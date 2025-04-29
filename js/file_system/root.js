import { uptime } from "./uptime.js";
import { feedback } from "./feedback.js";
import { populateExperiences } from "./experiences.js";
import { populateProjects } from "./projects.js";
import { populateVault } from "./vault.js";
import { File, Folder, App } from "./fileSystem.js";

export function populateRoot(root) {
  const about = new File("about.txt", "assets/about.txt");
  const resume = new File("resume.pdf", "assets/resume.pdf");
  const contact = new File("contact.txt", "assets/contact.txt");
  const portfolioIterations = new File(
    "portfolio-iterations.txt",
    "assets/portfolio-iterations.txt"
  );
  const projects = new Folder("projects");
  const experiences = new Folder("experience");

  const uptimeNode = new App("uptime.app", () => uptime());
  const feedbackNode = new App("feedback.app", () => ({
    output: "starting feedback form...",
    sideEffect: () => feedback(),
  }));
  const vault = new Folder("vault", true);

  // Add files to root
  root.addChild(about);
  root.addChild(projects);
  root.addChild(experiences);
  root.addChild(resume);
  root.addChild(vault);
  root.addChild(uptimeNode);
  root.addChild(feedbackNode);
  root.addChild(portfolioIterations);
  root.addChild(contact);

  populateExperiences(experiences);
  populateProjects(projects);
  populateVault(vault);
}
