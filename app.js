function setStudentName(name) {
  const clean = (name || "").trim();
  localStorage.setItem("studentName", clean || "Estudante");
}

function getStudentName() {
  return localStorage.getItem("studentName") || "Estudante";
}

function go(url) {
  window.location.href = url;
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  // LOGIN: digitou qualquer coisa -> entra
  if (page === "login") {
    const nameInput = document.getElementById("studentName");
    const passInput = document.getElementById("studentPass");
    const btn = document.getElementById("btnEnter");

    let redirected = false;

    const enterNow = () => {
      if (redirected) return;
      redirected = true;
      setStudentName(nameInput.value);
      go("menu.html");
    };

    const onType = () => {
      if ((nameInput.value && nameInput.value.length > 0) || (passInput.value && passInput.value.length > 0)) {
        enterNow();
      }
    };

    nameInput.addEventListener("input", onType);
    passInput.addEventListener("input", onType);

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      enterNow();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") enterNow();
    });
  }

  // MENU: nome no header
  if (page === "menu") {
    const el = document.getElementById("helloName");
    if (el) el.textContent = `Olá, ${getStudentName()}`;
  }

  // PERFIL: nome + detalhes expandíveis
  if (page === "perfil") {
    const nameEl = document.getElementById("profileName");
    if (nameEl) nameEl.textContent = getStudentName();

    const btnExpand = document.getElementById("btnExpand");
    const details = document.getElementById("cardDetails");

    if (btnExpand && details) {
      btnExpand.addEventListener("click", () => {
        const open = details.classList.toggle("open");
        btnExpand.textContent = open ? "Ocultar detalhes" : "Expandir (ver detalhes)";
      });
    }
  }
});
