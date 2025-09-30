<?php
// Set content type to JSON
header("Access-Control-Allow-Origin: http://www.cloudcontacts.online");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Accept, Origin");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only allow POST and PUT methods
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed"));
    exit();
}

// Database configuration
$servername = "localhost";
$username = "TheBeast";
$password = "WeLoveCOP4331";
$dbname = "COP4331";

try {
    // Create PDO connection
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get the input data
    $input = json_decode(file_get_contents("php://input"), true);

    // Validate required ID field
    if (!isset($input['ID']) || empty($input['ID'])) {
        http_response_code(400);
        echo json_encode(array("message" => "Contact ID is required"));
        exit();
    }

    $contactId = $input['ID'];

    // Check if contact exists
    $checkStmt = $pdo->prepare("SELECT ID FROM Contacts WHERE ID = :id");
    $checkStmt->bindParam(':id', $contactId);
    $checkStmt->execute();

    if ($checkStmt->rowCount() == 0) {
        http_response_code(404);
        echo json_encode(array("message" => "Contact not found"));
        exit();
    }

    // Create dynamic update query based on provided fields
    $updateFields = array();
    $params = array(':id' => $contactId);

    // Check and add each possible field
    if (isset($input['FirstName']) && !empty($input['FirstName'])) {
        $updateFields[] = "FirstName = :firstname";
        $params[':firstname'] = $input['FirstName'];
    }

    if (isset($input['LastName']) && !empty($input['LastName'])) {
        $updateFields[] = "LastName = :lastname";
        $params[':lastname'] = $input['LastName'];
    }

    if (isset($input['Email']) && !empty($input['Email'])) {
        // Basic email validation
        if (!filter_var($input['Email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid email format"));
            exit();
        }
        $updateFields[] = "Email = :email";
        $params[':email'] = $input['Email'];
    }

    if (isset($input['PhoneNumber']) && !empty($input['PhoneNumber'])) {
        $updateFields[] = "PhoneNumber = :phone";
        $params[':phone'] = $input['PhoneNumber'];
    }

    if (isset($input['UserID']) && !empty($input['UserID'])) {
        $updateFields[] = "UserID = :userid";
        $params[':userid'] = $input['UserID'];
    }

    // Check if at least one field is being updated
    if (empty($updateFields)) {
        http_response_code(400);
        echo json_encode(array("message" => "No valid fields provided for update"));
        exit();
    }

    // Construct and execute update query
    $sql = "UPDATE Contacts SET " . implode(", ", $updateFields) . " WHERE ID = :id";
    $stmt = $pdo->prepare($sql);

    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }

    if ($stmt->execute()) {
        // Fetch and return the updated contact
        $fetchStmt = $pdo->prepare("SELECT * FROM Contacts WHERE ID = :id");
        $fetchStmt->bindParam(':id', $contactId);
        $fetchStmt->execute();
        $updatedContact = $fetchStmt->fetch(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode(array(
            "message" => "Contact updated successfully",
            "contact" => $updatedContact
        ));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Failed to update contact"));
    }

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Database error: " . $e->getMessage()
    ));
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Server error: " . $e->getMessage()
    ));
}
?>
