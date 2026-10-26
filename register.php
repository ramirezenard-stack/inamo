<?php

require "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Invalid request.");
}

$firstname = trim($_POST["fname"] ?? "");
$lastname = trim($_POST["lname"] ?? "");
$email = trim($_POST["email"] ?? "");
$phone = trim($_POST["phone"] ?? "");
$password = $_POST["password"] ?? "";

if (
    empty($firstname) ||
    empty($lastname) ||
    empty($email) ||
    empty($phone) ||
    empty($password)
) {
    die("Please fill in all fields.");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("Invalid email address.");
}

if (strlen($password) < 6) {
    die("Password must be at least 6 characters.");
}


/* CHECK IF EMAIL ALREADY EXISTS */

$check = $conn->prepare(
    "SELECT id FROM users WHERE email = ?"
);

$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    die("This email is already registered.");
}

$check->close();


/* HASH PASSWORD */

$hashedPassword = password_hash(
    $password,
    PASSWORD_DEFAULT
);


/* INSERT USER */

$sql = "INSERT INTO users
(firstname, lastname, email, phone, password)
VALUES (?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Database error: " . $conn->error);
}

$stmt->bind_param(
    "sssss",
    $firstname,
    $lastname,
    $email,
    $phone,
    $hashedPassword
);

if ($stmt->execute()) {

    echo "<script>
        alert('Account created successfully!');
        window.location.href='login.html';
    </script>";

} else {

    echo "Registration failed: " . $stmt->error;

}

$stmt->close();
$conn->close();

?>