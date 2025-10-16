// DOM Elements
let chatMessages, userInput, sendBtn, shortModeBtn, attachBtn;
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
    initializeChatLayout();
    addLayoutStyles(); // Add this line to ensure styles are loaded
});

// Initialize theme
function initializeTheme() {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
}

// Initialize chat layout with proper state management and delete button
function initializeChatLayout() {
    const chatMainContainer = document.querySelector('.chat-main-container');
    if (!chatMainContainer) return;

    // Create initial welcome view
    const initialView = document.createElement('div');
    initialView.id = 'initial-view';
    initialView.className = 'initial-view';
    initialView.innerHTML = `
        <div class="welcome-content">
            <div class="bot-avatar">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
                    <circle cx="12" cy="5" r="2"></circle>
                    <path d="m12 7 0 4"></path>
                    <line x1="8" y1="16" x2="8" y2="16"></line>
                    <line x1="16" y1="16" x2="16" y2="16"></line>
                </svg>
            </div>
            <h1 class="welcome-title">Hi, I'm YRX3246</h1>
            <p class="welcome-subtitle">Your personal rule-based chatbot assistant</p>
            <div class="welcome-features">
                <div class="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m9 12 2 2 4-4"></path>
                    </svg>
                    <span>Instant responses</span>
                </div>
                <div class="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <span>Secure & Private</span>
                </div>
                <div class="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 6v6l4 2"></path>
                    </svg>
                    <span>Available 24/7</span>
                </div>
            </div>
            <div class="start-prompt">
                <p>Type a message below to start our conversation</p>
            </div>
            <form id="initial-form" class="initial-input-form">
                <div class="input-group">
                    <input type="text" id="initial-input" placeholder="Message YRX3246..." autocomplete="off" spellcheck="false" required>
                    <button type="submit" class="send-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m22 2-7 20-4-9-9-4Z"></path>
                            <path d="M22 2 11 13"></path>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    `;

    // Create chat view with header and delete button
    const chatView = document.createElement('div');
    chatView.id = 'chat-view';
    chatView.className = 'chat-view hidden';
    chatView.innerHTML = `
        <div class="chat-header">
            <div class="chat-title-section">
                <div class="chat-status"></div>
                <div>
                    <div class="chat-title-text">YRX3246</div>
                    <div class="chat-subtitle">Online • Active chat</div>
                </div>
            </div>
            <div class="chat-actions">
                <button id="info-chat-btn" class="info-chat-btn" title="Chat Information">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4"></path>
                        <path d="M12 8h.01"></path>
                    </svg>
                </button>
                <button id="delete-chat-btn" class="delete-chat-btn" title="Delete Chat">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        </div>
        <div class="chat-messages-area" id="chat-messages">
            <!-- Messages will be populated here -->
        </div>
        <div class="chat-input-container" id="input-container">
            <div class="input-wrapper">
                <div class="input-group">
                    <button id="attach-btn" class="attach-btn" title="Attach File">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                        </svg>
                    </button>
                    <input type="text" id="user-input" placeholder="Message YRX3246..." autocomplete="off" spellcheck="false">
                    <button id="short-mode-btn" class="short-mode-btn" title="Short Answers">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M8 12h8"></path>
                            <path d="M8 18h4"></path>
                            <path d="M8 6h8"></path>
                        </svg>
                    </button>
                    <button id="send-btn" class="send-btn" disabled>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m22 2-7 20-4-9-9-4Z"></path>
                            <path d="M22 2 11 13"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    // Clear existing content and add new layout
    chatMainContainer.innerHTML = '';
    chatMainContainer.appendChild(initialView);
    chatMainContainer.appendChild(chatView);

    // Initialize form submission listener
    initializeFormListener();
    
    // Re-initialize DOM references
    reinitializeDOMElements();
    
    // Initialize profile modal functionality
    initializeProfileModal();
    
    // Initialize chat action buttons
    initializeChatActions();
}

// Initialize profile modal functionality
function initializeProfileModal() {
    const profileSection = document.getElementById('profile-section');
    const profileModal = document.getElementById('profile-modal');
    const closeBtn = document.getElementById('close-profile-modal');
    
    if (profileSection && profileModal) {
        profileSection.addEventListener('click', (e) => {
            e.stopPropagation();
            showProfileModal();
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', hideProfileModal);
    }
    
    // Close modal when clicking outside
    if (profileModal) {
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) {
                hideProfileModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideProfileModal();
        }
    });
}

// Show profile modal
function showProfileModal() {
    const profileModal = document.getElementById('profile-modal');
    if (profileModal) {
        profileModal.classList.remove('hidden');
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    }
}

// Hide profile modal
function hideProfileModal() {
    const profileModal = document.getElementById('profile-modal');
    if (profileModal) {
        profileModal.classList.add('hidden');
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

// Initialize chat action buttons
function initializeChatActions() {
    // Wait for elements to be available after DOM update
    setTimeout(() => {
        const deleteChatBtn = document.getElementById('delete-chat-btn');
        const infoChatBtn = document.getElementById('info-chat-btn');
        
        if (deleteChatBtn) {
            deleteChatBtn.addEventListener('click', handleDeleteChat);
        }
        
        if (infoChatBtn) {
            infoChatBtn.addEventListener('click', handleChatInfo);
        }
    }, 100);
}

// Handle delete chat
function handleDeleteChat() {
    if (confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
        resetToInitialView();
        showToast('Chat deleted successfully');
    }
}

// Handle chat info
function handleChatInfo() {
    showToast('Chat Info: This conversation started today');
}

// Chat history item click handlers
function initializeChatHistory() {
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => {
        item.addEventListener('click', () => {
            const title = item.querySelector('.chat-title').textContent;
            showToast(`Loading chat: ${title}`);
            // Here you would implement loading the selected chat
        });
    });
}

// Profile card button handlers
function initializeProfileButtons() {
    const editProfileBtn = document.querySelector('.edit-profile');
    const logoutBtn = document.querySelector('.logout-btn');
    
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            hideProfileModal();
            showToast('Edit Profile: Feature coming soon!');
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                hideProfileModal();
                showToast('Logged out successfully');
                // Here you would implement logout functionality
            }
        });
    }
}

// Initialize form submission listener
function initializeFormListener() {
    const initialForm = document.getElementById('initial-form');
    const initialInput = document.getElementById('initial-input');
    
    if (initialForm && initialInput) {
        initialForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission
            
            const message = initialInput.value.trim();
            if (message) {
                // Transition to chat view
                transitionToChatView(message);
            }
        });
        
        // Focus the initial input
        initialInput.focus();
    }
}

// Transition from initial view to chat view
function transitionToChatView(initialMessage) {
    const initialView = document.getElementById('initial-view');
    const chatView = document.getElementById('chat-view');
    
    if (initialView && chatView) {
        // Hide initial view with animation
        initialView.classList.add('fade-out');
        
        setTimeout(() => {
            // Completely hide initial view
            initialView.style.display = 'none';
            
            // Show chat view
            chatView.classList.remove('hidden');
            chatView.classList.add('visible');
            
            // Re-initialize DOM references for the now-visible chat elements
            reinitializeDOMElements();
            
            // Start the conversation with the initial message
            if (initialMessage) {
                addMessage(initialMessage, 'user');
                
                // Simulate AI response
                setTimeout(() => {
                    const response = findAnswer ? findAnswer(initialMessage) : "Hello! I'm YRX3246, ready to help you. What would you like to know?";
                    addMessage(response, 'ai');
                }, 1000);
            }
            
            conversationStarted = true;
            
            // Focus the main chat input
            if (userInput) userInput.focus();
            
        }, 300);
    }
}

// Reset to initial view (for New Chat button)
function resetToInitialView() {
    const initialView = document.getElementById('initial-view');
    const chatView = document.getElementById('chat-view');
    const chatMessages = document.getElementById('chat-messages');
    const initialInput = document.getElementById('initial-input');
    
    if (initialView && chatView) {
        // Clear chat messages
        if (chatMessages) chatMessages.innerHTML = '';
        
        // Hide chat view
        chatView.classList.add('hidden');
        chatView.classList.remove('visible');
        
        // Show initial view
        initialView.style.display = 'flex';
        initialView.classList.remove('fade-out');
        
        // Clear and focus initial input
        if (initialInput) {
            initialInput.value = '';
            initialInput.focus();
        }
        
        conversationStarted = false;
    }
}

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
    if (!chatMessages) {
        console.error('Chat messages container not found');
        return;
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
    if (!userInput) return;
    
    const question = userInput.value.trim();
    if (question === '') return;

    addMessage(question, 'user');
    
    userInput.value = '';
    if (sendBtn) sendBtn.disabled = true;

    // Simulate AI thinking time
    setTimeout(() => {
        const answer = findAnswer ? findAnswer(question) : "I'm here to help! This is a demo response from YRX3246.";
        addMessage(answer, 'ai');
        if (sendBtn) sendBtn.disabled = false;
        if (userInput) userInput.focus();
    }, 1000);
}

// Handle attach file
function handleAttachFile() {
    showToast('Attach File: This feature is coming soon!');
}

// Handle short mode
function handleShortMode() {
    shortMode = !shortMode;
    if (shortModeBtn) {
        shortModeBtn.style.background = shortMode ? 'rgba(0, 255, 136, 0.2)' : 'var(--hover-bg)';
    }
    showToast(`Short Answers: ${shortMode ? 'Enabled' : 'Disabled'}`);
}

// Add layout styles
function addLayoutStyles() {
    // Remove existing styles to avoid duplicates
    const existingStyle = document.getElementById('layout-styles');
    if (existingStyle) existingStyle.remove();
    
    const style = document.createElement('style');
    style.id = 'layout-styles';
    style.textContent = `
        /* Initial View Styles */
        .initial-view {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            padding: 40px;
            opacity: 1;
            transform: translateY(0);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .initial-view.fade-out {
            opacity: 0;
            transform: translateY(-20px);
        }
        
        .welcome-content {
            text-align: center;
            max-width: 500px;
            width: 100%;
        }
        
        .bot-avatar {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            background: linear-gradient(135deg, var(--blue-accent), var(--blue-light));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 32px rgba(0, 255, 136, 0.3);
            border: 3px solid rgba(255, 255, 255, 0.2);
            position: relative;
            animation: bot-pulse 3s ease-in-out infinite;
        }
        
        .bot-avatar::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, var(--blue-accent), transparent, var(--blue-light));
            border-radius: 50%;
            z-index: -1;
            animation: bot-rotate 4s linear infinite;
        }
        
        .bot-avatar svg {
            color: white;
            width: 32px;
            height: 32px;
        }
        
        .welcome-title {
            font-size: 32px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 12px;
            background: linear-gradient(135deg, var(--text-primary), var(--blue-accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .welcome-subtitle {
            font-size: 16px;
            color: var(--text-secondary);
            margin-bottom: 40px;
            font-weight: 500;
        }
        
        .welcome-features {
            display: flex;
            justify-content: center;
            gap: 24px;
            margin-bottom: 32px;
            flex-wrap: wrap;
        }
        
        .feature-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            background: var(--hover-bg);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            font-size: 14px;
            font-weight: 500;
        }
        
        .feature-item svg {
            color: var(--blue-accent);
        }
        
        .start-prompt {
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--hover-bg), var(--card-bg));
            backdrop-filter: blur(30px);
            border-radius: 16px;
            border: 1px solid var(--border-color);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            margin-bottom: 24px;
        }
        
        .start-prompt p {
            color: var(--text-secondary);
            font-size: 14px;
            margin: 0;
            font-weight: 500;
        }
        
        /* Initial Input Form */
        .initial-input-form {
            max-width: 600px;
            margin: 0 auto;
        }
        
        .initial-input-form .input-group {
            display: flex;
            align-items: center;
            gap: 8px;
            background: var(--glass-bg);
            backdrop-filter: blur(40px);
            border: 2px solid var(--border-color);
            border-radius: 24px;
            padding: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }
        
        .initial-input-form .input-group:focus-within {
            border-color: var(--blue-accent);
            box-shadow: 0 0 0 4px rgba(0, 255, 136, 0.1);
        }
        
        #initial-input {
            flex: 1;
            padding: 12px 16px;
            border: none;
            outline: none;
            background: transparent;
            color: var(--text-primary);
            font-size: 14px;
            font-weight: 500;
            border-radius: 16px;
        }
        
        #initial-input::placeholder {
            color: var(--text-secondary);
        }
        
        /* Chat View Styles */
        .chat-view {
            display: flex;
            flex-direction: column;
            height: 100vh;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .chat-view.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .chat-view.hidden {
            display: none;
        }
        
        .chat-header {
            padding: 16px 24px;
            background: var(--glass-bg);
            backdrop-filter: blur(40px);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .chat-title-section {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .chat-status {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #4caf50;
        }
        
        .chat-title-text {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .chat-subtitle {
            font-size: 12px;
            color: var(--text-secondary);
            margin-top: 4px;
        }
        
        .chat-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .info-chat-btn, .delete-chat-btn {
            width: 36px;
            height: 36px;
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: var(--hover-bg);
            color: var(--text-secondary);
        }
        
        .info-chat-btn:hover, .delete-chat-btn:hover {
            background: var(--glass-bg);
            color: var(--blue-accent);
            transform: scale(1.05);
        }
        
        /* Chat Messages Area */
        .chat-messages-area {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        
        /* Chat Input Container */
        .chat-input-container {
            padding: 20px;
            background: var(--glass-bg);
            backdrop-filter: blur(40px);
            border-top: 1px solid var(--border-color);
        }
        
        .input-wrapper {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .input-group {
            display: flex;
            align-items: center;
            gap: 8px;
            background: var(--glass-bg);
            backdrop-filter: blur(40px);
            border: 2px solid var(--border-color);
            border-radius: 24px;
            padding: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }
        
        .input-group:focus-within {
            border-color: var(--blue-accent);
            box-shadow: 0 0 0 4px rgba(0, 255, 136, 0.1);
        }
        
        #user-input {
            flex: 1;
            padding: 12px 16px;
            border: none;
            outline: none;
            background: transparent;
            color: var(--text-primary);
            font-size: 14px;
            font-weight: 500;
            border-radius: 16px;
        }
        
        #user-input::placeholder {
            color: var(--text-secondary);
        }
        
        .attach-btn, .short-mode-btn, .send-btn {
            width: 36px;
            height: 36px;
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: var(--hover-bg);
            color: var(--text-secondary);
        }
        
        .attach-btn:hover, .short-mode-btn:hover {
            background: var(--glass-bg);
            color: var(--blue-accent);
            transform: scale(1.05);
        }
        
        .send-btn {
            background: var(--blue-accent);
            color: white;
        }
        
        .send-btn:hover:not(:disabled) {
            background: var(--blue-light);
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
        }
        
        .send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: var(--hover-bg);
            color: var(--text-secondary);
        }
        
        /* Message Styles */
        .chat-message-container {
            display: flex;
            margin-bottom: 16px;
            animation: message-slide-in 0.4s ease;
        }
        
        .user-message-container {
            justify-content: flex-end;
        }
        
        .ai-message-container {
            justify-content: flex-start;
        }
        
        .message-content {
            max-width: 70%;
            padding: 12px 16px;
            border-radius: 18px;
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-color);
        }
        
        .user-message-content {
            background: var(--blue-accent);
            color: white;
            border-radius: 18px 18px 4px 18px;
        }
        
        .ai-message-content {
            background: var(--hover-bg);
            color: var(--text-primary);
            border-radius: 18px 18px 18px 4px;
        }
        
        .message-text {
            margin: 0;
            font-size: 14px;
            line-height: 1.4;
            word-wrap: break-word;
        }
        
        .typing-cursor::after {
            content: '|';
            animation: blink 1s infinite;
            color: var(--blue-accent);
        }
        
        /* Animations */
        @keyframes bot-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @keyframes bot-rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @keyframes message-slide-in {
            from { 
                opacity: 0; 
                transform: translateY(20px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .initial-view {
                padding: 20px;
            }
            
            .welcome-title {
                font-size: 28px;
            }
            
            .welcome-features {
                flex-direction: column;
                align-items: center;
                gap: 12px;
            }
            
            .feature-item {
                width: 100%;
                max-width: 200px;
            }
            
            .chat-messages-area {
                padding: 15px;
            }
            
            .message-content {
                max-width: 85%;
            }
        }
        
        @media (max-width: 480px) {
            .initial-view {
                padding: 15px;
            }
            
            .welcome-title {
                font-size: 24px;
            }
            
            .bot-avatar {
                width: 60px;
                height: 60px;
            }
            
            .bot-avatar svg {
                width: 24px;
                height: 24px;
            }
            
            .chat-messages-area {
                padding: 10px;
            }
        }
    `;
    document.head.appendChild(style);
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

// FIXED SIDEBAR TOGGLE - SMOOTH ANIMATION
sidebarToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('active');
    
    // Add smooth animation class
    sidebar.style.transition = 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    
    // Show toast for feedback
    const isActive = sidebar.classList.contains('active');
    showToast(isActive ? 'Sidebar expanded' : 'Sidebar collapsed');
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (sidebar && !sidebar.contains(e.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
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

// Enhanced settings modal
function showSettings() {
    const settingsModal = document.createElement('div');
    settingsModal.className = 'settings-modal';
    settingsModal.innerHTML = `
        <div class="settings-content">
            <div class="settings-header">
                <div class="settings-title-section">
                    <svg class="settings-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 -1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    <h3>Settings</h3>
                </div>
                <button class="close-settings" onclick="closeSettings()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="settings-body">
                <div class="setting-item">
                    <label>Appearance</label>
                    <div class="theme-option">
                        <div class="theme-info">
                            <span>Dark Mode</span>
                            <small>Switch between light and dark themes</small>
                        </div>
                        <label class="theme-switch">
                            <input type="checkbox" id="theme-toggle" ${isDarkMode ? 'checked' : ''}>
                            <span class="theme-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="settings-footer">
                <button class="reset-settings" onclick="resetSettings()">Reset</button>
                <button class="save-settings" onclick="saveSettings()">Save</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(settingsModal);
    
    // Add event listener to theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle?.addEventListener('change', toggleDarkMode);
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .settings-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(15px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        }
        
        .settings-content {
            background: var(--glass-bg);
            backdrop-filter: blur(40px) saturate(180%);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            max-width: 380px;
            width: 90%;
            box-shadow: var(--sidebar-shadow);
            animation: liquid-pop-in 0.4s ease;
            overflow: hidden;
        }
        
        .settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .settings-title-section {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .settings-icon {
            color: var(--blue-accent);
        }
        
        .settings-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .close-settings {
            background: var(--hover-bg);
            border: 1px solid var(--border-color);
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            cursor: pointer;
            color: var(--text-secondary);
            transition: all 0.3s ease;
        }
        
        .close-settings:hover {
            background: var(--glass-bg);
            color: var(--blue-accent);
        }
        
        .settings-body {
            padding: 20px 24px;
        }
        
        .setting-item > label {
            display: block;
            margin-bottom: 10px;
            font-weight: 600;
            color: var(--text-primary);
            font-size: 14px;
        }
        
        .theme-option {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background: var(--hover-bg);
            border-radius: 12px;
            border: 1px solid var(--border-color);
        }
        
        .theme-info span {
            font-weight: 500;
            color: var(--text-primary);
        }
        
        .theme-info small {
            color: var(--text-secondary);
            font-size: 11px;
        }
        
        .settings-footer {
            padding: 18px 24px;
            border-top: 1px solid var(--border-color);
            display: flex;
            gap: 12px;
        }
        
        .save-settings, .reset-settings {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .save-settings {
            background: var(--blue-accent);
            color: var(--bg-color);
        }
        
        .reset-settings {
            background: var(--hover-bg);
            color: var(--text-primary);
        }
    `;
    document.head.appendChild(style);
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

// New chat functionality
document.querySelector('.new-chat')?.addEventListener('click', () => {
    resetToInitialView();
    showToast('New chat started');
});

// Global functions
window.closeSettings = () => {
    const modal = document.querySelector('.settings-modal');
    if (modal) modal.remove();
};

window.saveSettings = () => {
    showToast('Settings saved successfully!');
    window.closeSettings();
};

window.resetSettings = () => {
    isDarkMode = false;
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', false);
    showToast('Settings reset to default');
    window.closeSettings();
};

// Add the updated re-initialize function to include new elements
function reinitializeDOMElements() {
    // Update global references
    chatMessages = document.getElementById('chat-messages');
    userInput = document.getElementById('user-input');
    sendBtn = document.getElementById('send-btn');
    shortModeBtn = document.getElementById('short-mode-btn');
    attachBtn = document.getElementById('attach-btn');

    // Add event listeners for chat input
    if (sendBtn) sendBtn.addEventListener('click', handleUserInput);
    if (attachBtn) attachBtn.addEventListener('click', handleAttachFile);
    if (shortModeBtn) shortModeBtn.addEventListener('click', handleShortMode);
    
    if (userInput) {
        userInput.addEventListener('input', function() {
            if (sendBtn) sendBtn.disabled = !this.value.trim();
        });
        
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && sendBtn && !sendBtn.disabled) {
                handleUserInput();
            }
        });
    }
    
    // Re-initialize chat actions after DOM update
    initializeChatActions();
}

// Update the transition function to include chat header
function transitionToChatView(initialMessage) {
    const initialView = document.getElementById('initial-view');
    const chatView = document.getElementById('chat-view');
    
    if (initialView && chatView) {
        // Hide initial view with animation
        initialView.classList.add('fade-out');
        
        setTimeout(() => {
            // Completely hide initial view
            initialView.style.display = 'none';
            
            // Show chat view
            chatView.classList.remove('hidden');
            chatView.classList.add('visible');
            
            // Re-initialize DOM references for the now-visible chat elements
            reinitializeDOMElements();
            
            // Start the conversation with the initial message
            if (initialMessage) {
                addMessage(initialMessage, 'user');
                
                // Simulate AI response
                setTimeout(() => {
                    const response = findAnswer ? findAnswer(initialMessage) : "Hello! I'm YRX3246, ready to help you. What would you like to know?";
                    addMessage(response, 'ai');
                }, 1000);
            }
            
            conversationStarted = true;
            
            // Focus the main chat input
            if (userInput) userInput.focus();
            
        }, 300);
    }
}