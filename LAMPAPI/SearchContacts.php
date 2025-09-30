<?php
// CORS Headers - Add at the very top
header("Access-Control-Allow-Origin: http://www.cloudcontacts.online");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept, Origin");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get request data
$inData = getRequestInfo();

// Database connection
$conn = new mysqli('localhost', 'TheBeast', 'WeLoveCOP4331', 'COP4331');

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Prepare SQL statement using input data
    $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Email, PhoneNumber, UserID FROM Contacts WHERE FirstName LIKE ? AND UserID=?");
    $contactName = "%" . $inData["search"] . "%";
    $stmt->bind_param("si", $contactName, $inData["userId"]);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $searchResults = array();
    
    // Create Contact object containing attributes
    while($row = $result->fetch_assoc()) {
        $contact = array(
            "id" => $row["ID"],
            "firstname" => $row["FirstName"],
            "lastname" => $row["LastName"],
            "email" => $row["Email"],
            "phoneNumber" => $row["PhoneNumber"],
            "userId" => $row["UserID"]
        );
        // Add contact to array of search results
        array_push($searchResults, $contact);
    }
    
    // Check if no contacts were found
    if(count($searchResults) == 0) {
        returnWithError("No Records Found");
    } else {
        returnWithInfo($searchResults);
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
    $retValue = array(
        "results" => array(),
        "error" => $err
    );
    sendResultInfoAsJson(json_encode($retValue));
}

function returnWithInfo($searchResults) {
    $retValue = array(
        "results" => $searchResults,
        "error" => ""
    );
    sendResultInfoAsJson(json_encode($retValue));
}
?>

