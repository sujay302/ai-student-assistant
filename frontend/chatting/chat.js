document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. STATE ---
    const STORAGE_KEY = 'ai_workspace_final';
    const AI_DELAY_MS = 1000;
    
    let state = {
        chats: [],
        projects: [],
        currentChatId: null,
        activeFilter: 'all', // 'all' or Project ID
        theme: 'light'
    };

    // --- 2. DOM ELEMENTS (Safe Helper) ---
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
        // Update Icon Text
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
        renderProjects(); // Highlight active project
        
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
            type, // 'ai' or 'group'
            title,
            projectId: state.activeFilter !== 'all' ? state.activeFilter : null,
            messages: [],
            members: type === 'group' ? ['Alice', 'Bob', 'AI'] : ['AI']
        };
        state.chats.unshift(chat);
        saveData();
        loadChat(chat.id);
        renderChatList();
        
        // Close Sidebar on Mobile
        if(window.innerWidth <= 768) toggleSidebar(false);
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
    // --- NEW FUNCTIONS (Paste above renderChatList) ---

function deleteChat(e, id) {
    e.stopPropagation(); // ताकि चैट ओपन न हो जाए
    if(confirm("Are you sure you want to delete this chat?")) {
        state.chats = state.chats.filter(c => c.id !== id);
        saveData();
        
        // अगर खुली हुई चैट डिलीट की है, तो स्क्रीन साफ़ करें
        if(state.currentChatId === id) {
            state.currentChatId = null;
            els.messagesList.innerHTML = '';
            els.welcomeScreen.classList.remove('hidden');
            els.chatTitle.innerText = "Welcome";
            els.chatSubtitle.innerText = "Select a chat";
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
// --- UPDATED RENDER LIST FUNCTION (Replace old one) ---
function renderChatList() {
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
        
        const icon = chat.type === 'group' ? '<i class="fa-solid fa-users chat-icon icon-group"></i>' : '<i class="fa-solid fa-robot chat-icon icon-ai"></i>';
        
        // HTML में एडिट और डिलीट बटन जोड़े गए हैं
        div.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px; overflow:hidden;">
                ${icon} 
                <span class="history-title">${chat.title}</span>
            </div>
            <div class="history-actions">
                <i class="fa-solid fa-pen action-icon" id="ren_${chat.id}" title="Rename"></i>
                <i class="fa-solid fa-trash action-icon" id="del_${chat.id}" title="Delete"></i>
            </div>
        `;
        
        // चैट ओपन करने का क्लिक
        div.onclick = () => {
            loadChat(chat.id);
            if(window.innerWidth <= 768) toggleSidebar(false);
        };

        // बटन के लिए क्लिक इवेंट्स
        const renBtn = div.querySelector(`#ren_${chat.id}`);
        const delBtn = div.querySelector(`#del_${chat.id}`);
        
        if(renBtn) renBtn.onclick = (e) => renameChat(e, chat.id);
        if(delBtn) delBtn.onclick = (e) => deleteChat(e, chat.id);

        els.chatList.appendChild(div);
    });
}

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
        const div = document.createElement('div');
        const isUser = msg.sender === 'You';
        
        let roleClass = 'user';
        let avatarIcon = 'U';
        
        if (msg.role === 'ai') { roleClass = 'ai'; avatarIcon = '<i class="fa-solid fa-robot"></i>'; }
        else if (msg.role === 'group') { roleClass = 'group_member'; avatarIcon = msg.sender.charAt(0); }

        div.className = `message ${isUser ? 'user' : roleClass}`;
        
        let senderLabel = (!isUser && msg.role === 'group') ? `<div class="msg-sender">${msg.sender}</div>` : '';

        div.innerHTML = `
            <div class="avatar">${avatarIcon}</div>
            <div>
                ${senderLabel}
                <div class="bubble">${msg.text}</div>
            </div>
        `;
        els.messagesList.appendChild(div);
    }
// --- 8. MESSAGING (Updated for Backend) ---
async function sendMessage() {
    const text = els.input.value.trim();
    if (!text) return;
    
    // Check active chat
    if (!state.currentChatId) return;
    const chat = state.chats.find(c => c.id === state.currentChatId);
    if (!chat) return;

    // 1. User Message (Turant dikhayein)
    const msg = { role: 'user', sender: 'You', text };
    chat.messages.push(msg);
    appendMessageDOM(msg);
    els.input.value = ''; // Input khali karein
    saveData();

    // Scroll adjust
    scrollToBottom();

    // 2. AI Response Logic
    if (chat.type === 'ai') {
        // Typing dikhayein
        els.typingIndicator.classList.remove('hidden');
        scrollToBottom();

        // --- BACKEND CALL ---
        // Yahan hum Backend se jawaab maang rahe hain
        const aiResponseText = await generateAIResponse(text);

        // Typing hatayein
        els.typingIndicator.classList.add('hidden');

        // AI Message add karein
        const reply = { role: 'ai', sender: 'AI', text: aiResponseText };
        chat.messages.push(reply);
        appendMessageDOM(reply);
        saveData();
        scrollToBottom();
    } 
    else {
        // Group Chat (Fake Simulation)
        setTimeout(() => {
            const member = chat.members[Math.floor(Math.random() * chat.members.length)];
            const reply = { role: 'group', sender: member, text: "Interesting point! @You" };
            chat.messages.push(reply);
            appendMessageDOM(reply);
            saveData();
            scrollToBottom();
        }, 1500);
    }
}
    // --- NEW: Function to Connect with Backend ---
async function generateAIResponse(userMessage) {
    try {
        // Humare Backend Server ka address
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();
        return data.reply || "Error: No reply from server.";
    } catch (error) {
        console.error("Backend Error:", error);
        return "Error: Backend server is not running. Please run 'node server.js'";
    }
}

    // --- 9. VOICE RECOGNITION (Restored) ---
    function setupVoiceRecognition() {
        if (!els.voiceBtn) return;
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            
            recognition.onstart = () => { els.voiceBtn.classList.add('listening'); els.input.placeholder = "Listening..."; };
            recognition.onend = () => { els.voiceBtn.classList.remove('listening'); els.input.placeholder = "Type a message..."; };
            recognition.onresult = (e) => {
                const transcript = e.results[0][0].transcript;
                els.input.value = transcript;
                els.sendBtn.disabled = false;
                els.input.focus();
            };
            
            els.voiceBtn.onclick = () => recognition.start();
        } else {
            els.voiceBtn.style.display = 'none';
        }
    }

    // --- 10. MOVE MODAL ---
    function openMoveModal() {
        if(!state.currentChatId) return;
        els.moveModal.classList.remove('hidden');
        const list = document.getElementById('projectSelectContainer');
        list.innerHTML = `<div onclick="window.moveToProject(null)"><i class="fa-solid fa-ban"></i> Remove from Project</div>`;
        state.projects.forEach(p => {
            list.innerHTML += `<div onclick="window.moveToProject('${p.id}')"><i class="fa-solid fa-folder"></i> ${p.name}</div>`;
        });
    }

    window.moveToProject = (projId) => {
        const chat = state.chats.find(c => c.id === state.currentChatId);
        chat.projectId = projId;
        saveData();
        if(state.activeFilter !== 'all' && state.activeFilter !== projId) {
            state.currentChatId = null;
            els.messagesList.innerHTML = '';
            els.welcomeScreen.classList.remove('hidden');
        }
        renderChatList();
        closeAllModals();
    };

    // --- Utils ---
    function scrollToBottom() { els.chatContainer.scrollTop = els.chatContainer.scrollHeight; }
    function closeAllModals() { document.querySelectorAll('.modal-overlay').forEach(el => el.classList.add('hidden')); }
    function toggleSidebar(show) {
        if(show) { els.sidebar.classList.add('open'); els.overlay.style.display = 'block'; }
        else { els.sidebar.classList.remove('open'); els.overlay.style.display = 'none'; }
    }

    // --- Listeners ---
    function setupEventListeners() {
        els.newChatBtn.onclick = () => createChat('ai');
        els.newGroupBtn.onclick = () => els.groupModal.classList.remove('hidden');
        els.newProjectBtn.onclick = () => els.projectModal.classList.remove('hidden');
        
        els.confirmProjectBtn.onclick = createProject;
        els.confirmGroupBtn.onclick = createGroup;
        els.moveChatBtn.onclick = openMoveModal;
        
        els.sendBtn.onclick = sendMessage;
        els.input.onkeydown = (e) => { if(e.key === 'Enter') sendMessage(); };
        els.input.oninput = (e) => els.sendBtn.disabled = e.target.value.trim() === '';
        
        els.chatSearch.oninput = renderChatList;
        els.backToAllBtn.onclick = () => filterChats('all');

        // Sidebar
        els.mobileMenuBtn.onclick = () => toggleSidebar(true);
        els.overlay.onclick = () => toggleSidebar(false);

        // User Menu
        els.userProfileBtn.onclick = (e) => { e.stopPropagation(); els.userMenu.classList.toggle('hidden'); };
        document.onclick = () => els.userMenu.classList.add('hidden');
        
        els.toggleThemeBtn.onclick = () => applyTheme(state.theme === 'light' ? 'dark' : 'light');
        els.clearAllBtn.onclick = () => { if(confirm("Clear ALL?")) { state.chats=[]; state.projects=[]; saveData(); location.reload(); } };
        els.settingsBtn.onclick = () => els.settingsModal.classList.remove('hidden');

        document.querySelectorAll('.cancel-btn, .cancel-btn-icon').forEach(b => b.onclick = closeAllModals);
    }

    init();
});