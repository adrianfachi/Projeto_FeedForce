const nome = document.getElementById('nome')
const email = document.getElementById("email")
const senha = document.getElementById("senha")
const funcao = document.getElementById("funcao")
const ddd = document.getElementById("DDD")
const telefone = document.getElementById("telefone")

nome.addEventListener('blur', function() {
    validaNome(nome)
})

email.addEventListener('blur', function() {
    validacaoEmail(email)
})

senha.addEventListener('blur', function() {
    validacaoSenha(senha)
})

funcao.addEventListener('blur', function() {
    validaFuncao(funcao)
})

ddd.addEventListener('blur', function() {
    validaDDD(ddd)
})

telefone.addEventListener('blur', function() {
    validaTelefone(telefone)
})

function validaNome(nome) {
    if(nome.value.length > 3) {
        nome.style.border = 'none'
        return true
    } else {
        nome.style.border = 'solid red'
        return false
    }
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
    if(senha.value.length >+ 6) {
        senha.style.border = 'none'
        return true
    } else {
        senha.style.border = 'solid red'
        return false
    }
}

function validaFuncao(funcao) {
    if(funcao.value.length > 3) {
        funcao.style.border = 'none'
        return true
    } else {
        funcao.style.border = 'solid red'
        return false
    }
}

function validaDDD (ddd) {
    if (ddd.value.length == 2) {
        ddd.style.border = 'none'
        return true
    } else {
        ddd.style.border = 'solid red'
        return false
    }
}

function validaTelefone (telefone) {
    if (telefone.value.length == 9) {
        telefone.style.border = 'none'
        return true
    } else {
        telefone.style.border = 'solid red'
        return false
    }
}

function adicionar() {
    if(validaNome(nome) && validacaoEmail(email) && validacaoSenha(senha) && validaFuncao(funcao) && validaDDD(ddd) && validaTelefone(telefone)) {
        
    } else {
        validaNome(nome)
        validacaoEmail(email) 
        validaCPF(senha) 
        validaFuncao(funcao)
        validaDDD(ddd)
        validaTelefone(telefone)
    }
}