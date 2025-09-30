<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Database connection
$conn = new mysqli('localhost', 'TheBeast', 'WeLoveCOP4331', 'COP4331');
if ($conn->connect_error) {
    http_response_code(500); exit('Database connection failed');
}

// Collect JSON POST data
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['FirstName'], $data['LastName'], $data['Login'], $data['Password'])) {
    http_response_code(400); exit('Missing required fields');
}


$stmt = $conn->prepare(
    "INSERT into Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)"
);
$stmt->bind_param("ssss", $data['FirstName'], $data['LastName'], $data['Login'], $data['Password']);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(['message' => 'User created', 'id' => $stmt->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(['error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>

