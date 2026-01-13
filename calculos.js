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
document.getElementById('consumoMedio').textContent = consumoMedio.toFixed(1);


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


// Calcula uma vez ao carregar a página
atualizarTudo();