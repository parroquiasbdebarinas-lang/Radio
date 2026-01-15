console.log("Radio Parroquia Santa Bárbara - Cargada correctamente");

// Función para cambiar entre pestañas (Tabs)
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    // 1. Ocultar todo el contenido de las pestañas
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // 2. Quitar la clase "active" de todos los botones
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // 3. Mostrar la pestaña actual y añadir "active" al botón pulsado
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// --- Lógica del Chat en Vivo ---
// Intentar conectar solo si existe el chat en la página
const chatForm = document.getElementById('chat-form');
if (chatForm) {
    // --- CONFIGURACIÓN DE CONEXIÓN ---
    // Detectar si estamos en local o en producción
    
    
    // IMPORTANTE: Cuando subas el backend a Render, copia la URL que te den y pégala aquí abajo 👇
     

    // Configuración de conexión forzada para que no falle el envío
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const productionUrl = 'https://backend-8o1z.onrender.com'; 

const socket = io(isLocal ? 'http://localhost:3000' : productionUrl, {
    transports: ['websocket', 'polling'],
    upgrade: true,
    reconnection: true
});
    // ---------------------------------
    
    const chatMessages = document.getElementById('chat-messages');
    const usernameInput = document.getElementById('username');
    const messageInput = document.getElementById('message');
    const emojiBtn = document.getElementById('emoji-btn');
    const emojiPicker = document.getElementById('emoji-picker');

    // Categorías de Emojis
    const emojiCategories = {
        'Caras': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '☺️', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃'],
        'Gestos': ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁', '👅', '👄', '💋', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👨‍🦰', '👨‍🦱', '👨‍🦳', '👨‍🦲', '👩', '👩‍🦰', '👩‍🦱', '👩‍🦳', '👩‍🦲', '🧓', '👴', '👵', '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🧏', '🙇', '🤦', '🤷'],
        'Religión': ['⛪', '✝️', '🕊️', '🕯️', '📖', '📿', '🛐', '👼', '🎄', '✡️', '☪️', '☮️', '🕎', '🔯', '🕉️', '☸️', '☯️', '☦️', '⛎'],
        'Naturaleza': ['💐', '🌹', '🥀', '🌺', '🌷', '🌸', '💮', '🏵️', '🌻', '🌼', '🍂', '🍁', '🍄', '🌾', '🌵', '🌴', '🌳', '🌲', '🌱', '🌿', '☘️', '🍀', '🎍', '🪴', '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🫐', '🥝', '🍅', '🫒', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🫑', '🥒', '🥬', '🥦', '🧄', '🧅', '🥜', '🌰', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🪱', '🐛', '🦋', '🐌', '🐞', '🐜', '🪰', '🪲', '🪳', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🦭', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🦣', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦫', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔', '🐾', '🐉', '🐲'],
        'Objetos': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '🎉', '🎊', '🎈', '🎂', '🎁', '🎀', '🏆', '🥇', '🥈', '🥉', '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🎵', '🎶', '🎼', '🎤', '🎧', '🎷', '🎸', '🎹', '🎺', '🎻', '🥁', '📻', '📱', '💻', '📷', '🎥', '🎬', '📺', '💡', '🔦', '🕯️', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪚', '🔩', '⚙️', '🪤', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '🪦', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🪠', '🧺', '🧻', '🚽', '🚰', '🚿', '🛁', '🛀', '🧼', '🪥', '🪒', '🧽', '🪣', '🧴', '🛎️', '🔑', '🗝️', '🚪', '🪑', '🛋️', '🛏️', '🛌', '🧸', '🪆', '🖼️', '🪞', '🪟', '🛍️', '🛒', '🎁', '🎈', '🎏', '🎀', '🪄', '🪅', '🎊', '🎉', '🎎', '🏮', '🎐', '🧧', '✉️', '📩', '📨', '📧', '💌', '📥', '📤', '📦', '🏷️', '🪧', '📪', '📫', '📬', '📭', '📮', '📯', '📜', '📃', '📄', '📑', '🧾', '📊', '📈', '📉', '🗒️', '🗓️', '📆', '📅', '🗑️', '📇', '🗃️', '🗳️', '🗄️', '📋', '📁', '📂', '🗂️', '🗞️', '📰', '📓', '📔', '📒', '📕', '📗', '📘', '📙', '📚', '📖', '🔖', '🧷', '🔗', '📎', '🖇️', '📐', '📏', '🧮', '📌', '📍', '✂️', '🖊️', '🖋️', '✒️', '🖌️', '🖍️', '📝', '✏️', '🔍', '🔎', '🔏', '🔐', '🔒', '🔓'],
        'Símbolos': ['🇻🇪', '🇻🇦', '🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈', '🏳️‍⚧️', '🇺🇳', '🇦🇷', '🇧🇴', '🇧🇷', '🇨🇱', '🇨🇴', '🇨🇷', '🇨🇺', '🇩🇴', '🇪🇨', '🇸🇻', '🇬🇹', '🇭🇳', '🇲🇽', '🇳🇮', '🇵🇦', '🇵🇾', '🇵🇪', '🇵🇷', '🇪🇸', '🇺🇾', '🇺🇸', '🇨🇦', '🇮🇹', '🇵🇹', '🇫🇷', '🇩🇪', '🇬🇧', '🇨🇳', '🇯🇵', '🇰🇷', '🇮🇱', '🇵🇸', '🇺🇦', '🇷🇺', '✅', '❌', '⭕', '🛑', '⛔', '🚫', '💯', '💢', '♨️', '❗', '❓', '‼️', '⁉️', '⚠️', '♻️', '❇️', '✳️', '❎', '🌐', '💠', '🌀', '💤', '🏧', '♿', '🅿️', '🚾', '🚰', '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '#️⃣', '*️⃣', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '🔀', '🔁', '🔂', '◀️', '🔼', '🔽', '⏫', '⏬', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '🔄', '↪️', '↩️', '🔃', '⤴️', '⤵️', '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️', '©️', '®️', '👁️‍🗨️', '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛']
    };

    // Iconos para las categorías
    const categoryIcons = {
        'Caras': '😀',
        'Gestos': '👋',
        'Religión': '⛪',
        'Naturaleza': '🐶',
        'Objetos': '🎉',
        'Símbolos': '🇻🇪'
    };

    // Crear estructura del panel (Pestañas + Contenido)
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'emoji-tabs';
    
    const emojisContainer = document.createElement('div');
    emojisContainer.className = 'emoji-grid-container';

    emojiPicker.appendChild(tabsContainer);
    emojiPicker.appendChild(emojisContainer);

    // Generar pestañas y contenido
    let firstCategory = true;
    for (const [category, emojisList] of Object.entries(emojiCategories)) {
        // 1. Botón de pestaña
        const tabBtn = document.createElement('button');
        tabBtn.className = `emoji-tab-btn ${firstCategory ? 'active' : ''}`;
        tabBtn.textContent = categoryIcons[category];
        tabBtn.title = category;
        tabBtn.type = 'button'; // Evitar que envíe el formulario
        
        // 2. Contenedor de emojis para esta categoría
        const categoryDiv = document.createElement('div');
        categoryDiv.className = `emoji-category ${firstCategory ? 'active' : ''}`;
        categoryDiv.id = `emoji-cat-${category}`;

        // 3. Llenar emojis
        emojisList.forEach(emoji => {
            const span = document.createElement('span');
            span.textContent = emoji;
            span.classList.add('emoji-item');
            span.onclick = () => {
                messageInput.value += emoji;
                messageInput.focus();
            };
            categoryDiv.appendChild(span);
        });

        emojisContainer.appendChild(categoryDiv);

        // 4. Evento click en pestaña
        tabBtn.onclick = () => {
            // Quitar active de todos
            document.querySelectorAll('.emoji-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.emoji-category').forEach(c => c.classList.remove('active'));
            
            // Activar actual
            tabBtn.classList.add('active');
            categoryDiv.classList.add('active');
        };

        tabsContainer.appendChild(tabBtn);
        firstCategory = false;
    }

    // Mostrar/Ocultar panel
    emojiBtn.onclick = () => {
        emojiPicker.classList.toggle('active');
    };

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const message = messageInput.value;

        if (username && message) {
            // Enviar mensaje al servidor
            socket.emit('chat message', { user: username, text: message });
            messageInput.value = ''; // Limpiar campo
            emojiPicker.classList.remove('active'); // Cerrar panel al enviar
        }
    });

    // --- MANEJO DE MENSAJES E HISTORIAL ---

    // Función auxiliar para agregar mensaje al DOM
    function appendMessage(msg) {
        // Formatear hora (ej: 10:30 PM)
        const time = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
        
        // Solo mostrar botón de reporte si NO es mensaje de sistema
        const reportBtn = !msg.isSystem ? `<i class="fas fa-flag" style="font-size: 0.8rem; color: #666; cursor: pointer;" onclick="reportMessage('${msg.id}')" title="Reportar mensaje"></i>` : '';
        
        const div = document.createElement('div');
        div.classList.add('message');
        if (msg.isSystem) div.classList.add('system'); // Estilo especial si es sistema
        div.dataset.id = msg.id; // Guardamos el ID en el HTML para poder borrarlo luego
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:baseline;">
                <span><strong>${msg.user}:</strong> ${msg.text}</span>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size: 0.7rem; color: rgba(255,255,255,0.5); white-space: nowrap;">${time}</span>
                    ${reportBtn}
                </div>
            </div>`;
        chatMessages.appendChild(div);
    }

    // 1. Recibir historial reciente (últimos 50) al conectar
    socket.on('recent history', (data) => {
        chatMessages.innerHTML = ''; // Limpiar chat
        
        // Si hay más mensajes antiguos, mostrar botón
        if (data.hasMore) {
            const loadMoreBtn = document.createElement('div');
            loadMoreBtn.className = 'message system';
            loadMoreBtn.style.cursor = 'pointer'; loadMoreBtn.style.background = 'transparent'; loadMoreBtn.style.border = 'none';
            loadMoreBtn.style.color = 'var(--primary)';
            loadMoreBtn.innerHTML = '<strong><i class="fas fa-history"></i> Cargar mensajes antiguos...</strong>';
            loadMoreBtn.onclick = () => {
                socket.emit('request full history');
            };
            chatMessages.appendChild(loadMoreBtn);
        } else {
            const welcomeMsg = document.createElement('div');
            welcomeMsg.className = 'message system'; welcomeMsg.style.background = 'transparent'; welcomeMsg.style.border = 'none'; welcomeMsg.style.color = '#888';
            welcomeMsg.innerText = 'Bienvenido al chat de Radio Santa Bárbara.';
            chatMessages.appendChild(welcomeMsg);
        }

        data.messages.forEach(msg => appendMessage(msg));
        chatMessages.scrollTop = chatMessages.scrollHeight; // Bajar al final
    });

    // 2. Recibir historial completo (cuando se pide)
    socket.on('full history', (messages) => {
        chatMessages.innerHTML = ''; // Limpiar todo
        messages.forEach(msg => appendMessage(msg));
        // No hacemos scroll automático al fondo para que el usuario no pierda la posición (opcional)
    });

    // 3. Recibir un mensaje nuevo en tiempo real
    socket.on('chat message', (msg) => {
        appendMessage(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll hacia abajo
    });

    // 4. Actualizar contador de oyentes
    const userCountSpan = document.getElementById('user-count');
    socket.on('user count', (count) => {
        if (userCountSpan) userCountSpan.innerText = count;
    });

    // 5. Borrar chat completo
    socket.on('chat cleared', () => {
        chatMessages.innerHTML = '<div class="message system">El chat ha sido limpiado por un administrador.</div>';
    });

    // 6. Borrar mensaje individual
    socket.on('message deleted', (id) => {
        // Buscar el div que tenga ese ID y eliminarlo
        const msgDiv = chatMessages.querySelector(`div[data-id="${id}"]`);
        if (msgDiv) {
            msgDiv.remove();
        }
    });

    // 7. Si te banean
    socket.on('banned', (reason) => {
        const msg = reason || 'HAS SIDO BANEADO DEL CHAT';
        // En lugar de borrar toda la página, solo bloqueamos el contenedor del chat
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.innerHTML = `<div style="padding: 50px; text-align: center; color: #ff4757; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
                <i class="fas fa-ban" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <h3 style="margin-bottom: 10px;">Acceso Restringido</h3>
                <p>${msg}</p>
            </div>`;
        }
    });

    // Función global para reportar (fuera del scope del socket para que el HTML la vea)
    window.reportMessage = function(id) {
        const reason = prompt("¿Por qué quieres reportar este mensaje?");
        if (reason) {
            socket.emit('report message', { id: id, reason: reason });
            alert("Gracias. El reporte ha sido enviado a los administradores.");
        }
    };
}