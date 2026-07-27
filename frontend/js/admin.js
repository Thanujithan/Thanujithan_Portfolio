// ==========================================
// API URLS
// ==========================================

const CONTACT_API_URL =
    "https://thanujithan-portfolio-backend.onrender.com/api/contact";

const PROJECTS_API_URL =
    "https://thanujithan-portfolio-backend.onrender.com/api/projects";

const adminToken =
    localStorage.getItem("adminToken");


// ==========================================
// LOGIN CHECK
// ==========================================

if (!adminToken) {
    window.location.replace("admin-login.html");
}


// ==========================================
// MESSAGE DOM ELEMENTS
// ==========================================

const messagesTableBody =
    document.getElementById("messagesTableBody");

const mobileMessages =
    document.getElementById("mobileMessages");

const totalMessages =
    document.getElementById("totalMessages");

const todayMessages =
    document.getElementById("todayMessages");

const newMessages =
    document.getElementById("newMessages");

const readMessages =
    document.getElementById("readMessages");

const repliedMessages =
    document.getElementById("repliedMessages");

const loadingMessage =
    document.getElementById("loadingMessage");

const errorMessage =
    document.getElementById("errorMessage");

const emptyMessage =
    document.getElementById("emptyMessage");

const searchInput =
    document.getElementById("searchInput");

const refreshButton =
    document.getElementById("refreshButton");

const logoutButton =
    document.getElementById("logoutButton");


// ==========================================
// MESSAGE VIEW MODAL ELEMENTS
// ==========================================

const messageModal =
    document.getElementById("messageModal");

const closeModalButton =
    document.getElementById("closeModalButton");

const modalName =
    document.getElementById("modalName");

const modalEmail =
    document.getElementById("modalEmail");

const modalSubject =
    document.getElementById("modalSubject");

const modalStatus =
    document.getElementById("modalStatus");

const modalDate =
    document.getElementById("modalDate");

const modalMessage =
    document.getElementById("modalMessage");

const replyButton =
    document.getElementById("replyButton");


// ==========================================
// MESSAGE DELETE MODAL ELEMENTS
// ==========================================

const deleteModal =
    document.getElementById("deleteModal");

const cancelDeleteButton =
    document.getElementById("cancelDeleteButton");

const confirmDeleteButton =
    document.getElementById("confirmDeleteButton");


// ==========================================
// PROJECT DOM ELEMENTS
// ==========================================

const totalProjects =
    document.getElementById("totalProjects");

const addProjectButton =
    document.getElementById("addProjectButton");

const projectsTableBody =
    document.getElementById("projectsTableBody");

const mobileProjects =
    document.getElementById("mobileProjects");

const projectsLoadingMessage =
    document.getElementById(
        "projectsLoadingMessage"
    );

const projectsErrorMessage =
    document.getElementById(
        "projectsErrorMessage"
    );

const emptyProjectsMessage =
    document.getElementById(
        "emptyProjectsMessage"
    );


// ==========================================
// PROJECT ADD / EDIT MODAL ELEMENTS
// ==========================================

const projectModal =
    document.getElementById("projectModal");

const projectModalTitle =
    document.getElementById(
        "projectModalTitle"
    );

const closeProjectModalButton =
    document.getElementById(
        "closeProjectModalButton"
    );

const cancelProjectButton =
    document.getElementById(
        "cancelProjectButton"
    );

const projectForm =
    document.getElementById("projectForm");

const projectId =
    document.getElementById("projectId");

const projectTitle =
    document.getElementById("projectTitle");

const projectDescription =
    document.getElementById(
        "projectDescription"
    );

const projectTechnologies =
    document.getElementById(
        "projectTechnologies"
    );

const projectImageUrl =
    document.getElementById(
        "projectImageUrl"
    );

const projectGithubUrl =
    document.getElementById(
        "projectGithubUrl"
    );

const projectLiveUrl =
    document.getElementById(
        "projectLiveUrl"
    );

const projectDisplayOrder =
    document.getElementById(
        "projectDisplayOrder"
    );

const projectFeatured =
    document.getElementById(
        "projectFeatured"
    );

const saveProjectButton =
    document.getElementById(
        "saveProjectButton"
    );


// ==========================================
// PROJECT DELETE MODAL ELEMENTS
// ==========================================

const deleteProjectModal =
    document.getElementById(
        "deleteProjectModal"
    );

const cancelDeleteProjectButton =
    document.getElementById(
        "cancelDeleteProjectButton"
    );

const confirmDeleteProjectButton =
    document.getElementById(
        "confirmDeleteProjectButton"
    );


// ==========================================
// NOTIFICATION
// ==========================================

const notification =
    document.getElementById("notification");


// ==========================================
// GLOBAL VARIABLES
// ==========================================

let allMessages = [];

let selectedMessageId = null;

let openedMessageId = null;

let allProjects = [];

let selectedProjectId = null;

let editingProjectId = null;


// ==========================================
// LOGOUT
// ==========================================

function logoutAdmin() {

    localStorage.removeItem("adminToken");

    localStorage.removeItem(
        "adminUsername"
    );

    window.location.replace(
        "admin-login.html"
    );
}


// ==========================================
// FETCH CONTACT MESSAGES
// ==========================================

async function fetchMessages() {

    try {

        if (loadingMessage) {
            loadingMessage.style.display =
                "block";
        }

        if (errorMessage) {

            errorMessage.style.display =
                "none";

            errorMessage.textContent = "";

        }

        const response = await fetch(
            CONTACT_API_URL,
            {
                method: "GET",

                headers: {
                    Authorization:
                        `Bearer ${adminToken}`
                }
            }
        );

        if (response.status === 401) {

            logoutAdmin();

            return;

        }

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to load messages"
            );

        }

        if (Array.isArray(result)) {

            allMessages = result;

        } else if (
            Array.isArray(result.data)
        ) {

            allMessages = result.data;

        } else if (
            Array.isArray(result.messages)
        ) {

            allMessages = result.messages;

        } else {

            allMessages = [];

        }

        allMessages =
            allMessages.map((message) => ({
                ...message,

                status:
                    getValidStatus(
                        message.status
                    )
            }));

        displayCurrentMessageList();

        updateMessageStatistics();

    } catch (error) {

        console.error(
            "Fetch messages error:",
            error
        );

        if (errorMessage) {

            errorMessage.style.display =
                "block";

            errorMessage.textContent =
                error.message ||
                "Unable to load messages";

        }

    } finally {

        if (loadingMessage) {

            loadingMessage.style.display =
                "none";

        }

    }

}


// ==========================================
// DISPLAY CONTACT MESSAGES
// ==========================================

function displayMessages(messages) {

    if (messagesTableBody) {
        messagesTableBody.innerHTML = "";
    }

    if (mobileMessages) {
        mobileMessages.innerHTML = "";
    }

    if (
        !Array.isArray(messages) ||
        messages.length === 0
    ) {

        if (emptyMessage) {

            emptyMessage.style.display =
                "block";

        }

        return;

    }

    if (emptyMessage) {

        emptyMessage.style.display =
            "none";

    }

    messages.forEach((contact) => {

        createMessageTableRow(contact);

        createMessageMobileCard(contact);

    });

}


// ==========================================
// CREATE MESSAGE TABLE ROW
// ==========================================

function createMessageTableRow(contact) {

    if (!messagesTableBody) {
        return;
    }

    const status =
        getValidStatus(contact.status);

    const row =
        document.createElement("tr");

    row.innerHTML = `

        <td>
            ${escapeHTML(
                contact.name || "No name"
            )}
        </td>

        <td>

            <a
                class="email-link"

                href="mailto:${escapeHTML(
                    contact.email || ""
                )}"
            >

                ${escapeHTML(
                    contact.email ||
                    "No email"
                )}

            </a>

        </td>

        <td>

            <div class="subject-text">

                ${escapeHTML(
                    contact.subject ||
                    "No subject"
                )}

            </div>

        </td>

        <td>

            <span
                class="status-badge
                status-${status}"
            >

                ${capitalizeStatus(status)}

            </span>

        </td>

        <td>

            ${formatDate(
                contact.createdAt
            )}

        </td>

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

    const viewButton =
        row.querySelector(
            ".view-button"
        );

    const deleteButton =
        row.querySelector(
            ".delete-button"
        );

    if (viewButton) {

        viewButton.addEventListener(
            "click",
            () => {
                openMessageModal(contact);
            }
        );

    }

    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            () => {
                openDeleteModal(
                    contact._id
                );
            }
        );

    }

    messagesTableBody.appendChild(row);

}


// ==========================================
// CREATE MOBILE MESSAGE CARD
// ==========================================

function createMessageMobileCard(contact) {

    if (!mobileMessages) {
        return;
    }

    const status =
        getValidStatus(contact.status);

    const card =
        document.createElement("article");

    card.className =
        "mobile-message-card";

    card.innerHTML = `

        <h3>

            ${escapeHTML(
                contact.name || "No name"
            )}

        </h3>

        <p>

            <strong>Email:</strong>

            ${escapeHTML(
                contact.email ||
                "No email"
            )}

        </p>

        <p>

            <strong>Subject:</strong>

            ${escapeHTML(
                contact.subject ||
                "No subject"
            )}

        </p>

        <p>

            <strong>Status:</strong>

            <span
                class="status-badge
                status-${status}"
            >

                ${capitalizeStatus(status)}

            </span>

        </p>

        <p>

            <strong>Date:</strong>

            ${formatDate(
                contact.createdAt
            )}

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

    const viewButton =
        card.querySelector(
            ".view-button"
        );

    const deleteButton =
        card.querySelector(
            ".delete-button"
        );

    if (viewButton) {

        viewButton.addEventListener(
            "click",
            () => {
                openMessageModal(contact);
            }
        );

    }

    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            () => {
                openDeleteModal(
                    contact._id
                );
            }
        );

    }

    mobileMessages.appendChild(card);

}


// ==========================================
// SEARCH MESSAGES
// ==========================================

function searchMessages() {

    const searchValue =
        searchInput
            ? searchInput.value
                  .toLowerCase()
                  .trim()
            : "";

    const filteredMessages =
        allMessages.filter((contact) => {

            const name =
                String(
                    contact.name || ""
                ).toLowerCase();

            const email =
                String(
                    contact.email || ""
                ).toLowerCase();

            const subject =
                String(
                    contact.subject || ""
                ).toLowerCase();

            const message =
                String(
                    contact.message || ""
                ).toLowerCase();

            const status =
                getValidStatus(
                    contact.status
                );

            return (

                name.includes(searchValue) ||

                email.includes(searchValue) ||

                subject.includes(searchValue) ||

                message.includes(searchValue) ||

                status.includes(searchValue)

            );

        });

    displayMessages(filteredMessages);

}


function displayCurrentMessageList() {

    if (
        searchInput &&
        searchInput.value.trim() !== ""
    ) {

        searchMessages();

    } else {

        displayMessages(allMessages);

    }

}


// ==========================================
// UPDATE MESSAGE STATUS
// ==========================================

async function updateMessageStatus(
    messageId,
    newStatus
) {

    const validStatus =
        getValidStatus(newStatus);

    try {

        const response = await fetch(

            `${CONTACT_API_URL}/${messageId}/status`,

            {
                method: "PATCH",

                headers: {

                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${adminToken}`

                },

                body: JSON.stringify({
                    status: validStatus
                })
            }
        );

        if (response.status === 401) {

            logoutAdmin();

            return null;

        }

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to update status"
            );

        }

        const updatedMessage =
            result.data ||
            result.messageData ||
            result.contact ||
            result;

        updatedMessage.status =
            getValidStatus(
                updatedMessage.status
            );

        allMessages =
            allMessages.map((message) => {

                if (
                    message._id ===
                    messageId
                ) {

                    return {
                        ...message,
                        ...updatedMessage,
                        status: validStatus
                    };

                }

                return message;

            });

        displayCurrentMessageList();

        updateMessageStatistics();

        return allMessages.find(
            (message) =>
                message._id === messageId
        );

    } catch (error) {

        console.error(
            "Status update error:",
            error
        );

        showNotification(
            error.message ||
            "Unable to update status",
            "error"
        );

        return null;

    }

}


// ==========================================
// OPEN MESSAGE MODAL
// ==========================================

async function openMessageModal(contact) {

    if (!messageModal) {
        return;
    }

    let currentContact = {
        ...contact,

        status:
            getValidStatus(
                contact.status
            )
    };

    openedMessageId =
        currentContact._id;

    if (
        currentContact.status === "new"
    ) {

        const updated =
            await updateMessageStatus(
                currentContact._id,
                "read"
            );

        if (updated) {
            currentContact = updated;
        }

    }

    if (modalName) {

        modalName.textContent =
            currentContact.name ||
            "No name";

    }

    if (modalEmail) {

        modalEmail.textContent =
            currentContact.email ||
            "No email";

    }

    if (modalSubject) {

        modalSubject.textContent =
            currentContact.subject ||
            "No subject";

    }

    if (modalDate) {

        modalDate.textContent =
            formatFullDate(
                currentContact.createdAt
            );

    }

    if (modalMessage) {

        modalMessage.textContent =
            currentContact.message ||
            "No message";

    }

    updateModalStatus(
        currentContact.status
    );

    if (replyButton) {

        const email =
            currentContact.email || "";

        const subject =
            encodeURIComponent(

                `Re: ${
                    currentContact.subject ||
                    "Portfolio Contact"
                }`

            );

        replyButton.href =
            `mailto:${email}?subject=${subject}`;

        replyButton.dataset.messageId =
            currentContact._id;

    }

    messageModal.classList.add("show");

    document.body.style.overflow =
        "hidden";

}


// ==========================================
// UPDATE MESSAGE MODAL STATUS
// ==========================================

function updateModalStatus(statusValue) {

    if (!modalStatus) {
        return;
    }

    const status =
        getValidStatus(statusValue);

    modalStatus.textContent =
        capitalizeStatus(status);

    modalStatus.className =
        `status-badge status-${status}`;

}


// ==========================================
// CLOSE MESSAGE MODAL
// ==========================================

function closeMessageModal() {

    if (messageModal) {

        messageModal.classList.remove(
            "show"
        );

    }

    openedMessageId = null;

    if (replyButton) {

        replyButton.dataset.messageId =
            "";

    }

    document.body.style.overflow = "";

}


// ==========================================
// OPEN MESSAGE DELETE MODAL
// ==========================================

function openDeleteModal(messageId) {

    selectedMessageId = messageId;

    if (deleteModal) {

        deleteModal.classList.add(
            "show"
        );

    }

    document.body.style.overflow =
        "hidden";

}


// ==========================================
// CLOSE MESSAGE DELETE MODAL
// ==========================================

function closeDeleteModal() {

    selectedMessageId = null;

    if (deleteModal) {

        deleteModal.classList.remove(
            "show"
        );

    }

    document.body.style.overflow = "";

}


// ==========================================
// DELETE MESSAGE
// ==========================================

async function deleteMessage() {

    if (!selectedMessageId) {
        return;
    }

    try {

        if (confirmDeleteButton) {

            confirmDeleteButton.disabled =
                true;

            confirmDeleteButton.innerHTML = `

                <i
                    class="fa-solid
                    fa-spinner
                    fa-spin"
                ></i>

                Deleting...

            `;

        }

        const response = await fetch(

            `${CONTACT_API_URL}/${selectedMessageId}`,

            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${adminToken}`
                }
            }
        );

        if (response.status === 401) {

            logoutAdmin();

            return;

        }

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to delete message"
            );

        }

        allMessages =
            allMessages.filter(
                (message) =>
                    message._id !==
                    selectedMessageId
            );

        closeDeleteModal();

        displayCurrentMessageList();

        updateMessageStatistics();

        showNotification(
            "Message deleted successfully",
            "success"
        );

    } catch (error) {

        console.error(
            "Delete message error:",
            error
        );

        showNotification(
            error.message ||
            "Unable to delete message",
            "error"
        );

    } finally {

        if (confirmDeleteButton) {

            confirmDeleteButton.disabled =
                false;

            confirmDeleteButton.innerHTML =
                "Delete";

        }

    }

}


// ==========================================
// MESSAGE STATISTICS
// ==========================================

function updateMessageStatistics() {

    if (totalMessages) {

        totalMessages.textContent =
            allMessages.length;

    }

    const today = new Date();

    const todayCount =
        allMessages.filter((contact) => {

            if (!contact.createdAt) {
                return false;
            }

            const messageDate =
                new Date(
                    contact.createdAt
                );

            if (
                Number.isNaN(
                    messageDate.getTime()
                )
            ) {

                return false;

            }

            return (

                messageDate.getDate() ===
                    today.getDate() &&

                messageDate.getMonth() ===
                    today.getMonth() &&

                messageDate.getFullYear() ===
                    today.getFullYear()

            );

        }).length;

    if (todayMessages) {

        todayMessages.textContent =
            todayCount;

    }

    const newCount =
        allMessages.filter(
            (contact) =>
                getValidStatus(
                    contact.status
                ) === "new"
        ).length;

    const readCount =
        allMessages.filter(
            (contact) =>
                getValidStatus(
                    contact.status
                ) === "read"
        ).length;

    const repliedCount =
        allMessages.filter(
            (contact) =>
                getValidStatus(
                    contact.status
                ) === "replied"
        ).length;

    if (newMessages) {
        newMessages.textContent = newCount;
    }

    if (readMessages) {
        readMessages.textContent = readCount;
    }

    if (repliedMessages) {
        repliedMessages.textContent =
            repliedCount;
    }

}


// ==========================================
// FETCH PROJECTS
// ==========================================

async function fetchProjects() {

    try {

        if (projectsLoadingMessage) {

            projectsLoadingMessage.style.display =
                "block";

        }

        if (projectsErrorMessage) {

            projectsErrorMessage.style.display =
                "none";

            projectsErrorMessage.textContent =
                "";

        }

        const response = await fetch(
            PROJECTS_API_URL,
            {
                method: "GET",

                headers: {
                    Authorization:
                        `Bearer ${adminToken}`
                }
            }
        );

        if (response.status === 401) {

            logoutAdmin();

            return;

        }

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to load projects"
            );

        }

        if (Array.isArray(result)) {

            allProjects = result;

        } else if (
            Array.isArray(result.data)
        ) {

            allProjects = result.data;

        } else if (
            Array.isArray(result.projects)
        ) {

            allProjects =
                result.projects;

        } else {

            allProjects = [];

        }

        allProjects.sort((a, b) => {

            const firstOrder =
                Number(
                    a.displayOrder ??
                    a.order ??
                    0
                );

            const secondOrder =
                Number(
                    b.displayOrder ??
                    b.order ??
                    0
                );

            return (
                firstOrder -
                secondOrder
            );

        });

        displayProjects(allProjects);

        updateProjectStatistics();

    } catch (error) {

        console.error(
            "Fetch projects error:",
            error
        );

        if (projectsErrorMessage) {

            projectsErrorMessage.style.display =
                "block";

            projectsErrorMessage.textContent =
                error.message ||
                "Unable to load projects";

        }

    } finally {

        if (projectsLoadingMessage) {

            projectsLoadingMessage.style.display =
                "none";

        }

    }

}


// ==========================================
// DISPLAY PROJECTS
// ==========================================

function displayProjects(projects) {

    if (projectsTableBody) {

        projectsTableBody.innerHTML =
            "";

    }

    if (mobileProjects) {

        mobileProjects.innerHTML = "";

    }

    if (
        !Array.isArray(projects) ||
        projects.length === 0
    ) {

        if (emptyProjectsMessage) {

            emptyProjectsMessage.style.display =
                "block";

        }

        return;

    }

    if (emptyProjectsMessage) {

        emptyProjectsMessage.style.display =
            "none";

    }

    projects.forEach((project) => {

        createProjectTableRow(project);

        createProjectMobileCard(project);

    });

}


// ==========================================
// CREATE PROJECT TABLE ROW
// ==========================================

function createProjectTableRow(project) {

    if (!projectsTableBody) {
        return;
    }

    const row =
        document.createElement("tr");

    const imageUrl =
        getProjectImage(project);

    const title =
        project.title ||
        "Untitled Project";

    const technologies =
        normalizeTechnologies(
            project.technologies ||
            project.techStack
        );

    const featured =
        Boolean(project.featured);

    const displayOrder =
        Number(
            project.displayOrder ??
            project.order ??
            0
        );

    row.innerHTML = `

        <td>

            ${
                imageUrl
                    ? `

                        <img

                            class="project-thumbnail"

                            src="${escapeHTML(
                                imageUrl
                            )}"

                            alt="${escapeHTML(
                                title
                            )}"

                        >

                    `
                    : `

                        <div
                            class="project-placeholder"
                        >

                            <i
                                class="fa-solid
                                fa-image"
                            ></i>

                        </div>

                    `
            }

        </td>

        <td>

            <strong>

                ${escapeHTML(title)}

            </strong>

        </td>

        <td>

            <div class="technology-list">

                ${
                    technologies.length
                        ? technologies
                              .map(
                                  (
                                      technology
                                  ) => `

                                    <span
                                        class="technology-tag"
                                    >

                                        ${escapeHTML(
                                            technology
                                        )}

                                    </span>

                                `
                              )
                              .join("")
                        : `

                            <span
                                class="technology-tag"
                            >

                                Not added

                            </span>

                        `
                }

            </div>

        </td>

        <td>

            <span
                class="featured-badge
                ${featured ? "yes" : "no"}"
            >

                <i
                    class="fa-solid
                    ${
                        featured
                            ? "fa-star"
                            : "fa-minus"
                    }"
                ></i>

                ${featured ? "Yes" : "No"}

            </span>

        </td>

        <td>

            ${displayOrder}

        </td>

        <td>

            <div class="action-buttons">

                <button
                    type="button"
                    class="edit-button"
                    title="Edit Project"
                >

                    <i
                        class="fa-solid
                        fa-pen"
                    ></i>

                </button>

                <button
                    type="button"
                    class="delete-button"
                    title="Delete Project"
                >

                    <i
                        class="fa-solid
                        fa-trash"
                    ></i>

                </button>

            </div>

        </td>

    `;

    const editButton =
        row.querySelector(
            ".edit-button"
        );

    const deleteButton =
        row.querySelector(
            ".delete-button"
        );

    if (editButton) {

        editButton.addEventListener(
            "click",
            () => {

                openEditProjectModal(
                    project
                );

            }
        );

    }

    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            () => {

                openDeleteProjectModal(
                    project._id
                );

            }
        );

    }

    projectsTableBody.appendChild(row);

}


// ==========================================
// CREATE MOBILE PROJECT CARD
// ==========================================

function createProjectMobileCard(project) {

    if (!mobileProjects) {
        return;
    }

    const card =
        document.createElement("article");

    card.className =
        "mobile-project-card";

    const imageUrl =
        getProjectImage(project);

    const title =
        project.title ||
        "Untitled Project";

    const description =
        project.description ||
        "No description added";

    const technologies =
        normalizeTechnologies(
            project.technologies ||
            project.techStack
        );

    const featured =
        Boolean(project.featured);

    card.innerHTML = `

        <div class="mobile-project-header">

            ${
                imageUrl
                    ? `

                        <img

                            class="project-thumbnail"

                            src="${escapeHTML(
                                imageUrl
                            )}"

                            alt="${escapeHTML(
                                title
                            )}"

                        >

                    `
                    : `

                        <div
                            class="project-placeholder"
                        >

                            <i
                                class="fa-solid
                                fa-image"
                            ></i>

                        </div>

                    `
            }

            <div>

                <h3>

                    ${escapeHTML(title)}

                </h3>

                <span
                    class="featured-badge
                    ${featured ? "yes" : "no"}"
                >

                    <i
                        class="fa-solid
                        ${
                            featured
                                ? "fa-star"
                                : "fa-minus"
                        }"
                    ></i>

                    ${
                        featured
                            ? "Featured"
                            : "Normal"
                    }

                </span>

            </div>

        </div>

        <p>

            ${escapeHTML(description)}

        </p>

        <div class="technology-list">

            ${
                technologies.length
                    ? technologies
                          .map(
                              (
                                  technology
                              ) => `

                                <span
                                    class="technology-tag"
                                >

                                    ${escapeHTML(
                                        technology
                                    )}

                                </span>

                            `
                          )
                          .join("")
                    : `

                        <span
                            class="technology-tag"
                        >

                            Not added

                        </span>

                    `
            }

        </div>

        <div class="mobile-project-actions">

            <button
                type="button"
                class="edit-button"
            >

                <i
                    class="fa-solid
                    fa-pen"
                ></i>

                Edit

            </button>

            <button
                type="button"
                class="delete-button"
            >

                <i
                    class="fa-solid
                    fa-trash"
                ></i>

                Delete

            </button>

        </div>

    `;

    const editButton =
        card.querySelector(
            ".edit-button"
        );

    const deleteButton =
        card.querySelector(
            ".delete-button"
        );

    if (editButton) {

        editButton.addEventListener(
            "click",
            () => {

                openEditProjectModal(
                    project
                );

            }
        );

    }

    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            () => {

                openDeleteProjectModal(
                    project._id
                );

            }
        );

    }

    mobileProjects.appendChild(card);

}


// ==========================================
// OPEN ADD PROJECT MODAL
// ==========================================

function openAddProjectModal() {

    editingProjectId = null;

    if (projectForm) {
        projectForm.reset();
    }

    if (projectId) {
        projectId.value = "";
    }

    if (projectDisplayOrder) {
        projectDisplayOrder.value = "0";
    }

    if (projectFeatured) {
        projectFeatured.checked = false;
    }

    if (projectModalTitle) {

        projectModalTitle.textContent =
            "Add Project";

    }

    if (saveProjectButton) {

        saveProjectButton.innerHTML = `

            <i
                class="fa-solid
                fa-floppy-disk"
            ></i>

            Save Project

        `;

    }

    showProjectModal();

}


// ==========================================
// OPEN EDIT PROJECT MODAL
// ==========================================

function openEditProjectModal(project) {

    editingProjectId =
        project._id || null;

    if (projectId) {

        projectId.value =
            project._id || "";

    }

    if (projectTitle) {

        projectTitle.value =
            project.title || "";

    }

    if (projectDescription) {

        projectDescription.value =
            project.description || "";

    }

    if (projectTechnologies) {

        projectTechnologies.value =
            normalizeTechnologies(

                project.technologies ||
                project.techStack

            ).join(", ");

    }

    if (projectImageUrl) {

        projectImageUrl.value =
            getProjectImage(project);

    }

    if (projectGithubUrl) {

        projectGithubUrl.value =

            project.githubUrl ||

            project.githubLink ||

            project.github ||

            "";

    }

    if (projectLiveUrl) {

        projectLiveUrl.value =

            project.liveUrl ||

            project.liveLink ||

            project.demoUrl ||

            "";

    }

    if (projectDisplayOrder) {

        projectDisplayOrder.value =
            String(

                project.displayOrder ??
                project.order ??
                0

            );

    }

    if (projectFeatured) {

        projectFeatured.checked =
            Boolean(project.featured);

    }

    if (projectModalTitle) {

        projectModalTitle.textContent =
            "Edit Project";

    }

    if (saveProjectButton) {

        saveProjectButton.innerHTML = `

            <i
                class="fa-solid
                fa-floppy-disk"
            ></i>

            Update Project

        `;

    }

    showProjectModal();

}


// ==========================================
// SHOW PROJECT MODAL
// ==========================================

function showProjectModal() {

    if (projectModal) {

        projectModal.classList.add(
            "show"
        );

        document.body.style.overflow =
            "hidden";

    }

}


// ==========================================
// CLOSE PROJECT MODAL
// ==========================================

function closeProjectModal() {

    if (projectModal) {

        projectModal.classList.remove(
            "show"
        );

    }

    editingProjectId = null;

    if (projectForm) {
        projectForm.reset();
    }

    document.body.style.overflow = "";

}


// ==========================================
// SAVE PROJECT
// ==========================================

async function saveProject(event) {

    event.preventDefault();

    const titleValue =
        projectTitle
            ? projectTitle.value.trim()
            : "";

    const descriptionValue =
        projectDescription
            ? projectDescription.value.trim()
            : "";

    if (
        !titleValue ||
        !descriptionValue
    ) {

        showNotification(
            "Title and description are required",
            "error"
        );

        return;

    }

    const technologyArray =
        projectTechnologies
            ? projectTechnologies.value

                  .split(",")

                  .map(
                      (technology) =>
                          technology.trim()
                  )

                  .filter(Boolean)
            : [];

    const projectData = {

        title: titleValue,

        description:
            descriptionValue,

        technologies:
            technologyArray,

        imageUrl:
            projectImageUrl
                ? projectImageUrl.value.trim()
                : "",

        githubUrl:
            projectGithubUrl
                ? projectGithubUrl.value.trim()
                : "",

        liveUrl:
            projectLiveUrl
                ? projectLiveUrl.value.trim()
                : "",

        displayOrder:
            projectDisplayOrder
                ? Number(
                      projectDisplayOrder.value
                  ) || 0
                : 0,

        featured:
            projectFeatured
                ? projectFeatured.checked
                : false

    };

    const currentProjectId =

        editingProjectId ||

        (
            projectId
                ? projectId.value.trim()
                : ""
        );

    const isEditing =
        Boolean(currentProjectId);

    try {

        if (saveProjectButton) {

            saveProjectButton.disabled =
                true;

            saveProjectButton.innerHTML = `

                <i
                    class="fa-solid
                    fa-spinner
                    fa-spin"
                ></i>

                ${
                    isEditing
                        ? "Updating..."
                        : "Saving..."
                }

            `;

        }

        const requestUrl =
            isEditing

                ? `${PROJECTS_API_URL}/${currentProjectId}`

                : PROJECTS_API_URL;

        const response = await fetch(
            requestUrl,
            {
                method:
                    isEditing
                        ? "PUT"
                        : "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${adminToken}`

                },

                body:
                    JSON.stringify(
                        projectData
                    )
            }
        );

        if (response.status === 401) {

            logoutAdmin();

            return;

        }

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(
                result.message ||

                `Unable to ${
                    isEditing
                        ? "update"
                        : "add"
                } project`
            );

        }

        closeProjectModal();

        await fetchProjects();

        showNotification(

            isEditing

                ? "Project updated successfully"

                : "Project added successfully",

            "success"

        );

    } catch (error) {

        console.error(
            "Save project error:",
            error
        );

        showNotification(
            error.message ||
            "Unable to save project",
            "error"
        );

    } finally {

        if (saveProjectButton) {

            saveProjectButton.disabled =
                false;

            saveProjectButton.innerHTML = `

                <i
                    class="fa-solid
                    fa-floppy-disk"
                ></i>

                Save Project

            `;

        }

    }

}


// ==========================================
// OPEN DELETE PROJECT MODAL
// ==========================================

function openDeleteProjectModal(
    projectIdValue
) {

    selectedProjectId =
        projectIdValue;

    if (deleteProjectModal) {

        deleteProjectModal.classList.add(
            "show"
        );

    }

    document.body.style.overflow =
        "hidden";

}


// ==========================================
// CLOSE DELETE PROJECT MODAL
// ==========================================

function closeDeleteProjectModal() {

    selectedProjectId = null;

    if (deleteProjectModal) {

        deleteProjectModal.classList.remove(
            "show"
        );

    }

    document.body.style.overflow = "";

}


// ==========================================
// DELETE PROJECT
// ==========================================

async function deleteProject() {

    if (!selectedProjectId) {
        return;
    }

    try {

        if (
            confirmDeleteProjectButton
        ) {

            confirmDeleteProjectButton.disabled =
                true;

            confirmDeleteProjectButton.innerHTML = `

                <i
                    class="fa-solid
                    fa-spinner
                    fa-spin"
                ></i>

                Deleting...

            `;

        }

        const response = await fetch(

            `${PROJECTS_API_URL}/${selectedProjectId}`,

            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${adminToken}`
                }
            }
        );

        if (response.status === 401) {

            logoutAdmin();

            return;

        }

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to delete project"
            );

        }

        allProjects =
            allProjects.filter(
                (project) =>
                    project._id !==
                    selectedProjectId
            );

        closeDeleteProjectModal();

        displayProjects(allProjects);

        updateProjectStatistics();

        showNotification(
            "Project deleted successfully",
            "success"
        );

    } catch (error) {

        console.error(
            "Delete project error:",
            error
        );

        showNotification(
            error.message ||
            "Unable to delete project",
            "error"
        );

    } finally {

        if (
            confirmDeleteProjectButton
        ) {

            confirmDeleteProjectButton.disabled =
                false;

            confirmDeleteProjectButton.innerHTML =
                "Delete Project";

        }

    }

}


// ==========================================
// PROJECT STATISTICS
// ==========================================

function updateProjectStatistics() {

    if (totalProjects) {

        totalProjects.textContent =
            allProjects.length;

    }

}


// ==========================================
// NORMALIZE TECHNOLOGIES
// ==========================================

function normalizeTechnologies(value) {

    if (Array.isArray(value)) {

        return value

            .map(
                (item) =>
                    String(item).trim()
            )

            .filter(Boolean);

    }

    if (typeof value === "string") {

        return value

            .split(",")

            .map(
                (item) =>
                    item.trim()
            )

            .filter(Boolean);

    }

    return [];

}


// ==========================================
// GET PROJECT IMAGE
// ==========================================

function getProjectImage(project) {

    return (

        project.imageUrl ||

        project.image ||

        project.imageLink ||

        ""

    );

}


// ==========================================
// VALID MESSAGE STATUS
// ==========================================

function getValidStatus(statusValue) {

    const allowedStatuses = [

        "new",

        "read",

        "replied"

    ];

    const normalizedStatus =
        String(
            statusValue || "new"
        ).toLowerCase();

    if (
        allowedStatuses.includes(
            normalizedStatus
        )
    ) {

        return normalizedStatus;

    }

    return "new";

}


// ==========================================
// CAPITALIZE STATUS
// ==========================================

function capitalizeStatus(statusValue) {

    const status =
        getValidStatus(statusValue);

    return (

        status.charAt(0).toUpperCase() +

        status.slice(1)

    );

}


// ==========================================
// FORMAT SHORT DATE
// ==========================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "No date";
    }

    const date =
        new Date(dateValue);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Invalid date";

    }

    return date.toLocaleDateString(
        "en-LK",
        {
            year: "numeric",

            month: "short",

            day: "numeric"
        }
    );

}


// ==========================================
// FORMAT FULL DATE
// ==========================================

function formatFullDate(dateValue) {

    if (!dateValue) {
        return "No date";
    }

    const date =
        new Date(dateValue);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Invalid date";

    }

    return date.toLocaleString(
        "en-LK",
        {
            year: "numeric",

            month: "long",

            day: "numeric",

            hour: "2-digit",

            minute: "2-digit"
        }
    );

}


// ==========================================
// PREVENT HTML INJECTION
// ==========================================

function escapeHTML(value) {

    const element =
        document.createElement("div");

    element.textContent =
        String(value || "");

    return element.innerHTML;

}


// ==========================================
// SHOW NOTIFICATION
// ==========================================

function showNotification(
    message,
    type = "success"
) {

    if (!notification) {
        return;
    }

    notification.textContent =
        message;

    notification.className =
        `notification show ${type}`;

    setTimeout(() => {

        notification.className =
            "notification";

    }, 3000);

}


// ==========================================
// MESSAGE EVENT LISTENERS
// ==========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        searchMessages
    );

}


if (closeModalButton) {

    closeModalButton.addEventListener(
        "click",
        closeMessageModal
    );

}


if (messageModal) {

    messageModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                messageModal
            ) {

                closeMessageModal();

            }

        }
    );

}


if (replyButton) {

    replyButton.addEventListener(
        "click",
        async () => {

            const messageId =

                replyButton.dataset.messageId ||

                openedMessageId;

            if (!messageId) {
                return;
            }

            const updated =
                await updateMessageStatus(
                    messageId,
                    "replied"
                );

            if (updated) {

                updateModalStatus(
                    "replied"
                );

                showNotification(
                    "Message marked as replied",
                    "success"
                );

            }

        }
    );

}


if (cancelDeleteButton) {

    cancelDeleteButton.addEventListener(
        "click",
        closeDeleteModal
    );

}


if (confirmDeleteButton) {

    confirmDeleteButton.addEventListener(
        "click",
        deleteMessage
    );

}


if (deleteModal) {

    deleteModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                deleteModal
            ) {

                closeDeleteModal();

            }

        }
    );

}


// ==========================================
// PROJECT EVENT LISTENERS
// ==========================================

if (addProjectButton) {

    addProjectButton.addEventListener(
        "click",
        openAddProjectModal
    );

}


if (closeProjectModalButton) {

    closeProjectModalButton.addEventListener(
        "click",
        closeProjectModal
    );

}


if (cancelProjectButton) {

    cancelProjectButton.addEventListener(
        "click",
        closeProjectModal
    );

}


if (projectForm) {

    projectForm.addEventListener(
        "submit",
        saveProject
    );

}


if (projectModal) {

    projectModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                projectModal
            ) {

                closeProjectModal();

            }

        }
    );

}


if (cancelDeleteProjectButton) {

    cancelDeleteProjectButton.addEventListener(
        "click",
        closeDeleteProjectModal
    );

}


if (confirmDeleteProjectButton) {

    confirmDeleteProjectButton.addEventListener(
        "click",
        deleteProject
    );

}


if (deleteProjectModal) {

    deleteProjectModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                deleteProjectModal
            ) {

                closeDeleteProjectModal();

            }

        }
    );

}


// ==========================================
// REFRESH BUTTON
// ==========================================

if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        async () => {

            refreshButton.disabled =
                true;

            await Promise.all([

                fetchMessages(),

                fetchProjects()

            ]);

            refreshButton.disabled =
                false;

            showNotification(
                "Dashboard refreshed",
                "success"
            );

        }
    );

}


// ==========================================
// LOGOUT BUTTON
// ==========================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logoutAdmin
    );

}


// ==========================================
// ESCAPE KEY
// ==========================================

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {

            closeMessageModal();

            closeDeleteModal();

            closeProjectModal();

            closeDeleteProjectModal();

        }

    }
);


// ==========================================
// INITIAL PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        fetchMessages();

        fetchProjects();

    }
);