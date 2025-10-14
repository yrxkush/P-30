// Sidebar toggle functionality
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

// Toggle sidebar on button click
sidebarToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('active');
});

// Keep sidebar open when hovering
sidebar.addEventListener('mouseenter', () => {
    sidebar.classList.add('active');
});

sidebar.addEventListener('mouseleave', () => {
    sidebar.classList.remove('active');
});

// Chat input functionality
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const messagesContainer = document.getElementById('messagesContainer');
const welcomeSection = document.getElementById('welcomeSection');

// Auto-resize textarea
chatInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// Send message function
function sendMessage() {
    const message = chatInput.value.trim();
    
    if (message) {
        // Hide welcome section
        welcomeSection.style.display = 'none';
        
        // Add user message
        addMessage(message, 'user');
        
        // Clear input
        chatInput.value = '';
        chatInput.style.height = 'auto';
        
        // Simulate AI response
        setTimeout(() => {
            addMessage('This is a simulated AI response. Connect your backend to enable real AI functionality.', 'ai');
        }, 1000);
    }
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send on button click
sendBtn.addEventListener('click', sendMessage);

// Send on Enter (Shift+Enter for new line)
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// New chat button
document.querySelector('.new-chat').addEventListener('click', () => {
    messagesContainer.innerHTML = '';
    welcomeSection.style.display = 'block';
    chatInput.value = '';
});