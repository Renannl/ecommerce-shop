document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(".hamburguer-menu")
    const header = document.querySelector(".header")

    menuButton.addEventListener("click", () => {
        header.classList.toggle("active-menu")
    })
})