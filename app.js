const caseForm = document.getElementById("new-case-form");
const caseList = document.getElementById("cases");
const letterOutput = document.getElementById("letterOutput");

// Store cases in memory
let cases = [];

// Rules: How many days to add based on type
const deadlineRules = {
  ECC: 30,
  JCCR: 30,
};

// Auto-set deadline based on selected type
function autoSetDeadline() {
  const caseType = document.getElementById("caseType").value;
  const deadlineInput = document.getElementById("deadline");

  if (deadlineRules[caseType]) {
    const daysToAdd = deadlineRules[caseType];
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysToAdd);
    const formatted = newDate.toISOString().split("T")[0];
    deadlineInput.value = formatted;
  } else {
    deadlineInput.value = "";
  }
}

// Form submit
caseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const clientName = document.getElementById("clientName").value;
  const caseType = document.getElementById("caseType").value;
  const deadline = document.getElementById("deadline").value;
  const caseNotes = document.getElementById("caseNotes").value;

  const newCase = {
    id: Date.now(),
    clientName,
    caseType,
    deadline,
    caseNotes,
  };

  cases.push(newCase);
  renderCases();
  caseForm.reset();
  document.getElementById("deadline").value = "";
});

// Show all cases
function renderCases() {
  caseList.innerHTML = "";

  cases.forEach((c) => {
    const deadlineDate = new Date(c.deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${c.clientName}</strong> - ${c.caseType} (Due: ${c.deadline})<br>
      <small>${c.caseNotes}</small><br>
      <span style="color: ${diffDays < 7 ? 'red' : 'green'};">
        ${diffDays} day(s) remaining
      </span>
    `;
    caseList.appendChild(li);
  });
}

// Letter generator
function generateDemandLetter() {
  if (cases.length === 0) {
    letterOutput.textContent = "No cases available to generate a letter.";
    return;
  }

  const latestCase = cases[cases.length - 1];
  const letter = `
Dear Insurance Adjuster,

This letter is in reference to our client, ${latestCase.clientName}, regarding a ${latestCase.caseType} case. 
We are requesting a fair settlement based on injuries sustained and the circumstances outlined below:

${latestCase.caseNotes}

Please respond by the deadline: ${latestCase.deadline}.

Sincerely,
Law Office
  `;

  letterOutput.textContent = letter;
}
