// Função principal: é chamada toda vez que algo muda na tela
function atualizarTudo() {
atualizarConsumoMedio();
atualizarPotenciaSugerida();
}


// 1. Calcula o consumo médio com base nos inputs
function atualizarConsumoMedio() {
const inputs = document.querySelectorAll('.consumo');


let soma = 0;
let quantidade = 0;


inputs.forEach(input => {
const valor = Number(input.value);


if (input.value !== '' && !isNaN(valor)) {
soma += valor;
quantidade++;
}
});


const consumoMedio = quantidade > 0 ? soma / quantidade : 0;


// Mostra na tela
document.getElementById('consumoMedio').textContent = consumoMedio.toFixed(0);


// Guardamos o valor globalmente para outros cálculos
window.consumoMedioAtual = consumoMedio;

atualizarGrafico();
}


// 2. Calcula a potência sugerida com base no consumo
function atualizarPotenciaSugerida() {
const consumo = window.consumoMedioAtual || 0;


const energiaDiaria = consumo / 30;


const orientacao = document.getElementById('select-orientacao').value;


let perda = 0.06; // valor padrão
if (orientacao === 'norte') perda = 0;
else if (orientacao === 'lesteOeste') perda = 0.12;


const potenciaSugerida = (energiaDiaria * (1 + perda)) / (irradianciaMedia * 0.8);


document.getElementById('potenciaSugerida').textContent = potenciaSugerida.toFixed(2);
}


// 3. Conecta os eventos (quando o usuário digita, tudo atualiza)
const inputs = document.querySelectorAll('.consumo');
inputs.forEach(input => input.addEventListener('input', atualizarTudo));


const selectOrientacao = document.getElementById('select-orientacao');
selectOrientacao.addEventListener('change', atualizarTudo);

// 4. Calcula a potência real com base no módulo e quantidade
function atualizaPotenciaReal () {

    const selectModulo = document.getElementById('select-modulo');
    const selectInversor = document.getElementById('select-inversor');
    const inputQuantidadeModulos = document.getElementById('qtModulo');
    const inputQuantidadeInversor = document.getElementById('qtInversor');
    const outputPotenciaReal = document.getElementById('potenciaReal');
    const outputFDI = document.getElementById('fdi');
    const outputArea = document.getElementById('areaTotal');
    const outputPeso = document.getElementById('pesoM2');

    if (!selectModulo || !inputQuantidadeModulos || !selectInversor || !inputQuantidadeInversor || !outputPotenciaReal || !outputFDI || !outputArea || !outputPeso) return;

    const idModuloSelecionado = parseInt(selectModulo.value);
    const idInversorSelecionado = parseInt(selectInversor.value);
    const quantidadeModulos = Number(inputQuantidadeModulos.value);
    const quantidadeInversores = Number(inputQuantidadeInversor.value);

    const moduloSelecionado = modulosDB.find(m => m.id === idModuloSelecionado);

    if (!moduloSelecionado || isNaN(quantidadeModulos) || quantidadeModulos <= 0) {
        outputPotenciaReal.textContent = "0";
        return;
    }

    const potenciaReal = (moduloSelecionado.potencia * quantidadeModulos)/1000;

    const inversorSelecionado = inversoresDB.find(i => i.id === idInversorSelecionado);

     if (!inversorSelecionado || isNaN(quantidadeInversores) || quantidadeInversores <= 0) {
        outputFDI.textContent = "0";
        return;
    }

      const fdi = potenciaReal / (inversorSelecionado.potenciaNominal * quantidadeInversores);

      const areaTotal = moduloSelecionado.moduleHeight * moduloSelecionado.moduleWidth * quantidadeModulos;

    const pesoTotal = (moduloSelecionado.weight * quantidadeModulos) / areaTotal;
  
    outputPotenciaReal.textContent = potenciaReal.toFixed(2);
    outputFDI.textContent = fdi.toFixed(2);
    outputArea.textContent = areaTotal.toFixed(2);
    outputPeso.textContent = pesoTotal.toFixed(2);

    atualizarGrafico();

}

// 5. Conecta os eventos para potência real
const selectModulo = document.getElementById('select-modulo');
const selectInversor = document.getElementById('select-inversor');
const inputQuantidadeModulos = document.getElementById('qtModulo');
const inputQuantidadeInversor = document.getElementById('qtInversor');

if (selectModulo) {
    selectModulo.addEventListener('change', atualizaPotenciaReal);
}

if (selectInversor) {
    selectInversor.addEventListener('change', atualizaPotenciaReal);
}

if (inputQuantidadeModulos) {
    inputQuantidadeModulos.addEventListener('input', atualizaPotenciaReal);
}

if (inputQuantidadeInversor) {
    inputQuantidadeInversor.addEventListener('input', atualizaPotenciaReal);
}

// 6. Cria o grafico de consumo x geração

let grafico = null;

function atualizarGrafico() {

  const ctx = document.getElementById('graficoConsumoGeracao');
  if (!ctx) return;

  // ----- Consumo mensal vindo dos inputs -----
  const inputs = document.querySelectorAll('.consumo');
  const consumoMensal = Array.from(inputs).map(input =>
    Number(input.value) || 0
  );

  // ----- Potência real instalada -----
  const potenciaTexto = document.getElementById('potenciaReal').textContent;
  const potenciaInstalada = Number(potenciaTexto) || 0;

  // ----- Geração mensal estimada -----
  const geracaoMensal = irradianciaMensal.map(mes =>
    potenciaInstalada * mes.valor * 30 * 0.8
  );

  // ----- Meses -----
  const meses = irradianciaMensal.map(m => m.mes);

  // ----- Se gráfico já existe, só atualiza -----
  if (grafico) {
    grafico.data.labels = meses;
    grafico.data.datasets[0].data = consumoMensal;
    grafico.data.datasets[1].data = geracaoMensal;
    grafico.update();
    return;
  }

  // ----- Se ainda não existe, cria o gráfico -----
  grafico = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: meses,
      datasets: [
        {
          label: 'Consumo (kWh)',
          data: consumoMensal,
          backgroundColor: '#9e9e9e',
        borderColor: '#616161',
          borderWidth: 2,
          tension: 0.3
        },
        {
          label: 'Geração estimada (kWh)',
          data: geracaoMensal,
          backgroundColor: '#ff9800',
    borderColor: '#ef6c00',
          borderWidth: 2,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

carregarModulos();
carregarInversores();
atualizarTudo();