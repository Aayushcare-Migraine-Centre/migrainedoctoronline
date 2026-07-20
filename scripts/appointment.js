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
async function loadStates() {
  const stateSelect = document.getElementById("newState");

  stateSelect.innerHTML = `<option value="">Loading...</option>`;
  stateSelect.disabled = true;

  const spinner = document.createElement("div");
  spinner.className = "spinner";
  stateSelect.parentNode.appendChild(spinner);

  try {
    const res = await fetch(
      "https://software.aayushcare.com/api/resource/State?limit_page_length=0",
      {
        method: "GET",
        headers: {
          Authorization: "token 7897c339c442e4b:01ff7013b92aa32",
        },
      },
    );
    const data = await res.json();
    console.log("states", data);

    spinner.remove();
    stateSelect.disabled = false;
    stateSelect.innerHTML = `<option value="">-- Select State --</option>`;

    data.data.forEach((state) => {
      const opt = document.createElement("option");
      //opt.value = state.code;
      opt.textContent = state.name;
      stateSelect.appendChild(opt);
    });
  } catch (err) {
    spinner.remove();
    showError("newState", "Failed to load states");
  }
}

//Load Districts with Spinner
async function loadDistricts(stateCode) {
  const districtSelect = document.getElementById("newDistrict");
  const selectedState = document.getElementById("newState").value;

  districtSelect.innerHTML = `<option value="">Loading...</option>`;
  districtSelect.disabled = true;

  const spinner = document.createElement("div");
  spinner.className = "spinner";
  districtSelect.parentNode.appendChild(spinner);

  try {
    const filters = JSON.stringify([["state", "=", selectedState]]);
    console.log("filters", filters);
    const res = await fetch(
      `https://software.aayushcare.com/api/resource/District?filters=${encodeURIComponent(filters)}&limit_page_length=0`,
      {
        method: "GET",
        headers: {
          Authorization: "token 7897c339c442e4b:01ff7013b92aa32",
        },
      },
    );
    console.log("res", res);
    const data = await res.json();

    spinner.remove();
    districtSelect.disabled = false;
    districtSelect.innerHTML = `<option value="">-- Select District --</option>`;

    data.data.forEach((dist) => {
      const opt = document.createElement("option");
      opt.value = dist.name;
      opt.textContent = dist.name;
      districtSelect.appendChild(opt);
    });
  } catch (err) {
    console.log("err", err);
    spinner.remove();
    showError("newDistrict", "Failed to load districts");
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
    "newContact",
    "newEmail",
    "newState",
    "newDistrict",
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
newState.addEventListener("change", (e) => {
  if (e.target.value) loadDistricts(e.target.value);
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
loadStates();
