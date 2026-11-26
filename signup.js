import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import { db } from "./firebase.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

const authTabs = document.querySelectorAll(".auth-tab");
const authForm = document.querySelector(".auth-form");
const authSwitch = document.querySelector(".auth-switch");

const fullname = document.getElementById("fullname");
const username = document.getElementById("username");
const email = document.getElementById("email");
const learningGoal = document.getElementById("learning-goal");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

const submitButton = document.querySelector(".submit-button");

let currentMode = "signup";


// SWITCH BETWEEN SIGNUP AND LOGIN

function switchMode(mode) {

    currentMode = mode;

    const isSignup = mode === "signup";

    // Update active tab

    authTabs.forEach(tab => {
        tab.classList.remove("active");
    });

    if (isSignup) {
        authTabs[0].classList.add("active");
    } else {
        authTabs[1].classList.add("active");
    }


    // Show or hide signup fields

    fullname.closest(".form-group").hidden = !isSignup;
    username.closest(".form-group").hidden = !isSignup;
    confirmPassword.closest(".form-group").hidden = !isSignup;
    learningGoal.closest(".form-group").hidden = !isSignup;
learningGoal.required = isSignup;   

    // Update required fields

    fullname.required = isSignup;
    username.required = isSignup;
    confirmPassword.required = isSignup;


    // Update button text

    submitButton.textContent = isSignup
        ? "Create My Account"
        : "Sign In";


    // Update account switch message

    authSwitch.innerHTML = isSignup
        ? 'Already have an account? <a href="#" class="switch-link">Sign In</a>'
        : 'New to Igbolingo? <a href="#" class="switch-link">Create Account</a>';


    // Add or remove forgot password link

    let forgotLink = document.querySelector(".forgot-password");

    if (!isSignup && !forgotLink) {

        forgotLink = document.createElement("a");

        forgotLink.href = "#";
        forgotLink.className = "forgot-password";
        forgotLink.textContent = "Forgot Password?";

        password.closest(".form-group").appendChild(forgotLink);

        forgotLink.addEventListener("click", (event) => {
            event.preventDefault();

            alert("Password recovery will be connected with Firebase.");
        });
    }

    if (isSignup && forgotLink) {
        forgotLink.remove();
    }

}


// TAB BUTTON EVENTS

authTabs[0].addEventListener("click", () => {
    switchMode("signup");
});

authTabs[1].addEventListener("click", () => {
    switchMode("login");
});


// ACCOUNT SWITCH LINK

authSwitch.addEventListener("click", (event) => {

    if (event.target.classList.contains("switch-link")) {

        event.preventDefault();

        switchMode(
            currentMode === "signup" ? "login" : "signup"
        );

    }

});


// FORM SUBMISSION


authForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        await setPersistence(auth, browserLocalPersistence);

        if (currentMode === "signup") {

            if (password.value !== confirmPassword.value) {
                alert("Your passwords do not match.");
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email.value.trim(),
                password.value
            );

            await setDoc(doc(db, "users", userCredential.user.uid), {
                fullName: fullname.value.trim(),
                username: username.value.trim(),
                email: email.value.trim(),
                learningGoal: learningGoal.value,
                mascot: null,
                createdAt: serverTimestamp()
            });

            alert("Your Igbolingo account has been created!");

            // New learners choose their mascot first
            window.location.href = "profile-setup.html";

        } else {

            const userCredential = await signInWithEmailAndPassword(
                auth,
                email.value.trim(),
                password.value
            );

            alert("Welcome back to Igbolingo!");

            // Returning learners go directly to the dashboard
            window.location.href = "dashboard.html";
        }

    } catch (error) {
        alert(error.message);
        console.error(error);
    }
});



// SHOW AND HIDE PASSWORDS

const passwordToggles = document.querySelectorAll(".toggle-password");

passwordToggles.forEach(button => {
    button.addEventListener("click", () => {

        const input = document.getElementById(button.dataset.target);
        const isHidden = input.type === "password";

        input.type = isHidden ? "text" : "password";

        button.innerHTML = isHidden
            ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                   <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/>
                   <circle cx="12" cy="12" r="3"/>
               </svg>`
            : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                   <path d="M3 3l18 18"/>
                   <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/>
                   <path d="M9.9 5.2A11 11 0 0 1 12 5c6.5 0 10 7 10 7a15 15 0 0 1-4 4.8"/>
                   <path d="M6.2 6.2C3.5 8.1 2 12 2 12s3.5 7 10 7a10 10 0 0 0 3-.5"/>
               </svg>`;

        button.setAttribute(
            "aria-label",
            isHidden ? "Hide password" : "Show password"
        );
    });
});