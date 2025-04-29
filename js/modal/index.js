import { makeDraggableResizable } from './dragResize.js';
import { createAppHeader } from '../utils/appHeader.js';
import { initTerminal } from '../terminal/index.js';
import { bringToFront } from '../windowManager.js';

export function openModal(url) {
  const modal = document.createElement('div');
  modal.className = 'modal';

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const modalHeight = Math.min(screenHeight * 0.8, 800);
  const aspectRatio = 7.5 / 11;
  const modalWidth = Math.min(screenWidth * 0.8, 600, modalHeight * aspectRatio);

  modal.style.width = `${modalWidth}px`;
  modal.style.height = `${modalHeight}px`;
  
  const maxLeft = screenWidth - modalWidth;
  const maxTop = screenHeight - modalHeight;
  const randomLeft = Math.floor(Math.random() * maxLeft);
  const randomTop = Math.floor(Math.random() * maxTop);
  modal.style.left = `${randomLeft}px`;
  modal.style.top = `${randomTop}px`;

  // Create modal body
  const body = document.createElement('div');
  body.className = 'modal-body';

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = url + "#view=Fit";
  // No need to set width/height/border manually anymore
  
  const header = createAppHeader(() => {
    document.body.removeChild(modal);
  });

  body.appendChild(iframe);
  modal.appendChild(header);
  modal.appendChild(body);

  document.body.appendChild(modal);

  makeDraggableResizable(modal);
  header.addEventListener('mousedown', () => bringToFront(modal));
}


export function openTerminal() {
  const existingTerminal = document.querySelector('.terminal-window');
  if (existingTerminal) {
    bringToFront(existingTerminal)
    return;
  }
  const terminal = document.createElement('div');
  terminal.className = 'modal terminal-window';

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const terminalWidth = Math.min(screenWidth * 0.8, 800);
  const terminalHeight = Math.min(screenHeight * 0.8, 600);
  terminal.style.width = `${terminalWidth}px`;
  terminal.style.height = `${terminalHeight}px`;

  const header = createAppHeader(() => {
    document.body.removeChild(terminal);
  });

  const body = document.createElement('div');
  body.className = 'modal-body';

  const terminalDiv = document.createElement('div');
  terminalDiv.id = 'terminal'; // important! initTerminal will hook into this
  body.appendChild(terminalDiv);

  terminal.appendChild(header);
  terminal.appendChild(body);

  document.body.appendChild(terminal);

  makeDraggableResizable(terminal);
  bringToFront(terminal);
  terminal.addEventListener('mousedown', () => bringToFront(terminal));

  initTerminal(terminalDiv); // Pass the specific div to initialize typing inside
}