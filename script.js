async function sendMessage() {
    const inputField = document.getElementById('userInput');
    const messageContainer = document.querySelector('.chat-messages') || document.getElementById('messages'); 
    const message = inputField.value.trim();

    if (!message) return;

    // 1. Screen par user ka message dikhayein
    const userDiv = document.createElement('div');
    userDiv.className = 'message user-message';
    userDiv.innerHTML = `<div class="message-text">${message}</div>`;
    messageContainer.appendChild(userDiv);
    inputField.value = '';

    try {
        // 2. Flask backend ko request bhejein
        const response = await fetch('/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        // 3. AI ka reply dikhayein
        const botDiv = document.createElement('div');
        botDiv.className = 'message bot-message';
        botDiv.innerHTML = `<div class="message-text">${data.reply}</div>`;
        messageContainer.appendChild(botDiv);

        // Niche scroll karein
        messageContainer.scrollTop = messageContainer.scrollHeight;

    } catch (error) {
        console.error("Connection Error:", error);
        // YE LINE DEKHEIN: Purana "node server.js" wala error yahan se hat jayega
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message bot-message';
        errorDiv.innerHTML = `<div class="message-text" style="color: red;">Error: Python server se baat nahi ho pa rahi.</div>`;
        messageContainer.appendChild(errorDiv);
    }
}