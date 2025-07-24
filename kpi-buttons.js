
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
      const message = `DAX Conventions

• Use [measure] and never use table[measure]
• Use table[column] and never use [column]
• Space before ‘(‘ and ‘)’ and any operand and operator
• Space before an in-line argument
• Definitions in the first row, including the assignment
    – Use ‘=’ to define calculated columns / tables
    – Use ‘:=’ to define measures`;
      alert(message);
    });
  });
});
