<?php
header("Access-Control-Allow-Origin: http://www.cloudcontacts.online");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept, Origin");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$inData = getRequestInfo();

$userId = $inData["UserId"];
$firstname = $inData["FirstName"];
$lastname = $inData["LastName"];
$email = $inData["Email"];
$phoneNumber = $inData["PhoneNumber"];

$conn = new mysqli('localhost', 'TheBeast', 'WeLoveCOP4331', 'COP4331');

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("INSERT INTO Contacts (UserId, FirstName, LastName, Email, PhoneNumber) VALUES(?,?,?,?,?)");
    $stmt->bind_param("issss", $userId, $firstname, $lastname, $email, $phoneNumber);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        returnWithError("");
    } else {
        returnWithError("Failed to add contact");
    }
    
    $stmt->close();
    $conn->close();
}

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    echo $obj;
}

function returnWithError($err) {
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}
?>

