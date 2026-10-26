<?php

header("Content-Type: application/json");

require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if ($data === null) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON received.",
        "php_error" => json_last_error_msg()
    ]);
    exit;
}

$customer = $data["customer"] ?? null;
$payment = $data["payment"] ?? null;
$products = $data["products"] ?? [];

if (!$customer) {
    echo json_encode([
        "success" => false,
        "message" => "Customer information is missing."
    ]);
    exit;
}

if (!$payment) {
    echo json_encode([
        "success" => false,
        "message" => "Payment method is missing."
    ]);
    exit;
}

if (empty($products)) {
    echo json_encode([
        "success" => false,
        "message" => "No products were received."
    ]);
    exit;
}


/* CALCULATE TOTAL */

$subtotal = 0;

foreach ($products as $product) {

    $price = (float)($product["price"] ?? 0);
    $quantity = (int)($product["quantity"] ?? 1);

    $subtotal += $price * $quantity;
}

$shipping = 100;
$total = $subtotal + $shipping;


/* SAVE ORDER */

$sql = "INSERT INTO orders
(firstname, lastname, email, phone, address, city, postal,
payment_method, subtotal, shipping, total)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to prepare orders query.",
        "error" => $conn->error
    ]);

    exit;
}

$firstname = $customer["firstname"] ?? "";
$lastname = $customer["lastname"] ?? "";
$email = $customer["email"] ?? "";
$phone = $customer["phone"] ?? "";
$address = $customer["address"] ?? "";
$city = $customer["city"] ?? "";
$postal = $customer["postal"] ?? "";

$stmt->bind_param(
    "ssssssssddd",
    $firstname,
    $lastname,
    $email,
    $phone,
    $address,
    $city,
    $postal,
    $payment,
    $subtotal,
    $shipping,
    $total
);

if (!$stmt->execute()) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to save order.",
        "error" => $stmt->error
    ]);

    exit;
}

$order_id = $conn->insert_id;


/* SAVE ORDER PRODUCTS */

$itemSql = "INSERT INTO order_items
(order_id, product_id, product_name, price, size, quantity, image)
VALUES (?, ?, ?, ?, ?, ?, ?)";

$itemStmt = $conn->prepare($itemSql);

if (!$itemStmt) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to prepare order items query.",
        "error" => $conn->error
    ]);

    exit;
}

foreach ($products as $product) {

    $productId = (string)($product["id"] ?? "");
    $productName = (string)($product["name"] ?? "");
    $price = (float)($product["price"] ?? 0);
    $size = (string)($product["size"] ?? "N/A");
    $quantity = (int)($product["quantity"] ?? 1);
    $image = (string)($product["image"] ?? "");

    $itemStmt->bind_param(
        "issdsis",
        $order_id,
        $productId,
        $productName,
        $price,
        $size,
        $quantity,
        $image
    );

    if (!$itemStmt->execute()) {

        echo json_encode([
            "success" => false,
            "message" => "Order was saved, but product could not be saved.",
            "error" => $itemStmt->error
        ]);

        exit;
    }
}


/* SUCCESS */

echo json_encode([
    "success" => true,
    "message" => "Order saved successfully.",
    "order_id" => $order_id
]);

?>