const copyButtons = [...document.querySelectorAll("button.copy")];

for (const button of copyButtons) {
  const link = button.dataset.link;

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(link);

      button.disabled = true;
      button.innerHTML = "Link copied!";

      await sleep(2500);

      button.disabled = false;
      button.innerHTML = "Copy link";
    } catch (error) {
      console.error("Copy to clipboard not supported.");
    }
  });
}

const moreButtons = [...document.querySelectorAll("button.more")];

for (const button of moreButtons) {
  const form = document.querySelector(`form[data-id="${button.dataset.id}"]`);

  button.addEventListener("click", () => {
    form.dataset.status =
      form.dataset.status === "active" ? "inactive" : "active";

    button.innerHTML = form.dataset.status === "active" ? "Less" : "More";
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const timestamps = [...document.querySelectorAll(".timestamp")];

for (const timestamp of timestamps) {
  if (timestamp.dataset.timestamp) {
    timestamp.insertAdjacentHTML(
      "beforeend",
      new Date(Number(timestamp.dataset.timestamp)).toLocaleString("en-GB")
    );
  } else {
    timestamp.insertAdjacentHTML("beforeend", "N/A");
  }
}

const actionButtons = [
  ...document.querySelectorAll('button[data-role="action-trigger"]'),
];

for (const actionButton of actionButtons) {
  actionButton.addEventListener("click", () => {
    const id = actionButton.dataset.actionsId;

    const responder = document.querySelector(
      `[data-role="action-target"][data-actions-id="${id}"]`
    );

    responder.dataset.status =
      responder.dataset.status === "active" ? "inactive" : "active";
    actionButton.dataset.status =
      actionButton.dataset.status === "active" ? "inactive" : "active";

    const queryString = new URLSearchParams(window.location.search);

    if (queryString.toString() !== "") {
      history.replaceState(null, null, "/dashboard");
    }
  });
}

const queryString = new URLSearchParams(window.location.search);
const tab = queryString.get("tab");
const id = queryString.get("id");

const actionResponder = document.querySelector(
  `[data-role="action-target"][data-actions-id="${id}"]`
);
const actionTrigger = document.querySelector(
  `[data-role="action-trigger"][data-actions-id="${id}"]`
);

if (actionResponder) {
  actionResponder.dataset.status = "active";
  actionTrigger.dataset.status =
    actionTrigger.dataset.status === "active" ? "inactive" : "active";
}
