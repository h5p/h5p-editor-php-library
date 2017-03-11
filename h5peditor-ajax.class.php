<?php

abstract class H5PEditorEndpoints {

  /**
   * Endpoint for retrieving library data necessary for displaying
   * content types in the editor.
   */
  const LIBRARIES = 'libraries';

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

  public $core;

  public $editor;

  /**
   * H5PEditorAjax constructor.
   *
   * @param H5PCore $H5PCore
   */
  public function __construct(H5PCore $H5PCore, H5peditor $H5PEditor) {
    $this->core = $H5PCore;
    $this->editor = $H5PEditor;
  }

  /**
   * @param $endpoint
   */
  public function action($endpoint) {
    switch ($endpoint) {
      case H5PEditorEndpoints::LIBRARIES:
        H5PCore::ajaxSuccess($this->editor->getLibraries(), TRUE);
        break;
      case H5PEditorEndpoints::CONTENT_TYPE_CACHE:
        if (!$this->isHubOn()) return;
        if (!$this->isContentTypeCacheUpdated()) return;
        $this->getContentTypeCache();
        break;
    }
  }

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
      'libraries' => $this->core->getLatestGlobalLibrariesData(),
      'recentlyUsed' => $this->core->h5pF->getAuthorsRecentlyUsedLibraries()
    );

    H5PCore::ajaxSuccess($contentTypeCache, TRUE);
  }
}
