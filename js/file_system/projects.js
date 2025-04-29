import { File } from "./fileSystem.js";

export function populateProjects(projects) {
    projects.addChild(new File("notivate.txt", "notivate - coming soon"));
    projects.addChild(
      new File("neural-networks.txt", "image classification - coming soon")
    );
    projects.addChild(new File("acrp.txt", "airport design - coming soon"));
    projects.addChild(
      new File("venmo-automation.txt", "venmo automation - coming soon")
    );
    projects.addChild(
      new File("dupe-deleter.txt", "close duplicate chrome tabs! - coming soon")
    );
}