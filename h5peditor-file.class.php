<?php

class H5peditorFile {
  
  private $result, $field, $temporary_directory;
  
  public $type, $name, $path, $mime, $size;
  
  function __construct($files_directory) {
    // Check for file upload.
    if (empty($_POST) || !isset($_POST['field']) || empty($_FILES) || !isset($_FILES['file'])) {
      return;
    }
    
    // Create a new result object.
    $this->result = new stdClass();
    
    // Set temporary directory.
    $this->temporary_directory = $files_directory . '/h5peditor';
    
    // Create the temporary directory if it doesn't exist.
    $dirs = array ('', '/files', '/images', '/videos', '/audios');
    foreach ($dirs as $dir) {
      $dir = $this->temporary_directory . $dir;
      if (!is_dir($dir)) {
        if (!mkdir($dir)) {
          // TODO: Move all t-s out of here.
          $this->result->error = t('Unable to create temporary directory.');
          return;
        }
      }
    }
    
    // Get the field.
    $this->field = json_decode($_POST['field']);
    
    if (function_exists('finfo_file')) {
      $finfo = finfo_open(FILEINFO_MIME_TYPE);
      $this->type = finfo_file($finfo, $_FILES['file']['tmp_name']);
      finfo_close($finfo);
    }
    else {
      // Deprecated, only used for < php-5.3
      $this->type = mime_content_type($_FILES['file']['tmp_name']);
    }
    
    $this->size = $_FILES['file']['size'];
  }
  
  public function isLoaded() {
    return is_object($this->result);
  }
  
  public function validate() {
    // Check for field type.
    if (!isset($this->field->type)) {
      $this->result->error = t('Unable to get field type.');
      return FALSE;
    }
    
    // Check if mime type is allowed.
    if (isset($this->field->mimes) && !in_array($this->type, $this->field->mimes)) {
      $this->result->error = t("File type isn't allowed.");
      return FALSE;
    }
    
    // Type specific validations.
    switch ($this->field->type) {
      default:
        $this->result->error = t('Invalid field type.');
        return FALSE;
        
      case 'image':
        $image = @getimagesize($_FILES['file']['tmp_name']);
        if (!$image) {
          $this->result->error = t('File is not an image.');
          return FALSE;
        }
        
        $this->result->width = $image[0];
        $this->result->height = $image[1];
        break;

      case 'audio':
        if ($this->type !== 'audio/mpeg' && $this->type !== 'audio/x-wav'/* && $this->type !== 'application/ogg'*/) {
          $this->result->error = t('Invalid audio file format. Use mp3 or wav.');
        }
        $this->result->mime = $this->type;
        break;
        
      case 'video':
        if ($this->type !== 'video/mp4' && $this->type !== 'video/webm'/* && $this->type !== 'application/ogg'*/) {
          $this->result->error = t('Invalid video file format. Use mp4 or webm.');
        }
        $this->result->mime = $this->type;
        break;
        
      case 'file':
        $this->result->mime = $this->type;
    }
    
    return TRUE;
  }
  
 public function copy() {    
    $matches = array();
    preg_match('/([a-z0-9]{1,})$/i', $_FILES['file']['name'], $matches);

    $this->name = uniqid($this->field->name . '-');
    if (isset($matches[0])) {
      $this->name .= '.' . $matches[0];
    }
    $this->name = $this->field->type . 's/' . $this->name;
    
    $this->path = $this->temporary_directory . '/' . $this->name;
    if (!copy($_FILES['file']['tmp_name'], $this->path)) {
      $this->result->error = t('Could not copy file.');
      return FALSE;
    }
    
    $this->result->path = $this->name;
    return TRUE;
  }
  
  public function getResult() {
    return json_encode($this->result);
  }
}