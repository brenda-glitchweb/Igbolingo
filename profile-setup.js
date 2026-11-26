
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import {
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";


const mascotOptions = document.querySelectorAll(".mascot-option");
const continueButton = document.querySelector(".continue-button");
const selectionMessage = document.querySelector(".selection-message");

let selectedMascot = null;
let currentUser = null;


// Check whether the learner is signed in
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "signup.html";
        return;
    }

    currentUser = user;
});


// Select a mascot
mascotOptions.forEach((option) => {
    option.addEventListener("click", () => {

        mascotOptions.forEach((item) => {
            item.classList.remove("selected");
        });

        option.classList.add("selected");

        selectedMascot = option.dataset.mascot;

        continueButton.disabled = false;

        selectionMessage.textContent =
            `${selectedMascot.charAt(0).toUpperCase() + selectedMascot.slice(1)} selected!`;
    });
});


// Save mascot to Firebase
continueButton.addEventListener("click", async () => {

    if (!selectedMascot || !currentUser) {
        return;
    }

    continueButton.disabled = true;
    continueButton.textContent = "Saving...";

    try {

        await updateDoc(doc(db, "users", currentUser.uid), {
            mascot: selectedMascot
        });

        alert("Your mascot has been saved!");

        // We'll connect this to the dashboard next.

    } catch (error) {

        alert("Could not save your mascot. Please try again.");
        console.error(error);

        continueButton.disabled = false;
        continueButton.textContent = "Continue";
    }
});
