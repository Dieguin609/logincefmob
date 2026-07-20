// --- MEMÓRIA DA INTERFACE ---
let generoEscolhido = 1; // 1 = Masc, 2 = Fem
let peleEscolhida = 1;   // 1 = Branca, 2 = Negra
let estiloEscolhido = 1; // ID do estilo (barba/cabelo)

const audio = document.getElementById('myAudio');
const musicIcon = document.getElementById('musicIcon');

// --- 1. CONTROLE DE MÚSICA ---
function togglePlay() {
    if (audio.paused) {
        audio.play();
        musicIcon.classList.replace('fa-play', 'fa-pause');
    } else {
        audio.pause();
        musicIcon.classList.replace('fa-pause', 'fa-play');
    }
}

window.onload = () => {
    audio.play().catch(() => {
        musicIcon.classList.replace('fa-pause', 'fa-play');
    });
};

// --- 2. COMUNICAÇÃO DE ENTRADA (PAWN -> CEF) ---
function login() {
    const pass = document.getElementById('login-pass').value;
    if (pass.length > 0) {
        if (window.geckoju) window.geckoju.send("login:" + pass);
        else console.log("Login (Local): " + pass);
    } else {
        showError("DIGITE SUA SENHA!");
    }
}

function checkRegister() {
            if (window.geckoju) {
                // Manda um comando simples para o Pawn trocar o arquivo
                window.geckoju.send("change_page:criacao.html");
            } else {
                console.log("Comando enviado: change_page:criacao.html");
            }
        }

// --- 3. SELEÇÃO DE GÊNERO, PELE E ESTILO ---
function setGender(g, skinId) {
    // Atualiza a lógica de gênero (1=M, 2=F)
    generoEscolhido = (g === 'M') ? 1 : 2;
    
    // O HTML já gerencia a exibição visual das divs via ID, 
    // aqui apenas garantimos o envio pro servidor ver o boneco mudar
    if(window.geckoju) window.geckoju.send("setGender:" + skinId);
}

function setSkin(id) {
    peleEscolhida = id;
    if(window.geckoju) window.geckoju.send("setSkinColor:" + id);
}

function setEstilo(id, elemento) {
    estiloEscolhido = id;
    if(window.geckoju) window.geckoju.send("previewStyle:" + id);
}

// --- 4. FINALIZAR CRIAÇÃO (A NOVA LÓGICA) ---
function finalizar() {
    const nome = document.getElementById('char-name').value;
    const pass = document.getElementById('char-pass').value;
    
    // Validações de padrão Eixo Central
    if(!nome.includes("_")) {
        return alert("O nome deve seguir o padrão: Nome_Sobrenome");
    }
    if(pass.length < 4) {
        return alert("A senha deve conter no mínimo 4 caracteres!");
    }
    
    // Envia no formato: finishCreation:NOME|SENHA|GENERO|PELE|ESTILO
    const payload = `finishCreation:${nome}|${pass}|${generoEscolhido}|${peleEscolhida}|${estiloEscolhido}`;
    
    if(window.geckoju) {
        window.geckoju.send(payload);
    } else {
        console.log("Enviado ao PAWN:", payload);
    }
}

// --- 5. TRANSIÇÕES ---
function liberarCriacao() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('creation-screen').style.display = 'flex';
}

// --- 6. ERROS ---
function showError(msg) {
    const inputGroup = document.querySelector('.input-group');
    const input = document.getElementById('login-pass');
    
    input.value = "";
    input.placeholder = msg; 
    inputGroup.style.borderColor = "#e74c3c";
    inputGroup.style.boxShadow = "0 0 15px rgba(231, 76, 60, 0.3)";

    setTimeout(() => {
        input.placeholder = "DIGITE SUA SENHA";
        inputGroup.style.borderColor = "rgba(255, 255, 255, 0.06)";
        inputGroup.style.boxShadow = "none";
    }, 3000);
}

// --- 7. ESCUTA COMANDOS PAWN ---
if (window.geckoju) {
    window.geckoju.onData = function(data) {
        if(data === "abrir_criacao") liberarCriacao();
        if(data === "erro_conta") showError("CONTA JÁ EXISTE!");
    };
}