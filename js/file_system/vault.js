import { File, Folder } from "./fileSystem.js";

export function populateVault(vault) {
  const sysDesigns = new Folder("system-designs", true);
  vault.addChild(sysDesigns);

  const twitch = new File("twitch.png", "assets/twitch.png", true);
  const ticketMaster = new File(
    "ticketmaster.png",
    "assets/ticketmaster.png",
    true
  );

  sysDesigns.addChild(twitch);
  sysDesigns.addChild(ticketMaster);
}

/* ideally, I create a separate sysDesigns populate function, 
    but right now, since vault only contains a single subdirectory,
    I'll directly add all sub-nodes to vault here */
