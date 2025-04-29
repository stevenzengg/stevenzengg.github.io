import { startForm } from "../utils/formManager.js";
export function feedback() {
  return startForm([
    "what's your name? (if you so please)",
    "what's your e-mail? (if you so please)",
    "how did you find this site?",
    "any feedback for me?",
    "would you like to submit or cancel? ('submit' to submit, anything else to cancel)",
  ]);
}
