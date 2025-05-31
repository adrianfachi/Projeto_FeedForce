const email = document.getElementById("email");
const senha = document.getElementById("senha");

email.addEventListener('blur', async function() {
  await validacaoEmail(email);
});

senha.addEventListener('blur', function() {
  validacaoSenha(senha);
});

async function validacaoEmail(emailInput) {
  const emailValue = emailInput.value;

  // Validação básica do formato
  const usuario = emailValue.substring(0, emailValue.indexOf("@"));
  const dominio = emailValue.substring(emailValue.indexOf("@") + 1);

  const formatoValido = (
    usuario.length >= 1 &&
    dominio.length >= 3 &&
    usuario.indexOf("@") === -1 &&
    dominio.indexOf("@") === -1 &&
    usuario.indexOf(" ") === -1 &&
    dominio.indexOf(" ") === -1 &&
    dominio.indexOf(".") !== -1 &&
    dominio.indexOf(".") >= 1 &&
    dominio.lastIndexOf(".") < dominio.length - 1
  );

  if (!formatoValido) {
    emailInput.style.border = 'solid red';
    return false;
  }

  // Validação se email já existe (chamada async)
  const existe = await verificarEmailExistente(emailValue);
  if (existe) {
    emailInput.style.border = 'none';
    return true;
  } else {
    emailInput.style.border = 'solid red';
    return false;
  }
}

function validacaoSenha(senha) {
  if (senha.value.length >= 6) {
    senha.style.border = 'none';
    return true;
  } else {
    senha.style.border = 'solid red';
    return false;
  }
}

async function entrar() {
  const emailValido = await validacaoEmail(email); // já valida formato e disponibilidade
  const senhaValida = validacaoSenha(senha); // valida tamanho, etc

  if (!emailValido) {
    return;
  }

  if (!senhaValida) {
    
    return;
  }

  // Agora valida se o login (email+senha) bate com o banco
  const resultado = await validarLogin(email.value, senha.value);

  if (resultado.sucesso) {
    window.location = "telaInicial.html";
  } else {
    senha.style.border = 'solid red';
  }
}

const supabaseUrl = "https://dpmyuojkrmgnwfyieqig.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwbXl1b2prcm1nbndmeWllcWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NjQ0NzgsImV4cCI6MjA2NDI0MDQ3OH0.NnNTpy36xLrBzHlLPmm8ACOzNXfZ3pAOtM8hdOa5Q3A";

async function verificarEmailExistente(email) {
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/users?user_email=eq.${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    return data.length > 0;

  } catch (error) {
    console.error("Erro ao verificar e-mail:", error);
    return false;
  }
}

async function validarLogin(email, senha) {
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/users?user_email=eq.${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      // Usuário não existe
      console.log("Usuário não encontrado");
      return { sucesso: false, mensagem: "E-mail não cadastrado" };
    }

    const user = data[0];

    // Supondo senha salva em texto simples (não recomendado, melhor hash!)
    if (user.user_password === senha) {
      console.log("Login OK");
      return { sucesso: true, user };
    } else {
      console.log("Senha incorreta");
      senha.style.border = 'solid red';
      return { sucesso: false };
    }

  } catch (error) {
    console.error("Erro ao validar login:", error);
    return { sucesso: false, mensagem: "Erro no servidor" };
  }
}
