const modulosDB = [
    { id: 1, marca: "ASTRONERGY", modelo: "CHSM72N(DG)F-BH-575W", potencia: 575, vmppt: 42.94, imppt: 13.39, voc: 51.10, isc: 14.19 }
];

const inversoresDB = [
    {id: 1, marca: "DEYE", modelo: "SUN-5K-G05P1-EU-AM", potenciaNominal: 5, maxInput: 7.5, vInMax: 550, iInMax: 27, iOut: 25}
];

const irradianciaMensal = [
  { mes: "Jan", valor: 6.34 },
  { mes: "Fev", valor: 5.78 },
  { mes: "Mar", valor: 4.81 },
  { mes: "Abr", valor: 3.79 },
  { mes: "Mai", valor: 2.78 },
  { mes: "Jun", valor: 2.32 },
  { mes: "Jul", valor: 2.52 },
  { mes: "Ago", valor: 3.20 },
  { mes: "Set", valor: 3.58 },
  { mes: "Out", valor: 4.73 },
  { mes: "Nov", valor: 6.19 },
  { mes: "Dez", valor: 6.63 },
];

// const irradianciaMedia = irradianciaMensal.reduce((acc, curr) => acc + curr.valor, 0) / irradianciaMensal.length;

// 1. Lógica de Login Simples
function fazerLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // Autenticação simples (Front-end apenas para demonstração)
    if (user === "admin" && pass === "1234") {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-screen').classList.remove('hidden');
        carregarModulos(); // Carrega a lista quando logar
        carregarInversores(); // Também carrega a lista de inversores
    } else {
        const errorMsg = document.getElementById('error-msg');
        errorMsg.style.display = 'block';
    }
}

function sair() {
    document.getElementById('app-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
}

// 2. Preencher o Dropdown de Módulos e Inversores dinamicamente

function carregarModulos() {
    const select = document.getElementById('select-modulo');
    select.innerHTML = ""; // Limpa antes de preencher

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.text = 'Selecione o módulo';
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);

    modulosDB.forEach(modulo => {
        const option = document.createElement('option');
        option.value = modulo.id;
        option.text = `${modulo.potencia}W - ${modulo.marca} - ${modulo.modelo}`;
        select.appendChild(option);
    });
}

function carregarInversores() {
    const select = document.getElementById('select-inversor');
    select.innerHTML = ""; // Limpa antes de preencher

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.text = 'Selecione o inversor';
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);

    inversoresDB.forEach(inversor => {
        const option = document.createElement('option');
        option.value = inversor.id;
        option.text = `${inversor.potenciaNominal}KW - ${inversor.marca} - ${inversor.modelo}`;
        select.appendChild(option);
    });
}

// 3. O Cálculo de Engenharia (A mágica)

function atualizarConsumoMedio() {
  const inputsConsumo = document.querySelectorAll('.consumo');

  let somaConsumoKwh = 0;
  let quantidadeMeses = 0;

  inputsConsumo.forEach(inputConsumo => {
    const consumoKwh = Number(inputConsumo.value);

    if (inputConsumo.value !== '' && !isNaN(consumoKwh)) {
      somaConsumoKwh += consumoKwh;
      quantidadeMeses++;
    }
  });

  const consumoMedio =
    quantidadeMeses > 0 ? somaConsumoKwh / quantidadeMeses : 0;

  const outputConsumo = document.getElementById('consumoMedio');
  if (outputConsumo) {
    outputConsumo.textContent = consumoMedio.toFixed(1);
  }

    const energiaDiaria = consumoMedio / 30;

    // Orientação e perda (padrão 6% quando não selecionado)
    const orientacao = document.getElementById('select-orientacao').value;
    let perda = 0.06;
    if (orientacao === 'norte') perda = 0;
    else if (orientacao === 'nLesteNOeste') perda = 0.06;
    else if (orientacao === 'lesteOeste') perda = 0.12;

    const irradianciaMedia = 4.39;

    const potenciaSugerida = (energiaDiaria * (1 + perda) / (irradianciaMedia * 0.8));

    const outputPotencia = document.getElementById('potenciaSugerida');
  if (outputPotencia) {
    outputPotencia.textContent = potenciaSugerida.toFixed(2);
  }
}

const inputsConsumo = document.querySelectorAll('.consumo');

inputsConsumo.forEach(input => {
  input.addEventListener('input', atualizarConsumoMedio);
});

atualizarConsumoMedio();

    // Busca o objeto do módulo selecionado no "Banco de Dados"
    // const modulo = modulosDB.find(m => m.id === idModuloSelecionado);
