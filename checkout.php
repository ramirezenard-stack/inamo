<?php

session_start();

require "db.php";


// ==========================================
// ONLY ACCEPT POST REQUEST
// ==========================================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    header("Location: checkout.html");

    exit();

}


// ==========================================
// GET CUSTOMER INFORMATION
// ==========================================

$firstname = $_POST["firstname"];
$lastname = $_POST["lastname"];
$email = $_POST["email"];
$phone = $_POST["phone"];

$address = $_POST["address"];
$city = $_POST["city"];
$postal = $_POST["postal"];

$payment = $_POST["payment"];


// ==========================================
// GET PRODUCT INFORMATION
// ==========================================

$product_name = $_POST["product_name"];
$product_price = $_POST["product_price"];
$product_size = $_POST["product_size"];
$product_quantity = $_POST["product_quantity"];

$subtotal = $_POST["subtotal"];
$shipping = $_POST["shipping"];
$total = $_POST["total"];


// ==========================================
// INSERT ORDER
// ==========================================

$sql = "INSERT INTO orders
(
    firstname,
    lastname,
    email,
    phone,
    address,
    city,
    postal,
    payment_method,
    product_name,
    product_price,
    product_size,
    product_quantity,
    subtotal,
    shipping,
    total
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";


$stmt = $conn->prepare($sql);


if (!$stmt) {

    die("SQL Error: " . $conn->error);

}


// ==========================================
// BIND VALUES
// ==========================================

$stmt->bind_param(
    "sssssssssdsiddd",
    $firstname,
    $lastname,
    $email,
    $phone,
    $address,
    $city,
    $postal,
    $payment,
    $product_name,
    $product_price,
    $product_size,
    $product_quantity,
    $subtotal,
    $shipping,
    $total
);


// ==========================================
// EXECUTE
// ==========================================

if ($stmt->execute()) {

    $order_id = $stmt->insert_id;

    header(
        "Location: order-success.html?order=" .
        $order_id
    );

    exit();

} else {

    echo "Error placing order: " .
        $stmt->error;

}


$stmt->close();

$conn->close();

?>