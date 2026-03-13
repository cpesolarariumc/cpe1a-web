import { firebaseConfig } from 'https://www.cpe1a-hub.fun/scripts/config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { initializeFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { classQuotes } from 'https://www.cpe1a-hub.fun/scripts/quotes.js';

// --- 1. Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, { experimentalForceLongPolling: true });

// --- 2. Memories Vault Logic ---
const unlockBtn = document.getElementById('mem-unlock-btn');
const authCard = document.querySelector('#memories-auth .glass-card');
const passInput = document.getElementById('mem-pass');

window.openMemoriesAuth = () => {
    document.getElementById('memories-auth').style.display = 'flex';
    passInput.focus();
};

window.closeMemoriesAuth = () => {
    document.getElementById('memories-auth').style.display = 'none';
    passInput.value = "";
};

if (unlockBtn) {
    unlockBtn.addEventListener('click', async () => {
        const inputPass = passInput.value;
        if (!inputPass) return;

        unlockBtn.innerText = "Accessing Vault...";
        unlockBtn.disabled = true;

        try {
            const docRef = doc(db, "secrets", "admin_auth"); 
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const vault = docSnap.data().vault; 

                if (vault && vault[inputPass]) {
                    window.location.href = vault[inputPass];
                } else {
                    triggerFailure();
                }
            }
        } catch (error) {
            console.error("Auth Error:", error);
            alert("Connection error. Try again.");
            resetBtn();
        }
    });
}

function triggerFailure() {
    authCard.classList.add('shake');
    unlockBtn.innerText = "Invalid Key";
    setTimeout(() => {
        authCard.classList.remove('shake');
        resetBtn();
        passInput.value = "";
    }, 600);
}

function resetBtn() {
    unlockBtn.innerText = "Unlock & Redirect";
    unlockBtn.disabled = false;
}
function updateQuote() {
    const textEl = document.getElementById('quote-text');
    const authorEl = document.getElementById('quote-author');
    if (!textEl || !authorEl) return;

    textEl.style.opacity = 0;
    setTimeout(() => {
        const pick = classQuotes[Math.floor(Math.random() * classQuotes.length)];
        textEl.innerText = `"${pick.text}"`;
        authorEl.innerText = `— ${pick.author}`;
        textEl.style.opacity = 1;
    }, 500);
}
updateQuote();
setInterval(updateQuote, 15000);
