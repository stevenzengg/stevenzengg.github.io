let isFormMode = false;
let currentForm = null;
let scriptURL =
  "https://script.google.com/macros/s/AKfycbxH6WuV4jmU1Q7Z-TS6VO4PvhbwFm19DK3-vKEPqalVQ3WnOLQ496syMl41mYBpw-_z/exec";
export function startForm(questions) {
  isFormMode = true;
  currentForm = {
    questions,
    currentIndex: 0,
    answers: [],
  };
  return questions[0];
}

export function isInFormMode() {
  return isFormMode;
}

export async function handleFormInput(input) {
  if (!currentForm) return;

  currentForm.answers.push(input);
  currentForm.currentIndex++;

  if (currentForm.currentIndex < currentForm.questions.length) {
    return currentForm.questions[currentForm.currentIndex];
  } else {
    isFormMode = false;
    if (input == "submit") {
      console.log("Form submitted with answers:", currentForm.answers);
      sendFormAnswersToEmail(currentForm.answers);
      currentForm = null;
      return "Thanks for the feedback!";
    } else {
      currentForm = null;
      return "Form cancelled. Your responses were not saved.";
    }
  }
}

/*
design tradeoff here - do i know that you can ddox me via this app script?
yes i do. do i care? yes i do. do i care enough to change it? no i do not.
just kidding, but my app script is limited to 100 emails per day, so it limits
the total spammage. serverless is a pain, and i do not want to implement a rate
limiter here. how i might do it most simply though, is a simple database/table
with IP address and timestamp of last submission, and just token bucket it.
other solutions:
1. emailJS - better control over the email design, but if i want to protect
API keys, i need to pay. otherwise, i'd need to expose it in the client side
since i have no server.
2. abstract everything away to a server - the best solution, but really not needed
what am i scaling? ...unless i get a lot of traffic hehe. 
3. what i didn't research but may be even better - an API into google forms
*/

async function sendFormAnswersToEmail(answers) {
  const data = {
    name: answers[0],
    email: answers[1],
    feedback: answers[2],
  };

  fetch(scriptURL, {
    method: "POST",
    mode: "no-cors", // ← disables preflight & avoids CORS
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch((err) => {
    console.error("Failed to send", err);
  });
}
