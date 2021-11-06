const copyButtons = [...document.querySelectorAll("button.copy")];

for (const button of copyButtons) {
  const link = button.dataset.link;

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(link);

      button.disabled = true;
      button.innerHTML = "Copied!";

      await sleep(2500);

      button.disabled = false;
      button.innerHTML = "Copy";
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
      new Date(Number(timestamp.dataset.timestamp)).toLocaleString()
    );
  } else {
    timestamp.insertAdjacentHTML("beforeend", "N/A");
  }
}

const selects = [...document.querySelectorAll("select.action")];
for (const select of selects) {
  const { id } = select.dataset;

  updateFormValue(id, select.value);

  select.addEventListener("change", (event) =>
    updateFormValue(id, event.target.value)
  );

  function updateFormValue(id, value) {
    const form = document.querySelector(`form[data-id="${id}"]`);

    form.action =
      value === "delete"
        ? `/delete-rss/${id}?_method=DELETE`
        : `/regenerate-rss/${id}`;
  }
}
