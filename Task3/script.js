const countDisplay = document.getElementById("count");
const incrementBtn = document.querySelector(".increment");
const decrementBtn = document.querySelector(".decrement");
const resetBtn = document.querySelector(".reset");

let count = 0;

// Increment
incrementBtn.addEventListener("click", () => {
  count++;
  countDisplay.textContent = count;
});

// Decrement (ما ينزلش تحت الصفر)
decrementBtn.addEventListener("click", () => {
  if (count > 0) {
    count--;
    countDisplay.textContent = count;
  }
});

// Reset
resetBtn.addEventListener("click", () => {
  count = 0;
  countDisplay.textContent = count;
});

