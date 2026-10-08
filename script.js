// --- Data Structures (Arrays & Objects) ---
let wishlist = [];

// Product catalog object registry for reference
const productCatalog = {
    1: { id: 1, name: "Sourdough Loaf", price: "$7.50" },
    2: { id: 2, name: "Almond Croissant", price: "$4.25" },
    3: { id: 3, name: "Cinnamon Brioche", price: "$5.00" }
};

// --- Initialization on Page Load ---
document.addEventListener("DOMContentLoaded", () => {
    loadWishlistFromStorage();
    setupEventListeners();
    prefillFormFromStorage();
});

// --- Event Listeners Setup ---
function setupEventListeners() {
    // Interactive feature: Favorite buttons
    const favoriteButtons = document.querySelectorAll(".favorite-btn");
    favoriteButtons.forEach(button => {
        button.addEventListener("click", handleFavoriteClick);
    });

    // Form submission validation
    const orderForm = document.getElementById("order-form");
    if (orderForm) {
        orderForm.addEventListener("submit", handleFormSubmit);
    }

    // Live storage input saving as user types
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    if (nameInput && emailInput) {
        nameInput.addEventListener("input", saveDraftInput);
        emailInput.addEventListener("input", saveDraftInput);
    }
}

// --- Interactive Feature Logic: Wishlist Management ---
function handleFavoriteClick(event) {
    const card = event.target.closest(".product-card");
    const productId = card.getAttribute("data-id");
    const productName = card.getAttribute("data-name");

    const itemIndex = wishlist.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        // Remove from wishlist
        wishlist.splice(itemIndex, 1);
        event.target.classList.remove("favorited");
        event.target.textContent = "Add to Wishlist";
    } else {
        // Add to wishlist object/array
        wishlist.push({ id: productId, name: productName });
        event.target.classList.add("favorited");
        event.target.textContent = "Saved in Wishlist ✓";
    }

    saveWishlistToStorage();
    renderWishlist();
}

function renderWishlist() {
    const wishlistContainer = document.getElementById("wishlist-items");
    const wishlistCount = document.getElementById("wishlist-count");
    
    wishlistContainer.innerHTML = "";
    wishlistCount.textContent = wishlist.length;

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = "<li>No favorites saved yet.</li>";
        return;
    }

    wishlist.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.name;
        wishlistContainer.appendChild(li);
    });
}

// --- Browser Storage Functions (`localStorage`) ---
function saveWishlistToStorage() {
    localStorage.setItem("bakeryWishlist", JSON.stringify(wishlist));
}

function loadWishlistFromStorage() {
    const storedWishlist = localStorage.getItem("bakeryWishlist");
    if (storedWishlist) {
        wishlist = JSON.parse(storedWishlist);
        
        // Update UI button states based on loaded storage
        wishlist.forEach(item => {
            const card = document.querySelector(`.product-card[data-id="${item.id}"]`);
            if (card) {
                const btn = card.querySelector(".favorite-btn");
                btn.classList.add("favorited");
                btn.textContent = "Saved in Wishlist ✓";
            }
        });
        renderWishlist();
    }
}

function saveDraftInput(event) {
    const fieldId = event.target.id;
    localStorage.setItem(`draft_${fieldId}`, event.target.value);
}

function prefillFormFromStorage() {
    const savedName = localStorage.getItem("draft_name");
    const savedEmail = localStorage.getItem("draft_email");

    if (savedName) document.getElementById("name").value = savedName;
    if (savedEmail) document.getElementById("email").value = savedEmail;
}

// --- Form Validation Logic ---
function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default submission

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    
    let isValid = true;

    // Validation Check 1: Required Field Check
    if (nameInput.value.trim() === "") {
        showError("name-error", "Name is required.", nameInput);
        isValid = false;
    } else {
        clearError("name-error", nameInput);
    }

    // Validation Check 2: Email Format Validation
    const emailValue = emailInput.value.trim();
    if (emailValue === "") {
        showError("email-error", "Email address is required.", emailInput);
        isValid = false;
    } else if (!emailValue.includes("@") || !emailValue.includes(".")) {
        showError("email-error", "Please enter a valid email address containing '@' and '.'.", emailInput);
        isValid = false;
    } else {
        clearError("email-error", emailInput);
    }

    // Final Validation Outcome
    const successMsg = document.getElementById("form-success");
    if (isValid) {
        successMsg.textContent = "Thank you! Your custom order inquiry has been validated successfully.";
        // Clear draft storage upon successful valid submission
        localStorage.removeItem("draft_name");
        localStorage.removeItem("draft_email");
    } else {
        successMsg.textContent = "";
    }
}

function showError(errorElementId, message, inputElement) {
    const errorEl = document.getElementById(errorElementId);
    errorEl.textContent = message;
    inputElement.classList.add("error");
}

function clearError(errorElementId, inputElement) {
    const errorEl = document.getElementById(errorElementId);
    errorEl.textContent = "";
    inputElement.classList.remove("error");
}