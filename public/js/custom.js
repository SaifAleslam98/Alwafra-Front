

// When the user clicks the button, open the modal 
const openModal = function(modalName) {
    const modal = document.getElementById(modalName);
    modal.style.display = "block";
}
const closeModal = function(modalName) {
    const modal = document.getElementById(modalName);
    modal.style.display = "none";
}
// When the user clicks on <span> (x), close the modal
const closeButton = function() {
    const modal = document.closest('.modal');
    modal.style.display = "none";
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    const modal = event.target.closest('.modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}