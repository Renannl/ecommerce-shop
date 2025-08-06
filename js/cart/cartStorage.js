export function getProductsCart() {
    const products = localStorage.getItem("cart");
    return products ? JSON.parse(products) : [];
}

export function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}
