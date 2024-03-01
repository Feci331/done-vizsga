const registrationForm = document.getElementById(
  "registration-form"
) as HTMLFormElement;

registrationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const emailInput = document.getElementById("email") as HTMLInputElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const confirmPasswordInput = document.getElementById(
    "confirm-password"
  ) as HTMLInputElement;

  const email = emailInput.value;
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 5;
  const isConfirmPasswordValid = confirmPassword === password;

  if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
    try {
      const response = await fetch("http://localhost:5173/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert("Successful registration!");
        registrationForm.reset(); // Az űrlap ürítése
      } else if (response.status === 400) {
        const data = await response.json();
        alert(data.error || "This email address is already in use.");
      } else {
        throw new Error("Error occurred during registration.");
      }
    } catch (error) {
      console.error("Error occurred during registration:", error);
      alert("Error occurred during registration.");
    }
  } else {
    alert("Invalid data! Please check the entered information.");
  }
});
