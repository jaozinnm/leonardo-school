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

/* ===========================
   PERFIL - EDIÇÃO OCULTA
   =========================== */
const PROFILE_PREFIX = "ls_profile_";
const EDIT_HOLD_MS = 1200;

function saveProfileValue(key, value) {
  localStorage.setItem(PROFILE_PREFIX + key, value);
}

function loadProfileValue(key) {
  return localStorage.getItem(PROFILE_PREFIX + key);
}

function applySavedEditableValues() {
  document.querySelectorAll(".editable[data-key]").forEach((el) => {
    const key = el.dataset.key;
    const saved = loadProfileValue(key);
    if (saved !== null && saved !== undefined && saved !== "") {
      el.textContent = saved;
    }
  });
}

function setEditMode(enabled) {
  const body = document.body;
  body.classList.toggle("edit-mode", enabled);

  document.querySelectorAll(".editable[data-key]").forEach((el) => {
    el.setAttribute("contenteditable", enabled ? "true" : "false");
    el.classList.toggle("editing", enabled);
  });

  // botãozinho discreto
  const fabTop = document.getElementById("editFabTop");
  const fabDetails = document.getElementById("editFabDetails");
  if (fabTop) fabTop.textContent = enabled ? "Fechar" : "Editar";
  if (fabDetails) fabDetails.textContent = enabled ? "Fechar" : "Editar";

  // ao sair, salva tudo
  if (!enabled) {
    document.querySelectorAll(".editable[data-key]").forEach((el) => {
      const key = el.dataset.key;
      const value = (el.textContent || "").trim();
      saveProfileValue(key, value);
    });
  }
}

function bindEditableAutosave() {
  // salva ao "desfocar" também (bom pra mobile)
  document.querySelectorAll(".editable[data-key]").forEach((el) => {
    el.addEventListener("blur", () => {
      const key = el.dataset.key;
      const value = (el.textContent || "").trim();
      saveProfileValue(key, value);
    });
  });
}

function setupLongPressToggle(targetEl) {
  if (!targetEl) return;

  let timer = null;
  let started = false;

  const start = () => {
    started = true;
    timer = setTimeout(() => {
      const enabled = !document.body.classList.contains("edit-mode");
      setEditMode(enabled);
      // vibração leve no mobile (se suportar)
      try { navigator.vibrate && navigator.vibrate(30); } catch {}
    }, EDIT_HOLD_MS);
  };

  const cancel = () => {
    if (!started) return;
    started = false;
    if (timer) clearTimeout(timer);
    timer = null;
  };

  // mouse
  targetEl.addEventListener("mousedown", start);
  targetEl.addEventListener("mouseup", cancel);
  targetEl.addEventListener("mouseleave", cancel);

  // touch
  targetEl.addEventListener("touchstart", start, { passive: true });
  targetEl.addEventListener("touchend", cancel);
  targetEl.addEventListener("touchcancel", cancel);
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

  // PERFIL
  if (page === "perfil") {
    // nome no topo
    const nameEl = document.getElementById("profileName");
    if (nameEl) nameEl.textContent = getStudentName();

    // aplica valores salvos (se já editaram antes)
    applySavedEditableValues();
    bindEditableAutosave();

    // botão expandir detalhes
    const btnExpand = document.getElementById("btnExpand");
    const details = document.getElementById("cardDetails");
    if (btnExpand && details) {
      btnExpand.addEventListener("click", () => {
        const open = details.classList.toggle("open");
        btnExpand.textContent = open ? "Ocultar detalhes" : "Expandir (ver detalhes)";
      });
    }

    // long press: ativa modo edição (discreto)
    const cardTop = document.getElementById("carteira");
    const cardDetails = document.getElementById("cardDetails");
    setupLongPressToggle(cardTop);
    setupLongPressToggle(cardDetails);

    // clique no botão discreto (quando aparecer)
    const fabTop = document.getElementById("editFabTop");
    const fabDetails = document.getElementById("editFabDetails");
    const toggle = () => setEditMode(!document.body.classList.contains("edit-mode"));
    if (fabTop) fabTop.addEventListener("click", toggle);
    if (fabDetails) fabDetails.addEventListener("click", toggle);

    // DICA: sair do modo edição ao apertar ESC (desktop)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("edit-mode")) {
        setEditMode(false);
      }
    });
  }
});
