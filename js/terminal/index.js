import { handleCommand } from "./commandHandler.js";
import { fifoManager } from "../utils/fifoQueue.js";
import { getCurrentDirectory } from "./fileSystem.js";

let terminalDiv;
let currentInputSpan = null; // track the current active input
let allowTyping = true;

const linkMap = {
  "instagram": "https://www.instagram.com/stevezengg/",
  "linkedin": "https://www.linkedin.com/in/stevenlzeng/",
  "email": "mailto:zengstevenz@gmail.com",
  "github": "https://github.com/stevenzengg",
};

export function initTerminal() {
  terminalDiv = document.getElementById("terminal");
  newPrompt();
  document.addEventListener("keydown", handleKeydown);
}

function newPrompt() {
  const oldBlinker = document.querySelector(".blinker");
  if (oldBlinker) {
    const filler = document.createElement("span");
    filler.className = "input-filler";
    oldBlinker.parentNode.replaceChild(filler, oldBlinker);
  }

  const prompt = document.createElement("div");
  prompt.className = "prompt-line";
  prompt.innerHTML = `<span>szeng@steve-server ${
    getCurrentDirectory().name
  } % </span><span class="input-area"></span><span class="blinker">█</span>`;
  terminalDiv.appendChild(prompt);

  // update active input
  currentInputSpan = prompt.querySelector(".input-area");

  // Clear any lingering text input tracking
  currentInputSpan.textContent = "";
  fifoManager.checkQueue(terminalDiv);
}

async function handleKeydown(e) {
  if (!currentInputSpan) return;
  if (!allowTyping) return;

  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
    // Regular character
    currentInputSpan.textContent += e.key;
  } else if (e.key === "Backspace") {
    // Remove last character
    currentInputSpan.textContent = currentInputSpan.textContent.slice(0, -1);
  } else if (e.key === "Enter") {
    const inputText = currentInputSpan.textContent.trim();
    await executeCommand(inputText);
  }
}

/* function executeCommand(input) {
  const output = handleCommand(input);
  
  const outputDiv = document.createElement('div');
  outputDiv.className = 'output-line';
  const formattedOutput = output.replace(/\n/g, '<br>'); // 🔥 replace \n with <br>
  outputDiv.innerHTML = formattedOutput; // 🔥 use innerHTML instead of textContent

  terminalDiv.appendChild(outputDiv);
  terminalDiv.scrollTop = terminalDiv.scrollHeight;
  
  fifoManager.checkQueue(terminalDiv);
  newPrompt();
} */

async function executeCommand(input) {
  allowTyping = false; // Disable typing while processing the command
  const output = await handleCommand(input);

  const outputDiv = document.createElement("div");
  outputDiv.className = "output-line";
  terminalDiv.appendChild(outputDiv);

  let formattedOutput = output.replace(/\n\n/g, "<br>").replace(/\n/g, " ");
  let currentIndex = 0;

  // invisibilify the blinker
  const activeBlinker = document.querySelector(".blinker");
  if (activeBlinker) {
    activeBlinker.style.animation = "none";
    activeBlinker.style.opacity = 0;
  }
  function typeNextChar() {
    if (currentIndex < formattedOutput.length) {
      const nextChar = formattedOutput[currentIndex];

      if (formattedOutput.slice(currentIndex, currentIndex + 4) === "<br>") {
        outputDiv.innerHTML += "<br>";
        currentIndex += 4; // Move by 4 characters for "<br>"
      } else {
        outputDiv.innerHTML += nextChar;
        currentIndex += 1;
      }

      terminalDiv.scrollTop = terminalDiv.scrollHeight;
      setTimeout(typeNextChar, 1); // move typing to next after scrolling
    } else {
      // typing output finished
      outputDiv.innerHTML = insertLinks(outputDiv.innerHTML);
      if (activeBlinker) {
        activeBlinker.style.animation = "blink 1s step-end infinite";
      }

      allowTyping = true;
      newPrompt();
      terminalDiv.scrollTop = terminalDiv.scrollHeight;
    }
  }

  typeNextChar();
}

function insertLinks(text) {
  for (const [keyword, url] of Object.entries(linkMap)) {
    const linkHTML = `<a href="${url}" target="_blank" style="color: #00afff; text-decoration: underline;">${keyword}</a>`;
    text = text.replace(new RegExp(`\\b${keyword}\\b`, "g"), linkHTML);
  }
  return text;
}
