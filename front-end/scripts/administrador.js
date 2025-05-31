const nome = document.getElementById('nome')
const email = document.getElementById("email")
const senha = document.getElementById("senha")
const funcao = document.getElementById("funcao")

nome.addEventListener('blur', function() {
    validacaoEmail(nome)
})

email.addEventListener('blur', function() {
    validacaoEmail(email)
})

senha.addEventListener('blur', function() {
    validacaoSenha(senha)
})

funcao.addEventListener('blur', function() {
    validacaoEmail(funcao)
})

function validaNome(nome) {
    return true 
}

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

function validaFuncao(nome) {
    return true
}

function adicionar() {
    if(validaNome(nome) && validacaoEmail(email) && validacaoSenha(senha) && validaFuncao(funcao)) {
        
    } else {
        validacaoEmail(email) 
        validaCPF(senha) 
    }
}