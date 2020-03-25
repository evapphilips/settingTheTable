var askBtn = document.getElementById('learnMoreBtn')
askBtn.addEventListener("click", () => {
    document.getElementById("askModal").style.display = "flex";
})
// Close modal
document.getElementById('closeModal').addEventListener("click", () => {
    document.getElementById("askModal").style.display = "none";
})