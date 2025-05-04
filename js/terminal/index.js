import { handleCommand } from "./commandHandler.js";
import { fifoManager } from "../utils/fifoQueue.js";
import {
  getCurrentDirectory,
  setCurrentDirectory,
  resetCurrentDirectory,
} from "../file_system/fileSystem.js";
import { isInFormMode } from "../utils/formManager.js";
import { historyManager } from "../utils/historyManager.js";

let terminalDiv;
let currentInputSpan = null; // track the current active input
let allowTyping = true;

const linkMap = {
  instagram: "https://www.instagram.com/stevezengg/",
  linkedin: "https://www.linkedin.com/in/stevenlzeng/",
  email: "mailto:zengstevenz@gmail.com",
  github: "https://github.com/stevenzengg",
};

export function initTerminal() {
  resetCurrentDirectory();
  terminalDiv = document.getElementById("terminal");
  // create intro message
  const introMessage = `type 'help' for a list of commands. please use desktop for best (jk, any*) experience. not supported on mobile.`;
  const outputDiv = document.createElement("div");
  outputDiv.className = "prompt-line";
  outputDiv.innerHTML = introMessage
    .replace(/\n\n/g, "<br>")
    .replace(/\n/g, "<br>");
  terminalDiv.appendChild(outputDiv);

  newPrompt();
  document.addEventListener("keydown", handleKeydown);
}

function newPrompt() {
  const oldBlinker = document.querySelector(".blinker");

  // remove old blinker
  if (oldBlinker) {
    const filler = document.createElement("span");
    filler.className = "input-filler";
    oldBlinker.parentNode.replaceChild(filler, oldBlinker);
  }

  const prompt = document.createElement("div");
  prompt.className = "prompt-line";
  if (!isInFormMode()) {
    prompt.innerHTML = `<span>szeng@steve-server ${
      getCurrentDirectory().name
    } % </span><span class="input-area"></span><span class="blinker">█</span>`;
  } else {
    // form mode should not expose the current directory
    prompt.innerHTML = `<span class="input-area"></span><span class="blinker">█</span>`;
  }

  terminalDiv.appendChild(prompt);

  // update active input
  currentInputSpan = prompt.querySelector(".input-area");

  // clear any lingering text input tracking
  currentInputSpan.textContent = "";
  fifoManager.checkQueue(terminalDiv);
}

async function handleKeydown(e) {
  if (!currentInputSpan) return;
  if (!allowTyping) return;

  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
    currentInputSpan.textContent += e.key;
  } else if (e.key === "Backspace") {
    currentInputSpan.textContent = currentInputSpan.textContent.slice(0, -1);
  } else if (e.key === "Enter") {
    const inputText = currentInputSpan.textContent.trim();
    historyManager.add(inputText);
    await executeCommand(inputText);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    currentInputSpan.textContent = historyManager.getPrevious();
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    currentInputSpan.textContent = historyManager.getNext();
  }
}

async function executeCommand(input) {
  if (input === "clear") {
    terminalDiv.innerHTML = ""; // Clear the terminal
    newPrompt();
    return;
  }
  /*
  design tradeoff here - handling clear here violates separation of concerns.
  ideally, we define case "clear" in commandHandler.js and handle it there like any 
  other command. we'd return an object literal such as {clear: true} and detect
  special control flags here and respond accordingly. great! we love consistent
  interfaces and centralized command logic! however, then i would have to
  1. change handleCommand() to always return an object instead of str
  2. update all existing command cases to return objects instead
  3. create handle logic here
  4. a lot of complexity for a single clear command! (in other words, i don't feel like it)
  */

  allowTyping = false;
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
        currentIndex += 4; // move by 4 characters for "<br>"
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

// hacky solution to linkify keywords. needed since output
// typing char by char does not support injected links
function insertLinks(text) {
  for (const [keyword, url] of Object.entries(linkMap)) {
    const linkHTML = `<a href="${url}" target="_blank" style="color: #00afff; text-decoration: underline;">${keyword}</a>`;
    text = text.replace(new RegExp(`\\b${keyword}\\b`, "g"), linkHTML);
  }
  return text;
}
