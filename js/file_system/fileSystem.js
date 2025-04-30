import { populateRoot } from "./root.js";
class Node {
  constructor(name, hidden = false) {
    this.name = name;
    this.parent = null;
    this.hidden = hidden;
  }
}

class File extends Node {
  constructor(name, content, hidden = false) {
    super(name, hidden);
    this.content = content;
  }
}

class Folder extends Node {
  constructor(name, hidden = false) {
    super(name, hidden);
    this.children = {};
  }

  addChild(node) {
    node.parent = this;
    this.children[node.name] = node;
  }

  getChild(name) {
    return this.children[name];
  }

  listChildren() {
    return Object.keys(this.children);
  }
  listChildrenNodes() {
    return Object.values(this.children);
  }
}

class App extends Node {
  constructor(name, runFunction, hidden = false) {
    super(name, hidden);
    this.run = runFunction;
  }
}

const root = new Folder("~");
populateRoot(root);
let _currentDirectory = root;

function getCurrentDirectory() {
  return _currentDirectory;
}

function setCurrentDirectory(newDirectory) {
  _currentDirectory = newDirectory;
}

function resetCurrentDirectory() {
  _currentDirectory = root;
}

export { root, getCurrentDirectory, setCurrentDirectory, resetCurrentDirectory, File, Folder, App };
