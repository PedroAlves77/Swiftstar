document.addEventListener("DOMContentLoaded", function () {
  const eyeIcon = document.querySelector(".eye-icon");
  const passwordInput = document.getElementById("password");

  eyeIcon.addEventListener("click", function () {
    // Alterna o tipo do input entre 'password' e 'text'
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    window.location.href = "home.html";
  });
});
