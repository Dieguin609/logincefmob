let selectedGender = null;
const audio = document.getElementById('myAudio');
const musicIcon = document.getElementById('musicIcon');

// --- CONTROLE DE MÚSICA ---
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
    // No mobile, o autoplay é bloqueado, tentamos dar play no carregamento
    audio.play().catch(() => {
        musicIcon.classList.remove('fa-pause');
        musicIcon.classList.add('fa-play');
    });
};

// --- NAVEGAÇÃO ---
function toggleForm(type) {
    if(type === 'reg') {
        document.getElementById('login-box').style.display = 'none';
        document.getElementById('register-box').style.display = 'block';
    } else {
        document.getElementById('register-box').style.display = 'none';
        document.getElementById('login-box').style.display = 'block';
    }
}

function selectGender(gender) {
    selectedGender = gender;
    document.getElementById('m-btn').classList.remove('active');
    document.getElementById('f-btn').classList.remove('active');
    if(gender === 'M') document.getElementById('m-btn').classList.add('active');
    else document.getElementById('f-btn').classList.add('active');
}

// --- COMUNICAÇÃO EXCLUSIVA MOBILE (GECKOJU) ---

function login() {
    const pass = document.getElementById('login-pass').value;
    if (pass.length > 0) {
        // Formato Geckoju: Envia um objeto JSON como string
        window.geckoju.send(JSON.stringify({
            event: "server:onPlayerLogin",
            password: pass
        }));
    } else {
        showError("Por favor, digite sua senha.");
    }
}

function register() {
    const pass = document.getElementById('reg-pass').value;
    if (pass.length > 0 && selectedGender) {
        window.geckoju.send(JSON.stringify({
            event: "server:onPlayerRegister",
            password: pass,
            gender: selectedGender
        }));
        setTimeout(() => { toggleForm('log'); }, 200);
    } else {
        showError("Preencha a senha e selecione o gênero.");
    }
}

// --- RECEBER DADOS DO SERVIDOR NO MOBILE ---

window.geckoju.onData = function(data) {
    try {
        const obj = JSON.parse(data);
        
        // Exemplo: se o servidor enviar {"action": "error", "msg": "Senha incorreta"}
        if(obj.action === "error") {
            showError(obj.msg);
        }
    } catch(e) {
        console.log("Erro ao processar dados: " + e);
    }
};

// Função para mostrar erro
function showError(msg) {
    const inputGroup = document.querySelector('.input-group');
    const input = document.getElementById('login-pass');
    
    input.value = "";
    input.placeholder = msg;
    inputGroup.style.borderColor = "#ff4444";
    inputGroup.style.boxShadow = "0 0 10px rgba(255, 68, 68, 0.2)";

    setTimeout(() => {
        inputGroup.style.borderColor = "rgba(255, 255, 255, 0.1)";
        inputGroup.style.boxShadow = "none";
        input.placeholder = "SUA SENHA";
    }, 3000);
}