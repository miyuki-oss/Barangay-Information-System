document.addEventListener("DOMContentLoaded", function () {
    console.log("System initialization sequence running...");

    // ==========================================================================
    // 1. SEED FILLER ACCOUNTS (THE MOCK DATABASE)
    // ==========================================================================
    const mockDatabase = [
        {
            identifier: "09171234567",
            password: "password123",
            role: "resident",
            name: "Juan M. Dela Cruz",
            zone: "Cloverleaf Community Compound",
            sector: "General Citizen"
        },
        {
            identifier: "admin@unangsigaw.gov",
            password: "adminpassword",
            role: "admin",
            name: "Officer Maria Santos",
            zone: "Barangay Secretariat",
            sector: "System Desk Officer"
        }
    ];

    // Initialize memory if it is completely blank
    if (!localStorage.getItem("brgy_users")) {
        localStorage.setItem("brgy_users", JSON.stringify(mockDatabase));
        console.log("Mock database loaded successfully.");
    }

    // ==========================================================================
    // 2. LOGIN AUTHENTICATION SYSTEM
    // ==========================================================================
    const loginForm = document.querySelector(".login-form");

    // Only run this block if the user is on the login page (index.html)
    if (loginForm && !document.title.includes("Registration")) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Stop page refresh

            const userInput = document.getElementById("identifier").value.trim();
            const passwordInput = document.getElementById("password").value;

            // Fetch current user database array from browser memory
            const registeredUsers = JSON.parse(localStorage.getItem("brgy_users"));

            // Check if login inputs match any row inside our storage
            const matchedUser = registeredUsers.find(user => 
                user.identifier === userInput && user.password === passwordInput
            );

            if (matchedUser) {
                // Save current user info to access it on the dashboard page
                localStorage.setItem("active_session", JSON.stringify(matchedUser));

                if (matchedUser.role === "resident") {
                    alert(`Welcome back, ${matchedUser.name}! Opening Resident Portal...`);
                    window.location.href = "dashboard.html";
                } else if (matchedUser.role === "admin") {
                    alert("Admin identity verified. Opening Command Console...");
                    window.location.href = "admin.html";
                }
            } else {
                alert("❌ Authentication Failed!\n\nUse filler credentials:\n• Resident: 09171234567 / password123\n• Admin: admin@unangsigaw.gov / adminpassword");
            }
        });
    }

    // ==========================================================================
    // 3. REGISTRATION HANDLER (SAVES NEW ACCOUNTS LOCALLY)
    // ==========================================================================
    const registrationForm = document.querySelector(".register-card form");

    if (registrationForm) {
        registrationForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Stop standard form reload

            const firstName = document.getElementById("first_name").value.trim();
            const lastName = document.getElementById("last_name").value.trim();
            const mobile = document.getElementById("mobile").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm_password").value;
            const streetSelect = document.getElementById("street");
            const streetText = streetSelect.options[streetSelect.selectedIndex].text;
            const sectorSelect = document.getElementById("sector");
            const sectorText = sectorSelect.options[sectorSelect.selectedIndex].text;

            // Front-End Check: Mobile Format
            if (!/^09\d{9}$/.test(mobile)) {
                alert("⚠️ Please input a valid 11-digit PH mobile number starting with 09.");
                return;
            }

            // Front-End Check: Password Match
            if (password !== confirmPassword) {
                alert("⚠️ Passwords do not match. Please re-type your password.");
                return;
            }

            // Pull current database, add the new user object, and write it back down
            const currentUsers = JSON.parse(localStorage.getItem("brgy_users"));
            
            // Check if mobile number is already taken
            if (currentUsers.some(user => user.identifier === mobile)) {
                alert("⚠️ This mobile number is already registered!");
                return;
            }

            const newUser = {
                identifier: mobile,
                password: password,
                role: "resident",
                name: `${firstName} ${lastName}`,
                zone: streetText,
                sector: sectorText
            };

            currentUsers.push(newUser);
            localStorage.setItem("brgy_users", JSON.stringify(currentUsers));

            alert(`🎉 Success! Account created for ${firstName}.\nYou can now log in using your mobile number.`);
            window.location.href = "index.html"; // Send back to login screen
        });
    }
});
