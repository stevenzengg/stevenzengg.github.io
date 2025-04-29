import { openResume, openImage } from "../modal/index.js";
import {
  getCurrentDirectory,
  setCurrentDirectory,
  File,
  Folder,
  App,
} from "../file_system/fileSystem.js";
import { isInFormMode, handleFormInput } from "../utils/formManager.js";

export async function handleCommand(input) {
  if (isInFormMode()) {
    return handleFormInput(input);
  }
  const parts = input.trim().split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);

  switch (command) {
    case "help":
      return _fetchFileContent("assets/help.txt");

    case "ls":
      if (args.length === 1 && args[0] === "-a") {
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

    case "run":
      if (args.length === 0) return "Specify an app to run.";
      return runApp(args[0]);

    case "tree":
      if (args.length !== 0) return "No arguments needed.";
      return "~\n\n" + buildTree(getCurrentDirectory());

    case "exit":
      // to be implemented!

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
    return `Error fetching file: ${fileName}`;
  }
}

async function catFile(filename) {
  const node = getCurrentDirectory().getChild(filename);
  if (!node) return `File not found: ${filename}`;
  if (node instanceof File) {
    if (node.content.endsWith(".txt")) {
      return await _fetchFileContent(node.content, filename);
    } else {
      return node.content;
    }
  }
  return `Cannot cat ${filename} (unsupported format).`;
}

function openFile(filename) {
  // perhaps add functionality to open other file types
  const node = getCurrentDirectory().getChild(filename);
  if (!node) return `File not found: ${filename}`;
  if (node instanceof File) {
    if (node.name.endsWith(".pdf")) {
      openResume(node.content);
    } else if (node.name.endsWith(".png")) {
      openImage(node.content);
    } else {
      return "Corrupted file ${filename}...";
    }
    return `Opening ${filename}...`;
  }
  return `Cannot open ${filename} (unsupported format).`;
}

function runApp(appName, input) {
  const node = getCurrentDirectory().getChild(appName);
  if (!node) return `App not found: ${appName}`;
  if (node instanceof App && node.name.endsWith(".app")) {
    const res = node.run();
    if (res !== null && typeof res === "object") {
      let sideEffectOutput = "";
      if (res.sideEffect !== null && typeof res.sideEffect === "function") {
        sideEffectOutput = res.sideEffect(input);
      }
      return [res.output ?? "", sideEffectOutput || ""]
        .filter(Boolean)
        .join("\n\n");
    }
    if (res !== null && typeof res === "string") {
      return res;
    }
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

function buildTree(folder, prefix = "") {
  const children = folder.listChildrenNodes().filter((child) => !child.hidden);
  const lastIndex = children.length - 1;
  let output = "";

  children.forEach((node, index) => {
    const isLast = index === lastIndex;
    const connector = isLast ? "└── " : "├── ";

    output += `${prefix}${connector}${node.name}\n\n`;

    if (node instanceof Folder) {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      output += buildTree(node, newPrefix);
    }
  });

  return output;
}
