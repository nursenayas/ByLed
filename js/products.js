const products = [
    { id: 1, name: "RGB LED Şerit", description: "Renk değiştiren LED şerit", price: "200 TL" },
    { id: 2, name: "Beyaz LED Ampul", description: "Tasarruflu LED ampul", price: "100 TL" }
];
const productList = document.getElementById("products");
products.forEach(product => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="product-detail.html?id=${product.id}">${product.name} - ${product.price}</a>`;
    productList.appendChild(li);
});