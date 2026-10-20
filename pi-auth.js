(() => {
  let piSessionToken = null;
  let piUser = null;
  let authenticationStarted = false;

  async function authenticateWithPi() {
    if (authenticationStarted) return;
    authenticationStarted = true;

    try {
      if (!window.Pi) {
        throw new Error("O SDK da Pi Network não foi carregado.");
      }

      await window.Pi.init({ version: "2.0" });

      const authResult = await window.Pi.authenticate(
        ["username"],
        onIncompletePaymentFound
      );

      if (!authResult || !authResult.accessToken) {
        throw new Error("A Pi Network não retornou um token de acesso.");
      }

      const response = await fetch(
        "https://backend.appstudio-u7cm9zhmha0ruwv8.piappengine.com/pi/auth/v1/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            accessToken: authResult.accessToken
          })
        }
      );

      if (!response.ok) {
        throw new Error("Falha na autenticação pelo App Studio.");
      }

      const result = await response.json();

      if (!result.sessionToken || !result.user) {
        throw new Error("Resposta de autenticação inválida.");
      }

      // Mantém o token somente na memória desta página.
      piSessionToken = result.sessionToken;
      piUser = result.user;

      window.dispatchEvent(
        new CustomEvent("pi-auth-success", {
          detail: {
            uid: piUser.uid,
            username: piUser.username
          }
        })
      );

      console.log("Autenticação Pi concluída.");
    } catch (error) {
      authenticationStarted = false;
      console.error("Erro na autenticação Pi:", error);

      window.dispatchEvent(
        new CustomEvent("pi-auth-error", {
          detail: { message: error.message }
        })
      );
    }
  }

  function onIncompletePaymentFound(payment) {
    console.log("Pagamento incompleto identificado:", payment);
  }

  // Disponibiliza somente a função de autenticação.
    window.SafraPiAuth = {
    authenticate: authenticateWithPi,
    getUser: () => piUser,
    isAuthenticated: () => Boolean(piSessionToken)
  };

  const loginButton = document.getElementById("piLoginButton");

  if (loginButton) {
    loginButton.addEventListener("click", authenticateWithPi);

    window.addEventListener("pi-auth-success", (event) => {
      const username = event.detail.username;

      loginButton.textContent = username
        ? `Conectado: @${username}`
        : "Conectado com Pi";

      loginButton.disabled = true;
    });

    window.addEventListener("pi-auth-error", (event) => {
      alert(
        "Não foi possível entrar com a Pi Network: " +
        event.detail.message
      );
    });
  }
})();