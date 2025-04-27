class Node {
  constructor(name) {
    this.name = name;
    this.parent = null;
  }
}

class File extends Node {
  constructor(name, content) {
    super(name);
    this.content = content;
  }
}

class Folder extends Node {
  constructor(name) {
    super(name);
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

const root = new Folder("/");

const about = new File(
  "about.txt",
  "Hi, I am Stove"
);
const skills = new File(
  "skills.txt",
  "cool stuff"
);
const resume = new File("resume.pdf", "assets/resume.pdf"); // Path to your actual resume file
const contact = new File(
  "contact.txt",
  "Email: https://www.zengstevenz@gmail.com\nLinkedIn: https://www.linkedin.com/in/stevenlzeng"
);

const projects = new Folder("projects");
const experience = new Folder("experience");

// Add files to root
root.addChild(about);
root.addChild(skills);
root.addChild(projects);
root.addChild(experience);
root.addChild(resume);
root.addChild(contact);

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

let _currentDirectory = root;

function getCurrentDirectory() {
  return _currentDirectory;
}

function setCurrentDirectory(newDirectory) {
  _currentDirectory = newDirectory;
}
export { root, getCurrentDirectory, setCurrentDirectory, File, Folder };
