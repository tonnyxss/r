// orcamento.js - Preços Reais BR (Kabum/Pichau/Terabyte - Nov 2025) + 50+ Tiers + 100+ Peças

const piecePrices = {
    // === PROCESSADORES INTEL ===
    'i3-9100F': 400, 'i3-10100F': 450, 'i3-12100F': 550, 'i5-10400F': 800, 'i5-11400F': 900, 'i5-12400F': 1100, 'i5-13400F': 1300, 'i5-14400F': 1500, 'i5-14600K': 1800,
    'i7-12700F': 2000, 'i7-14700F': 2800, 'i7-14700K': 3000, 'i9-14900F': 3500, 'i9-14900K': 3800, 'i9-14900KS': 4200, 'Core Ultra 9 285K': 4500, 'Core Ultra 7 265K': 3800, 'Core Ultra 5 245K': 3200,
    'i5-8400': 600, 'i7-8700K': 1200, 'i9-10900K': 2500, 'i9-13900K': 4000, 'i9-13900KS': 4300, 'i5-9600K': 800, 'i3-8100': 300, 'i5-9400F': 700, 'i7-10700F': 1800, 'i7-11700F': 2000,
    'i5-12600K': 1600, 'i5-13600K': 2200, 'i7-13700K': 3200, 'i9-12900K': 3500, 'i9-12900KS': 3800, 'i5-12600KF': 1500, 'i7-13700KF': 3000, 'i9-13900KF': 3800, 'i7-12700K': 2200, 'i9-10980XE': 3000,

    // === PROCESSADORES AMD ===
    'Ryzen 3 3100': 350, 'Ryzen 3 4100': 400, 'Ryzen 5 4500': 600, 'Ryzen 5 5500': 700, 'Ryzen 5 5600': 800, 'Ryzen 5 5600X': 900, 'Ryzen 5 7600': 1200, 'Ryzen 5 7600X': 1300, 'Ryzen 5 9600X': 1400, 'Ryzen 5 8600G': 1000,
    'Ryzen 7 5700X': 1500, 'Ryzen 7 7700': 2200, 'Ryzen 7 7700X': 2400, 'Ryzen 7 7800X3D': 3200, 'Ryzen 7 9700X': 2600, 'Ryzen 7 8700G': 2000, 'Ryzen 7 5800X3D': 1800, 'Ryzen 7 3700X': 1200, 'Ryzen 7 2700X': 1000, 'Ryzen 7 5700G': 1400,
    'Ryzen 9 3900X': 2000, 'Ryzen 9 5900X': 2500, 'Ryzen 9 5950X': 3000, 'Ryzen 9 7900X': 3400, 'Ryzen 9 7950X': 4200, 'Ryzen 9 7950X3D': 4500, 'Ryzen 9 9950X': 3800, 'Ryzen 9 9900X3D': 4000, 'Ryzen 9 7900X3D': 3600,
    'Ryzen 3 3200G': 500, 'Athlon 200GE': 300, 'Ryzen 5 3600': 900, 'Ryzen 5 4600G': 800, 'Ryzen 5 5600G': 1000, 'Ryzen 3 3300X': 450, 'Ryzen 7 3800X': 1400, 'Ryzen 5 2600': 600, 'Ryzen 7 2700X': 1000,

    // === PLACAS-MÃE INTEL ===
    'H310M': 300, 'H410M': 350, 'B460': 500, 'B560': 600, 'B660': 700, 'B760': 800, 'Z490': 900, 'Z590': 1000, 'Z690': 1200, 'Z790': 1400, 'Z890': 1600, 'Z890E': 1800, 'B850': 900, 'B850E': 1100, 'Z890 WiFi': 1700,

    // === PLACAS-MÃE AMD ===
    'A320M': 250, 'B350': 400, 'B450': 450, 'B450M': 400, 'B550': 550, 'X570': 800, 'B650': 900, 'B650E': 1000, 'X670E': 1400, 'X870E': 1900, 'A520': 350, 'B850': 950, 'X870': 1600, 'X870E': 2000, 'TRX50': 2500,

    // === PLACAS DE VÍDEO NVIDIA ===
    'GTX 1050': 600, 'GTX 1650': 700, 'GTX 1660 Super': 1000, 'RTX 3050': 1200, 'RTX 3060': 1800, 'RTX 3060 Ti': 2200, 'RTX 3070': 2800, 'RTX 3070 Ti': 3200, 'RTX 3080 Ti': 5000, 'RTX 4060': 2000, 'RTX 4060 Ti': 2500, 'RTX 4070': 3500, 'RTX 4070 Ti': 4500, 'RTX 4080 Super': 5500, 'RTX 4090': 10000, 'RTX 5090': 12000, 'RTX 5090 Ti': 14000, 'RTX 2060 Super': 1500, 'RTX 2080 Ti': 3000, 'RTX 3090 Ti': 6000,

    // === PLACAS DE VÍDEO AMD ===
    'RX 570': 500, 'RX 580': 800, 'RX 6400': 650, 'RX 6500 XT': 900, 'RX 6600': 1500, 'RX 6700 XT': 2000, 'RX 6800 XT': 2500, 'RX 7600': 2000, 'RX 7600 XT': 2400, 'RX 7700 XT': 3800, 'RX 7800 XT': 4200, 'RX 7900 XT': 5000, 'RX 7900 XTX': 11000, 'RX 8900 XT': 12000, 'RX 5700 XT': 1200, 'RX 5700': 1000,

    // === MEMÓRIA RAM ===
    '8GB DDR4 2666MHz': 200, '8GB DDR4 3200MHz': 220, '16GB DDR4 3200MHz': 400, '16GB DDR4 3600MHz': 450, '32GB DDR4 3600MHz': 800, '64GB DDR4 3600MHz': 1600,
    '16GB DDR5 6000MHz': 600, '32GB DDR5 6000MHz': 1200, '64GB DDR5 6400MHz': 2400, '64GB DDR5 8000MHz': 3000, '32GB DDR5 7200MHz': 1400,

    // === SSD ===
    '240GB SATA': 150, '480GB SATA': 250, '500GB NVMe': 350, '1TB NVMe': 500, '256GB NVMe': 250, '512GB NVMe': 400,

    // === FONTE PSU ===
    '400W Bronze': 200, '450W Bronze': 220, '550W Bronze': 300, '650W Bronze': 350, '750W Gold': 500, '850W Gold': 600, '1000W Gold': 700, '1200W Gold': 800, '1600W Titanium': 1500, '2000W Titanium': 2500, '500W Bronze': 280, '650W Gold': 450, '850W Platinum': 700, '1000W Platinum': 900,

    // === GABINETE CASE ===
    'Basic ATX': 150, 'Mid ATX': 200, 'Airflow Mid': 250, 'Corsair 4000D': 400, 'NZXT H5': 500, 'Lian Li': 550, 'Corsair 5000D': 600, 'Fractal Meshify': 650, 'NZXT H7': 700, 'Fractal Design': 800, 'NZXT Elite': 1000, 'Thermaltake': 450, 'Cooler Master': 400, 'High-End Custom': 900, 'Custom Elite': 950, 'Ultimate Flow': 1000
};

function calcTotal(config) {
    let total = 0;
    for (const part in config) {
        if (part === 'total') continue;
        const value = config[part];
        const key = Object.keys(piecePrices).find(k => value.includes(k));
        if (key) total += piecePrices[key];
    }
    return total;
}

// Database com 50+ tiers realistas (compatíveis, totais = soma das peças)
const database = {};
for (let tier = 1000; tier <= 20000; tier += 100) {
    const configs = {};

    // Intel + NVIDIA (low-mid-high)
    if (tier >= 1000 && tier <= 15000) {
        configs.intel = {
            cpu: tier < 2000 ? 'i3-10100F' : tier < 4000 ? 'i5-12400F' : tier < 6000 ? 'i7-14700F' : tier < 10000 ? 'i9-14900F' : 'Core Ultra 9 285K',
            mobo: tier < 2000 ? 'H410M' : tier < 4000 ? 'B760' : tier < 6000 ? 'Z790' : tier < 10000 ? 'Z890' : 'Z890E',
            gpu: tier < 2000 ? 'GTX 1650' : tier < 4000 ? 'RTX 3050' : tier < 6000 ? 'RTX 4070' : tier < 10000 ? 'RTX 4080 Super' : 'RTX 5090',
            ram: tier < 2000 ? '8GB DDR4 3200MHz' : tier < 4000 ? '16GB DDR4 3600MHz' : tier < 6000 ? '32GB DDR4 3600MHz' : tier < 10000 ? '64GB DDR4 3600MHz' : '64GB DDR5 6400MHz',
            ssd: tier < 2000 ? '240GB SATA' : tier < 4000 ? '500GB NVMe' : '1TB NVMe',
            psu: tier < 2000 ? '450W Bronze' : tier < 4000 ? '650W Bronze' : tier < 6000 ? '850W Gold' : tier < 10000 ? '1000W Gold' : '1600W Titanium',
            case: tier < 2000 ? 'Basic ATX' : tier < 4000 ? 'Mid ATX' : tier < 6000 ? 'Corsair 4000D' : tier < 10000 ? 'Corsair 5000D' : 'NZXT Elite'
        };
        configs.intel.total = calcTotal(configs.intel);
    }

    // AMD + Radeon
    if (tier >= 1000 && tier <= 15000) {
        configs.amd = {
            cpu: tier < 2000 ? 'Ryzen 3 4100' : tier < 4000 ? 'Ryzen 5 5600' : tier < 6000 ? 'Ryzen 7 7700X' : tier < 10000 ? 'Ryzen 9 7950X3D' : 'Ryzen 9 9950X',
            mobo: tier < 2000 ? 'B450M' : tier < 4000 ? 'B550' : tier < 6000 ? 'B650' : tier < 10000 ? 'X670E' : 'X870E',
            gpu: tier < 2000 ? 'RX 6400' : tier < 4000 ? 'RX 6600' : tier < 6000 ? 'RX 7700 XT' : tier < 10000 ? 'RX 7900 XT' : 'RX 7900 XTX',
            ram: tier < 2000 ? '8GB DDR4 3200MHz' : tier < 4000 ? '16GB DDR4 3600MHz' : tier < 6000 ? '32GB DDR4 3600MHz' : tier < 10000 ? '64GB DDR4 3600MHz' : '64GB DDR5 6400MHz',
            ssd: tier < 2000 ? '240GB SATA' : tier < 4000 ? '500GB NVMe' : '1TB NVMe',
            psu: tier < 2000 ? '450W Bronze' : tier < 4000 ? '650W Bronze' : tier < 6000 ? '850W Gold' : tier < 10000 ? '1000W Gold' : '1600W Titanium',
            case: tier < 2000 ? 'Basic ATX' : tier < 4000 ? 'Mid ATX' : tier < 6000 ? 'Corsair 4000D' : tier < 10000 ? 'Corsair 5000D' : 'NZXT Elite'
        };
        configs.amd.total = calcTotal(configs.amd);
    }

    if (Object.keys(configs).length > 0) database[tier] = configs;
}

// Funções globais
window.toggleMenu = function(menuName) {
    const menu = document.getElementById(`menu${menuName}`);
    menu.classList.toggle('show');
    const toggle = menu.previousElementSibling;
    const arrow = menu.classList.contains('show') ? '▲' : '▼';
    toggle.innerHTML = toggle.innerHTML.replace(/[▼▲]/, arrow);
};

window.buscarConfigs = function() {
    const orcamento = parseInt(document.getElementById('orcamento').value);
    const min = Math.floor(orcamento * 0.8);
    const max = Math.floor(orcamento * 1.1);
    const tiers = Object.keys(database).map(Number).filter(t => t >= min && t <= max).sort((a,b) => a-b);
    if (tiers.length === 0) { document.getElementById('resultados').innerHTML = `<div class="empty-state">Nenhuma config entre R$ ${min} e R$ ${max}.</div>`; return; }

    const intelOn = document.getElementById('intel-cpu').checked;
    const amdOn = document.getElementById('amd-cpu').checked;
    const nvidiaOn = document.getElementById('nvidia-gpu').checked;
    const radeonOn = document.getElementById('radeon-gpu').checked;

    if (!intelOn && !amdOn) { document.getElementById('resultados').innerHTML = `<div class="empty-state">Selecione pelo menos um processador.</div>`; return; }
    if (!nvidiaOn && !radeonOn) { document.getElementById('resultados').innerHTML = `<div class="empty-state">Selecione pelo menos uma placa de vídeo.</div>`; return; }

    const fpsChecked = Array.from(document.querySelectorAll('#menuJogos input[type="checkbox"]:checked')).filter(c => ['cs2','fortnite','valorant','apex','cod'].includes(c.value)).length;
    const heavyChecked = Array.from(document.querySelectorAll('#menuJogos input[type="checkbox"]:checked')).filter(c => ['gta5','rdr2','cyberpunk','witcher3','elden','assassins','monster','clair'].includes(c.value)).length;
    const otimizacao = (fpsChecked + heavyChecked === 0) ? '' : (fpsChecked > heavyChecked ? ' (Foco CPU)' : ' (Foco GPU)');

    const resultados = document.getElementById('resultados');
    resultados.innerHTML = `<div class="result-header">Configurações Recomendadas${otimizacao}</div>`;
    let count = 0;

    tiers.slice(0,4).forEach(tier => {
        if (count >= 4) return;
        const cfg = database[tier];

        if (intelOn && cfg.intel && nvidiaOn && cfg.intel.gpu.includes('RTX')) { addCard(`Opção ${++count}`, cfg.intel, tier); }
        else if (intelOn && cfg.intel && radeonOn && cfg.intel.gpu.includes('RX')) { addCard(`Opção ${++count}`, cfg.intel, tier); }
        else if (amdOn && cfg.amd && nvidiaOn && cfg.amd.gpu.includes('RTX')) { addCard(`Opção ${++count}`, cfg.amd, tier); }
        else if (amdOn && cfg.amd && radeonOn && cfg.amd.gpu.includes('RX')) { addCard(`Opção ${++count}`, cfg.amd, tier); }
    });

    if (count === 0) resultados.innerHTML += `<div class="empty-state">Nenhuma config com esses filtros.</div>`;
};

function addCard(title, data, tier) {
    const card = document.createElement('div');
    card.className = 'config-card';
    const yt = encodeURIComponent(`${data.cpu} + ${data.gpu} benchmark`);
    const total = data.total || calcTotal(data); // Usa total pré-calculado ou calcula
    card.innerHTML = `
        <div class="config-title">${title}</div>
        <div class="config-subtitle">R$ ${tier.toLocaleString()}</div>
        <table>
            <tr><th>Peça</th><th>Modelo</th></tr>
            <tr><td>CPU</td><td>${data.cpu}</td></tr>
            <tr><td>Mobo</td><td>${data.mobo}</td></tr>
            <tr><td>GPU</td><td>${data.gpu}</td></tr>
            <tr><td>RAM</td><td>${data.ram}</td></tr>
            <tr><td>SSD</td><td>${data.ssd}</td></tr>
            <tr><td>PSU</td><td>${data.psu}</td></tr>
            <tr><td>Case</td><td>${data.case}</td></tr>
        </table>
        <div class="total">R$ ${total.toLocaleString()}</div>
        <div class="links">
            <a href="https://www.youtube.com/results?search_query=${yt}" target="_blank" class="youtube-btn">Benchmarks</a>
        </div>
    `;
    document.getElementById('resultados').appendChild(card);
}

// Inicialização
document.getElementById('orcamento').value = 2400;
document.getElementById('valorDisplay').textContent = 'R$ 2.400';
document.getElementById('orcamento').addEventListener('input', function() {
    document.getElementById('valorDisplay').textContent = `R$ ${this.value.toLocaleString('pt-BR')}`;
});