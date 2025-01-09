import { useState, useEffect } from "react";

function App() {
  const siteKey = import.meta.env.VITE_SITE_KEY; // Fetch the site key from .env
  const [captchaToken, setCaptchaToken] = useState("");

  // Callback function to handle the CAPTCHA token
  useEffect(() => {
    // Assign the function to the global scope
    window.handleCaptcha = (token) => {
      setCaptchaToken(token);
      console.log("Generated Token: ", token);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      alert("Please complete the CAPTCHA.");
      return;
    }

    // Send CAPTCHA token to the server for verification
    try {
      const response = await fetch("http://localhost:5000/verify-captcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: captchaToken }),
      });
      const result = await response.json();
      if (result.success) {
        alert("CAPTCHA verified and form submitted successfully!");
      } else {
        alert("CAPTCHA verification failed.");
      }
    } catch (error) {
      console.error("Error verifying CAPTCHA:", error);
    }
  };

  return (
    <>
      <script
        src="https://www.google.com/recaptcha/api.js"
        async
        defer
      ></script>
      <form onSubmit={handleSubmit}>
        <div
          className="g-recaptcha"
          data-sitekey={siteKey}
          data-callback="handleCaptcha" // Reference to the global function
        ></div>
        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default App;
