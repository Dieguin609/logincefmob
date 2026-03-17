let selectedGender = null;
const audio = document.getElementById('myAudio');
const musicIcon = document.getElementById('musicIcon');

// --- 1. CONTROLE DE MÚSICA ---
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
    audio.play().catch(() => {
        musicIcon.classList.remove('fa-pause');
        musicIcon.classList.add('fa-play');
    });
};

// --- 2. NAVEGAÇÃO ---
function toggleForm(type) {
    // Resetar avisos de erro ao trocar de aba
    const inputGroup = document.querySelector('.input-group');
    const input = document.getElementById('login-pass');
    inputGroup.style.borderColor = "rgba(255, 255, 255, 0.1)";

    if(type === 'reg') {
        document.getElementById('login-box').style.display = 'none';
        document.getElementById('register-box').style.display = 'block';
    } else {
        document.getElementById('register-box').style.display = 'none';
        document.getElementById('login-box').style.display = 'block';
    }
}

// --- 3. ENVIO PARA O SERVIDOR ---

function login() {
    const pass = document.getElementById('login-pass').value;
    if (pass.length > 0) {
        if (window.geckoju) {
            window.geckoju.send("login:" + pass);
        }
    } else {
        showError("DIGITE SUA SENHA!");
    }
}

// ESSA É A FUNÇÃO QUE VOCÊ QUERIA: Só verifica e manda pro criacao.html via Pawn
function register() {
    if (window.geckoju) {
        // Envia o sinal "checkRegister". 
        // No Pawn, se DOF2_FileExists for falso, você abre o criacao.html
        window.geckoju.send("checkRegister:null");
    } else {
        console.log("Servidor não detectado - Teste de Clique");
    }
}

// --- 4. FUNÇÃO DE ERRO VISUAL ---
function showError(msg) {
    const inputGroup = document.querySelector('.input-group');
    const input = document.getElementById('login-pass');
    
    input.value = "";
    input.placeholder = msg; 
    inputGroup.style.borderColor = "#ff4444";
    inputGroup.style.boxShadow = "0 0 10px rgba(255, 68, 68, 0.2)";

    setTimeout(() => {
        input.placeholder = "SUA SENHA";
        inputGroup.style.borderColor = "rgba(255, 255, 255, 0.1)";
        inputGroup.style.boxShadow = "none";
    }, 3000);
}

// --- 5. RECEBIMENTO DO SERVIDOR ---
if (window.geckoju) {
    window.geckoju.onData = function(data) {
        // Se o servidor quiser mostrar um erro (tipo "Conta já existe")
        if(data === "erro_conta") {
            // Se você criou a div error-msg no HTML
            const errorDiv = document.getElementById('error-msg');
            if(errorDiv) {
                errorDiv.style.display = 'block';
                setTimeout(() => { errorDiv.style.display = 'none'; }, 5000);
            }
        }
    };
}