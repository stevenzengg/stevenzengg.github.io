import { openModal } from "../modal/index.js";
import {
  getCurrentDirectory,
  setCurrentDirectory,
  root,
  File,
  Folder,
} from "./fileSystem.js";

export function handleCommand(input) {
  const parts = input.trim().split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);

  switch (command) {
    case "help":
      return `Available commands:\n
help        Show this list of commands
ls          List files
ls -la      List all files (including hidden)
cat [file]  View the contents of a text file
open [file] Open a non-text file (like PDFs)
cd [dir]    Change directory
clear       Clear the terminal screen
exit        Close the terminal`;

    case "ls":
      return listFiles(false);

    case "ls -la":
      return listFiles(true);

    case "cat":
      if (args.length === 0) return "Specify a file to read.";
      return catFile(args[0]);

    case "open":
      if (args.length === 0) return "Specify a file to open.";
      return openFile(args[0]);

    case "cd":
      if (args.length === 0) return "Specify a directory to move into.";
      return changeDirectory(args[0]);
    
    case "whoami":
      return `me`;
    
    case "clear":
      return;
      // to be implemented

    default:
      return `Command not found: ${input}`;
  }
}

function listFiles(showHidden) {
  const currentDirectory = getCurrentDirectory();
  const childrenNodes = currentDirectory.listChildrenNodes();

  if (!childrenNodes.length) return "(empty directory)";

  if (showHidden) {
    // mimic detailed ls -la output
    return childrenNodes
      .map((node) => {
        const type = node instanceof Folder ? "d" : "-";
        return `${type}rw-r--r-- 1 user group 0 Jan 1 00:00 ${node.name}`;
      })
      .join("\n");
  } else {
    return childrenNodes.map(node => node.name).join("\n");
  }
}

function catFile(filename) {
  const node = getCurrentDirectory().getChild(filename);
  if (!node) return `File not found: ${filename}`;
  if (node instanceof Folder) return `Cannot cat a directory: ${filename}`;
  return node.content;
}

function openFile(filename) {
  const node = getCurrentDirectory().getChild(filename);
  if (!node) return `File not found: ${filename}`;
  if (node instanceof Folder) return `Cannot open a directory: ${filename}`;
  if (typeof node.content === "string" && node.content.endsWith(".pdf")) {
    openModal(node.content);
    return `Opening ${filename}...`;
  }
  return `Cannot open ${filename} (unsupported format).`;
}

function changeDirectory(foldername) {
  const currentDirectory = getCurrentDirectory();
  if (foldername === "..") {
    const parent = currentDirectory.parent;
    if (parent) {
      setCurrentDirectory(parent);
      return "";
    } else {
      return "Already at root directory.";
    }
  }
  const node = currentDirectory.getChild(foldername);
  if (!node || !(node instanceof Folder)) {
    return `Folder not found: ${foldername}`;
  }
  setCurrentDirectory(node);
  return "";
}
