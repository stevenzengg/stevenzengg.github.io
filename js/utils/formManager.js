let isFormMode = false;
let currentForm = null;
let scriptURL =
  "https://script.google.com/macros/s/AKfycbzUXfu3VrN3bGhdgq6RenwEembs-SLihWTtibTsT1zxdMR4Iaf9G1JwE1bayo7UrXGR/exec";
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

  try {
    await fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}
