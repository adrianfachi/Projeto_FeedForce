const email = document.getElementById("email")
const senha = document.getElementById("senha")
email.addEventListener('blur', function() {
    validacaoEmail(email)
})

senha.addEventListener('blur', function() {
    validacaoSenha(senha)
})

function validacaoEmail(email) {
    usuario = email.value.substring(0, email.value.indexOf("@"));
    dominio = email.value.substring(email.value.indexOf("@")+ 1, email.value.length);
    
if ((usuario.length >=1) &&
    (dominio.length >=3) &&
    (usuario.search("@")==-1) &&
    (dominio.search("@")==-1) &&
    (usuario.search(" ")==-1) &&
    (dominio.search(" ")==-1) &&
    (dominio.search(".")!=-1) &&
    (dominio.indexOf(".") >=1)&&
    (dominio.lastIndexOf(".") < dominio.length - 1)) {
        email.style.border = 'none'
        return true
} else {
        email.style.border = 'solid red'
        return false
    }
}

function validacaoSenha(senha) {
    return true
}

function entrar() {
    if(validacaoEmail(email) && validacaoSenha(senha)) {
        window.location = "telaInicial.html"
    } else {
        validacaoEmail(email) 
        validaCPF(senha) 
    }
}