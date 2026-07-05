let activePersona = 'piyush';

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
        
        personaBtns.forEach(b => b.classList.remove('active'));
        btnElement.classList.add('active');
        
        activePersona = btnElement.getAttribute('data-persona');
        
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
        
        document.querySelectorAll('.message-row').forEach(msg => msg.remove());
        welcomeBanner.style.display = 'block';
    });
});

// Secure Serverless Fetch Logic
async function getAIResponse(prompt, persona) {
    // Send request to our secure Vercel backend
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, persona })
    });

    if (!response.ok) {
        throw new Error('API request failed');
    }

    const data = await response.json();
    return data.reply;
}

// Chat Submission Logic
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    addMessageToUI(userMessage, 'user');
    messageInput.value = '';
    welcomeBanner.style.display = 'none';

    const typingId = showTypingIndicator();

    try {
        // Call our secure backend function
        const responseText = await getAIResponse(userMessage, activePersona);
        
        document.getElementById(typingId).remove();
        addMessageToUI(responseText, 'bot');
    } catch (error) {
        document.getElementById(typingId).remove();
        addMessageToUI("Oops! Server error. Make sure your API key is set in Vercel.", 'bot');
        console.error(error);
    }
});

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
    
    const avatarSrc = sender === 'bot' 
        ? (activePersona === 'hitesh' ? 'image/hitesh_choudhary.jpg' : 'image/piyush_garg.jpg')
        : ''; 

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
