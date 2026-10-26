// ==========================================
// VALQORA PRODUCT POPUP
// ==========================================


const productModal =
    document.getElementById("product-modal");

const closeModal =
    document.getElementById("close-modal");

const modalImage =
    document.getElementById("modal-image");

const modalName =
    document.getElementById("modal-name");

const modalPrice =
    document.getElementById("modal-price");

const modalAddCart =
    document.getElementById("modal-add-cart");

const modalBuyNow =
    document.getElementById("modal-buy-now");

const quantityText =
    document.getElementById("quantity");

const quantityMinus =
    document.getElementById("quantity-minus");

const quantityPlus =
    document.getElementById("quantity-plus");


// Current product

let selectedProduct = null;

let selectedSize = null;

let quantity = 1;


// ==========================================
// OPEN POPUP
// ==========================================

document.querySelectorAll(".cart-bttn").forEach(button => {

    button.addEventListener("click", function () {

        // Get product information
        selectedProduct = {

            name: this.dataset.name,

            price: Number(this.dataset.price),

            image: this.dataset.image

        };


        // Put information into popup

        modalName.textContent =
            selectedProduct.name;

        modalPrice.textContent =
            "₱" +
            selectedProduct.price.toLocaleString();

        modalImage.src =
            selectedProduct.image;


        // Reset quantity

        quantity = 1;

        quantityText.textContent = quantity;


        // Reset size

        selectedSize = null;

        document.querySelectorAll(".size-btn")
            .forEach(btn => {

                btn.classList.remove("selected");

            });


        // Show popup

        productModal.classList.add("active");

    });

});


// ==========================================
// CLOSE POPUP
// ==========================================

closeModal.addEventListener("click", function () {

    productModal.classList.remove("active");

});


// ==========================================
// CLICK OUTSIDE POPUP
// ==========================================

productModal.addEventListener("click", function (event) {

    if (event.target === productModal) {

        productModal.classList.remove("active");

    }

});


// ==========================================
// SELECT SIZE
// ==========================================

document.querySelectorAll(".size-btn").forEach(button => {

    button.addEventListener("click", function () {

        // Remove selected from all

        document.querySelectorAll(".size-btn")
            .forEach(btn => {

                btn.classList.remove("selected");

            });


        // Select clicked size

        this.classList.add("selected");

        selectedSize = this.dataset.size;

    });

});


// ==========================================
// QUANTITY +
// ==========================================

quantityPlus.addEventListener("click", function () {

    quantity++;

    quantityText.textContent = quantity;

});


// ==========================================
// QUANTITY -
// ==========================================

quantityMinus.addEventListener("click", function () {

    if (quantity > 1) {

        quantity--;

    }

    quantityText.textContent = quantity;

});


// ==========================================
// ADD TO CART
// ==========================================

modalAddCart.addEventListener("click", function () {

    // Require size

    if (!selectedSize) {

        alert("Please choose a size.");

        return;

    }


    // Get existing cart

    let cart =
        JSON.parse(
            localStorage.getItem("valqoraCart")
        ) || [];


    // Product to add

    const product = {

        id: Date.now(),

        name: selectedProduct.name,

        price: selectedProduct.price,

        image: selectedProduct.image,

        size: selectedSize,

        quantity: quantity

    };


    cart.push(product);


    // Save

    localStorage.setItem(
        "valqoraCart",
        JSON.stringify(cart)
    );


    alert(
        selectedProduct.name +
        " has been added to your cart!"
    );


    // Close popup

    productModal.classList.remove("active");

});


// ==========================================
// BUY NOW
// ==========================================

modalBuyNow.addEventListener("click", function () {

    // Require size

    if (!selectedSize) {

        alert("Please choose a size.");

        return;

    }


    const product = {

        id: Date.now(),

        name: selectedProduct.name,

        price: selectedProduct.price,

        image: selectedProduct.image,

        size: selectedSize,

        quantity: quantity

    };


    // Save only selected product

    localStorage.setItem(

        "valqoraBuyNow",

        JSON.stringify(product)

    );


    // Go to checkout

    window.location.href =
        "checkout.html";

});
// ==========================================
// BUY NOW
// ==========================================

modalBuyNow.addEventListener("click", function () {

    // Check size
    if (!selectedSize) {

        alert("Please choose a size.");

        return;

    }


    // Create product
    const product = {

        id: Date.now(),

        name: selectedProduct.name,

        price: selectedProduct.price,

        image: selectedProduct.image,

        size: selectedSize,

        quantity: quantity

    };


    // Save product for checkout
    localStorage.setItem(
        "valqoraBuyNow",
        JSON.stringify(product)
    );


    // Go to checkout
    window.location.href = "checkout.html";

});
// ==========================================
// GET BUY NOW PRODUCT
// ==========================================

const buyNowProduct =
    JSON.parse(
        localStorage.getItem("valqoraBuyNow")
    );


// ==========================================
// DISPLAY PRODUCT
// ==========================================

const productContainer =
    document.getElementById(
        "checkout-product"
    );


if (!buyNowProduct) {

    productContainer.innerHTML = `

        <p>
            No product selected.
        </p>

        <a href="shop.html">
            Return to Shop
        </a>

    `;

} else {


    productContainer.innerHTML = `

        <div class="checkout-product">

            <img
                src="${buyNowProduct.image}"
                alt="${buyNowProduct.name}">


            <div>

                <h3>
                    ${buyNowProduct.name}
                </h3>

                <p>
                    Size:
                    ${buyNowProduct.size}
                </p>

                <p>
                    Quantity:
                    ${buyNowProduct.quantity}
                </p>

                <strong>
                    ₱${(
                        buyNowProduct.price *
                        buyNowProduct.quantity
                    ).toLocaleString()}
                </strong>

            </div>

        </div>

    `;

}



// ==========================================
// CALCULATE TOTAL
// ==========================================

if (buyNowProduct) {

    const subtotal =
        buyNowProduct.price *
        buyNowProduct.quantity;

    const shipping = 100;

    const total =
        subtotal + shipping;


    document.getElementById(
        "checkout-subtotal"
    ).textContent =
        "₱" +
        subtotal.toLocaleString();


    document.getElementById(
        "checkout-total"
    ).textContent =
        "₱" +
        total.toLocaleString();

}



// ==========================================
// PLACE ORDER
// ==========================================

document
    .getElementById("place-order")
    .addEventListener("click", function () {


        // Get customer information

        const firstname =
            document.getElementById(
                "firstname"
            ).value.trim();


        const lastname =
            document.getElementById(
                "lastname"
            ).value.trim();


        const email =
            document.getElementById(
                "email"
            ).value.trim();


        const phone =
            document.getElementById(
                "phone"
            ).value.trim();


        const address =
            document.getElementById(
                "address"
            ).value.trim();


        const city =
            document.getElementById(
                "city"
            ).value.trim();


        const postal =
            document.getElementById(
                "postal"
            ).value.trim();



        // Check fields

        if (
            !firstname ||
            !lastname ||
            !email ||
            !phone ||
            !address ||
            !city ||
            !postal
        ) {

            alert(
                "Please complete all shipping information."
            );

            return;

        }



        // Get payment method

        const payment =
            document.querySelector(
                'input[name="payment"]:checked'
            ).value;



        // Create order

        const order = {

            orderNumber:
                "VAL-" +
                Date.now(),

            customer: {

                firstname:
                    firstname,

                lastname:
                    lastname,

                email:
                    email,

                phone:
                    phone,

                address:
                    address,

                city:
                    city,

                postal:
                    postal

            },

            product:
                buyNowProduct,

            payment:
                payment,

            date:
                new Date().toLocaleString()

        };



        // Save order

        localStorage.setItem(
            "valqoraLastOrder",
            JSON.stringify(order)
        );



        // Remove Buy Now product

        localStorage.removeItem(
            "valqoraBuyNow"
        );



        // Go to confirmation

        window.location.href =
            "order-success.html";

    });

    // ==========================================
// PLACE ORDER
// ==========================================

document
    .getElementById("checkout-form")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        // ==============================
        // CUSTOMER INFORMATION
        // ==============================

        const firstname =
            document.getElementById("firstname").value.trim();

        const lastname =
            document.getElementById("lastname").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const address =
            document.getElementById("address").value.trim();

        const city =
            document.getElementById("city").value.trim();

        const postal =
            document.getElementById("postal").value.trim();


        // ==============================
        // PAYMENT
        // ==============================

        const payment =
            document.querySelector(
                'input[name="payment"]:checked'
            ).value;


        // ==============================
        // CHECK PRODUCT
        // ==============================

        if (!buyNowProduct) {

            alert("No product selected.");

            return;

        }


        // ==============================
        // CALCULATE
        // ==============================

        const subtotal =
            buyNowProduct.price *
            buyNowProduct.quantity;

        const shipping = 100;

        const total =
            subtotal + shipping;


        // ==============================
        // CREATE FORM
        // ==============================

        const form =
            document.createElement("form");

        form.method = "POST";

        form.action = "checkout.php";


        // ==============================
        // ADD FIELD FUNCTION
        // ==============================

        function addField(name, value) {

            const input =
                document.createElement("input");

            input.type = "hidden";

            input.name = name;

            input.value = value;

            form.appendChild(input);

        }


        // ==============================
        // CUSTOMER DATA
        // ==============================

        addField(
            "firstname",
            firstname
        );

        addField(
            "lastname",
            lastname
        );

        addField(
            "email",
            email
        );

        addField(
            "phone",
            phone
        );

        addField(
            "address",
            address
        );

        addField(
            "city",
            city
        );

        addField(
            "postal",
            postal
        );

        addField(
            "payment",
            payment
        );


        // ==============================
        // PRODUCT DATA
        // ==============================

        addField(
            "product_name",
            buyNowProduct.name
        );

        addField(
            "product_price",
            buyNowProduct.price
        );

        addField(
            "product_size",
            buyNowProduct.size
        );

        addField(
            "product_quantity",
            buyNowProduct.quantity
        );


        // ==============================
        // ORDER TOTAL
        // ==============================

        addField(
            "subtotal",
            subtotal
        );

        addField(
            "shipping",
            shipping
        );

        addField(
            "total",
            total
        );


        // ==============================
        // SEND TO PHP
        // ==============================

        document.body.appendChild(form);

        form.submit();

    });