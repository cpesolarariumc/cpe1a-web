import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// FIREBASE CONFIGURATION (Replace with yours)
const firebaseConfig = {
  apiKey: "AIzaSyBDuMDpKLwAE5FLBS2bzxZb86hl95Ltir8",
  authDomain: "ngldatabase-5abc1.firebaseapp.com",
  projectId: "ngldatabase-5abc1",
  storageBucket: "ngldatabase-5abc1.firebasestorage.app",
  messagingSenderId: "176091428343",
  appId: "1:176091428343:web:935f98400d1f2b57c46af2",
  measurementId: "G-1SYQSDJ74S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesCol = collection(db, "messages");

// UI Elements
const nglForm = document.getElementById('ngl-form');
const msgInput = document.getElementById('message-input');
const charDisplay = document.getElementById('char-count');
const msgList = document.getElementById('messages-list');
const btn = document.getElementById('submit-btn');

const sendSection = document.getElementById('send-section');
const inboxSection = document.getElementById('inbox-section');
const dotSend = document.getElementById('show-send');
const dotInbox = document.getElementById('show-inbox');

// 1. Character Counter
msgInput.addEventListener('input', () => {
    charDisplay.innerText = `${msgInput.value.length} / 300`;
});

// 2. Send Message Logic (Production Grade)
nglForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = msgInput.value.trim();
    if (!content) return;

    btn.innerText = "Sending...";
    btn.disabled = true;

    try {
        await addDoc(messagesCol, {
            content: content,
            createdAt: serverTimestamp()
        });
        
        // Success Feedback
        msgInput.value = "";
        charDisplay.innerText = "0 / 300";
        btn.innerText = "Sent! ✨";
        setTimeout(() => { btn.innerText = "Send!"; btn.disabled = false; }, 2000);
    } catch (err) {
        console.error("Submission failed:", err);
        btn.innerText = "Error!";
        btn.disabled = false;
        alert("The firewall blocked the message. Check your Firestore Rules.");
    }
});

// 3. Real-Time Inbox (Limited for Performance)
const q = query(messagesCol, orderBy("createdAt", "desc"), limit(40));
onSnapshot(q, (snapshot) => {
    msgList.innerHTML = "";
    if (snapshot.empty) {
        msgList.innerHTML = '<p class="status-text">No messages yet. Send one!</p>';
        return;
    }
    snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement('div');
        div.className = "msg-bubble";
        div.innerHTML = `
            <p>${data.content}</p>
            <span class="msg-time">${data.createdAt?.toDate().toLocaleString() || "Syncing..."}</span>
        `;
        msgList.appendChild(div);
    });
}, (err) => {
    msgList.innerHTML = '<p class="status-text" style="color:red;">Access Denied. Check Rules.</p>';
});

// 4. Smooth View Toggling
dotSend.onclick = () => {
    sendSection.style.display = "block";
    inboxSection.style.display = "none";
    dotSend.classList.add('active');
    dotInbox.classList.remove('active');
};

dotInbox.onclick = () => {
    sendSection.style.display = "none";
    inboxSection.style.display = "block";
    dotInbox.classList.add('active');
    dotSend.classList.remove('active');
};

// Function to show the specific message with style
function showSingleMessage(id, text) {
    activeId = id;
    
    // Smooth transition
    const inbox = document.getElementById('inbox-view');
    const story = document.getElementById('story-view');
    
    inbox.style.display = 'none';
    story.style.display = 'flex';
    
    // Set the text
    document.getElementById('focus-text').innerText = text;
}