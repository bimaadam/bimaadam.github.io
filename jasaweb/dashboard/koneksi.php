<?php
// koneksi.php
// Database connection configuration - zeroed placeholders

$host = "localhost";     // Database host
$user = "root";          // Database username
$password = "";          // Database password
$database = "devnarda";  // Database name

// Create connection
$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// You can add charset or other settings here
$conn->set_charset("utf8mb4");
?>

