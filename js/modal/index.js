import { makeDraggableResizable } from "./dragResize.js";
import { createAppHeader } from "../utils/appHeader.js";
import { initTerminal } from "../terminal/index.js";
import { bringToFront } from "../windowManager.js";

function createModal(contentElement, { width, height }) {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // fallback safety defaults
  let modalWidth = Math.min(screenWidth * 0.8, width);
  let modalHeight = Math.min(screenHeight * 0.8, height);

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.style.width = `${modalWidth}px`;
  modal.style.height = `${modalHeight}px`;

  const maxLeft = screenWidth - modalWidth;
  const maxTop = screenHeight - modalHeight;

  // random jitter position
  modal.style.left = `${Math.floor(Math.random() * maxLeft)}px`;
  modal.style.top = `${Math.floor(Math.random() * maxTop)}px`;

  const header = createAppHeader(
    () => {
      document.body.removeChild(modal);
    },
    () => {
      toggleFullScreen(modal);
    }
  );

  const body = document.createElement("div");
  body.className = "modal-body";
  body.appendChild(contentElement);

  modal.appendChild(header);
  modal.appendChild(body);
  document.body.appendChild(modal);

  makeDraggableResizable(modal);
  requestAnimationFrame(() => bringToFront(modal));
  header.addEventListener("mousedown", () => bringToFront(modal));
  modal.addEventListener("mousedown", () => bringToFront(modal));

  return modal;
}

export function openResume(url) {
  const iframe = document.createElement("iframe");
  iframe.src = url + "#view=Fit";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";

  createModal(iframe, {
    width: 850,
    height: 1100,
  });
}

export function openImage(url) {
  const img = new Image();
  img.src = url;

  img.onload = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let naturalWidth = img.naturalWidth;
    let naturalHeight = img.naturalHeight;

    let scaleFactor = Math.min(
      (screenWidth * 0.9) / naturalWidth,
      (screenHeight * 0.9) / naturalHeight,
      1 // don't upscale if image is smaller than screen
    );

    let width = naturalWidth * scaleFactor;
    let height = naturalHeight * scaleFactor;

    img.style.width = "100%";
    img.style.height = "100%";
    img.style.display = "block";
    img.style.objectFit = "contain";

    createModal(img, {
      width,
      height,
    });
  };

  img.onerror = () => {
    alert("Failed to load image.");
  };
}

export function openTerminal() {
  const existingTerminal = document.querySelector(".terminal-window");
  if (existingTerminal) {
    bringToFront(existingTerminal);
    return;
  }

  const terminalDiv = document.createElement("div");
  terminalDiv.id = "terminal"; // required by initTerminal
  terminalDiv.className = "terminal-window"; // ✅ preserve className for styling
  terminalDiv.style.height = "100%"; // allow vertical scroll to work
  terminalDiv.style.overflowY = "auto";

  const modal = createModal(terminalDiv, {
    width: 800,
    height: 600,
  });

  modal.classList.add("terminal-window"); // optional: if you want styling here too

  initTerminal(terminalDiv);
}


function toggleFullScreen(modal) {
  const transformX = parseFloat(modal.getAttribute("data-x")) || 0;
  const transformY = parseFloat(modal.getAttribute("data-y")) || 0;

  // Commit transform to left/top if needed
  if (transformX || transformY) {
    const left = parseFloat(modal.style.left) || 0;
    const top = parseFloat(modal.style.top) || 0;
    modal.style.left = `${left + transformX}px`;
    modal.style.top = `${top + transformY}px`;
    modal.style.transform = "none";
    modal.setAttribute("data-x", 0);
    modal.setAttribute("data-y", 0);
  }

  const rect = modal.getBoundingClientRect();
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const isFullScreen =
    Math.abs(rect.width - screenWidth) < 10 &&
    Math.abs(rect.height - screenHeight) < 10 &&
    parseInt(modal.style.left, 10) === 0 &&
    parseInt(modal.style.top, 10) === 0;

  if (isFullScreen) {
    modal.style.width = modal.dataset.originalWidth;
    modal.style.height = modal.dataset.originalHeight;
    modal.style.left = modal.dataset.originalLeft;
    modal.style.top = modal.dataset.originalTop;
    modal.classList.remove("fullscreen");
  } else {
    modal.dataset.originalWidth = modal.style.width;
    modal.dataset.originalHeight = modal.style.height;
    modal.dataset.originalLeft = modal.style.left;
    modal.dataset.originalTop = modal.style.top;

    modal.style.width = `${screenWidth}px`;
    modal.style.height = `${screenHeight}px`;
    modal.style.left = `0px`;
    modal.style.top = `0px`;
    modal.classList.add("fullscreen");
  }
}
