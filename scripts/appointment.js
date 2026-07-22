//Show error below fields
function showError(id, message) {
  const el = document.getElementById(id);
  const errorId = id + "_error";

  let errorEl = document.getElementById(errorId);
  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.id = errorId;
    errorEl.className = "error";
    el.parentNode.appendChild(errorEl);
  }

  errorEl.textContent = message;
}

function clearError(id) {
  const errorEl = document.getElementById(id + "_error");
  if (errorEl) errorEl.textContent = "";
}

//Load States with Spinner
async function loadCountries() {
  const countrySelect = document.getElementById("newCountry");

  countrySelect.innerHTML = `<option value="">Loading...</option>`;
  countrySelect.disabled = true;

  const spinner = document.createElement("div");
  spinner.className = "spinner";
  countrySelect.parentNode.appendChild(spinner);

  try {
    const res = await fetch(
      "https://api.migrainedoctoronline.com/GetCountries?limit_page_length=0",
      {
        method: "GET",
      },
    );
    const data = await res.json();
    console.log("countries", data);

    spinner.remove();
    countrySelect.disabled = false;
    countrySelect.innerHTML = `<option value="">-- Select Country --</option>`;

    data.data.forEach((state) => {
      const opt = document.createElement("option");
      //opt.value = state.code;
      opt.textContent = state.name;
      countrySelect.appendChild(opt);
    });
  } catch (err) {
    spinner.remove();
    showError("newCountry", "Failed to load countries");
  }
}

//Load Districts with Spinner
async function loadStates(countryCode) {
  const stateSelect = document.getElementById("newState");
  const selectedCountry = document.getElementById("newCountry").value;

  stateSelect.innerHTML = `<option value="">Loading...</option>`;
  stateSelect.disabled = true;

  const spinner = document.createElement("div");
  spinner.className = "spinner";
  stateSelect.parentNode.appendChild(spinner);

  try {
    const res = await fetch(
      `https://api.migrainedoctoronline.com/GetStates?limit_page_length=0`,
      {
        method: "GET",
      },
    );
    console.log("res", res);
    const data = await res.json();

    spinner.remove();
    stateSelect.disabled = false;
    stateSelect.innerHTML = `<option value="">-- Select State --</option>`;

    data.data.forEach((dist) => {
      const opt = document.createElement("option");
      opt.value = dist.name;
      opt.textContent = dist.name;
      stateSelect.appendChild(opt);
    });
  } catch (err) {
    console.log("err", err);
    spinner.remove();
    showError("newState", "Failed to load states");
  }
}

//Email Validation
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

//Contact Validation
function validateContact(contact) {
  return /^[0-9]{10}$/.test(contact);
}

//Mandatory Fields + Error Messages
function validateForm() {
  const fields = [
    "newName",
    "firstName",
    "lastName",
    "newContact",
    "newEmail",
    "newCountry",
    "newState",
    "newLanguage",
    "newReferral",
    "newDoctor",
    "appointmentDate",
  ];

  let valid = true;

  fields.forEach((id) => {
    const el = document.getElementById(id);
    clearError(id);

    if (!el.value.trim()) {
      showError(id, "This field is required");
      valid = false;
    }
  });

  if (!validateEmail(newEmail.value)) {
    showError("newEmail", "Invalid email format");
    valid = false;
  }

  if (!validateContact(newContact.value)) {
    showError("newContact", "Contact number must be 10 digits");
    valid = false;
  }

  return valid;
}

/* document.getElementById("payButton").addEventListener("click", () => {
  if (validateForm()) showReview();
}); */

//Event Listeners
document.getElementById("newCountry").addEventListener("change", (e) => {
  console.log("e.target.value");
  if (e.target.value == "India") {
    loadStates(e.target.value);
    document.getElementById("stateWrapper").style.display = "block";
  } else {
    document.getElementById("stateWrapper").style.display = "none";
  }
});

newEmail.addEventListener("blur", () => {
  clearError("newEmail");
  if (!validateEmail(newEmail.value))
    showError("newEmail", "Invalid email format");
});

newContact.addEventListener("blur", () => {
  clearError("newContact");
  if (!validateContact(newContact.value))
    showError("newContact", "Contact number must be 10 digits");
});

//Load States on Page Load
loadCountries();
