const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
const product = products.find(p => p.id == productId);
if (product) {
    document.getElementById("product-info").textContent = `${product.name} - ${product.description} - ${product.price}`;
}