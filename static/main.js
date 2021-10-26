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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
