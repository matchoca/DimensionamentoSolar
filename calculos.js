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

carregarModulos();
carregarInversores();
atualizarTudo();