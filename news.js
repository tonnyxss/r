let currentURL = '';
let shareLink = '';

function carregarPagina() {
    const url = document.getElementById('antonio_url').value.trim();
    if (!url) {
        showAntonioMessage('Por favor, insira uma URL.', 'error');
        return;
    }
    const encoded = btoa(url);
    currentURL = url;
    shareLink = `${window.location.origin}${window.location.pathname}?id=${encoded}`;
    document.getElementById('antonio-frame').src = url;
    window.history.pushState({ encoded }, '', `?id=${encoded}`);
    document.getElementById('antonio-content').style.overflow = 'auto';
    showAntonioMessage('Página carregada com sucesso!', 'success');
}

function showAntonioMessage(message, type) {
    const msgDiv = document.getElementById('antonio-message');
    msgDiv.textContent = message;
    msgDiv.className = type;
    msgDiv.style.display = 'block';
    setTimeout(() => msgDiv.style.display = 'none', 5000);
}

window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('id');
    if (encoded) {
        try {
            const url = atob(encoded);
            document.getElementById('antonio_url').value = url;
            currentURL = url;
            shareLink = `${window.location.origin}${window.location.pathname}?id=${encoded}`;
            document.getElementById('antonio-frame').src = url;
            window.history.pushState({ encoded }, '', `?id=${encoded}`);
            document.getElementById('antonio-content').style.overflow = 'auto';
        } catch (error) {
            showAntonioMessage('ID inválido ou URL não encontrada.', 'error');
        }
    } else {
        document.getElementById('antonio-content').style.overflow = 'hidden';
    }

    // Listener para carregar no Enter
    document.getElementById('antonio_url').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            carregarPagina();
        }
    });
};

/* ===== Proteção contra inspeção ===== */

// Bloquear botão direito
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    alert('Função desativada neste site.');
});

// Bloquear F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && ['I','J'].includes(e.key.toUpperCase())) || 
        (e.ctrlKey && e.key.toUpperCase() === 'U')) {
        e.preventDefault();
        alert('Ação bloqueada neste site.');
    }
});

// Detectar abertura do DevTools
setInterval(function() {
    if (window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200) {
        document.head.innerHTML = '';
        document.body.innerHTML = `
            <h1 style="
                color:red;
                font-size:40px;
                text-align:center;
                margin-top:50px;
                font-family:sans-serif;">
                <b>Tá caçando problema?<br><br>Vai acabar encontrando! :D</b>
            </h1>
        `;
    }
}, 500);
