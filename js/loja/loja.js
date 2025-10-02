// Global store data
let storeData = {
  userStars: 2000,
  itemsRedeemed: 15,
  starsSpent: 1250,
  availableItems: 8,
};

// DOM Elements
const userStarsDisplay = document.getElementById("user-stars-display");
const categoryButtons = document.querySelectorAll(".category-btn");
const storeItems = document.querySelectorAll(".store-item");
const redeemButtons = document.querySelectorAll(".redeem-btn");
const statNumbers = document.querySelectorAll(".stat-number");
const notificationContainer = document.getElementById("notification-container");

// Initialize Store
function initStore() {
  updateStoreDisplay();
  initCategoryFilters();
  initRedeemButtons();
  updateButtonStates();

  // Welcome notification
  setTimeout(() => {
    showNotification("Bem-vindo à Loja SwiftStars! 🛍️", "success");
  }, 500);
}

// Update Store Display
function updateStoreDisplay() {
  if (userStarsDisplay) {
    userStarsDisplay.textContent = `${storeData.userStars} SwiftStars`;
  }

  // Update stats
  if (statNumbers.length >= 3) {
    statNumbers[0].textContent = storeData.itemsRedeemed;
    statNumbers[1].textContent = storeData.starsSpent.toLocaleString();
    statNumbers[2].textContent = storeData.availableItems;
  }
}

// Category Filters
function initCategoryFilters() {
  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category");

      // Update active button
      categoryButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Filter items
      storeItems.forEach((item) => {
        const itemCategory = item.getAttribute("data-category");
        if (category === "all" || itemCategory === category) {
          item.style.display = "block";
          // Add animation
          item.style.opacity = "0";
          setTimeout(() => {
            item.style.transition = "opacity 0.3s ease";
            item.style.opacity = "1";
          }, 100);
        } else {
          item.style.display = "none";
        }
      });

      // Show filter feedback
      showNotification(`Filtro aplicado: ${btn.textContent}`, "info");
    });
  });
}

// Redeem Buttons
function initRedeemButtons() {
  redeemButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const itemName = btn.getAttribute("data-item");
      const price = parseInt(btn.getAttribute("data-price"));

      if (!btn.classList.contains("disabled")) {
        redeemItem(itemName, price, btn);
      } else {
        showNotification(
          "SwiftStars insuficientes! Complete mais missões.",
          "info"
        );
      }
    });
  });
}

// Update Button States
function updateButtonStates() {
  redeemButtons.forEach((btn) => {
    const price = parseInt(btn.getAttribute("data-price"));

    if (storeData.userStars >= price) {
      btn.classList.remove("disabled");
      btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Resgatar';
    } else {
      btn.classList.add("disabled");
      btn.innerHTML = '<i class="fas fa-ban"></i> Insuficiente';
    }
  });
}

// Redeem Item
function redeemItem(itemName, cost, buttonElement) {
  if (storeData.userStars >= cost) {
    // Deduct stars
    storeData.userStars -= cost;
    storeData.itemsRedeemed += 1;
    storeData.starsSpent += cost;

    // Update display
    updateStoreDisplay();

    // Button feedback
    buttonElement.innerHTML = '<i class="fas fa-check"></i> Resgatado!';
    buttonElement.style.background = "#10B981";
    buttonElement.classList.add("disabled");

    // Success notification
    showNotification(`${itemName} resgatado com sucesso! 🎉`, "success");

    // Update all button states after delay
    setTimeout(() => {
      updateButtonStates();
    }, 2000);

    // Add purchase animation
    addPurchaseAnimation(buttonElement);

    // Trigger custom event for external integration
    dispatchStoreEvent("itemPurchased", {
      itemName: itemName,
      cost: cost,
      remainingStars: storeData.userStars,
    });
  } else {
    showNotification(
      "SwiftStars insuficientes! Complete mais missões para ganhar pontos.",
      "info"
    );
  }
}

// Purchase Animation
function addPurchaseAnimation(button) {
  const item = button.closest(".store-item");

  // Add bounce animation
  item.style.transform = "scale(1.05)";
  item.style.boxShadow = "0 8px 32px rgba(16, 185, 129, 0.3)";

  setTimeout(() => {
    item.style.transform = "scale(1)";
    item.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
  }, 300);
}

// Notification System
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

  notificationContainer.appendChild(notification);

  // Show notification
  setTimeout(() => notification.classList.add("show"), 100);

  // Auto remove
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 3000);

  // Close button
  notification
    .querySelector(".notification-close")
    .addEventListener("click", () => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    });
}

// Custom Events for External Integration
function dispatchStoreEvent(eventName, data) {
  const event = new CustomEvent(`swiftStarsStore:${eventName}`, {
    detail: data,
  });
  window.dispatchEvent(event);
}

// Public API for External Integration
window.SwiftStarsStore = {
  // Get current user stars
  getUserStars: () => storeData.userStars,

  // Set user stars (for external updates)
  setUserStars: (amount) => {
    storeData.userStars = amount;
    updateStoreDisplay();
    updateButtonStates();
  },

  // Add stars to user
  addStars: (amount) => {
    storeData.userStars += amount;
    updateStoreDisplay();
    updateButtonStates();
    showNotification(`+${amount} SwiftStars adicionados! 🌟`, "success");
  },

  // Get store statistics
  getStats: () => ({
    userStars: storeData.userStars,
    itemsRedeemed: storeData.itemsRedeemed,
    starsSpent: storeData.starsSpent,
    availableItems: storeData.availableItems,
  }),

  // Show notification from external
  showNotification: showNotification,

  // Reset store (for testing)
  reset: () => {
    storeData = {
      userStars: 200,
      itemsRedeemed: 15,
      starsSpent: 1250,
      availableItems: 8,
    };
    updateStoreDisplay();
    updateButtonStates();
    showNotification("Loja resetada!", "info");
  },
};

// Event Listeners for External Integration
// Listen for external star updates
window.addEventListener("swiftStarsStore:updateStars", (event) => {
  SwiftStarsStore.setUserStars(event.detail.amount);
});

// Listen for external star additions
window.addEventListener("swiftStarsStore:addStars", (event) => {
  SwiftStarsStore.addStars(event.detail.amount);
});

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initStore);

// Utility Functions
function formatNumber(num) {
  return num.toLocaleString();
}

function animateValue(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    element.textContent = Math.round(current);

    if (current >= end) {
      element.textContent = end;
      clearInterval(timer);
    }
  }, 16);
}

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Press 'R' to reset store (for development)
  if (e.key === "r" || e.key === "R") {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      SwiftStarsStore.reset();
    }
  }

  // Press 'Escape' to close notifications
  if (e.key === "Escape") {
    const notifications = document.querySelectorAll(".notification");
    notifications.forEach((notif) => {
      notif.classList.remove("show");
      setTimeout(() => notif.remove(), 300);
    });
  }
});

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = SwiftStarsStore;
}
