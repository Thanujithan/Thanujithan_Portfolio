const API_URL = "http://localhost:5000/api/admin";

const adminLoginForm = document.getElementById("adminLoginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");

const togglePassword = document.getElementById("togglePassword");

// Already logged in
const existingToken = localStorage.getItem("adminToken");

if (existingToken) {
    verifyExistingToken(existingToken);
}

async function verifyExistingToken(token) {
    try {
        const response = await fetch(`${API_URL}/verify`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.ok) {
            window.location.href = "admin.html";
        } else {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUsername");
        }
    } catch (error) {
        console.error("Token verify error:", error);
    }
}

// Login
adminLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        showMessage(
            "Please enter username and password",
            "error"
        );

        return;
    }

    try {
        loginButton.disabled = true;

        loginButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Logging in...
        `;

        const response = await fetch(`${API_URL}/login`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Login failed"
            );
        }

        localStorage.setItem("adminToken", result.token);

        localStorage.setItem(
            "adminUsername",
            result.admin.username
        );

        showMessage("Login successful", "success");

        setTimeout(() => {
            window.location.href = "admin.html";
        }, 700);
    } catch (error) {
        showMessage(error.message, "error");
    } finally {
        loginButton.disabled = false;

        loginButton.innerHTML = `
            <i class="fa-solid fa-right-to-bracket"></i>
            Login
        `;
    }
});

// Show/hide password
togglePassword.addEventListener("click", () => {
    const isPassword =
        passwordInput.type === "password";

    passwordInput.type = isPassword
        ? "text"
        : "password";

    togglePassword.innerHTML = isPassword
        ? '<i class="fa-solid fa-eye-slash"></i>'
        : '<i class="fa-solid fa-eye"></i>';
});

function showMessage(message, type) {
    loginMessage.textContent = message;
    loginMessage.className = `login-message ${type}`;
}