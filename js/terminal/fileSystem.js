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

const about = new File("about.txt", "assets/about.txt");
const resume = new File("resume.pdf", "assets/resume.pdf");
const contact = new File("contact.txt", "assets/contact.txt");

const projects = new Folder("projects");
const experience = new Folder("experience");
const sysDesigns = new Folder("system-designs", true);

const uptime = new App("uptime.exe", () => {
  const birthDate = new Date("2000-02-14T00:00:00Z");
  const now = new Date();
  const diffMs = now - birthDate;

  const seconds = Math.floor(diffMs / 1000) % 60;
  const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
  const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return `Steven has been alive for: ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds.
  Note that this is an approximation, please do not try to doxx me.`;
});

const tree = new App("tree.exe", () => {
  return "~\n\n" + buildTree(root);
});

// Add files to root
root.addChild(about);
root.addChild(projects);
root.addChild(experience);
root.addChild(resume);
root.addChild(contact);
root.addChild(sysDesigns);
root.addChild(uptime);
root.addChild(tree);

// Add project files
projects.addChild(
  new File("portfolio.txt", "Built a portfolio site showcasing projects.")
);
projects.addChild(
  new File(
    "weather-app.txt",
    "Weather forecast application using React and API integrations."
  )
);

// Add experience files
experience.addChild(
  new File("google.txt", "Software Engineer Intern at Google.")
);
experience.addChild(
  new File("startup.txt", "Backend Developer at a fintech startup.")
);

// Add system design files
const twitch = new File("twitch.png", "assets/twitch.png", true);

const ticketMaster = new File(
  "ticket-master.png",
  "assets/ticket-master.png",
  true
);

sysDesigns.addChild(twitch);
sysDesigns.addChild(ticketMaster);

let _currentDirectory = root;

function getCurrentDirectory() {
  return _currentDirectory;
}

function setCurrentDirectory(newDirectory) {
  _currentDirectory = newDirectory;
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

export { root, getCurrentDirectory, setCurrentDirectory, File, Folder, App };
