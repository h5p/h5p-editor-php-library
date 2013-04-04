<?php 

interface H5peditorStorage {
  public function getSemantics($machine_name, $major_version, $minor_version);
  public function addFile($file);
  public function removeFile($path);
  public function getLibraries();
}