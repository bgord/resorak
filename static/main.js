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

const selects = [...document.querySelectorAll("select.action")];
for (const select of selects) {
  const { id } = select.dataset;

  updateFormValue(id, select.value);

  select.addEventListener("change", (event) =>
    updateFormValue(id, event.target.value)
  );

  function updateFormValue(id, value) {
    const form = document.querySelector(`form[data-id="${id}"]`);

    if (value === "delete") {
      form.action = `/delete-rss/${id}?_method=DELETE`;
    }
    if (value === "regenerate") {
      form.action = `/regenerate-rss/${id}`;
    }
    if (value === "include-reply-tweets") {
      form.action = `/include-reply-tweets-in-rss/${id}`;
    }
    if (value === "skip-reply-tweets") {
      form.action = `/skip-reply-tweets-in-rss/${id}`;
    }
    if (value === "suspend") {
      form.action = `/suspend-rss/${id}`;
    }
    if (value === "activate") {
      form.action = `/activate-rss/${id}`;
    }
  }
}
