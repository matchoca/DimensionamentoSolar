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