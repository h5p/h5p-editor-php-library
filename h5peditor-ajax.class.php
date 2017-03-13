<?php

abstract class H5PEditorEndpoints {

  /**
   * Endpoint for retrieving library data necessary for displaying
   * content types in the editor.
   */
  const LIBRARIES = 'libraries';

  /**
   * Endpoint for retrieving a singe library's data necessary for displaying
   * main libraries
   */
  const SINGLE_LIBRARY = 'single-library';

  /**
   * Endpoint for retrieving the currently stored content type cache
   */
  const CONTENT_TYPE_CACHE = 'content-type-cache';

  /**
   * Endpoint for installing libraries from the Content Type Hub
   */
  const LIBRARY_INSTALL = 'library-install';

  /**
   * Endpoint for uploading libraries used by the editor through the Content
   * Type Hub.
   */
  const LIBRARY_UPLOAD = 'library-upload';

  /**
   * Endpoint for uploading files used by the editor.
   */
  const FILES = 'files';
}


  /**
 * Class H5PEditorAjax
 * @package modules\h5peditor\h5peditor
 */
class H5PEditorAjax {

  /**
   * @var \H5PCore
   */
  public $core;

  /**
   * @var \H5peditor
   */
  public $editor;

  /**
   * @var \H5peditorStorage
   */
  public $storage;

  /**
   * H5PEditorAjax constructor requires core, editor and storage as building
   * blocks.
   *
   * @param H5PCore $H5PCore
   * @param H5peditor $H5PEditor
   * @param H5peditorStorage $H5PEditorStorage
   */
  public function __construct(H5PCore $H5PCore, H5peditor $H5PEditor, H5peditorStorage $H5PEditorStorage) {
    $this->core = $H5PCore;
    $this->editor = $H5PEditor;
    $this->storage = $H5PEditorStorage;
  }

  /**
   * @param $endpoint
   */
  public function action($endpoint) {
    switch ($endpoint) {
      case H5PEditorEndpoints::LIBRARIES:
        H5PCore::ajaxSuccess($this->editor->getLibraries(), TRUE);
        break;

      case H5PEditorEndpoints::SINGLE_LIBRARY:
        // pass on arguments
        $args = func_get_args();
        array_shift($args);
        $library = call_user_func_array(
          array($this->editor, 'getLibraryData'), $args
        );
        H5PCore::ajaxSuccess($library, TRUE);
        break;

      case H5PEditorEndpoints::CONTENT_TYPE_CACHE:
        if (!$this->isHubOn()) return;
        if (!$this->isContentTypeCacheUpdated()) return;
        $this->getContentTypeCache();
        break;

      case H5PEditorEndpoints::LIBRARY_INSTALL:
          if (!$this->isPostRequest()) return;

          $token = func_get_arg(1);
          if (!$this->isValidEditorToken($token)) return;

          $machineName = func_get_arg(2);
          $this->libraryInstall($machineName);
        break;

      case H5PEditorEndpoints::LIBRARY_UPLOAD:
        $token = func_get_arg(1);
        if (!$this->isPostRequest()) return;
        if (!$this->isValidEditorToken($token)) return;
        $this->libraryUpload();
        break;

      case H5PEditorEndpoints::FILES:
        $token = func_get_arg(1);
        $contentId = func_get_arg(2);
        if (!$this->isValidEditorToken($token)) return;
        $this->fileUpload($contentId);
        break;
    }
  }

  /**
   * Handles uploaded files from the editor, making sure they are validated
   * and ready to be permanently stored if saved.
   *
   * Marks all uploaded files as
   * temporary so they can be cleaned up when we have finished using them.
   *
   * @param $contentId Id of content if already existing content
   */
  private function fileUpload($contentId = NULL) {
    $file = new H5peditorFile($this->core->h5pF);
    if (!$file->isLoaded()) {
      H5PCore::ajaxError($this->core->h5pF->t('File not found on server. Check file upload settings.'));
      return;
    }

    // Make sure file is valid and mark it for cleanup at a later time
    if ($file->validate()) {
      $this->core->fs->saveFile($file, $contentId);
      $this->storage->markFileForCleanup($file);
    }
    $file->printResult();
  }

  /**
   * Handles uploading libraries so they are ready to be modified or directly saved.
   *
   * Validates and saves any dependencies, then exposes content to the editor.
   */
  private function libraryUpload() {
    $file = $this->saveFileTemporarily($_FILES['h5p']['tmp_name'], $_FILES['h5p']['name'], TRUE);
    if (!$file) return;

    // These has to be set instead of sending parameteres to the validation function.
    $this->setSessionParameters($file, $_FILES['h5p']['name']);
    if (!$this->isValidPackage()) return;

    // Install any required dependencies
    $storage = new H5PStorage($this->core->h5pF, $this->core);
    $storage->savePackage(NULL, NULL, TRUE);

    // Since package has been validated, make content assets available to editor
    $content = $this->core->fs->moveContentDirectory($this->core->h5pF->getUploadedH5pFolderPath());

    // Clean up
    $this->removeUploadeFiles();

    H5PCore::ajaxSuccess((object) array(
      'h5p' => json_decode($content->h5pJson),
      'content' => json_decode($content->contentJson)
    ));
  }

  /**
   * Validates security tokens used for the editor
   *
   * @param string $token
   *
   * @return bool
   */
  private function isValidEditorToken($token) {
    if (!\H5PCore::validToken('editorajax', $token)) {
      \H5PCore::ajaxError(
        $this->core->h5pF->t('Invalid security token.'),
        'INVALID_TOKEN'
      );
      return FALSE;
    }
    return TRUE;
  }

  /**
   * Clean up temporary files and delete session variables
   */
  private function removeUploadeFiles() {
    H5PCore::deleteFileTree($_SESSION['h5p_upload_folder']);
    unset($_SESSION['h5p_upload'], $_SESSION['h5p_upload_folder']);
  }

  /**
   * Handles installation of libraries from the Content Type Hub.
   *
   * Accepts a machine name and attempts to fetch and install it from the Hub if
   * it is valid. Will also install any dependencies to the requested library.
   *
   * @param string $machineName Name of library that should be installed
   */
  private function libraryInstall($machineName) {

    // Determine which content type to install from post data
    if (!$machineName) {
      H5PCore::ajaxError($this->core->h5pF->t('No content type was specified.'), 'NO_CONTENT_TYPE');
      return;
    }

    // Look up content type to ensure it's valid(and to check permissions)
    $contentType = $this->editor->ajaxInterface->getContentTypeCache($machineName);
    if (!$contentType) {
      H5PCore::ajaxError($this->core->h5pF->t('The chosen content type is invalid.'), 'INVALID_CONTENT_TYPE');
      return;
    }

    // Check install permissions
    if (!$this->editor->canInstallContentType($contentType)) {
      H5PCore::ajaxError($this->core->h5pF->t('No permission to install content type.'), 'INSTALL_DENIED');
      return;
    }
    else {
      // Override core permission check
      $this->core->mayUpdateLibraries(TRUE);
    }

    // Retrieve content type from hub endpoint
    $endpointResponse = $this->callHubEndpoint(H5PHubEndpoints::CONTENT_TYPES . $machineName);
    if (!$endpointResponse) return;

    // Save file temporarily to verify validity
    $file = $this->saveFileTemporarily($endpointResponse);
    if (!$file) return;

    // Session parameters has to be set for validation and saving of packages
    $this->setSessionParameters($file->dir, $file->fileName);
    if (!$this->isValidPackage(TRUE)) return;

    // Save H5P
    $storage = new H5PStorage($this->core->h5pF, $this->core);
    $storage->savePackage(NULL, NULL, TRUE);

    // Clean up
    $this->removeUploadeFiles();

    // Successfully installed.
    H5PCore::ajaxSuccess();
  }

  /**
   * Validates the package. Sets error messages if validation fails.
   *
   * @param bool $skipContent Will not validate cotent if set to TRUE
   *
   * @return bool
   */
  private function isValidPackage($skipContent = FALSE) {
    $validator = new H5PValidator($this->core->h5pF, $this->core);
    if (!$validator->isValidPackage($skipContent, FALSE)) {
      $this->removeUploadeFiles();

      H5PCore::ajaxError(
        $this->core->h5pF->t('Validating h5p package failed.'),
        'VALIDATION_FAILED'
      );
      return FALSE;
    }

    return TRUE;
  }

  /**
   * Set session parameters as these are required for validating H5Ps
   * and saving them
   *
   * @param string $tmpPath Path of temporarily stored files
   * @param string $fileName Name of the H5P that will be handled
   */
  private function setSessionParameters($tmpPath, $fileName) {
    $_SESSION['h5p_upload_folder'] = $tmpPath;
    $_SESSION['h5p_upload'] = $tmpPath . DIRECTORY_SEPARATOR . $fileName;
  }

  /**
   * Saves a file or moves it temporarily. This is often necessary in order to
   * validate and store uploaded or fetched H5Ps.
   *
   * Sets error messages if saving fails.
   *
   * @param string $data Uri of data that should be saved as a temporary file
   * @param boolean $move_file Can be set to TRUE to move the data instead of saving it
   *
   * @return bool|object Returns false if saving failed or the path to the file
   *  if saving succeeded
   */
  private function saveFileTemporarily($data, $move_file = FALSE) {
    $file = $this->storage->saveFileTemporarily($data, $move_file);
    if (!$file) {
      H5PCore::ajaxError(
        $this->core->h5pF->t('Failed to download the requested H5P.'),
        'DOWNLOAD_FAILED'
      );
      return FALSE;
    }

    return $file;
  }

  /**
   * Calls provided hub endpoint and returns any found response data.
   *
   * @param string $endpoint Endpoint without protocol
   *
   * @return bool|string Returns the response if found
   */
  private function callHubEndpoint($endpoint) {
    $protocol = (extension_loaded('openssl') ? 'https' : 'http');
    $response  = $this->core->h5pF->fetchExternalData("{$protocol}://{$endpoint}");

    if (!$response) {
      H5PCore::ajaxError(
        $this->core->h5pF->t('Failed to download the requested H5P.'),
        'DOWNLOAD_FAILED'
      );
      return FALSE;
    }

    return $response;
  }

  /**
   * Checks if request is a POST. Sets error message on fail.
   *
   * @return bool
   */
  private function isPostRequest() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
      H5PCore::ajaxError(
        $this->core->h5pF->t('A post message is required to access the given endpoint'),
        'REQUIRES_POST',
        405
      );
      return FALSE;
    }
    return TRUE;
  }

  /**
   * Checks if H5P Hub is enabled. Sets error message on fail.
   *
   * @return bool
   */
  private function isHubOn() {
    if (!$this->core->h5pF->getOption('hub_is_enabled', TRUE)) {
      H5PCore::ajaxError(
        $this->core->h5pF->t('The hub is disabled. You can enable it in the H5P settings.'),
        'HUB_DISABLED',
        403
      );
      return false;
    }
    return true;
  }

  /**
   * Checks if Content Type Cache is up to date. Immediately tries to fetch
   * a new Content Type Cache if it is outdated.
   * Sets error message if fetching new Content Type Cache fails.
   *
   * @return bool
   */
  private function isContentTypeCacheUpdated() {

    // Update content type cache if enabled and too old
    $ct_cache_last_update = $this->core->h5pF->getOption('content_type_cache_updated_at', 0);
    $outdated_cache       = $ct_cache_last_update + (60 * 60 * 24 * 7); // 1 week
    if (time() > $outdated_cache) {
      $success = $this->core->updateContentTypeCache();
      if (!$success) {
        H5PCore::ajaxError(
          $this->core->h5pF->t('Could not connect to the H5P Content Type Hub. Please try again later.'),
          'NO_RESPONSE',
          404
        );
        return false;
      }
    }
    return true;
  }

  /**
   * Gets content type cache for globally available libraries and the order
   * in which they have been used by the author
   */
  private function getContentTypeCache() {
    $contentTypeCache = array(
      'libraries' => $this->editor->getLatestGlobalLibrariesData(),
      'recentlyUsed' => $this->editor->ajaxInterface->getAuthorsRecentlyUsedLibraries()
    );

    H5PCore::ajaxSuccess($contentTypeCache, TRUE);
  }
}
