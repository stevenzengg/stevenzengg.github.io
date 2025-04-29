import { startForm } from "../utils/formManager.js";
export function feedback() {
  return startForm([
    "What's your name?",
    "How did you find this site?",
    "Any feedback for me?",
    "Would you like to submit or cancel? ('submit' to submit, anything else to cancel)",
  ]);
}
