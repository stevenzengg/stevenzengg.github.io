import { initTerminal } from './terminal/index.js';
import { openTerminal } from './modal/index.js';

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('open-terminal-btn').addEventListener('click', openTerminal);
});