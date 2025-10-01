const urlBase = "http://www.cloudcontacts.online/LAMPAPI/";
const extension = "php";

//remove user id field when creating contact
//clear right column after delete success
//add logout button
//add logout function
//add click effect on contact cards
// make more error returns for signup, like one that same username cant eb created
// no errors pops up for incorrect login rn

// Mobile detection and helpers

function isMobileView() {
    return window.innerWidth <= 768;
}

function showMobileContactDetails() {
    if (isMobileView()) {
        const listColumn = document.getElementById('contactListColumn');
        if (listColumn) {
            listColumn.classList.add('mobile-hide-list');
        }
    }
}

function showMobileContactList() {
    if (isMobileView()) {
        const listColumn = document.getElementById('contactListColumn');
        if (listColumn) {
            listColumn.classList.remove('mobile-hide-list');
        }
        clearRightPanel();
    }
}

async function doLogin(usernameParam = null, passwordParam = null) {
    let loginUsername = usernameParam || document.getElementById("loginUsername").value;
    let loginPassword = passwordParam || document.getElementById("loginPassword").value;

    if (!loginUsername || !loginPassword) {
        document.getElementById("loginError").classList.remove("hidden");
        document.getElementById("loginError").innerHTML = "Please fill in all fields.";
        return;
    }

    let loginErrorDiv = document.getElementById("loginError");
    loginErrorDiv.innerHTML = ""; // Clear previous messages
    loginErrorDiv.classList.add("hidden"); // Hide error div by default

    let tmp = {
        login: loginUsername,
        password: loginPassword
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = `${urlBase}Login.${extension}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: jsonPayload,
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const jsonObject = await response.json();

        if (parseInt(jsonObject.id) < 1) {
            loginErrorDiv.classList.remove("hidden"); // Show the error div
            loginErrorDiv.classList.add("alert", "alert-danger"); // Ensure Bootstrap classes are applied
            loginErrorDiv.innerHTML = "User/Password combination incorrect";
            return;
        }

        sessionStorage.setItem("userId", parseInt(jsonObject.id));
        sessionStorage.setItem("firstName", jsonObject.firstName);
        sessionStorage.setItem("lastName", jsonObject.lastName);
        window.location.href = "contacts_manager_page.html";

    } catch (err) {
        loginErrorDiv.classList.remove("hidden"); // Show the error div
        loginErrorDiv.classList.add("alert", "alert-danger"); // Apply Bootstrap classes
        loginErrorDiv.innerHTML = err.message;
    }
}

async function doSignup(usernameParam = null, passwordParam = null, otherParam = null) {
    let username = document.getElementById("signupUsername").value;
    let password = document.getElementById("signupPassword").value;
    let firstName = document.getElementById("signupFirstName").value;
    let lastName = document.getElementById("signupLastName").value;

    if (!username || !password || !firstName || !lastName) {
        document.getElementById("signupError").classList.remove("hidden");
        document.getElementById("signupError").innerHTML = "Please fill in all fields.";
        return;
    }

    let signupErrorDiv = document.getElementById("signupError");
    signupErrorDiv.innerHTML = ""; // Clear previous messages
    signupErrorDiv.classList.add("hidden"); // Hide error div by default

    let tmp = {
        FirstName: firstName,
        LastName: lastName,
        Login: username,
        Password: password
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = `${urlBase}CreateUser.${extension}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: jsonPayload,
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const jsonObject = await response.json();

        if (jsonObject.message === "User created") {
            await doLogin(username, password);
            return;
        } else if (jsonObject.error) {
            signupErrorDiv.classList.remove("hidden");
            signupErrorDiv.classList.add("alert", "alert-danger");
            signupErrorDiv.innerHTML = jsonObject.error;
        }

    } catch (err) {
        signupErrorDiv.classList.remove("hidden");
        signupErrorDiv.classList.add("alert", "alert-danger");
        signupErrorDiv.innerHTML = err.message;
    }
}

function doLogout() {
    // Clear session storage
    sessionStorage.clear();
    // Redirect to login page
    window.location.href = "index.html";
}

function updateSignedInAs() {
    const firstName = sessionStorage.getItem("firstName");
    const lastName = sessionStorage.getItem("lastName");
    const usernameElement = document.getElementById("username");

    if (firstName && lastName) {
        usernameElement.textContent = `${firstName} ${lastName}`;
    } else {
        // Redirect to login if no user data
        window.location.href = "index.html";
    }
}

async function loadContacts() {
    let url = `${urlBase}SearchContacts.${extension}`;
    const userId = parseInt(sessionStorage.getItem("userId"), 10);

    const payload = {
        search: "",
        userId: userId
    };

    let jsonPayload = JSON.stringify(payload);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: jsonPayload,
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.error === "No Records Found" || data.error === "No Contacts Found") {
            document.getElementById("contactCards").innerHTML = "<p>No contacts found.</p>";
        } else if (data.results) {
            sessionStorage.setItem("allContacts", JSON.stringify(data.results));
            populateContacts(data.results);
        } else {
            // Handle the scenario where no contacts are returned
            console.log("No contacts found");
            document.getElementById("contactCards").innerHTML = "<p>No contacts found.</p>";
        }

    } catch (error) {
        console.error("Error:", error);
        document.getElementById("contactCards").innerHTML = "<p>Error loading contacts.</p>";
    }
}

function populateContacts(contacts) {
    const container = document.getElementById("contactCards");
    container.innerHTML = ""; // Clear any existing content

    contacts.forEach((contact) => {
        // Create card element
        const card = document.createElement("div");
        card.className = "card contact-card mb-2";
        card.setAttribute("data-contact-id", contact.id);
        card.style.cursor = "pointer";

        // Create card body
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${contact.firstname} ${contact.lastname}</h5>
                <p class="card-text"><strong>Email:</strong> ${contact.email || 'N/A'}</p>
                <p class="card-text"><strong>Phone:</strong> ${contact.phoneNumber || 'N/A'}</p>
            </div>
        `;

        // Add click event to show contact details
        card.addEventListener("click", function() {
            displayContactDetails(contact);
        });

        container.appendChild(card);
    });
}

function displayContactDetails(contact) {
    const detailsDiv = document.getElementById("contactDetails");

    // Mobile back button
    const mobileBackBtn = isMobileView()
        ? `<div style="width: 100%; text-align: center; padding: 20px 0 10px 0; position: relative; z-index: 100;">
             <button class="btn btn-secondary mobile-back-btn" onclick="showMobileContactList()" style="padding: 10px 20px; font-size: 16px; position: relative; z-index: 100;">
               ← Back to Contacts
             </button>
           </div>`
        : '';

    // Responsive cloud size - ORIGINAL desktop size, custom mobile
    const cloudWidth = isMobileView() ? '1600px' : '1600px';
    const cloudStyle = isMobileView()
        ? `position: absolute; width: ${cloudWidth}; max-width: 300%; height: auto; z-index: 1; opacity: 0.95; pointer-events: none; left: 50%; transform: translateX(-50%);`
        : `position: absolute; width: ${cloudWidth}; height: auto; z-index: 1; opacity: 0.95;`;

    detailsDiv.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%; ${isMobileView() ? 'overflow-x: hidden;' : ''}">
            ${mobileBackBtn}
            <div style="position: relative; padding: 40px; display: flex; align-items: center; justify-content: center; min-height: 400px; width: 100%;">
                <img src="images/cloud.png" style="${cloudStyle}" />
                <div style="position: relative; z-index: 2; text-align: center; padding: 40px; max-width: 90%;">
                    <h2 style="color: #2C3E50; font-weight: 700; margin-bottom: 25px;">${contact.firstname} ${contact.lastname}</h2>
                    <p style="color: #34495E; font-size: 18px; margin: 15px 0;"><strong>Email:</strong> ${contact.email || 'N/A'}</p>
                    <p style="color: #34495E; font-size: 18px; margin: 15px 0;"><strong>Phone:</strong> ${contact.phoneNumber || 'N/A'}</p>
                    <hr style="border: 1px solid rgba(0,0,0,0.1); margin: 25px 0;">
                    <button class="btn btn-primary" style="margin: 10px; position: relative; z-index: 10;" onclick="showEditForm(${contact.id}, '${contact.firstname}', '${contact.lastname}', '${contact.email || ''}', '${contact.phoneNumber || ''}')">Edit Contact</button>
                    <button class="btn btn-danger" style="margin: 10px; position: relative; z-index: 10;" onclick="deleteContact(${contact.id})">Delete Contact</button>
                </div>
            </div>
        </div>
    `;

    showMobileContactDetails();
}


function showEditForm(id, firstname, lastname, email, phone) {
    const detailsDiv = document.getElementById("contactDetails");
    
    const mobileBackBtn = isMobileView() 
        ? `<div style="width: 100%; text-align: center; padding: 20px 0 10px 0; position: relative; z-index: 100;">
             <button class="btn btn-secondary mobile-back-btn" onclick="showMobileContactList()" style="padding: 10px 20px; font-size: 16px; position: relative; z-index: 100;">
               ← Back to Contacts
             </button>
           </div>`
        : '';
    
    // ORIGINAL desktop behavior preserved
    const cloudWidth = isMobileView() ? '1600px' : '1600px';
    const cloudStyle = isMobileView() 
        ? `position: absolute; width: ${cloudWidth}; max-width: 300%; height: auto; z-index: 1; opacity: 0.95; pointer-events: none; left: 50%; transform: translateX(-50%);`
        : `position: absolute; width: ${cloudWidth}; height: auto; z-index: 1; opacity: 0.95;`;
    
    detailsDiv.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%; ${isMobileView() ? 'overflow-x: hidden;' : ''}">
            ${mobileBackBtn}
            <div style="position: relative; padding: 40px; display: flex; align-items: center; justify-content: center; min-height: 500px; width: 100%;">
                <img src="images/cloud.png" style="${cloudStyle}" />
                <div style="position: relative; z-index: 2; width: 450px; max-width: 90%; padding: 30px;">
                    <h2 style="color: #2C3E50; font-weight: 700; text-align: center; margin-bottom: 25px;">Edit Contact</h2>
                    <form id="editContactForm">
                        <input type="hidden" id="editContactId" value="${id}">
                        
                        <div class="form-group">
                            <label style="color: #2C3E50; font-weight: 600;">First Name</label>
                            <input type="text" class="form-control" id="editFirstName" value="${firstname}" required>
                        </div>
                        
                        <div class="form-group">
                            <label style="color: #2C3E50; font-weight: 600;">Last Name</label>
                            <input type="text" class="form-control" id="editLastName" value="${lastname}" required>
                        </div>
                        
                        <div class="form-group">
                            <label style="color: #2C3E50; font-weight: 600;">Email</label>
                            <input type="email" class="form-control" id="editEmail" value="${email}">
                        </div>
                        
                        <div class="form-group">
                            <label style="color: #2C3E50; font-weight: 600;">Phone Number</label>
                            <input type="tel" class="form-control" id="editPhoneNumber" value="${phone}">
                        </div>
                        
                        <div style="text-align: center; margin-top: 20px;">
                            <button type="button" class="btn btn-success" style="position: relative; z-index: 10;" onclick="saveEditedContact()">Save Changes</button>
                            <button type="button" class="btn btn-secondary ml-2" style="position: relative; z-index: 10;" onclick="handleCancelButton()">Cancel</button>
			</div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    showMobileContactDetails();
}


async function searchContacts() {
    let url = `${urlBase}SearchContacts.${extension}`;
    const userId = parseInt(sessionStorage.getItem("userId"), 10);
    const searchTerm = document.getElementById("searchContact").value; // Fixed ID

    const payload = {
        search: searchTerm,
        userId: userId
    };

    let jsonPayload = JSON.stringify(payload);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: jsonPayload,
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.error && data.error !== "") {
            document.getElementById("contactCards").innerHTML = "<p class='text-white'>No contacts found.</p>";
        } else if (data.results) {
            populateContacts(data.results);
        } else {
            document.getElementById("contactCards").innerHTML = "<p class='text-white'>No contacts found.</p>";
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("contactCards").innerHTML = "<p class='text-white'>Error searching contacts.</p>";
    }
}

// Helper function to clear the right panel
function clearRightPanel() {
    const detailsDiv = document.getElementById("contactDetails");
    detailsDiv.style.cssText = "height: 100%; width: 100%; padding: 0; margin: 0; display: flex; align-items: center; justify-content: center;";
    detailsDiv.innerHTML = `
        <img src="images/backgroundclouds.png" style="height: 100%; width: 100%; object-fit: cover; display: block;" />
    `;
}

function showAddContactForm() {
    const detailsDiv = document.getElementById("contactDetails");
    
    const mobileBackBtn = isMobileView() 
        ? `<div style="width: 100%; text-align: center; padding: 20px 0 10px 0; position: relative; z-index: 100;">
             <button class="btn btn-secondary mobile-back-btn" onclick="showMobileContactList()" style="padding: 10px 20px; font-size: 16px; position: relative; z-index: 100;">
               ← Back to Contacts
             </button>
           </div>`
        : '';
    
    // ORIGINAL desktop behavior preserved
    const cloudWidth = isMobileView() ? '1600px' : '1600px';
    const cloudStyle = isMobileView() 
        ? `position: absolute; width: ${cloudWidth}; max-width: 300%; height: auto; z-index: 1; opacity: 0.95; pointer-events: none; left: 50%; transform: translateX(-50%);`
        : `position: absolute; width: ${cloudWidth}; height: auto; z-index: 1; opacity: 0.95;`;
    
    detailsDiv.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%; ${isMobileView() ? 'overflow-x: hidden;' : ''}">
            ${mobileBackBtn}
            <div style="position: relative; padding: 40px; display: flex; align-items: center; justify-content: center; min-height: 500px; width: 100%;">
                <img src="images/cloud.png" style="${cloudStyle}" />
                <div style="position: relative; z-index: 2; width: 450px; max-width: 90%; padding: 30px;">
                    <h2 style="color: #2C3E50; font-weight: 700; text-align: center; margin-bottom: 25px;">Add New Contact</h2>
                    <form id="addContactForm">
                        <div class="form-group">
                            <label style="color: #2C3E50; font-weight: 600;">First Name</label>
                            <input type="text" class="form-control" id="newFirstName" required>
                        </div>
                        <div class="form-group">
                            <label style="color: #2C3E50; font-weight: 600;">Last Name</label>
                            <input type="text" class="form-control" id="newLastName" required>
                        </div>
                        <div class="form-group">
                            <label style="color: #2C3E50; font-weight: 600;">Email</label>
                            <input type="email" class="form-control" id="newEmail">
                        </div>
                        <div class="form-group">
                            <label style="color: #2C3E50; font-weight: 600;">Phone Number</label>
                            <input type="tel" class="form-control" id="newPhoneNumber">
                        </div>
                        <div style="text-align: center; margin-top: 20px;">
                            <button type="button" class="btn btn-success" style="position: relative; z-index: 10;" onclick="submitNewContact()">Save Contact</button>
                            <button type="button" class="btn btn-secondary ml-2" style="position: relative; z-index: 10;" onclick="handleCancelButton()">Cancel</button>
			</div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    showMobileContactDetails();
}


async function submitNewContact() {
    const firstName = document.getElementById("newFirstName").value;
    const lastName = document.getElementById("newLastName").value;
    const email = document.getElementById("newEmail").value;
    const phoneNumber = document.getElementById("newPhoneNumber").value;
    const userId = parseInt(sessionStorage.getItem("userId"), 10);

    if (!firstName || !lastName) {
        alert("First name and last name are required.");
        return;
    }

    let tmp = {
        UserId: userId,
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        PhoneNumber: phoneNumber
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = `${urlBase}AddContact.${extension}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: jsonPayload,
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const jsonObject = await response.json();

        if (jsonObject.error === "") {
            alert("Contact added successfully!");
            // Reload contacts to show the new contact
            await loadContacts();
            // Clear the right panel
            clearRightPanel();
        } else {
            alert("Error adding contact: " + jsonObject.error);
        }
    } catch (err) {
        console.error("Error adding contact:", err);
        alert("Error adding contact: " + err.message);
    }
}

async function updateContact(contactId) {
    const firstName = document.getElementById("editFirstName").value;
    const lastName = document.getElementById("editLastName").value;
    const email = document.getElementById("editEmail").value;
    const phoneNumber = document.getElementById("editPhoneNumber").value;
    
    if (!firstName || !lastName) {
        alert("First name and last name are required.");
        return;
    }
    
    let tmp = {
        ID: contactId,
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        PhoneNumber: phoneNumber
    };
    
    let jsonPayload = JSON.stringify(tmp);
    let url = `${urlBase}UpdateContact.${extension}`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: jsonPayload,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonObject = await response.json();
        
        if (jsonObject.message === "Contact updated successfully") {
            alert("Contact updated successfully!");
            // Reload the contacts list to show updated information
            await searchContacts();
            // Clear the right panel and show background image
            clearRightPanel();
        } else {
            alert("Error updating contact: " + jsonObject.message);
        }
    } catch (err) {
        console.error("Error updating contact:", err);
        alert("Error updating contact: " + err.message);
    }
}


async function deleteContact(contactId) {
    if (!confirm("Are you sure you want to delete this contact?")) {
        return;
    }

    let tmp = {
        ID: contactId  // Changed from "contact" to "ID"
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = `${urlBase}DeleteContact.${extension}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: jsonPayload,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonObject = await response.json();

        if (jsonObject.error === "") {
            alert("Contact deleted successfully!");
            // Reload contacts to refresh the list
            await searchContacts();
            // Clear the right panel
            clearRightPanel();
        } else {
            alert("Error deleting contact: " + jsonObject.error);
        }
    } catch (err) {
        console.error("Error deleting contact:", err);
        alert("Error deleting contact: " + err.message);
    }
}

async function deleteUserAccount() {
    const firstName = sessionStorage.getItem("firstName");
    const lastName = sessionStorage.getItem("lastName");

    // First confirmation with strong warning
    const confirmed = confirm(
        `⚠️ WARNING ⚠️\n\n` +
        `Are you absolutely sure you want to DELETE your account?\n\n` +
        `Account: ${firstName} ${lastName}\n\n` +
        `This will permanently delete:\n` +
        `• Your user account\n` +
        `• ALL your contacts\n` +
        `• ALL your data\n\n` +
        `This action CANNOT be undone!`
    );

    if (!confirmed) {
        return;
    }

    // Second confirmation for extra safety
    const doubleConfirmed = confirm(
        `⚠️ FINAL WARNING ⚠️\n\n` +
        `This is your last chance!\n\n` +
        `Click OK to PERMANENTLY DELETE your account and all data.\n` +
        `Click Cancel to keep your account.`
    );

    if (!doubleConfirmed) {
        return;
    }

    const userId = parseInt(sessionStorage.getItem("userId"), 10);

    let tmp = {
        ID: userId
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = `${urlBase}DeleteUser.${extension}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: jsonPayload,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonObject = await response.json();

        if (jsonObject.error === "") {
            alert("Your account has been permanently deleted.");
            // Clear session storage
            sessionStorage.clear();
            // Redirect to login page
            window.location.href = "index.html";
        } else {
            alert("Error deleting account: " + jsonObject.error);
        }
    } catch (err) {
        console.error("Error deleting account:", err);
        alert("Error deleting account: " + err.message);
    }
}


async function deleteUser() {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        return;
    }

    const userId = parseInt(sessionStorage.getItem("userId"), 10);

    let tmp = {
        ID: userId
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = `${urlBase}DeleteUser.${extension}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: jsonPayload,
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const jsonObject = await response.json();

        if (jsonObject.error === "") {
            alert("Account deleted successfully!");
            doLogout();
        } else {
            alert("Error deleting account: " + jsonObject.error);
        }

    } catch (err) {
        alert("Error deleting account: " + err.message);
    }
}


// Helper function to close edit form
function closeEditForm() {
    document.getElementById("editContactModal").style.display = "none";
}

// Helper function to save edited contact
function saveEditedContact() {
    const contactId = document.getElementById("editContactId").value;
    updateContact(parseInt(contactId));
}

function handleCancelButton() {
    if (isMobileView()) {
        // On mobile: go back to contact list
        showMobileContactList();
    } else {
        // On desktop: show background image
        clearRightPanel();
    }
}


// Initialize page
document.addEventListener("DOMContentLoaded", function() {
    // Check if user is logged in
    const userId = sessionStorage.getItem("userId");
    if (userId && window.location.pathname.includes("contacts_manager_page.html")) {
        // Removed loadContacts() - contacts will only load when user searches
        
        // Display user's name
        const firstName = sessionStorage.getItem("firstName");
        const lastName = sessionStorage.getItem("lastName");
        if (firstName && lastName) {
            const welcomeElement = document.getElementById("welcomeMessage");
            if (welcomeElement) {
                welcomeElement.innerHTML = `Welcome, ${firstName} ${lastName}!`;
            }
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Search button click
    const searchButton = document.getElementById("searchButton");
    if (searchButton) {
        searchButton.addEventListener("click", searchContacts);
    }

    // Search on Enter key
    const searchInput = document.getElementById("searchContact");
    if (searchInput) {
        searchInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                searchContacts();
            }
        });
    }

    // Add contact button
    const addButton = document.getElementById("addContactBtn");
    if (addButton) {
        addButton.addEventListener("click", showAddContactForm);
    }
});

