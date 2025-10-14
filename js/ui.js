// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const shortModeBtn = document.getElementById('short-mode-btn');
const attachBtn = document.getElementById('attach-btn');
const aiIdentity = document.getElementById('ai-identity');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

// State variables
let conversationStarted = false;
let toastTimeout;
let shortMode = false;

// Sidebar functionality - only toggle on button click
sidebarToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('active');
});

// Chat input functionality
userInput.addEventListener('input', function() {
    // Enable/disable send button based on input
    sendBtn.disabled = !this.value.trim();
});

// Typewriter effect function
function typewriterEffect(element, text, callback) {
    let i = 0;
    const speed = 25;

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            chatMessages.scrollTop = chatMessages.scrollHeight;
            setTimeout(type, speed);
        } else {
            element.classList.remove('typing-cursor');
            if (callback) callback();
        }
    }
    type();
}

// Add message to chat
function addMessage(message, sender) {
    if (!conversationStarted) {
        aiIdentity.style.display = 'none';
        conversationStarted = true;
    }

    const messageContainer = document.createElement('div');
    messageContainer.classList.add('chat-message-container');
    
    if (sender === 'user') {
        messageContainer.classList.add('user-message-container');
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content', 'user-message-content');
        contentDiv.innerHTML = `<p class="message-text">${message}</p>`;
        messageContainer.appendChild(contentDiv);
    } else {
        messageContainer.classList.add('ai-message-container');
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content', 'ai-message-content');
        const p = document.createElement('p');
        p.classList.add('message-text', 'typing-cursor');
        contentDiv.appendChild(p);
        messageContainer.appendChild(contentDiv);
        
        chatMessages.appendChild(messageContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        typewriterEffect(p, message);
        return;
    }
    
    chatMessages.appendChild(messageContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle user input
function handleUserInput() {
    const question = userInput.value.trim();
    if (question === '') return;

    addMessage(question, 'user');
    
    userInput.value = '';
    sendBtn.disabled = true;

    // Simulate AI thinking time
    setTimeout(() => {
        const answer = findAnswer(question);
        addMessage(answer, 'ai');
        sendBtn.disabled = false;
    }, 1000);
}

// Show toast notification
function showToast(message) {
    clearTimeout(toastTimeout);
    toastMessage.textContent = message;
    toast.style.animation = 'toast-in 0.5s ease forwards';

    toastTimeout = setTimeout(() => {
        toast.style.animation = 'toast-out 0.5s ease forwards';
    }, 3000);
}

// Event listeners
sendBtn.addEventListener('click', handleUserInput);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !sendBtn.disabled) {
        handleUserInput();
    }
});

// Attach file functionality
attachBtn.addEventListener('click', () => {
    showToast('Attach File: This feature is coming soon!');
});

// Short mode functionality
shortModeBtn.addEventListener('click', () => {
    shortMode = !shortMode;
    shortModeBtn.style.background = shortMode ? 'rgba(59, 130, 246, 0.3)' : 'transparent';
    showToast(`Short Answers: ${shortMode ? 'Enabled' : 'Disabled'}`);
});

// New chat functionality
document.querySelector('.new-chat')?.addEventListener('click', () => {
    chatMessages.innerHTML = `
        <div id="ai-identity" class="ai-welcome-section">
            <div class="ai-avatar-container">
                <svg viewBox="0 0 100 100" class="ai-avatar-icon">
                    <path d="M50,10 A40,40 0 1 1 50,90 A40,40 0 1 1 50,10 Z M50,20 A30,30 0 1 0 50,80 A30,30 0 1 0 50,20 Z" fill="none" stroke="currentColor" stroke-width="4"></path>
                    <circle cx="50" cy="50" r="10" fill="currentColor"></circle>
                    <path d="M30 50 L 70 50 M50 30 L 50 70" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4" opacity="0.5"></path>
                </svg>
            </div>
            <h1 class="ai-welcome-title">Hi, I'm YRX3246</h1>
            <p class="ai-welcome-subtitle">Your personal portfolio guide.</p>
        </div>
    `;
    
    conversationStarted = false;
    userInput.value = '';
    sendBtn.disabled = true;
    shortMode = false;
    shortModeBtn.style.background = 'transparent';
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    sendBtn.disabled = true;
    userInput.focus();
});