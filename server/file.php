<?php
$dir_root = dirname(__FILE__);
$get_file = $dir_root."/data/list.json";
$method = $_POST["method"];
$data = urldecode($_POST["data"]);

switch ($method) {
	case "read":

		if (file_exists($get_file) && is_writable($get_file)) {
			$data = file_get_contents($get_file,true);

			//output data as json
			header('Content-Type: application/json; charset=utf-8');
			echo $data;
		}
	break;
	case "write":
		if (file_exists($get_file) && is_writable($get_file)) {
			//save file with new content
			$file = fopen($get_file, "w");
			fwrite($file, $data, strlen($data));

			//close file
			fclose($file);

		}
	break;
}
?>