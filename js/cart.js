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
    updateCartCounter()
    renderCartTable()
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

updateCartCounter()

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
                                <input type="number" value="${product.quantity}" min="1">
                            </td>
                            <td class="td-total-price">$${product.price}</td>
                            <td>
                                <button class="btn-remove" data-id="${product.id}"></button>
                            </td>`
        tableBody.appendChild(tr)
    })
}
renderCartTable()