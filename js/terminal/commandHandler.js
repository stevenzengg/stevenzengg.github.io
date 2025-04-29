import { openModal } from "../modal/index.js";
import {
  getCurrentDirectory,
  setCurrentDirectory,
  root,
  File,
  Folder,
  App,
} from "./fileSystem.js";

export async function handleCommand(input) {
  const parts = input.trim().split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);

  switch (command) {
    case "help":
      return _fetchFileContent("assets/help.txt");

    case "ls":
      if (args.length === 1 && args[0] === "-la") {
        return listFiles(true);
      }
      return listFiles(false);

    case "cat":
      if (args.length === 0) return "Specify a file to read.";
      return catFile(args[0]);

    case "open":
      if (args.length === 0) return "Specify a file to open.";
      return openFile(args[0]);

    case "cd":
      if (args.length === 0) return "Specify a directory to move into.";
      return changeDirectory(args[0]);

    case "clear":
      return;
    // to be implemented

    case "run":
      if (args.length === 0) return "Specify a file to run.";
      return runApp(args[0]);
      
    default:
      return `Command not found: ${input}. Try 'help' for a list of commands.`;
  }
}

function listFiles(showHidden) {
  const currentDirectory = getCurrentDirectory();
  let childrenNodes = currentDirectory.listChildrenNodes();
  if (!showHidden) {
    childrenNodes = childrenNodes.filter((node) => !node.hidden);
  }
  if (!childrenNodes.length) return "(empty directory)";

  return childrenNodes.map((node) => node.name).join("\n\n");
}

async function _fetchFileContent(filePath, fileName = "") {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error("Network response was not ok");
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error fetching file:", error);
    return `Error fetching file: ${fileName}`;
  }
}

async function catFile(filename) {
  const node = getCurrentDirectory().getChild(filename);
  if (!node) return `File not found: ${filename}`;
  if (node instanceof File && node.content.endsWith(".txt")) {
    return await _fetchFileContent(node.content, filename);
  }
  return `Cannot cat ${filename} (unsupported format).`;
}

function openFile(filename) {
  // perhaps add functionality to open other file types
  const node = getCurrentDirectory().getChild(filename);
  if (!node) return `File not found: ${filename}`;
  if (node instanceof File && node.content.endsWith(".pdf")) {
    openModal(node.content);
    return `Opening ${filename}...`;
  }
  return `Cannot open ${filename} (unsupported format).`;
}

function runApp(appName) {
  const node = getCurrentDirectory().getChild(appName);
  if (!node) return `App not found: ${appName}`;
  if (node instanceof App) {
    return node.run();
  }
  return `Cannot run ${appName} (not an app).`;
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
  if (!node) return `Folder not found: ${foldername}`;
  if (node instanceof Folder) {
    setCurrentDirectory(node);
    return "";
  }
  return `Folder not found: ${foldername}`;
}
