
document.addEventListener("DOMContentLoaded", function () {
  // Copy button functionality
  document.querySelectorAll(".copy-button").forEach((button) => {
    button.addEventListener("click", () => {
      const codeBlock = button.closest(".code-toolbar").querySelector("code");
      const text = codeBlock.innerText;
      navigator.clipboard.writeText(text).then(() => {
        button.textContent = "Copied!";
        setTimeout(() => (button.textContent = "Copy"), 2000);
      }).catch(err => {
        console.error("Copy failed", err);
        button.textContent = "Failed";
      });
    });
  });

  // Conventions button functionality
  document.querySelectorAll(".conventions-button").forEach((button) => {
    button.addEventListener("click", () => {
      const message = `This pattern follows these conventions:
- Measures are created in the model, not in visuals.
- Measures are formatted using standard formatting settings.
- Time intelligence functions always use a Date table marked as such.
- The Date table must have a continuous range of dates without gaps.
- Columns in the Date table are properly related to the data model.
- Time calculations are based on standard DAX time intelligence functions.
- Measures are reusable and composed where possible.`;
      alert(message);
    });
  });
});
