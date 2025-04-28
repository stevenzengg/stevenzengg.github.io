import { makeDraggableResizable } from './dragResize.js';
import { createAppHeader } from '../utils/appHeader.js'; // still use our reusable app header
import { initTerminal } from '../terminal/index.js'; // your terminal typing logic
import { bringToFront } from '../windowManager.js';

export function openModal(url) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  // create a container inside for iframe
  const body = document.createElement('div');
  body.className = 'modal-body';

  // create the iframe
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.width = '100%';
  iframe.height = '100%';
  iframe.style.border = 'none';

  // assemble modal
  const header = createAppHeader(() => {
    document.body.removeChild(modal);
  });

  body.appendChild(iframe);
  modal.appendChild(header);
  modal.appendChild(body);

  document.body.appendChild(modal);

  makeDraggableResizable(modal);
  bringToFront(modal);
  modal.addEventListener('mousedown', () => bringToFront(modal));

}

export function openTerminal() {
  const existingTerminal = document.querySelector('.terminal-window');
  if (existingTerminal) {
    bringToFront(existingTerminal)
    return;
  }
  const terminalWindow = document.createElement('div');
  terminalWindow.className = 'modal terminal-window';

  const header = createAppHeader(() => {
    document.body.removeChild(terminalWindow);
  });

  const body = document.createElement('div');
  body.className = 'modal-body';

  const terminalDiv = document.createElement('div');
  terminalDiv.id = 'terminal'; // important! initTerminal will hook into this
  body.appendChild(terminalDiv);

  terminalWindow.appendChild(header);
  terminalWindow.appendChild(body);

  document.body.appendChild(terminalWindow);

  makeDraggableResizable(terminalWindow);
  bringToFront(terminalWindow);
  terminalWindow.addEventListener('mousedown', () => bringToFront(terminalWindow));

  initTerminal(terminalDiv); // Pass the specific div to initialize typing inside
}

