import { File } from "./fileSystem.js";

export function populateExperiences(experiences) {
  experiences.addChild(
    new File("google-internship.txt", "assets/google-internship.txt")
  );
  experiences.addChild(
    new File("google.txt", "assets/google.txt")
  );
  experiences.addChild(
    new File("amazon.txt", "assets/amazon.txt")
  );
  experiences.addChild(
    new File("at&t.txt", "insurance fraud at at&t - coming soon")
  );
  experiences.addChild(
    new File("carmax.txt", "dev velocity at carmax - coming soon")
  );
}
