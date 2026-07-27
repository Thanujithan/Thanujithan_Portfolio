const API_URL =
    "https://thanujithan-portfolio-backend.onrender.com/api/admin";

const adminLoginForm =
    document.getElementById("adminLoginForm");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const loginMessage =
    document.getElementById("loginMessage");

const togglePassword =
    document.getElementById("togglePassword");


// ==========================================
// CHECK EXISTING LOGIN
// ==========================================

const existingToken =
    localStorage.getItem("adminToken");

if (existingToken) {
    verifyExistingToken(existingToken);
}


async function verifyExistingToken(token) {
    try {
        const response = await fetch(
            `${API_URL}/verify`,
            {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.ok) {
            window.location.href = "admin.html";
        } else {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUsername");
        }
    } catch (error) {
        console.error(
            "Token verify error:",
            error
        );

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUsername");
    }
}


// ==========================================
// ADMIN LOGIN
// ==========================================

if (adminLoginForm) {
    adminLoginForm.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();

            const username =
                usernameInput.value.trim();

            const password =
                passwordInput.value;

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

                const response = await fetch(
                    `${API_URL}/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            username,
                            password
                        })
                    }
                );

                const result =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                        "Login failed"
                    );
                }

                if (!result.token) {
                    throw new Error(
                        "Login token was not received"
                    );
                }

                localStorage.setItem(
                    "adminToken",
                    result.token
                );

                localStorage.setItem(
                    "adminUsername",
                    result.admin?.username ||
                    username
                );

                showMessage(
                    "Login successful",
                    "success"
                );

                setTimeout(() => {
                    window.location.href =
                        "admin.html";
                }, 700);

            } catch (error) {
                console.error(
                    "Admin login error:",
                    error
                );

                showMessage(
                    error.message ||
                    "Unable to connect to server",
                    "error"
                );

            } finally {
                loginButton.disabled = false;

                loginButton.innerHTML = `
                    <i class="fa-solid fa-right-to-bracket"></i>
                    Login
                `;
            }
        }
    );
}


// ==========================================
// SHOW / HIDE PASSWORD
// ==========================================

if (togglePassword) {
    togglePassword.addEventListener(
        "click",
        () => {
            const isPassword =
                passwordInput.type === "password";

            passwordInput.type =
                isPassword
                    ? "text"
                    : "password";

            togglePassword.innerHTML =
                isPassword
                    ? '<i class="fa-solid fa-eye-slash"></i>'
                    : '<i class="fa-solid fa-eye"></i>';
        }
    );
}


// ==========================================
// SHOW MESSAGE
// ==========================================

function showMessage(message, type) {
    if (!loginMessage) {
        return;
    }

    loginMessage.textContent = message;

    loginMessage.className =
        `login-message ${type}`;
}