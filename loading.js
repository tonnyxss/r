// Mover todo este bloco de script para o final do <body>
// Configuração do alfabeto e tamanhos
const ALFABETO = '0123456789abcdefghijklmnopqrstuvwxyzçABCDEFGHIJKLMNOPQRSTUVWXYZãáõóéíú!@#$%^&*()_+-=[]{}|;:,.<>?`~';
const TAMANHO_ALFABETO = BigInt(ALFABETO.length);
const COMPRIMENTO_MIN = 4;
const COMPRIMENTO_MAX = 32;
const ITENS_POR_LOTE = 100;
const MAX_RESULTS_BUSCA = 3000;
let posicaoVirtual = BigInt(1);
let consultaBusca = '';
let resultadosBusca = [];
let indiceBuscaAtual = 0;
let debounceTimeout = null;
let itensCarregados = 0;

const totalPorComprimento = new Array(COMPRIMENTO_MAX + 1).fill(BigInt(0));
const indiceInicial = new Array(COMPRIMENTO_MAX + 1).fill(BigInt(0));
let indiceMaximo = BigInt(0);

for (let n = COMPRIMENTO_MIN; n <= COMPRIMENTO_MAX; n++) {
    totalPorComprimento[n] = TAMANHO_ALFABETO ** BigInt(n);
    indiceInicial[n] = indiceMaximo;
    indiceMaximo += totalPorComprimento[n];
}

function escaparHTML(str) {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;');
}

function indiceParaSenha(indice) {
    if (indice < 1n) return '';
    let idx = indice - 1n;
    let comprimento = COMPRIMENTO_MIN;
    while (comprimento <= COMPRIMENTO_MAX && idx >= totalPorComprimento[comprimento]) {
        idx -= totalPorComprimento[comprimento];
        comprimento++;
    }
    if (comprimento > COMPRIMENTO_MAX) return '';
    let caracteres = [];
    for (let i = 0; i < comprimento; i++) {
        caracteres.unshift(ALFABETO[Number(idx % TAMANHO_ALFABETO)]);
        idx /= TAMANHO_ALFABETO;
    }
    return caracteres.join('');
}

function senhaParaIndice(senha) {
    const comprimento = senha.length;
    if (comprimento < COMPRIMENTO_MIN || comprimento > COMPRIMENTO_MAX) return null;
    if (!senha.split('').every(c => ALFABETO.includes(c))) return null;
    let idx = BigInt(0);
    for (let c of senha) {
        idx = idx * TAMANHO_ALFABETO + BigInt(ALFABETO.indexOf(c));
    }
    return indiceInicial[comprimento] + idx + 1n;
}

function gerarSenhasComTermo(termo) {
    const resultados = [];
    const seen = new Set();
    for (let comprimento = COMPRIMENTO_MIN; comprimento <= COMPRIMENTO_MAX && resultados.length < MAX_RESULTS_BUSCA; comprimento++) {
        for (let posicao = 0; posicao <= comprimento - termo.length && resultados.length < MAX_RESULTS_BUSCA; posicao++) {
            const prefixo = 'a'.repeat(posicao);
            const sufixo = 'a'.repeat(comprimento - posicao - termo.length);
            const base = prefixo + termo + sufixo;
            const variar = (str, pos) => {
                if (resultados.length >= MAX_RESULTS_BUSCA) return;
                if (pos >= str.length) {
                    if (str.includes(termo) && !seen.has(str)) { // Garante que a senha gerada contém o termo
                        const indice = senhaParaIndice(str);
                        if (indice) {
                            resultados.push({ indice, senha: str });
                            seen.add(str);
                        }
                    }
                    return;
                }
                if (pos < posicao || pos >= posicao + termo.length) { // Varia apenas fora do termo
                    for (let c of ALFABETO) {
                        const novaStr = str.substring(0, pos) + c + str.substring(pos + 1);
                        variar(novaStr, pos + 1);
                    }
                } else { // Não varia caracteres que fazem parte do termo
                    variar(str, pos + 1);
                }
            };
            variar(base, 0);
        }
    }
    resultados.sort((a, b) => (a.indice < b.indice ? -1 : 1));
    return resultados;
}

function destacarBusca(texto) {
    if (!consultaBusca) return escaparHTML(texto);
    const termoEscapado = escaparHTML(consultaBusca);
    const textoEscapado = escaparHTML(texto);
    return textoEscapado.replace(new RegExp(termoEscapado, 'gi'), match => `<span style="background:#4a5c5e">${match}</span>`);
}

function copiarSenha(senhaEscapada, indice) {
    const senha = senhaEscapada
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    navigator.clipboard.writeText(senha).then(() => {
        const item = document.querySelectorAll('.item-senha')[indice];
        if (item) {
            const span = item.querySelector('.senha');
            span.innerHTML = '<span class="copiado">Copiado!</span>';
            setTimeout(() => {
                span.innerHTML = destacarBusca(senha);
            }, 1000);
        }
    });
}

function atualizarLista(append = false) {
    const lista = document.getElementById('lista-senhas');
    if (!append) {
        lista.innerHTML = '';
        itensCarregados = 0;
    }

    let itens = [];
    if (consultaBusca) {
        itens = resultadosBusca.slice(itensCarregados, itensCarregados + ITENS_POR_LOTE);
    } else {
        const inicio = posicaoVirtual + BigInt(itensCarregados);
        for (let i = 0; i < ITENS_POR_LOTE; i++) {
            let indice = inicio + BigInt(i);
            if (indice > indiceMaximo) break;
            itens.push({
                indice,
                senha: indiceParaSenha(indice),
            });
        }
    }

    itens.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'item-senha';
        const senhaEscapada = escaparHTML(item.senha);
        div.innerHTML = `
            <span>${String(item.indice).padStart(10, '0')}</span>
            <span class="senha coluna-senha" data-valor="${senhaEscapada}">${destacarBusca(item.senha)}</span>
            <span class="caracteres">${item.senha.length}</span>
            <button onclick="copiarSenha('${senhaEscapada}', ${itensCarregados + idx})" title="Copiar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d9d9d9" stroke-width="2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
            </button>
        `;
        lista.appendChild(div);
    });

    itensCarregados += itens.length;
    setTimeout(destacarSenhasEncontradas, 0);
}

function destacarSenhasEncontradas() {
    const entradaBusca = document.getElementById('entrada-busca');
    const busca = entradaBusca.value.trim();

    const senhasVisiveis = document.querySelectorAll('.item-senha');

    senhasVisiveis.forEach(itemSenhaDiv => {
        const senhaSpan = itemSenhaDiv.querySelector('.coluna-senha');
        if (senhaSpan) {
            const senhaCompletaOriginal = senhaSpan.dataset.valor;
            
            itemSenhaDiv.classList.remove('senha-encontrada');

            if (busca !== '' && senhaCompletaOriginal === busca) {
                itemSenhaDiv.classList.add('senha-encontrada');
            }
        }
    });
}

function configurarBusca() {
    const entrada = document.getElementById('entrada-busca');
    entrada.oninput = () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            consultaBusca = entrada.value.trim();
            resultadosBusca = [];
            if (consultaBusca) {
                resultadosBusca = gerarSenhasComTermo(consultaBusca);
            }
            indiceBuscaAtual = 0;
            posicaoVirtual = resultadosBusca.length ? resultadosBusca[0].indice : 1n;
            atualizarLista();
        }, 600); // tempo pra localizar senha
    };
}

function configurarTeclado() {
    document.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key) && !consultaBusca) {
            if (e.key === 'ArrowUp') posicaoVirtual = posicaoVirtual > 1n ? posicaoVirtual - 1n : 1n;
            if (e.key === 'ArrowDown') posicaoVirtual += 1n;
            if (e.key === 'Home') posicaoVirtual = 1n;
            if (e.key === 'End') posicaoVirtual = indiceMaximo - BigInt(ITENS_POR_LOTE);
            atualizarLista();
            e.preventDefault();
        }
    });
}

function configurarRolagem() {
    const sentinela = document.getElementById('sentinela');
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            atualizarLista(true);
        }
    }, { threshold: 0.1 });
    observer.observe(sentinela);

    const container = document.querySelector('.lista-container');
    container.onwheel = (e) => {
        if (consultaBusca) return;
        posicaoVirtual += BigInt(e.deltaY > 0 ? 1 : -1);
        if (posicaoVirtual < 1n) posicaoVirtual = 1n;
        if (posicaoVirtual > indiceMaximo) {
            posicaoVirtual = indiceMaximo;
        }
        atualizarLista();
        e.preventDefault();
    };
}

// === Funções para o Loading Animado (AGORA PURAMENTE VISUAL E SEPARADA) ===
let visualLoadingInterval;
const VISUAL_LOADING_DURATION_MS = 1829; // 2 segundos
const VISUAL_UPDATE_INTERVAL_MS = 121; // Suavidade

function startVisualLoadingAnimation() {
    const loadingProgressSpan = document.getElementById('loading-progress');
    const loadingOverlay = document.getElementById('loading');

    // Depuração: Verifique se os elementos são encontrados
    console.log("--> startVisualLoadingAnimation chamada.");
    console.log("--> Elemento loading-progress:", loadingProgressSpan);
    console.log("--> Elemento loading-overlay:", loadingOverlay);

    if (!loadingProgressSpan || !loadingOverlay) {
        console.error("ERRO GRAVE: Elemento(s) de loading não encontrado(s). Iniciando site imediatamente.");
        initializeSiteLogic(); // Fallback imediato
        return;
    }

    let startTime = Date.now();
    loadingProgressSpan.textContent = '[0%]'; // Garante o estado inicial

    visualLoadingInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        let progress = Math.min(1, elapsedTime / VISUAL_LOADING_DURATION_MS);
        
        let percentage = Math.floor(progress * 100);
        percentage = Math.max(0, Math.min(100, percentage)); // Clampa entre 0 e 100

        loadingProgressSpan.textContent = `[${percentage}%]`;

        // Depuração: Veja o progresso no console
        // console.log(`Progress: ${percentage}%`); 

        if (elapsedTime >= VISUAL_LOADING_DURATION_MS) {
            clearInterval(visualLoadingInterval);
            loadingProgressSpan.textContent = '[100%]'; // Garante o 100% final
            console.log("--> Animação de loading visual concluída. Escondendo overlay e iniciando lógica.");
            
            loadingOverlay.style.display = 'none'; 
            initializeSiteLogic(); // Chama a função que inicia o resto do seu script
        }
    }, VISUAL_UPDATE_INTERVAL_MS);
}

// Esta função agora contém toda a lógica de inicialização do seu site
function initializeSiteLogic() {
    console.log("--> Iniciando a lógica principal do site...");
    configurarBusca();
    configurarTeclado();
    configurarRolagem();
    atualizarLista(); // Esta chamada vai carregar os primeiros itens na lista
}

// A execução da animação de loading agora é controlada diretamente
// sem depender do 'DOMContentLoaded' aqui, pois o script já está no final do body.
// Isso garante que o DOM completo já está disponível.
startVisualLoadingAnimation(); // Chame a função diretamente aqui.