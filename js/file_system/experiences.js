import { File } from "./fileSystem.js";

export function populateExperiences(experiences) {
  experiences.addChild(
    new File("google1.txt", "swe intern at gstore - coming soon")
  );
  experiences.addChild(
    new File("google2.txt", "Software Engineer at GCP - coming soon")
  );
  experiences.addChild(
    new File("amazon.txt", "swe intern at alexa video - coming soon")
  );
  experiences.addChild(
    new File("at&t.txt", "insurance fraud at at&t - coming soon")
  );
  experiences.addChild(
    new File("carmax.txt", "dev velocity at carmax - coming soon")
  );
}
