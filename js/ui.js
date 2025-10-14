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
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    if (sendBtn) sendBtn.disabled = true;
    if (userInput) userInput.focus();
});

// Initialize theme
function initializeTheme() {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
}

// Toggle dark mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
    
    // Update theme toggle in settings if it exists
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.checked = isDarkMode;
    }
    
    showToast(`${isDarkMode ? 'Dark' : 'Light'} mode enabled`);
}

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

// Enhanced settings modal with dark mode toggle
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
                    <div class="theme-option">
                        <span>Dark Mode</span>
                        <label class="theme-switch">
                            <input type="checkbox" id="theme-toggle" ${isDarkMode ? 'checked' : ''}>
                            <span class="theme-slider"></span>
                        </label>
                    </div>
                </div>
                <div class="setting-item">
                    <label>Language</label>
                    <select id="language-select">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="ja">Japanese</option>
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
                <div class="setting-item">
                    <label>
                        <input type="checkbox" id="animations-toggle" checked>
                        Animations
                    </label>
                </div>
            </div>
            <div class="settings-footer">
                <button class="save-settings" onclick="saveSettings()">Save Changes</button>
                <button class="reset-settings" onclick="resetSettings()">Reset to Default</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(settingsModal);
    
    // Add event listener to theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('change', toggleDarkMode);
    
    // Enhanced styles for settings modal
    const style = document.createElement('style');
    style.textContent = `
        .settings-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        
        .settings-content {
            background: var(--glass-bg);
            backdrop-filter: blur(40px) saturate(200%);
            -webkit-backdrop-filter: blur(40px) saturate(200%);
            border: 2px solid var(--glass-border);
            border-radius: 24px;
            padding: 0;
            max-width: 450px;
            width: 90%;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3),
                        inset 0 2px 4px rgba(255, 255, 255, 0.1);
            animation: liquid-pop-in 0.4s ease;
            overflow: hidden;
        }
        
        .settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 28px;
            border-bottom: 1px solid var(--border-color);
            background: rgba(255, 255, 255, 0.1);
        }
        
        .settings-header h3 {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
            color: var(--text-primary);
        }
        
        .close-settings {
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: var(--text-secondary);
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .close-settings:hover {
            background: var(--hover-bg);
            color: var(--text-primary);
            transform: scale(1.1);
        }
        
        .settings-body {
            padding: 28px;
        }
        
        .setting-item {
            margin-bottom: 24px;
        }
        
        .setting-item:last-child {
            margin-bottom: 0;
        }
        
        .setting-item > label {
            display: block;
            margin-bottom: 10px;
            font-weight: 600;
            color: var(--text-primary);
            font-size: 15px;
        }
        
        .theme-option {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background: var(--hover-bg);
            backdrop-filter: blur(15px);
            border-radius: 12px;
            border: 1px solid var(--border-color);
        }
        
        .theme-option span {
            font-weight: 500;
            color: var(--text-primary);
        }
        
        .setting-item select {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            background: var(--hover-bg);
            backdrop-filter: blur(15px);
            color: var(--text-primary);
            font-size: 14px;
            font-weight: 500;
        }
        
        .setting-item input[type="checkbox"] {
            margin-right: 10px;
            transform: scale(1.2);
        }
        
        .settings-footer {
            padding: 24px 28px;
            border-top: 1px solid var(--border-color);
            background: rgba(255, 255, 255, 0.05);
            display: flex;
            gap: 12px;
        }
        
        .save-settings, .reset-settings {
            flex: 1;
            padding: 14px;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
        }
        
        .save-settings {
            background: linear-gradient(135deg, var(--blue-accent), var(--blue-light));
            color: white;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        }
        
        .save-settings:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
        }
        
        .reset-settings {
            background: var(--hover-bg);
            backdrop-filter: blur(15px);
            color: var(--text-primary);
            border: 1px solid var(--border-color);
        }
        
        .reset-settings:hover {
            transform: translateY(-2px);
            background: var(--glass-bg);
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

// Reset settings
function resetSettings() {
    // Reset theme to light mode
    isDarkMode = false;
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', false);
    
    showToast('Settings reset to default');
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
        showToast('New chat started');
    }
});

// Make functions global for onclick handlers
window.closeSettings = closeSettings;
window.saveSettings = saveSettings;
window.resetSettings = resetSettings;
window.toggleDarkMode = toggleDarkMode;