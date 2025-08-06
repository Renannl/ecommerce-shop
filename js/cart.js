/*
Objetivo 1 - quando clicar no botão de adicionar ao carrinho:
    - atualizar o contador
    - adicionar o produto no localStorage
    - atualizar a tabela HTML do carrinho

Objetivo 2 - remover produtos do carrinho:
    - ouvir o botão de deletar
    - remover do localStorage
    - atualizar o DOM e o total

Objetivo 3 - atualizar valores do carrinho:
    - ouvir mudanças de quantidade
    - recalcular total individual
    - recalcular total geral
*/

const btnAddToCart = document.querySelectorAll(".add-to-cart");

btnAddToCart.forEach((button) => {
    button.addEventListener("click", (event) => {

    const elementProduct = event.target.closest(".product")
    const productId = elementProduct.dataset.id
    const productName = elementProduct.querySelector(".name").textContent
    const productImage = elementProduct.querySelector("img").getAttribute("src")
    const productPrice = parseFloat(elementProduct.querySelector(".price").textContent.replace("$", ""))


    const cart = getProductsCart()
    
    const productExists = cart.find(product => product.id === productId)
    if(productExists){
        productExists.quantity = (productExists.quantity || 1) + 1;
    }else{
        const product = {
            id: productId,
            name: productName,
            image: productImage,
            price: productPrice,
            quantity: 1
        }
        cart.push(product)
    }
    function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart))
    }
    saveCart(cart)
    updateCartAndTable()
    })
})

function getProductsCart(){
    const products = localStorage.getItem("cart")
    return products ? JSON.parse(products) : [];
}

function updateCartCounter(){
    const products = getProductsCart()
    let total = 0

    products.forEach(product => {
        total += product.quantity
    })
    document.getElementById("cart-counter").textContent = total
}


function renderCartTable(){
    const products = getProductsCart()
    const tableBody = document.querySelector("#modal-1-content table tbody")
    tableBody.innerHTML= ""

    products.forEach(product => {
        const tr = document.createElement("tr")
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
                            </td>`
        tableBody.appendChild(tr)
    })
}


const tableBody = document.querySelector("#modal-1-content table tbody")
tableBody.addEventListener("click", event => {
    if (event.target.classList.contains("btn-remove")) {
    const id = event.target.dataset.id
    removeProductFromCart(id)
    }
})

tableBody.addEventListener("input", event => {
    if(event.target.classList.contains("input-quantity")){
        const products = getProductsCart()
        const product = products.find(product => product.id === event.target.dataset.id)
        let newQuantity = parseInt(event.target.value)
        if(product){
            product.quantity = newQuantity
        }
        saveCart(products)
        updateCartAndTable()
    }
})

function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart))
}

function removeProductFromCart(id) {
    const products = getProductsCart()
    console.log(products)
    const updatedCart = products.filter(product => product.id !== id)
    console.log(updatedCart)
    saveCart(updatedCart)
    updateCartAndTable()
} 

function updateCartTotal() {
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

function updateCartAndTable(){
    updateCartCounter()
    renderCartTable()
    updateCartTotal()
}

updateCartAndTable()

async function calculateShipping(zip) {
    const url = "https://renanlovo.app.n8n.cloud/webhook/8d3c2832-77b3-4dd5-9b8e-7c44d952a97d";

    try {
        const mesuresResponse = await fetch('./js/product-mesures.json');
        const mesures = await mesuresResponse.json();

        const product = getProductsCart();
        const products = product.map(product => {
            const mesure = mesures.find(m => m.id === product.id);
            return {
                quantity: product.quantity,
                height: mesure ? mesure.height : 4,
                length: mesure ? mesure.length : 30,
                width: mesure ? mesure.width : 25,
                weight: mesure ? mesure.weight : 0.25
            };
        });

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ zip, products })
        });

        if (!response.ok) throw new Error("Error in calculation");
        const result = await response.json();

        if (Array.isArray(result) && result.length > 0) {
            return result[0].price;
        } else if (result.price) {
            return result.price;
        } else {
            console.warn("Resposta inesperada do frete:", result);
            return null;
        }

    } catch (error) {
        console.error("Error at calculation:", error);
        return null;
    }
}

const btnCalculateShipping = document.getElementById("calculate-zip");
const inputZip = document.getElementById("input-zip");
const priceShip = document.getElementById("price-ship");

btnCalculateShipping.addEventListener("click", async () => {
    const zip = inputZip.value.trim();
    const errorZip = document.querySelector(".error");

    if (!validateZip(zip)) {
        errorZip.textContent = "Invalid ZIP code.";
        errorZip.style.display = "block";
        return;
    }
    errorZip.style.display = "none";

    // Chama API de frete
    const shippingValue = await calculateShipping(zip);

    if (shippingValue === undefined || shippingValue === null || isNaN(shippingValue)) {
        errorZip.textContent = "Shipping calculation failed.";
        errorZip.style.display = "block";
        return;
    }

    // Atualiza valor do frete
    document.querySelector("#price-ship .value").textContent = 
        shippingValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    document.querySelector("#price-ship").style.display = "flex";

    // ✅ Calcula subtotal dinâmico
    const subtotal = calculateSubtotal();

    // ✅ Soma subtotal + frete
    const totalWithShipping = subtotal + shippingValue;
    const cartTotalElement = document.querySelector("#total-cart");
    if (cartTotalElement) {
        cartTotalElement.textContent = `Total: ${totalWithShipping.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;
    }
});

function calculateSubtotal() {
    let subtotal = 0;

    // Soma os valores de cada item no carrinho
    document.querySelectorAll(".td-total-price").forEach(item => {
        subtotal += parseFloat(item.textContent.replace(/[^0-9.-]+/g, "")) || 0;
    });

    // Atualiza o HTML
    const subtotalElement = document.querySelector("#subtotal-orders .price");
    if (subtotalElement) {
        subtotalElement.textContent = subtotal.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    }

    return subtotal;
}



function validateZip(zip) {
    const regexCep = /^[0-9]{5}-?[0-9]{3}$/;
    return regexCep.test(zip);
}
