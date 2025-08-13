let currentURL = '';
let shareLink = '';

function carregarPagina() {
    const urlInput = document.getElementById('antonio_url');
    const url = urlInput.value.trim();

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

function recarregar() {
    const frame = document.getElementById('antonio-frame');
    if (frame.src && frame.src !== 'about:blank') {
        frame.contentWindow.location.reload(true);
        showAntonioMessage('Página atualizada!', 'success');
    } else {
        showAntonioMessage('Nenhuma página para atualizar.', 'error');
    }
}

function copiarURL() {
    if (shareLink) {
        navigator.clipboard.writeText(shareLink).then(() => {
            showAntonioMessage('URL copiada para a área de transferência!', 'success');
        }).catch(err => {
            console.error('Erro ao copiar URL: ', err);
            showAntonioMessage('Falha ao copiar a URL.', 'error');
        });
    } else {
        showAntonioMessage('Nenhuma URL para copiar.', 'error');
    }
}

function limpar() {
    document.getElementById('antonio_url').value = '';
    document.getElementById('antonio-frame').src = 'about:blank';
    document.getElementById('antonio-content').style.overflow = 'hidden';
    currentURL = '';
    shareLink = '';
    window.history.pushState({}, '', window.location.pathname);
    showAntonioMessage('Campo e página limpos.', 'success');
}

function showAntonioMessage(message, type) {
    const msgDiv = document.getElementById('antonio-message');
    if (!msgDiv) return;
    
    msgDiv.textContent = message;
    msgDiv.className = ''; // Limpa classes antigas
    msgDiv.classList.add('show', type === 'success' ? 'antonio-success' : 'antonio-error');

    setTimeout(() => {
        msgDiv.classList.remove('show');
    }, 3000);
}

window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('id');
    if (encoded) {
        try {
            const url = atob(encoded);
            document.getElementById('antonio_url').value = url;
            carregarPagina();
        } catch (error) {
            showAntonioMessage('ID inválido ou URL não encontrada.', 'error');
            document.getElementById('antonio-content').style.overflow = 'hidden';
        }
    } else {
        document.getElementById('antonio-content').style.overflow = 'hidden';
    }

    document.getElementById('antonio_url').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            carregarPagina();
        }
    });
};

/* ===== Proteção contra inspeção ===== */

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === 'U')) {
        e.preventDefault();
    }
});

let devToolsDetectado = false;
const verificador = setInterval(function() {
    // Se já foi detectado, não faz mais nada aqui.
    if (devToolsDetectado) {
        clearInterval(verificador);
        return;
    }

    // Condição para detectar o DevTools aberto
    const devToolsAberto = window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160;

    if (devToolsAberto) {
        devToolsDetectado = true;
        
        // 1. Limpa a tela para mostrar a mensagem de aviso
        document.body.innerHTML = `
            <div style="width:100%; height:100vh; display:flex; align-items:center; justify-content:center; background-color:#111;">
                <h1 style="color:red; font-size:40px; text-align:center; font-family:sans-serif;">
                    <b>Tá caçando problema?<br><br>Vai acabar encontrando! :D</b>
                </h1>
            </div>
        `;

        // 2. ALTERNATIVA FINAL: Em vez de tentar fechar, prende o DevTools num loop de depuração.
        // Isso torna a ferramenta de desenvolvimento completamente inutilizável.
        setInterval(function() {
            debugger;
        }, 50);
    }
}, 500);