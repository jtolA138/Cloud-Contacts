<?php
// CORS Headers - Add at the very top
header("Access-Control-Allow-Origin: http://www.cloudcontacts.online");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept, Origin");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$inData = getRequestInfo();

$ID = $inData["ID"];

$conn = new mysqli('localhost', 'TheBeast', 'WeLoveCOP4331', 'COP4331');

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // First delete all contacts belonging to this user
    $deleteContactsStmt = $conn->prepare("DELETE FROM Contacts WHERE UserID=?");
    $deleteContactsStmt->bind_param("i", $ID);
    $deleteContactsStmt->execute();
    $deleteContactsStmt->close();
    
    // Then delete the user
    $stmt = $conn->prepare("DELETE FROM Users WHERE ID=?");
    $stmt->bind_param("i", $ID);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            returnWithError(""); // Success - empty error
        } else {
            returnWithError("User not found");
        }
    } else {
        returnWithError("Failed to delete user");
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

