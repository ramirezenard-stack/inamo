<?php

session_start();

require "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Invalid request.");
}

$email = trim($_POST["email"] ?? "");
$password = $_POST["password"] ?? "";

if (empty($email) || empty($password)) {
    die("Please enter your email and password.");
}


/* FIND USER */

$sql = "SELECT * FROM users WHERE email = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Database error: " . $conn->error);
}

$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();


/* CHECK ACCOUNT */

if ($result->num_rows === 1) {

    $user = $result->fetch_assoc();


    /* CHECK PASSWORD */

    if (password_verify($password, $user["password"])) {

        $_SESSION["user_id"] = $user["id"];
        $_SESSION["firstname"] = $user["firstname"];
        $_SESSION["lastname"] = $user["lastname"];
        $_SESSION["email"] = $user["email"];


        echo "<script>
            alert('Login successful!');
            window.location.href='home.html';
        </script>";

    } else {

        echo "<script>
            alert('Incorrect password.');
            window.location.href='login.html';
        </script>";

    }

} else {

    echo "<script>
        alert('Account not found.');
        window.location.href='login.html';
    </script>";

}

$stmt->close();
$conn->close();

?>