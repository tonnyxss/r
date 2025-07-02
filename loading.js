 // Configuração do alfabeto e tamanhos
        const ALFABETO = 'abcdefghijklmnopqrstuvwxyzçABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?`~';
        const TAMANHO_ALFABETO = BigInt(ALFABETO.length); // 93 caracteres
        const COMPRIMENTO_MIN = 8;
        const COMPRIMENTO_MAX = 32;
        const ITENS_POR_LOTE = 100; // Carrega 100 senhas por vez
        const MAX_RESULTADOS_BUSCA = 3000; // Limite de resultados da busca
        let posicaoVirtual = BigInt(1);
        let consultaBusca = '';
        let resultadosBusca = [];
        let indiceBuscaAtual = 0;
        let debounceTimeout = null;
        let itensCarregados = 0;

        // Calcula o número total de senhas
        const totalPorComprimento = new Array(COMPRIMENTO_MAX + 1).fill(BigInt(0));
        const indiceInicial = new Array(COMPRIMENTO_MAX + 1).fill(BigInt(0));
        let indiceMaximo = BigInt(0);
        for (let n = COMPRIMENTO_MIN; n <= COMPRIMENTO_MAX; n++) {
            totalPorComprimento[n] = TAMANHO_ALFABETO ** BigInt(n);
            indiceInicial[n] = indiceMaximo;
            indiceMaximo += totalPorComprimento[n];
        }

        // Escapa caracteres para HTML seguro
        function escaparHTML(str) {
            return str.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"').replace(/'/g, '');
        }

        // Converte índice global em senha
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

        // Converte senha em índice global
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

        // Gera senhas contendo o termo
        function gerarSenhasComTermo(termo) {
            const resultados = [];
            const seen = new Set();
            // Itera sobre comprimentos de 8 a 32
            for (let comprimento = COMPRIMENTO_MIN; comprimento <= COMPRIMENTO_MAX && resultados.length < MAX_RESULTADOS_BUSCA; comprimento++) {
                // Itera sobre posições onde o termo pode aparecer
                for (let posicao = 0; posicao <= comprimento - termo.length && resultados.length < MAX_RESULTADOS_BUSCA; posicao++) {
                    // Gera senhas com o termo fixo na posição
                    const prefixo = 'a'.repeat(posicao);
                    const sufixo = 'a'.repeat(comprimento - posicao - termo.length);
                    const base = prefixo + termo + sufixo;
                    // Varia os caracteres fora do termo
                    const variar = (str, pos, callback) => {
                        if (resultados.length >= MAX_RESULTADOS_BUSCA) return;
                        if (pos >= str.length) {
                            if (str.includes(termo) && !seen.has(str)) {
                                const indice = senhaParaIndice(str);
                                if (indice) {
                                    resultados.push({ indice, senha: str });
                                    seen.add(str);
                                }
                            }
                            return;
                        }
                        if (pos < posicao || pos >= posicao + termo.length) {
                            for (let c of ALFABETO) {
                                const novaStr = str.substring(0, pos) + c + str.substring(pos + 1);
                                variar(novaStr, pos + 1, callback);
                            }
                        } else {
                            variar(str, pos + 1, callback);
                        }
                    };
                    variar(base, 0, () => {});
                }
            }
            // Ordena por índice para manter continuidade
            resultados.sort((a, b) => (a.indice < b.indice ? -1 : 1));
            return resultados;
        }

        // Atualiza a lista de senhas
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
                    <span class="senha">${destacarBusca(item.senha)}</span>
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
            console.log(`Itens carregados: ${itensCarregados}`);
            // Esconde a tela de loading inicial
            document.getElementById('loading').style.display = 'none';
        }

        // Destaca o texto da busca
        function destacarBusca(texto) {
            if (!consultaBusca) return escaparHTML(texto);
            const termoEscapado = escaparHTML(consultaBusca);
            const textoEscapado = escaparHTML(texto);
            return textoEscapado.replace(new RegExp(termoEscapado, 'gi'), match => `<span style="background:#4a5c5e">${match}</span>`);
        }

        // Copia a senha
        function copiarSenha(senhaEscapada, indice) {
            const senha = senhaEscapada.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"').replace(/'/g, "'");
            navigator.clipboard.writeText(senha).then(() => {
                const item = document.querySelectorAll('.item-senha')[indice];
                const span = item.querySelector('.senha');
                span.innerHTML = '<span class="copiado">Copiado!</span>';
                setTimeout(() => {
                    span.innerHTML = destacarBusca(senha);
                }, 1000);
                console.log(`Senha copiada: ${senha}`);
            });
        }

        // Configura a busca
        function configurarBusca() {
            const entrada = document.getElementById('entrada-busca');
            const botaoAnterior = document.getElementById('botao-anterior');
            const botaoProximo = document.getElementById('botao-proximo');
            const botaoLimpar = document.getElementById('botao-limpar');

            entrada.oninput = () => {
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => {
                    consultaBusca = entrada.value.trim();
                    resultadosBusca = [];
                    if (consultaBusca) {
                        resultadosBusca = gerarSenhasComTermo(consultaBusca);
                        console.log(`Busca por "${consultaBusca}": ${resultadosBusca.length} resultados`, resultadosBusca.slice(0, 5));
                    }
                    indiceBuscaAtual = 0;
                    posicaoVirtual = resultadosBusca.length ? resultadosBusca[0].indice : 1n;
                    atualizarLista();
                }, 300);
            };

            botaoAnterior.onclick = () => {
                if (resultadosBusca.length) {
                    indiceBuscaAtual = (indiceBuscaAtual - 1 + resultadosBusca.length) % resultadosBusca.length;
                    posicaoVirtual = resultadosBusca[indiceBuscaAtual].indice;
                    atualizarLista();
                }
            };

            botaoProximo.onclick = () => {
                if (resultadosBusca.length) {
                    indiceBuscaAtual = (indiceBuscaAtual + 1) % resultadosBusca.length;
                    posicaoVirtual = resultadosBusca[indiceBuscaAtual].indice;
                    atualizarLista();
                }
            };

            botaoLimpar.onclick = () => {
                entrada.value = '';
                consultaBusca = '';
                resultadosBusca = [];
                posicaoVirtual = 1n;
                indiceBuscaAtual = 0;
                atualizarLista();
            };
        }

        // Configura navegação por teclado
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

        // Configura rolagem infinita
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
                posicaoVirtual += BigInt(e.deltaY > 0 ? 10 : -10);
                if (posicaoVirtual < 1n) posicaoVirtual = 1n;
                if (posicaoVirtual > indiceMaximo - BigInt(ITENS_POR_LOTE)) {
                    posicaoVirtual = indiceMaximo - BigInt(ITENS_POR_LOTE);
                }
                atualizarLista();
            };
        }

        // Inicializa todos scripts
        configurarBusca();
        configurarTeclado();
        configurarRolagem();
        atualizarLista();
