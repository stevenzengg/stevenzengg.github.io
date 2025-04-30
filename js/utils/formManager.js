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
