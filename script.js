// --- MEMÓRIA DA INTERFACE ---
let generoEscolhido = 'M'; // Começa como Masculino por padrão
const audio = document.getElementById('myAudio');
const musicIcon = document.getElementById('musicIcon');

// --- 1. CONTROLE DO PLAYER DE MÚSICA ---
function togglePlay() {
    if (audio.paused) {
        audio.play();
        musicIcon.classList.remove('fa-play');
        musicIcon.classList.add('fa-pause');
    } else {
        audio.pause();
        musicIcon.classList.remove('fa-pause');
        musicIcon.classList.add('fa-play');
    }
}

window.onload = () => {
    // Tenta dar o play automático ao carregar
    audio.play().catch(() => {
        // Se o navegador bloquear, altera o ícone para o botão de Play
        musicIcon.classList.remove('fa-pause');
        musicIcon.classList.add('fa-play');
    });
};

// --- 2. COMUNICAÇÃO DE ENTRADA (PAWN -> CEF) ---
function login() {
    const pass = document.getElementById('login-pass').value;
    if (pass.length > 0) {
        if (window.geckoju) {
            window.geckoju.send("login:" + pass);
        } else {
            console.log("Tentativa de login (Local): " + pass);
        }
    } else {
        showError("DIGITE SUA SENHA!");
    }
}

function checkRegister() {
    if (window.geckoju) {
        // Envia a verificação de registro para o Pawn
        window.geckoju.send("checkRegister:null");
    } else {
        console.log("Servidor não detectado - Liberando criação local para testes.");
        liberarCriacao(); // Executa local para você conseguir testar no navegador
    }
}

// --- 3. SELEÇÃO DE GÊNERO NA CRIAÇÃO ---
function clicouHomem() {
    document.getElementById('m-btn').classList.add('active');
    document.getElementById('f-btn').classList.remove('active');
    
    generoEscolhido = 'M';
    if(window.geckoju) window.geckoju.send("btn_homem");
}

function clicouMulher() {
    document.getElementById('f-btn').classList.add('active');
    document.getElementById('m-btn').classList.remove('active');
    
    generoEscolhido = 'F';
    if(window.geckoju) window.geckoju.send("btn_mulher");
}

// --- 4. FINALIZAR CRIAÇÃO DE PERSONAGEM ---
function finalizar() {
    const pass = document.getElementById('char-pass').value;
    if(pass.length < 4) {
        return alert("Sua senha deve ter no mínimo 4 caracteres!");
    }
    
    // Envia a string formatada perfeitamente para o seu script Pawn processar
    if(window.geckoju) {
        window.geckoju.send("registrar|" + generoEscolhido + "|" + pass);
    } else {
        console.log("Enviado ao servidor local: registrar|" + generoEscolhido + "|" + pass);
    }
}

// --- 5. TRANSIÇÕES DE TELAS (CHAMADAS EXTERNAS OU TESTES) ---
function liberarCriacao() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('creation-screen').style.display = 'flex';
}

function voltarParaLogin() {
    document.getElementById('creation-screen').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
}

// --- 6. ERROS VISUAIS E ALERTA DE CONTA EXISTENTE ---
function showError(msg) {
    const inputGroup = document.querySelector('.input-group');
    const input = document.getElementById('login-pass');
    
    input.value = "";
    input.placeholder = msg; 
    inputGroup.style.borderColor = "#ff3366";
    inputGroup.style.boxShadow = "0 0 15px rgba(255, 51, 102, 0.3)";

    setTimeout(() => {
        input.placeholder = "DIGITE SUA SENHA";
        inputGroup.style.borderColor = "rgba(255, 255, 255, 0.06)";
        inputGroup.style.boxShadow = "none";
    }, 3000);
}

// --- 7. ESCUTA COMANDOS VINDOS DO SCRIPT PAWN ---
if (window.geckoju) {
    window.geckoju.onData = function(data) {
        // Se o servidor retornar o erro informando que a conta já existe
        if(data === "erro_conta") {
            const errorDiv = document.getElementById('error-msg');
            if(errorDiv) {
                errorDiv.style.display = 'block';
                setTimeout(() => { errorDiv.style.display = 'none'; }, 5000);
            }
        }
        // Se o servidor aprovar o checkRegister e mandar abrir a criação
        if(data === "abrir_criacao") {
            liberarCriacao();
        }
    };
}