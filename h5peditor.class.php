<?php

class H5peditor {

  public static $styles = array(
    'styles/css/application.css',
  );
  public static $scripts = array(
    'scripts/h5peditor.js',
    'scripts/h5peditor-editor.js',
    'scripts/h5peditor-library-selector.js',
    'scripts/h5peditor-form.js',
    'scripts/h5peditor-text.js',
    'scripts/h5peditor-html.js',
    'scripts/h5peditor-number.js',
    'scripts/h5peditor-textarea.js',
    'scripts/h5peditor-file.js',
    'scripts/h5peditor-av.js',
    'scripts/h5peditor-group.js',
    'scripts/h5peditor-boolean.js',
    'scripts/h5peditor-list.js',
    'scripts/h5peditor-library.js',
    'scripts/h5peditor-dimensions.js',
    'scripts/h5peditor-coordinates.js',
    'scripts/h5peditor-none.js',
    'ckeditor/ckeditor.js',
  );
  private $storage, $files_directory;

  /**
   * Constructor.
   *
   * @param object $storage
   * @param string $files_directory
   */
  function __construct($storage, $files_directory) {
    $this->storage = $storage;
    $this->files_directory = $files_directory;
  }

  /**
   * Create directories for uploaded content.
   *
   * @param int $id
   * @return boolean
   */
  public function createDirectories($id) {
    $this->content_directory = $this->files_directory . '/h5p/content/' . $id . '/';

    $sub_directories = array('', 'files', 'images', 'videos', 'audios');
    foreach ($sub_directories AS $sub_directory) {
      $sub_directory = $this->content_directory . $sub_directory;
      if (!is_dir($sub_directory) && !@mkdir($sub_directory)) {
        return FALSE;
      }
    }

    return TRUE;
  }

  /**
   * Move uploaded files, remove old files and update library usage.
   *
   * @param string $oldLibrary
   * @param string $oldParameters
   * @param object $newLibrary
   * @param string $newParameters
   */
  public function processParameters($contentId, $newLibrary, $newParameters, $oldLibrary = NULL, $oldParameters = NULL) {
    $newFiles = array();
    $oldFiles = array();
    $newLibraries = array($newLibrary['machineName'] => $newLibrary);
    $oldLibraries = array($oldLibrary);
    
    // Find new libraries and files.  
    $this->processSemantics($newFiles, $newLibraries, json_decode($this->storage->getSemantics($newLibrary['machineName'], $newLibrary['majorVersion'], $newLibrary['minorVersion'])), $newParameters);

    $h5pStorage = _h5p_get_instance('storage');
    
    $librariesUsed = $newLibraries; // Copy
    
    foreach ($newLibraries as $library) {
      $libraryFull = $h5pStorage->h5pF->loadLibrary($library['machineName'], $library['majorVersion'], $library['minorVersion']);
      $librariesUsed[$library['machineName']]['library'] = $libraryFull;
      $librariesUsed[$library['machineName']]['preloaded'] = 1;
      $h5pStorage->getLibraryUsage($librariesUsed, $libraryFull);
    }

    $h5pStorage->h5pF->deleteLibraryUsage($contentId);
    $h5pStorage->h5pF->saveLibraryUsage($contentId, $librariesUsed);
    
    if ($oldLibrary) {
      // Find old files and libraries.
      $this->processSemantics($oldFiles, $oldLibraries, json_decode($this->storage->getSemantics($oldLibrary['machineName'], $oldLibrary['majorVersion'], $oldLibrary['minorVersion'])), $oldParameters);

      // Remove old files.
      for ($i = 0, $s = count($oldFiles); $i < $s; $i++) {
        if (!in_array($oldFiles[$i], $newFiles)) {
          $removeFile = $this->content_directory . $oldFiles[$i];
          unlink($removeFile);
          $this->storage->removeFile($removeFile);
        }
      }
    }
  }

  /**
   * Recursive function that moves the new files in to the h5p content folder and generates a list over the old files.
   * Also locates all the librares.
   * 
   * @param array $files
   * @param array $libraries
   * @param array $schema
   * @param array $params
   */
  private function processSemantics(&$files, &$libraries, $semantics, &$params) {
    for ($i = 0, $s = count($semantics); $i < $s; $i++) {
      $field = $semantics[$i];
      if (!isset($params->{$field->name})) {
        continue;
      }
      $this->processField($field, $params->{$field->name}, $files, $libraries);
    }
  }

  /**
   * Process a single field.
   * 
   * @staticvar string $h5peditor_path
   * @param object $field
   * @param mixed $params
   * @param array $files
   * @param array $libraries
   */
  private function processField(&$field, &$params, &$files, &$libraries) {
    static $h5peditor_path;
    if (!$h5peditor_path) {
      $h5peditor_path = $this->files_directory . '/h5peditor/';
    }
    switch ($field->type) {
      case 'file':
      case 'image':
        if (isset($params->path)) {
          $temp_file = $h5peditor_path . $params->path;
          if (file_exists($temp_file)) {
            rename($temp_file, $this->content_directory . $params->path);
            $this->storage->removeFile($temp_file);
          }

          $files[] = $params->path;
        }
        break;
        
      case 'video':
      case 'audio':
        if (is_array($params)) {
          for ($i = 0, $s = count($params); $i < $s; $i++) {
            $temp_file = $h5peditor_path . $params[$i]->path;
            if (file_exists($temp_file)) {
              rename($temp_file, $this->content_directory . $params[$i]->path);
              $this->storage->removeFile($temp_file);
            }

            $files[] = $params[$i]->path;
          }
        }
        break;

      case 'library':
        if (isset($params->library) && isset($params->params)) {
          $libraryData = h5peditor_get_library_property($params->library);
          $libraries[$libraryData['machineName']] = $libraryData;
          $this->processSemantics($files, $libraries, json_decode($this->storage->getSemantics($libraryData['machineName'], $libraryData['majorVersion'], $libraryData['minorVersion'])), $params->params);
        }
        break;

      case 'group':
        if (isset($params)) {
          $this->processSemantics($files, $libraries, $field->fields, $params);
        }
        break;
        
      case 'list':
        if (is_array($params)) {
          for ($j = 0, $t = count($params); $j < $t; $j++) {
            $this->processField($field->field, $params[$j], $files, $libraries);
          }
        }
        break;
    }
  }

  /**
   * Get all scripts, css and semantics data for a library
   *
   * @param string $library_name
   *  Name of the library we want to fetch data for
   */
  public function getLibraryData($machineName, $majorVersion, $minorVersion) {
    $libraryData = new stdClass();
    $libraryData->semantics = $this->storage->getSemantics($machineName, $majorVersion, $minorVersion);

    $editorLibraryIds = $this->storage->getEditorLibraries($machineName, $majorVersion, $minorVersion);
    
    foreach ($editorLibraryIds as $editorLibraryId) {
      $filePaths = $this->storage->getFilePaths($editorLibraryId);
      
      if (!empty($filePaths['js'])) {
        if (!isset($libraryData->javascript)) {
          $libraryData->javascript = '';
        }
        foreach ($filePaths['js'] as $jsFilePath) {
          $libraryData->javascript .= file_get_contents($jsFilePath);
        }
      }
      if (!empty($filePaths['css'])) {
        if (!isset($libraryData->css)) {
          $libraryData->css = '';
        }
        foreach ($filePaths['css'] as $cssFilePath) {
          $libraryData->css .= file_get_contents($cssFilePath);
        }
      }
    }
    
    return json_encode($libraryData);
  }

}