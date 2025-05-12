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

    case "HELP":
      return _fetchFileContent("assets/super-help.txt");

    case "ls":
      if (args.length > 0) {
        if (args[0] === "-a") {
          return listFiles(args.length > 1 ? args[1] : "", true);
        }
        return listFiles(args[0]);
      }
      return listFiles();

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
      return (
        getCurrentDirectory().name + "\n\n" + buildTree(getCurrentDirectory())
      );

    case "exit":
    // to be implemented!

    default:
      return `Command not found: ${input}. Try 'help' for a list of commands.`;
  }
}

function listFiles(filePath = "", showHidden = false) {
  let currentDirectory = null;
  if (filePath) {
    currentDirectory = getNodeByPath(filePath);
  } else {
    currentDirectory = getCurrentDirectory();
  }
  if (!currentDirectory) return `Directory not found: ${filePath}`;
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
  const node = getNodeByPath(filename);
  if (!node) return `File not found: ${filename}`;
  if (node instanceof File) {
    if (node.content.endsWith(".txt")) {
      return await _fetchFileContent(node.content, filename);
    }
  }
  return `Cannot cat ${filename} - Try run (.app) or open (.pdf, .png, etc.) or cd (directory)... `;
}

function openFile(filename) {
  // perhaps add functionality to open other file types
  const node = getNodeByPath(filename);
  if (!node) return `File not found: ${filename}`;
  if (!(node instanceof File))
    return `Cannot open ${filename} - Try cat (.txt) or run (.app) or cd (directory)...`;
  if (node.name.endsWith(".pdf")) {
    openResume(node.content);
  } else if (node.name.endsWith(".png")) {
    openImage(node.content);
  } else {
    return `Cannot open ${filename} - Try cat (.txt) or run (.app) or cd (directory)...`;
  }
  return `Opening ${filename}...`;
}

function runApp(appName, input) {
  const node = getNodeByPath(appName);
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
  return `Cannot run ${appName} - Try cat (.txt) or open (.pdf, .png, etc.) or cd (directory)...`;
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
  const node = getNodeByPath(foldername);
  if (!node) return `Folder not found: ${foldername}`;
  if (node instanceof Folder) {
    setCurrentDirectory(node);
    return "";
  }
  return `Cannot enter ${foldername} - Try cat (.txt) or run (.app) or open (.pdf, .png, etc.)...`;
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

function getNodeByPath(path) {
  const segments = path.split("/").filter(Boolean);
  let current = getCurrentDirectory();

  for (let i = 0; i < segments.length; i++) {
    if (!(current instanceof Folder)) return null;

    const next = current.getChild(segments[i]);
    if (!next) return null;

    current = next;
  }

  return current; // could be File, Folder, App, etc.
}
