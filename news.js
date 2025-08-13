        let currentURL = '';
        let shareLink = '';

        function showAntonioMessage(message, type = 'success') {
            const messageDiv = document.getElementById('antonio-message');
            messageDiv.classList.remove('antonio-success', 'antonio-error');
            if (type === 'error') {
                messageDiv.classList.add('antonio-error');
            } else {
                messageDiv.classList.add('antonio-success');
            }
            messageDiv.textContent = message;
            messageDiv.classList.add('show');
            setTimeout(() => {
                messageDiv.classList.remove('show');
            }, 5000); // agora 5 segundos
        }

        function carregarPagina() {
            const url = document.getElementById('antonio_url').value.trim();
            if (!url) {
                showAntonioMessage('Por favor, digite um URL válido.', 'error');
                return;
            }
            const encoded = btoa(url);
            currentURL = url;
            shareLink = `${window.location.origin}${window.location.pathname}?id=${encoded}`;
            document.getElementById('antonio-frame').src = url;
            window.history.pushState({ encoded }, '', `?id=${encoded}`);
            document.getElementById('antonio-content').style.overflow = 'auto';
            showAntonioMessage('Página carregada!', 'success');
        }

        function recarregar() {
            if (currentURL) {
                document.getElementById('antonio_url').value = currentURL;
                carregarPagina();
            }
        }

        function copiarURL() {
            if (shareLink) {
                navigator.clipboard.writeText(shareLink)
                    .then(() => showAntonioMessage('Link copiado!', 'success'));
            } else {
                showAntonioMessage('Nenhuma URL carregada.', 'error');
            }
        }

        function limpar() {
            document.getElementById('antonio_url').value = '';
            document.getElementById('antonio-frame').src = 'about:blank';
            currentURL = '';
            shareLink = '';
            window.history.pushState({}, '', window.location.pathname);
            document.getElementById('antonio-content').style.overflow = 'hidden';
            showAntonioMessage('Campos limpos!', 'success');
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
        };

        // Enter = carregarPagina()
        document.getElementById('antonio_url').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                carregarPagina();
            }
        });
    
	


/* Detectar abertura do DevTools e apagar conteúdo */
setInterval(function() {
    if (window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200) {
        document.head.innerHTML = ''; // Remove todos os estilos e scripts
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
}, 100);