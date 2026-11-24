"use strict";
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const motionToggle = document.getElementById("motionToggle");
let motionPaused = motionPreference.matches;
function setMotion(paused) {
  motionPaused = paused;
  document.body.classList.toggle("motion-paused", paused);
  motionToggle.setAttribute("aria-pressed", String(paused));
  motionToggle.textContent = paused
    ? "Animaciones pausadas ▷"
    : "Pausar animaciones Ⅱ";
}
setMotion(motionPaused);
motionToggle.addEventListener("click", () => {
  if (motionPreference.matches) {
    document.getElementById("playStatus").textContent =
      "Se respeta la preferencia de movimiento reducido de tu dispositivo.";
    return;
  }
  setMotion(!motionPaused);
});
motionPreference.addEventListener("change", (event) =>
  setMotion(event.matches),
);
const navigationLinks = [...document.querySelectorAll("nav a")];
const sections = [...document.querySelectorAll("main section")];
function updateNavigation() {
  const position = window.scrollY + Math.min(window.innerHeight * 0.35, 250);
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top + window.scrollY <= position)
      current = section;
  }
  if (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 5
  )
    current = sections.at(-1);
  for (const link of navigationLinks) {
    const active = link.hash === `#${current.id}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}
let scrollScheduled = false;
window.addEventListener(
  "scroll",
  () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => {
      updateNavigation();
      scrollScheduled = false;
    });
  },
  { passive: true },
);
window.addEventListener("resize", updateNavigation);
updateNavigation();
const scene = document.querySelector(".scene");
document.getElementById("playButton").addEventListener("click", () => {
  const status = document.getElementById("playStatus");
  if (motionPaused) {
    status.textContent =
      "¡Hola, jugador! El pequeño mundo está en modo tranquilo.";
    return;
  }
  if (scene.classList.contains("jumping")) return;
  scene.classList.add("jumping");
  status.textContent = "¡Salto! Una idea más cerca de despegar.";
  setTimeout(() => scene.classList.remove("jumping"), 680);
});
if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener(
    "pointermove",
    (event) => {
      if (motionPaused) return;
      document.documentElement.style.setProperty(
        "--pointer-x",
        `${event.clientX}px`,
      );
      document.documentElement.style.setProperty(
        "--pointer-y",
        `${event.clientY}px`,
      );
    },
    { passive: true },
  );
}
// No contact endpoint is configured: save a local draft without claiming delivery.
document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const draft = `Idea para Grover Soria Garcia\n\nNombre: ${values.get("nombre")}\nCorreo: ${values.get("email")}\n\n${values.get("mensaje")}\n\nBorrador local. Este mensaje no se ha enviado.\n`;
  const url = URL.createObjectURL(
    new Blob([draft], { type: "text/plain;charset=utf-8" }),
  );
  const download = document.createElement("a");
  download.href = url;
  download.download = "mi-idea-para-grover.txt";
  document.body.appendChild(download);
  download.click();
  download.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.getElementById("formStatus").textContent =
    "Borrador preparado para descargar. Tu mensaje no se ha enviado.";
});
document.getElementById("year").textContent = new Date().getFullYear();
