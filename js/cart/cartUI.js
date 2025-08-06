import { getProductsCart, saveCart } from "./cartStorage.js";

export function updateCartCounter() {
    const products = getProductsCart();
    let total = 0;
    products.forEach(product => {
        total += product.quantity;
    });
    document.getElementById("cart-counter").textContent = total;
}

export function renderCartTable() {
    const products = getProductsCart();
    const tableBody = document.querySelector("#modal-1-content table tbody");
    tableBody.innerHTML = "";
    products.forEach(product => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td class="td-product">
                                <img src="${product.image}" alt="${product.name}">
                            </td>
                            <td>${product.name}</td>
                            <td class="td-price-unitary">$${product.price}</td>
                            <td class="td-quantity">
                                <input type="number" class="input-quantity" data-id="${product.id}" value="${product.quantity}" min="1">
                            </td>
                            <td class="td-total-price">$${product.price * product.quantity}</td>
                            <td>
                                <button class="btn-remove" data-id="${product.id}"></button>
                            </td>`;
        tableBody.appendChild(tr);
    });
}

export function updateCartTotal() {
    const carrinho = getProductsCart();
    let total = 0;
    carrinho.forEach(item => {
        total += item.price * (item.quantity || 1);
    });
    const totalSpan = document.getElementById('cart-total');
    if (totalSpan) {
        totalSpan.textContent = `Total: $ ${total}`;
    }
}

export function calculateSubtotal() {
    let subtotal = 0;
    document.querySelectorAll(".td-total-price").forEach(item => {
        subtotal += parseFloat(item.textContent.replace(/[^0-9.-]+/g, "")) || 0;
    });
    const subtotalElement = document.querySelector("#subtotal-orders .price");
    if (subtotalElement) {
        subtotalElement.textContent = subtotal.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    }
    return subtotal;
}
