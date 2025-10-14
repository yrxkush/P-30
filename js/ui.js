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

// Sidebar functionality
sidebarToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('active');
});

// Profile section functionality
document.querySelector('.profile-section')?.addEventListener('click', () => {
    showToast('Profile: Feature coming soon!');
});

// Settings button functionality
document.querySelector('.settings-btn')?.addEventListener('click', () => {
    showSettings();
});

// Search chat functionality
document.querySelector('.search-chat')?.addEventListener('click', () => {
    showToast('Search: Feature coming soon!');
});

// Chat input functionality
userInput?.addEventListener('input', function() {
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
            if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
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
    if (!conversationStarted && aiIdentity) {
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
        
        if (chatMessages) {
            chatMessages.appendChild(messageContainer);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        typewriterEffect(p, message);
        return;
    }
    
    if (chatMessages) {
        chatMessages.appendChild(messageContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Handle user input
function handleUserInput() {
    if (!userInput) return;
    
    const question = userInput.value.trim();
    if (question === '') return;

    addMessage(question, 'user');
    
    userInput.value = '';
    if (sendBtn) sendBtn.disabled = true;

    // Simulate AI thinking time
    setTimeout(() => {
        const answer = findAnswer ? findAnswer(question) : "I'm here to help! This is a demo response.";
        addMessage(answer, 'ai');
        if (sendBtn) sendBtn.disabled = false;
    }, 1000);
}

// Show settings modal
function showSettings() {
    const settingsModal = document.createElement('div');
    settingsModal.className = 'settings-modal';
    settingsModal.innerHTML = `
        <div class="settings-content">
            <div class="settings-header">
                <h3>Settings</h3>
                <button class="close-settings" onclick="closeSettings()">&times;</button>
            </div>
            <div class="settings-body">
                <div class="setting-item">
                    <label>Theme</label>
                    <select id="theme-select">
                        <option value="light">Light Mode</option>
                        <option value="dark">Dark Mode</option>
                        <option value="auto">Auto</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label>Language</label>
                    <select id="language-select">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label>
                        <input type="checkbox" id="notifications-toggle" checked>
                        Enable Notifications
                    </label>
                </div>
                <div class="setting-item">
                    <label>
                        <input type="checkbox" id="sound-toggle" checked>
                        Sound Effects
                    </label>
                </div>
            </div>
            <div class="settings-footer">
                <button class="save-settings" onclick="saveSettings()">Save Changes</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(settingsModal);
    
    // Add styles for settings modal
    const style = document.createElement('style');
    style.textContent = `
        .settings-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        
        .settings-content {
            background: var(--glass-bg);
            backdrop-filter: blur(25px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 0;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            animation: liquid-pop-in 0.4s ease;
        }
        
        .settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 25px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .settings-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .close-settings {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-secondary);
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        }
        
        .close-settings:hover {
            background: var(--hover-bg);
            color: var(--text-primary);
        }
        
        .settings-body {
            padding: 25px;
        }
        
        .setting-item {
            margin-bottom: 20px;
        }
        
        .setting-item:last-child {
            margin-bottom: 0;
        }
        
        .setting-item label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--text-primary);
        }
        
        .setting-item select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.5);
            color: var(--text-primary);
            font-size: 14px;
        }
        
        .setting-item input[type="checkbox"] {
            margin-right: 8px;
        }
        
        .settings-footer {
            padding: 20px 25px;
            border-top: 1px solid var(--border-color);
        }
        
        .save-settings {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, var(--blue-accent), var(--blue-light));
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .save-settings:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        }
    `;
    document.head.appendChild(style);
}

// Close settings modal
function closeSettings() {
    const modal = document.querySelector('.settings-modal');
    if (modal) {
        modal.remove();
    }
}

// Save settings
function saveSettings() {
    showToast('Settings saved successfully!');
    closeSettings();
}

// Show toast notification
function showToast(message) {
    if (!toast || !toastMessage) return;
    
    clearTimeout(toastTimeout);
    toastMessage.textContent = message;
    toast.style.animation = 'toast-in 0.5s ease forwards';

    toastTimeout = setTimeout(() => {
        toast.style.animation = 'toast-out 0.5s ease forwards';
    }, 3000);
}

// Event listeners
sendBtn?.addEventListener('click', handleUserInput);

userInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && sendBtn && !sendBtn.disabled) {
        handleUserInput();
    }
});

// Attach file functionality
attachBtn?.addEventListener('click', () => {
    showToast('Attach File: This feature is coming soon!');
});

// Short mode functionality
shortModeBtn?.addEventListener('click', () => {
    shortMode = !shortMode;
    shortModeBtn.style.background = shortMode ? 'rgba(59, 130, 246, 0.3)' : 'transparent';
    showToast(`Short Answers: ${shortMode ? 'Enabled' : 'Disabled'}`);
});

// New chat functionality
document.querySelector('.new-chat')?.addEventListener('click', () => {
    if (chatMessages && aiIdentity) {
        chatMessages.innerHTML = aiIdentity.outerHTML;
        conversationStarted = false;
        if (userInput) userInput.value = '';
        if (sendBtn) sendBtn.disabled = true;
        shortMode = false;
        if (shortModeBtn) shortModeBtn.style.background = 'transparent';
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (sendBtn) sendBtn.disabled = true;
    if (userInput) userInput.focus();
});

// Make functions global for onclick handlers
window.closeSettings = closeSettings;
window.saveSettings = saveSettings;