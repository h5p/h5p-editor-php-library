<?php

/**
 * Class
 */
class H5peditorFile {
  private $result, $field, $interface;
  public $type, $name, $path, $mime, $size;

  /**
   * Constructor. Process data for file uploaded through the editor.
   */
  function __construct($interface) {
    $field = filter_input(INPUT_POST, 'field', FILTER_SANITIZE_STRING, FILTER_FLAG_NO_ENCODE_QUOTES);

    // Check for file upload.
    if ($field === NULL || empty($_FILES) || !isset($_FILES['file'])) {
      return;
    }

    $this->interface = $interface;

    // Create a new result object.
    $this->result = new stdClass();

    // Get the field.
    $this->field = json_decode($field);

    // Handle temporarily uploaded form file
    if (function_exists('finfo_file')) {
      $finfo = finfo_open(FILEINFO_MIME_TYPE);
      $this->type = finfo_file($finfo, $_FILES['file']['tmp_name']);
      finfo_close($finfo);
    }
    elseif (function_exists('mime_content_type')) {
      // Deprecated, only when finfo isn't available.
      $this->type = mime_content_type($_FILES['file']['tmp_name']);
    }
    else {
      $this->type = $_FILES['file']['type'];
    }

    $this->extension = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
    $this->size = $_FILES['file']['size'];
  }

  /**
   * Indicates if an uploaded file was found or not.
   *
   * @return boolean
   */
  public function isLoaded() {
    return is_object($this->result);
  }

  /**
   * Check current file up agains mime types and extensions in the given list.
   *
   * @param array $mimes List to check against.
   * @return boolean
   */
  public function check($mimes) {
    $ext = strtolower($this->extension);
    foreach ($mimes as $mime => $extension) {
      if (is_array($extension)) {
        // Multiple extensions
        if (in_array($ext, $extension)) {
          $this->type = $mime;
          return TRUE;
        }
      }
      elseif (/*$this->type === $mime && */$ext === $extension) {
        // TODO: Either remove everything that has to do with mime types, or make it work
        // Currently we're experiencing trouble with mime types on different servers...
        $this->type = $mime;
        return TRUE;
      }
    }
    return FALSE;
  }

  /**
   * Validate the file.
   *
   * @return boolean
   */
  public function validate() {
    if (isset($this->result->error)) {
      return FALSE;
    }

    // Check for field type.
    if (!isset($this->field->type)) {
      $this->result->error = $this->interface->t('Unable to get field type.');
      return FALSE;
    }

    $whitelist = explode(' ', $this->interface->getWhitelist(
      FALSE,
      H5PCore::$defaultContentWhitelist,
      H5PCore::$defaultLibraryWhitelistExtras
    ));

    // Check if mime type is allowed.
    $isValidMime = !isset($this->field->mimes) || in_array($this->type, $this->field->mimes);
    $isPhp = substr($this->extension, 0, 3) === 'php';
    $isWhitelisted = in_array(strtolower($this->extension), $whitelist);
    if (!$isValidMime || !$isWhitelisted || $isPhp) {
      $this->result->error = $this->interface->t("File type isn't allowed.");
      return FALSE;
    }

    // Type specific validations.
    switch ($this->field->type) {
      default:
        $this->result->error = $this->interface->t('Invalid field type.');
        return FALSE;

      case 'image':
        $allowed = array(
          'image/png' => 'png',
          'image/jpeg' => array('jpg', 'jpeg'),
          'image/gif' => 'gif',
          'image/svg+xml' => 'svg',
        );
        if (!$this->check($allowed)) {
          $this->result->error = $this->interface->t('Invalid image file format. Use jpg, png, gif or svg.');
          return FALSE;
        }

        // Image size from temp file
        if (strtolower($this->extension) === 'svg') {
          $image = $this->getSVGimagesize($_FILES['file']['tmp_name']);
        }
        else {
          $image = @getimagesize($_FILES['file']['tmp_name']);
        }

        if (!$image) {
          $this->result->error = $this->interface->t('File is not an image.');
          return FALSE;
        }

        $this->result->width = $image[0];
        $this->result->height = $image[1];
        $this->result->mime = $this->type;
        break;

      case 'audio':
        $allowed = array(
          'audio/mpeg' => 'mp3',
          'audio/mp3' => 'mp3',
          'audio/mp4' => 'm4a',
          'audio/x-wav' => 'wav',
          'audio/wav' => 'wav',
          //'application/ogg' => 'ogg',
          'audio/ogg' => 'ogg',
          //'video/ogg' => 'ogg',
        );
        if (!$this->check($allowed)) {
          $this->result->error = $this->interface->t('Invalid audio file format. Use mp3 or wav.');
          return FALSE;

        }

        $this->result->mime = $this->type;
        break;

      case 'video':
        $allowed = array(
          'video/mp4' => 'mp4',
          'video/webm' => 'webm',
         // 'application/ogg' => 'ogv',
          'video/ogg' => 'ogv',
        );
        if (!$this->check($allowed)) {
          $this->result->error = $this->interface->t('Invalid video file format. Use mp4 or webm.');
          return FALSE;
        }

        $this->result->mime = $this->type;
        break;

      case 'file':
        // TODO: Try to get file extension for type and check that it matches the current extension.
        $this->result->mime = $this->type;
    }

    return TRUE;
  }

  /**
   * Get the type of the current file.
   *
   * @return string
   */
  public function getType() {
    return $this->field->type;
  }

  /**
   * Get the name of the current file.
   *
   * @return string
   */
  public function getName() {
    static $name;

    if (empty($name)) {
      $name = uniqid($this->field->name . '-');

      $matches = array();
      preg_match('/([a-z0-9]{1,})$/i', $_FILES['file']['name'], $matches);
      if (isset($matches[0])) {
        $name .= '.' . $matches[0];
      }
    }

    return $name;
  }

  /**
   * Get result from file processing.
   */
  public function getResult() {
    return json_encode($this->result);
  }

  /**
   * Print result from file processing.
   */
  public function printResult() {
    $this->result->path = $this->getType() . 's/' . $this->getName() . '#tmp';

    // text/plain is used to support IE
    header('Cache-Control: no-cache');
    header('Content-Type: text/plain; charset=utf-8');

    print $this->getResult();
  }

  /**
   * Get imagesize like getimagesize would for non-SVG images.
   * Tries to determine fixed dimensions, then ratio or uses fallback.
   * @param {string} $filename File name.
   * @param {int[]} [$fallbackSize=[300,150]] Fallback size.
   * @return {int[]} Width and height of image.
   */
  private function getSVGimagesize($filename, $fallbackSize = [300, 150]) {
    if (!function_exists('simplexml_load_file')) {
      return $fallbackSize;
    }

    $xmlget = simplexml_load_file($filename);

    if (!$xmlget || $xmlget->attributes() === null) {
      return $fallbackSize;
    }

    $width = $this->getPixelValue($xmlget->attributes()->width);
    $height = $this->getPixelValue($xmlget->attributes()->height);

    // Can use fixed dimensions
    if ($width && $height) {
      return [$width, $height];
    }

    if (!isset($xmlget->attributes()->viewBox)) {
      return $fallbackSize;
    }

    $viewBoxSegements = explode(' ', $xmlget->attributes()->viewBox);
    if (sizeof($viewBoxSegements) < 4) {
      return $fallbackSize;
    }

    $viewBoxWidth = (float) $viewBoxSegements[2];
    $viewBoxHeight = (float) $viewBoxSegements[3];

    // Fixed width set, scale height accordingly
    if ($width) {
      return [$width, $width / $viewBoxWidth * $viewBoxHeight];
    }

    // Fixed height set, scale width accordingly
    if ($height) {
      return [$height / $viewBoxHeight * $viewBoxWidth, $height];
    }

    // Scale to fallback size using given ratio
    $ratioImage = $viewBoxWidth / $viewBoxHeight;
    $ratioFallback = $fallbackSize[0] / $fallbackSize[1];

    if ($ratioImage - $ratioFallback > 0) {
      return [$fallbackSize[0], $viewBoxHeight * $fallbackSize[0] / $viewBoxWidth];
    }
    else {
      return [$viewBoxWidth * $fallbackSize[1] / $viewBoxHeight, $fallbackSize[1]];
    }
  }

  /**
   * Convert size measurements to pixels.
   * @param {string} [$size=0] Size (1em, 12in, 3cm etc.).
   * @return {int} Size as pixel value.
   */
  private function getPixelValue($size = 0) {
    // Cmp. https://www.w3.org/Style/Examples/007/units.en.html, assuming 96dpi
    $map = [
      'px' => 1,
      'em' => 16, // common default font size display
      'ex' => 8, // uncommon value, best guess
      'pt' => 4 / 3,
      'pc' => 16,
      'in' => 96,
      'cm' => 96 / 2.54,
      'mm' => 96 / 25.4,
    ];

    $size = trim($size);

    // Assuming valid unit is always 2 chars long
    $value = substr($size, 0, -2);
    $unit = substr($size, -2);

    // Mapping found
    if (is_numeric($value) && isset($map[$unit])) {
      $size = $value * $map[$unit];
    }

    // Interpret input as pixels
    if (is_numeric($size)) {
      return (int) round($size);
    }

    return 0;
  }
}
