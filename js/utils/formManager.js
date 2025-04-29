let isFormMode = false;
let currentForm = null;

export function startForm(questions) {
  isFormMode = true;
  currentForm = {
    questions,
    currentIndex: 1,
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
        const formatted = formatAnswers(currentForm.answers);
        sendFormAnswersToEmail(currentForm.answers);
        currentForm = null;
        return "Thanks for the feedback!";
    } else {
        currentForm = null;
        return "Form cancelled. Your responses were not saved."
    }
  }
}

function formatAnswers(answers) {
  return answers.map((a, i) => `${i + 1}. ${a}`).join("\n");
}

async function sendFormAnswersToEmail(answers) {
  const message = formatAnswers(answers);

  try {
    await emailjs.send("service_fbu1e2n", "your_template_id", {
      to_email: "zengstevenz@gmail.com",
      message,
    });
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}
