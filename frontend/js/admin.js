const API_URL = "http://localhost:5000/api/contact";

const adminToken = localStorage.getItem("adminToken");

// Redirect if not logged in
if (!adminToken) {
    window.location.replace("admin-login.html");
}

// DOM Elements
const messagesTableBody = document.getElementById("messagesTableBody");
const mobileMessages = document.getElementById("mobileMessages");

const totalMessages = document.getElementById("totalMessages");
const todayMessages = document.getElementById("todayMessages");

const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const emptyMessage = document.getElementById("emptyMessage");

const searchInput = document.getElementById("searchInput");
const refreshButton = document.getElementById("refreshButton");

const logoutButton = document.getElementById("logoutButton");

let allMessages = [];
let selectedMessageId = null;

// Logout
function logoutAdmin() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    window.location.replace("admin-login.html");
}

if (logoutButton) {
    logoutButton.addEventListener("click", logoutAdmin);
}

// Fetch Messages
async function fetchMessages() {
    try {

        loadingMessage.style.display = "block";
        errorMessage.style.display = "none";

        const response = await fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        });

        // Token expired
        if (response.status === 401) {
            logoutAdmin();
            return;
        }

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        allMessages = result.data || [];

        displayMessages(allMessages);

        updateStatistics(allMessages);
    } catch (err) {

        console.error(err);

        errorMessage.style.display = "block";
        errorMessage.innerHTML = err.message;

    } finally {

        loadingMessage.style.display = "none";

    }

}

refreshButton.addEventListener("click", fetchMessages);

// Modal DOM Elements
const messageModal = document.getElementById("messageModal");
const closeModalButton = document.getElementById("closeModalButton");

const modalName = document.getElementById("modalName");
const modalEmail = document.getElementById("modalEmail");
const modalSubject = document.getElementById("modalSubject");
const modalDate = document.getElementById("modalDate");
const modalMessage = document.getElementById("modalMessage");
const replyButton = document.getElementById("replyButton");

// Display all messages
function displayMessages(messages) {
    messagesTableBody.innerHTML = "";
    mobileMessages.innerHTML = "";

    if (messages.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    messages.forEach((contact) => {
        createTableRow(contact);
        createMobileCard(contact);
    });
}

// Create desktop table row
function createTableRow(contact) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${escapeHTML(contact.name)}</td>

        <td>
            <a
                class="email-link"
                href="mailto:${escapeHTML(contact.email)}"
            >
                ${escapeHTML(contact.email)}
            </a>
        </td>

        <td>
            <div class="subject-text">
                ${escapeHTML(contact.subject)}
            </div>
        </td>

        <td>${formatDate(contact.createdAt)}</td>

        <td>
            <div class="action-buttons">

                <button
                    type="button"
                    class="view-button"
                    title="View Message"
                >
                    <i class="fa-solid fa-eye"></i>
                </button>

                <button
                    type="button"
                    class="delete-button"
                    title="Delete Message"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>
        </td>
    `;

    const viewButton = row.querySelector(".view-button");
    const deleteButton = row.querySelector(".delete-button");

    viewButton.addEventListener("click", () => {
        openMessageModal(contact);
    });

    deleteButton.addEventListener("click", () => {
        openDeleteModal(contact._id);
    });

    messagesTableBody.appendChild(row);
}

// Create mobile message card
function createMobileCard(contact) {
    const card = document.createElement("article");

    card.className = "mobile-message-card";

    card.innerHTML = `
        <h3>${escapeHTML(contact.name)}</h3>

        <p>
            <strong>Email:</strong>
            ${escapeHTML(contact.email)}
        </p>

        <p>
            <strong>Subject:</strong>
            ${escapeHTML(contact.subject)}
        </p>

        <p>
            <strong>Date:</strong>
            ${formatDate(contact.createdAt)}
        </p>

        <div class="mobile-card-actions">

            <button
                type="button"
                class="view-button"
            >
                <i class="fa-solid fa-eye"></i>
                View
            </button>

            <button
                type="button"
                class="delete-button"
            >
                <i class="fa-solid fa-trash"></i>
                Delete
            </button>

        </div>
    `;

    const viewButton = card.querySelector(".view-button");
    const deleteButton = card.querySelector(".delete-button");

    viewButton.addEventListener("click", () => {
        openMessageModal(contact);
    });

    deleteButton.addEventListener("click", () => {
        openDeleteModal(contact._id);
    });

    mobileMessages.appendChild(card);
}

// Search messages
function searchMessages() {
    const searchValue = searchInput.value
        .toLowerCase()
        .trim();

    const filteredMessages = allMessages.filter((contact) => {
        const name = contact.name || "";
        const email = contact.email || "";
        const subject = contact.subject || "";
        const message = contact.message || "";

        return (
            name.toLowerCase().includes(searchValue) ||
            email.toLowerCase().includes(searchValue) ||
            subject.toLowerCase().includes(searchValue) ||
            message.toLowerCase().includes(searchValue)
        );
    });

    displayMessages(filteredMessages);
}

// Open view message modal
function openMessageModal(contact) {
    modalName.textContent = contact.name || "No name";
    modalEmail.textContent = contact.email || "No email";
    modalSubject.textContent = contact.subject || "No subject";
    modalDate.textContent = formatFullDate(contact.createdAt);
    modalMessage.textContent = contact.message || "No message";

    const email = encodeURIComponent(contact.email || "");
    const subject = encodeURIComponent(
        `Re: ${contact.subject || "Portfolio Contact"}`
    );

    replyButton.href = `mailto:${email}?subject=${subject}`;

    messageModal.classList.add("show");

    document.body.style.overflow = "hidden";
}

// Close view message modal
function closeMessageModal() {
    messageModal.classList.remove("show");

    document.body.style.overflow = "";
}

// Search event
if (searchInput) {
    searchInput.addEventListener("input", searchMessages);
}

// Close button event
if (closeModalButton) {
    closeModalButton.addEventListener("click", closeMessageModal);
}

// Close modal when clicking outside
if (messageModal) {
    messageModal.addEventListener("click", (event) => {
        if (event.target === messageModal) {
            closeMessageModal();
        }
    });
}

// Delete modal DOM elements
const deleteModal = document.getElementById("deleteModal");
const cancelDeleteButton = document.getElementById("cancelDeleteButton");
const confirmDeleteButton = document.getElementById("confirmDeleteButton");

const notification = document.getElementById("notification");

// Open delete confirmation modal
function openDeleteModal(messageId) {
    selectedMessageId = messageId;

    deleteModal.classList.add("show");

    document.body.style.overflow = "hidden";
}

// Close delete confirmation modal
function closeDeleteModal() {
    selectedMessageId = null;

    deleteModal.classList.remove("show");

    document.body.style.overflow = "";
}

// Delete selected message
async function deleteMessage() {
    if (!selectedMessageId) {
        return;
    }

    try {
        confirmDeleteButton.disabled = true;

        confirmDeleteButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Deleting...
        `;

        const response = await fetch(
            `${API_URL}/${selectedMessageId}`,
            {
                method: "DELETE",

                headers: {
                    Authorization: `Bearer ${adminToken}`
                }
            }
        );

        if (response.status === 401) {
            logoutAdmin();
            return;
        }

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Unable to delete message"
            );
        }

        allMessages = allMessages.filter(
            (message) => message._id !== selectedMessageId
        );

        displayMessages(allMessages);
        updateStatistics(allMessages);

        closeDeleteModal();

        showNotification(
            "Message deleted successfully",
            "success"
        );

    } catch (error) {
        console.error("Delete error:", error);

        showNotification(
            error.message || "Unable to delete message",
            "error"
        );

    } finally {
        confirmDeleteButton.disabled = false;

        confirmDeleteButton.innerHTML = "Delete";
    }
}

// Update message statistics
function updateStatistics(messages) {
    totalMessages.textContent = messages.length;

    const today = new Date();

    const todayCount = messages.filter((contact) => {
        if (!contact.createdAt) {
            return false;
        }

        const messageDate = new Date(contact.createdAt);

        return (
            messageDate.getDate() === today.getDate() &&
            messageDate.getMonth() === today.getMonth() &&
            messageDate.getFullYear() === today.getFullYear()
        );
    }).length;

    todayMessages.textContent = todayCount;
}

// Show notification
function showNotification(message, type = "success") {
    notification.textContent = message;

    notification.className =
        `notification show ${type}`;

    setTimeout(() => {
        notification.className = "notification";
    }, 3000);
}

// Format short date
function formatDate(dateValue) {
    if (!dateValue) {
        return "No date";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Invalid date";
    }

    return date.toLocaleDateString("en-LK", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

// Format full date and time
function formatFullDate(dateValue) {
    if (!dateValue) {
        return "No date";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Invalid date";
    }

    return date.toLocaleString("en-LK", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// Prevent HTML injection
function escapeHTML(value) {
    const element = document.createElement("div");

    element.textContent = value || "";

    return element.innerHTML;
}

// Cancel delete
if (cancelDeleteButton) {
    cancelDeleteButton.addEventListener(
        "click",
        closeDeleteModal
    );
}

// Confirm delete
if (confirmDeleteButton) {
    confirmDeleteButton.addEventListener(
        "click",
        deleteMessage
    );
}

// Close delete modal when clicking outside
if (deleteModal) {
    deleteModal.addEventListener("click", (event) => {
        if (event.target === deleteModal) {
            closeDeleteModal();
        }
    });
}

// Close modals with Escape key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMessageModal();
        closeDeleteModal();
    }
});

// Initial page load
document.addEventListener("DOMContentLoaded", () => {
    fetchMessages();
});