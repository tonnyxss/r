let currentURL = '';
let shareLink = '';
let messageTimeout; // Variável para controlar o timer da mensagem

function carregarPagina() {
    const urlInput = document.getElementById('antonio_url');
    let url = urlInput.value.trim();

    if (!url) {
        showAntonioMessage('Por favor, insira uma URL.', 'error');
        return;
    }
    
    // Adiciona https:// se não houver protocolo
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
        urlInput.value = url;
    }

    try {
        const encoded = btoa(url);
        currentURL = url;
        shareLink = `${window.location.origin}${window.location.pathname}?id=${encoded}`;

        document.getElementById('antonio-frame').src = url;
        window.history.pushState({ encoded }, '', `?id=${encoded}`);
        document.getElementById('antonio-content').style.overflow = 'auto';
        showAntonioMessage('Página carregada com sucesso!', 'success');
    } catch (e) {
        showAntonioMessage('URL inválida.', 'error');
        console.error("Erro ao codificar URL:", e);
    }
}

function recarregar() {
    const frame = document.getElementById('antonio-frame');
    if (frame.src && frame.src !== 'about:blank') {
        // Maneira correta de recarregar um iframe de outro domínio
        frame.src = frame.src;
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

    // Limpa qualquer timer anterior para evitar que a mensagem suma antes da hora
    clearTimeout(messageTimeout);

    // Define o texto da mensagem
    msgDiv.textContent = message;

    // Remove apenas as classes de cor antigas, preservando outras
    msgDiv.classList.remove('antonio-success', 'antonio-error');

    // Adiciona a nova classe de cor e a classe 'show' para fazê-la aparecer
    msgDiv.classList.add(type === 'success' ? 'antonio-success' : 'antonio-error');
    msgDiv.classList.add('show');

    // Define um novo timer para esconder a mensagem
    messageTimeout = setTimeout(() => {
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
            showAntonioMessage('ID inválido na URL.', 'error');
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

