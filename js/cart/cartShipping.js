import { getProductsCart } from "./cartStorage.js";

export async function calculateShipping(zip, btnCalculateShipping) {
    btnCalculateShipping.disabled = true;
    const originalText = btnCalculateShipping.textContent;
    btnCalculateShipping.textContent = "Calculating...";
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
    } finally {
        btnCalculateShipping.disabled = false;
        btnCalculateShipping.textContent = originalText;
    }
}

export function validateZip(zip) {
    const regexCep = /^[0-9]{5}-?[0-9]{3}$/;
    return regexCep.test(zip);
}
