import { getProductsCart, saveCart } from "./cartStorage.js";
import { updateCartCounter, renderCartTable, updateCartTotal, calculateSubtotal } from "./cartUI.js";
import { calculateShipping, validateZip } from "./cartShipping.js";

function updateCartAndTable() {
    updateCartCounter();
    renderCartTable();
    updateCartTotal();
    calculateSubtotal();
}

function removeProductFromCart(id) {
    const products = getProductsCart();
    const updatedCart = products.filter(product => product.id !== id);
    saveCart(updatedCart);
    updateCartAndTable();
}

function handleAddToCart(event) {
    const elementProduct = event.target.closest(".product");
    const productId = elementProduct.dataset.id;
    const productName = elementProduct.querySelector(".name").textContent;
    const productImage = elementProduct.querySelector("img").getAttribute("src");
    const productPrice = parseFloat(elementProduct.querySelector(".price").textContent.replace("$", ""));
    const cart = getProductsCart();
    const productExists = cart.find(product => product.id === productId);
    if (productExists) {
        productExists.quantity = (productExists.quantity || 1) + 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            image: productImage,
            price: productPrice,
            quantity: 1
        });
    }
    saveCart(cart);
    updateCartAndTable();
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartAndTable();
    const btnAddToCart = document.querySelectorAll(".add-to-cart");
    btnAddToCart.forEach(button => {
        button.addEventListener("click", handleAddToCart);
    });
    const tableBody = document.querySelector("#modal-1-content table tbody");
    tableBody.addEventListener("click", event => {
        if (event.target.classList.contains("btn-remove")) {
            const id = event.target.dataset.id;
            removeProductFromCart(id);
        }
    });
    tableBody.addEventListener("input", event => {
        if (event.target.classList.contains("input-quantity")) {
            const products = getProductsCart();
            const product = products.find(product => product.id === event.target.dataset.id);
            let newQuantity = parseInt(event.target.value);
            if (product) {
                product.quantity = newQuantity;
            }
            saveCart(products);
            updateCartAndTable();
        }
    });
    const btnCalculateShipping = document.getElementById("calculate-zip");
    const inputZip = document.getElementById("input-zip");
    inputZip.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            btnCalculateShipping.click();
        }
    });
    btnCalculateShipping.addEventListener("click", async () => {
        const zip = inputZip.value.trim();
        const errorZip = document.querySelector(".error");
        if (!validateZip(zip)) {
            errorZip.textContent = "Invalid ZIP code.";
            errorZip.style.display = "block";
            return;
        }
        errorZip.style.display = "none";
        const shippingValue = await calculateShipping(zip, btnCalculateShipping);
        if (shippingValue === undefined || shippingValue === null || isNaN(shippingValue)) {
            errorZip.textContent = "Shipping calculation failed.";
            errorZip.style.display = "block";
            return;
        }
        document.querySelector("#price-ship .value").textContent = 
            shippingValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        document.querySelector("#price-ship").style.display = "flex";
        const subtotal = calculateSubtotal();
        document.querySelector("[data-micromodal-trigger='modal-1']")
            .addEventListener("click", () => {
                updateCartAndTable();
            });
        const totalWithShipping = subtotal + shippingValue;
        const cartTotalElement = document.querySelector("#total-cart");
        if (cartTotalElement) {
            cartTotalElement.textContent = `Total: ${totalWithShipping.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;
        }
    });
});
