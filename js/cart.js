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
const cartCounter = document.querySelector(".cart-count");

btnAddToCart.forEach((button) => {
    button.addEventListener("click", (event) => {
    let currentCount = parseInt(cartCounter.innerHTML)
    cartCounter.innerHTML = currentCount + 1

    const elementProduct = event.target.closest(".product")
    const productId = elementProduct.dataset.id
    const productName = elementProduct.querySelector(".info").textContent
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
            price: productImage,
            quantity: 1
        }
        cart.push(product)
    }
    function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart))
    }
    saveCart(cart)
    })
})

function getProductsCart(){
    const products = localStorage.getItem("cart")
    return products ? JSON.parse(products) : [];
}