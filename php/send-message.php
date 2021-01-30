<?php

if(!isset($_POST["name"]) || !isset($_POST["message"])) exit;
$name = $_POST["name"];
$message = $_POST["message"];
if(strlen($message) > 10000) exit;
$time = time();
$data = json_decode(file_get_contents("data/messages.json"));
$counter = 0;
foreach($data as $value) {
	if($time - $value[1] < 86400) $counter++;
}
if($counter > 86400) exit;
if($counter == 0){
	$mailed = mail("koen.doodeman@gmail.com", "You've got a message!", "Check the messages.json file on your server. This is only the first message of the day.\n\n".$name." says:\n\n".$message."\n\nCheers, me!");
}
array_push($data, array($name, $time, $message));
file_put_contents("data/messages.json", json_encode($data));
