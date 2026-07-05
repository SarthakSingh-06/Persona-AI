import { hiteshSirResponse, piyushSirResponse } from './main.js';

let activePersona = 'piyush'; // Global State

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');
const personaBtns = document.querySelectorAll('.persona-btn');
const headerAvatar = document.getElementById('headerAvatar');
const headerName = document.getElementById('headerName');
const headerRole = document.getElementById('headerRole');
const welcomeBanner = document.getElementById('welcomeBanner');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const messagesContainer = document.getElementById('messages');

// Theme Toggle Logic
themeToggle.addEventListener('click', () => {
    const htmlObj = document.documentElement;
    const currentTheme = htmlObj.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlObj.setAttribute('data-theme', newTheme);
    themeLabel.textContent = newTheme === 'dark' ? 'Dark Mode' : 'Light Mode';
});

// Persona Switching Logic
personaBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const btnElement = e.currentTarget;
        
        // Update active styling on buttons
        personaBtns.forEach(b => b.classList.remove('active'));
        btnElement.classList.add('active');
        
        // Update state
        activePersona = btnElement.getAttribute('data-persona');
        
        // Update UI Header and Welcome Banner
        if (activePersona === 'hitesh') {
            headerName.textContent = 'Hitesh Choudhary';
            headerRole.textContent = 'Founder · Chai Aur Code';
            headerAvatar.src = 'image/hitesh_choudhary.jpg';
            welcomeBanner.innerHTML = `
                <img class="welcome-icon" src="image/hitesh_choudhary.jpg" alt="Hitesh Sir">
                <h3>Chat with Hitesh Sir</h3>
                <p>Hanji Swagat hai aapka! Ask about software development, system design, AI, or chai.</p>
            `;
        } else {
            headerName.textContent = 'Piyush Garg';
            headerRole.textContent = 'Principal Engineer · Oraczen';
            headerAvatar.src = 'image/piyush_garg.jpg';
            welcomeBanner.innerHTML = `
                <img class="welcome-icon" src="image/piyush_garg.jpg" alt="Piyush Sir">
                <h3>Chat with Piyush Garg</h3>
                <p>Ask about product building, AI, tech stacks, or anything from his journey.</p>
            `;
        }
        
        // Clear previous chat history when switching
        document.querySelectorAll('.message-row').forEach(msg => msg.remove());
        welcomeBanner.style.display = 'block';
    });
});

// 3. Chat Submission & API Routing Logic
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    // Display User Message
    addMessageToUI(userMessage, 'user');
    messageInput.value = '';
    welcomeBanner.style.display = 'none'; // Hide banner once chat starts

    // Show typing indicator
    const typingId = showTypingIndicator();

    try {
        let responseText = '';
        
        // Route the prompt to the correct imported function
        if (activePersona === 'hitesh') {
            responseText = await hiteshSirResponse(userMessage);
        } else {
            responseText = await piyushSirResponse(userMessage);
        }

        // Remove typing indicator and show bot response
        document.getElementById(typingId).remove();
        addMessageToUI(responseText, 'bot');
    } catch (error) {
        document.getElementById(typingId).remove();
        addMessageToUI("Oops, an error occurred while fetching the response. Check the console.", 'bot');
        console.error(error);
    }
});

// Allow Shift+Enter for new line, regular Enter to submit
messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
    }
});

// Helper Functions
function addMessageToUI(text, sender) {
    const messageRow = document.createElement('div');
    messageRow.classList.add('message-row', sender);
    
    // Determine which avatar to show for the bot
    const avatarSrc = sender === 'bot' 
        ? (activePersona === 'hitesh' ? 'image/hitesh_choudhary.jpg' : 'image/piyush_garg.jpg')
        : ''; // User avatar is hidden via CSS anyway

    messageRow.innerHTML = `
        <img class="message-avatar" src="${avatarSrc}" alt="">
        <div class="message-content">
            <div class="message-bubble">${text}</div>
            <div class="message-time">Just now</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageRow);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const messageRow = document.createElement('div');
    messageRow.classList.add('message-row', 'bot');
    messageRow.id = id;
    
    const avatarSrc = activePersona === 'hitesh' ? 'image/hitesh_choudhary.jpg' : 'image/piyush_garg.jpg';

    messageRow.innerHTML = `
        <img class="message-avatar" src="${avatarSrc}" alt="">
        <div class="message-content">
            <div class="message-bubble typing-bubble">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(messageRow);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return id;
}
