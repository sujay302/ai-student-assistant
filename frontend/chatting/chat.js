document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. STATE ---
    const STORAGE_KEY = 'ai_workspace_final';
        let state = {
        chats: [],
        projects: [],
        currentChatId: null,
        activeFilter: 'all', 
        theme: 'light'
    };

    // --- 2. DOM ELEMENTS ---
    const get = (id) => document.getElementById(id);
    const els = {
        sidebar: get('sidebar'),
        overlay: get('sidebarOverlay'),
        mobileMenuBtn: get('mobileMenuBtn'),
        chatList: get('chatHistoryList'),
        projectList: get('projectsList'),
        messagesList: get('messagesList'),
        input: get('messageInput'),
        sendBtn: get('sendBtn'),
        voiceBtn: get('voiceBtn'),
        chatTitle: get('currentChatTitle'),
        chatSubtitle: get('currentChatSubtitle'),
        welcomeScreen: get('welcomeScreen'),
        typingIndicator: get('typingIndicator'),
        chatContainer: get('chatContainer'),
        chatSearch: get('chatSearch'),
        historyLabel: get('historyLabel'),
        backToAllBtn: get('backToAllChats'),
        // Modals
        projectModal: get('projectModal'),
        groupModal: get('groupModal'),
        moveModal: get('moveModal'),
        settingsModal: get('settingsModal'),
        // Buttons
        newChatBtn: get('newChatBtn'),
        newGroupBtn: get('newGroupBtn'),
        newProjectBtn: get('newProjectBtn'),
        confirmProjectBtn: get('confirmProjectBtn'),
        confirmGroupBtn: get('confirmGroupBtn'),
        moveChatBtn: get('moveChatBtn'),
        // Menu
        userProfileBtn: get('userProfileBtn'),
        userMenu: get('userMenu'),
        toggleThemeBtn: get('toggleThemeBtn'),
        clearAllBtn: get('clearAllBtn'),
        settingsBtn: get('settingsBtn')
    };

    // --- 3. INIT ---
    function init() {
        loadData();
        applyTheme(state.theme);
        renderProjects();
        renderChatList();
        
        if (state.chats.length > 0) loadChat(state.chats[0].id);
        
        setupEventListeners();
        setupVoiceRecognition();
    }

    // --- 4. DATA ---
    function loadData() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) state = JSON.parse(stored);
            if (!state.theme) state.theme = 'light';
        } catch(e) { console.error(e); }
    }

    function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

    // --- 5. THEME ---
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        state.theme = theme;
        saveData();
        const icon = theme === 'dark' ? '<i class="fa-solid fa-sun"></i> Light Mode' : '<i class="fa-solid fa-moon"></i> Dark Mode';
        if(get('toggleThemeBtn')) get('toggleThemeBtn').innerHTML = icon;
    }

    // --- 6. PROJECTS ---
    function createProject() {
        const name = get('projectNameInput').value.trim();
        if(!name) return;
        state.projects.push({ id: 'proj_' + Date.now(), name });
        saveData();
        renderProjects();
        closeAllModals();
        get('projectNameInput').value = '';
    }

    function renderProjects() {
        if(!els.projectList) return;
        els.projectList.innerHTML = '';
        state.projects.forEach(p => {
            const div = document.createElement('div');
            div.className = `project-item ${state.activeFilter === p.id ? 'active' : ''}`;
            div.innerHTML = `<i class="fa-solid fa-folder"></i> ${p.name}`;
            div.onclick = () => filterChats(p.id, p.name);
            els.projectList.appendChild(div);
        });
    }

    function filterChats(filterId, name) {
        state.activeFilter = filterId;
        renderProjects();
        if(filterId === 'all') {
            els.historyLabel.innerText = "All Chats";
            els.backToAllBtn.classList.add('hidden');
        } else {
            els.historyLabel.innerText = `📁 ${name}`;
            els.backToAllBtn.classList.remove('hidden');
        }
        renderChatList();
    }

    // --- 7. CHATS & GROUPS ---
    function createChat(type, title = 'New Chat') {
        const chat = {
            id: 'chat_' + Date.now(),
            type,
            title,
            projectId: state.activeFilter !== 'all' ? state.activeFilter : null,
            messages: [],
            members: type === 'group' ? ['Alice', 'Bob', 'AI'] : ['AI']
        };
        state.chats.unshift(chat);
        saveData();
        loadChat(chat.id);
        renderChatList();
    }

    function createGroup() {
        const name = get('groupNameInput').value.trim();
        if(!name) return;
        createChat('group', name);
        closeAllModals();
        get('groupNameInput').value = '';
    }

    function loadChat(id) {
        state.currentChatId = id;
        const chat = state.chats.find(c => c.id === id);
        if(!chat) return;

        els.chatTitle.innerText = chat.title;
        els.chatSubtitle.innerText = chat.type === 'group' ? `${chat.members.length + 1} Members` : 'AI Assistant';
        
        renderMessages(chat.messages);
        renderChatList();
    }

    function deleteChat(e, id) {
        e.stopPropagation();
        if(confirm("Are you sure you want to delete this chat?")) {
            state.chats = state.chats.filter(c => c.id !== id);
            saveData();
            if(state.currentChatId === id) {
                state.currentChatId = null;
                els.messagesList.innerHTML = '';
                els.welcomeScreen.classList.remove('hidden');
            }
            renderChatList();
        }
    }

    function renameChat(e, id) {
        e.stopPropagation();
        const chat = state.chats.find(c => c.id === id);
        if(!chat) return;
        const newName = prompt("Enter new chat name:", chat.title);
        if(newName && newName.trim() !== "") {
            chat.title = newName.trim();
            saveData();
            renderChatList();
            if(state.currentChatId === id) els.chatTitle.innerText = chat.title;
        }
    }

    function renderChatList() {
        if(!els.chatList) return;
        els.chatList.innerHTML = '';
        const search = els.chatSearch.value.toLowerCase();
        const filtered = state.chats.filter(c => {
            const matchesProject = state.activeFilter === 'all' || c.projectId === state.activeFilter;
            const matchesSearch = c.title.toLowerCase().includes(search);
            return matchesProject && matchesSearch;
        });

        filtered.forEach(chat => {
            const div = document.createElement('div');
            div.className = `history-item ${chat.id === state.currentChatId ? 'active' : ''}`;
            div.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px; overflow:hidden;">
                    <i class="fa-solid ${chat.type === 'group' ? 'fa-users' : 'fa-robot'} chat-icon"></i> 
                    <span class="history-title">${chat.title}</span>
                </div>
                <div class="history-actions">
                    <i class="fa-solid fa-pen action-icon" onclick="event.stopPropagation(); window.renameChatManual('${chat.id}')"></i>
                    <i class="fa-solid fa-trash action-icon" onclick="event.stopPropagation(); window.deleteChatManual('${chat.id}')"></i>
                </div>
            `;
            div.onclick = () => loadChat(chat.id);
            els.chatList.appendChild(div);
        });
    }

    // Manual triggers for global scope
    window.renameChatManual = (id) => renameChat({stopPropagation:()=>{}}, id);
    window.deleteChatManual = (id) => deleteChat({stopPropagation:()=>{}}, id);

    function renderMessages(msgs) {
        els.messagesList.innerHTML = '';
        if(msgs.length === 0) els.welcomeScreen.classList.remove('hidden');
        else {
            els.welcomeScreen.classList.add('hidden');
            msgs.forEach(msg => appendMessageDOM(msg));
        }
        scrollToBottom();
    }

   function appendMessageDOM(msg) {
    const messagesList = document.getElementById('messagesList'); // Ensure ye ID aapke HTML mein hai
    if (!messagesList) return;

    const div = document.createElement('div');
    const isUser = msg.sender === 'You';
    
    // Aapke CSS classes (user aur ai) ke hisaab se
    div.className = `message ${isUser ? 'user' : 'ai'}`; 
    
    div.innerHTML = `
        <div class="avatar">${isUser ? 'U' : '<i class="fa-solid fa-robot"></i>'}</div>
        <div class="content">
            <div class="bubble">${msg.text}</div>
        </div>
    `;
    messagesList.appendChild(div);
    
    // Auto scroll to bottom
    const chatContainer = document.getElementById('chatContainer');
    if(chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
}

    // --- 8. MESSAGING ---
    async function sendMessage() {
        const text = els.input.value.trim();
        if (!text || !state.currentChatId) return;

        const chat = state.chats.find(c => c.id === state.currentChatId);
        if (!chat) return;

        // User Message
        const msg = { role: 'user', sender: 'You', text };
        chat.messages.push(msg);
        appendMessageDOM(msg);
        els.input.value = '';
        saveData();
        scrollToBottom();

        if (chat.type === 'ai') {
            els.typingIndicator.classList.remove('hidden');
            scrollToBottom();

            // Backend Call
            const aiResponseText = await generateAIResponse(text);

            els.typingIndicator.classList.add('hidden');
            const reply = { role: 'ai', sender: 'AI', text: aiResponseText };
            chat.messages.push(reply);
            appendMessageDOM(reply);
            saveData();
            scrollToBottom();
        }
    }

    // --- 9. BACKEND CONNECTION ---
    async function generateAIResponse(userMessage) {
        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) throw new Error("Server disconnected");

            const data = await response.json();
            return data.reply || "No response received.";
        } catch (error) {
            console.error("Backend Error:", error);
            return "⚠️ Connection Error: Please make sure backend server is running on http://localhost:3000.";
        }
    }

    // --- Utils & Listeners ---
    function scrollToBottom() { els.chatContainer.scrollTop = els.chatContainer.scrollHeight; }
    function closeAllModals() { document.querySelectorAll('.modal-overlay').forEach(el => el.classList.add('hidden')); }
    
    function setupEventListeners() {
        els.sendBtn.onclick = sendMessage;
        els.input.onkeydown = (e) => { if(e.key === 'Enter') sendMessage(); };
        els.newChatBtn.onclick = () => createChat('ai');
        els.newProjectBtn.onclick = () => els.projectModal.classList.remove('hidden');
        els.confirmProjectBtn.onclick = createProject;
        els.toggleThemeBtn.onclick = () => applyTheme(state.theme === 'light' ? 'dark' : 'light');
    }

    function setupVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition && els.voiceBtn) {
            const recognition = new SpeechRecognition();
            recognition.onresult = (e) => {
                els.input.value = e.results[0][0].transcript;
                sendMessage();
            };
            els.voiceBtn.onclick = () => recognition.start();
        }
    }

    init();
});