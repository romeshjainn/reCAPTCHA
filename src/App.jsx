import { useState, useEffect } from "react";

function App() {
  const siteKey = import.meta.env.VITE_SITE_KEY; // Fetch the site key from .env
  const [captchaToken, setCaptchaToken] = useState("");

  // Wait for the reCAPTCHA API to load and then initialize it
  useEffect(() => {
    const loadRecaptcha = () => {
      // Check if reCAPTCHA is already loaded
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          // Create the reCAPTCHA widget after the API is ready
          window.grecaptcha.render("recaptcha-container", {
            sitekey: siteKey,
            callback: handleCaptcha,
          });
        });
      }
    };

    // Dynamically load the reCAPTCHA script
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    script.onload = loadRecaptcha;
    document.head.appendChild(script);

    // Clean up the script when component is unmounted
    return () => {
      script.remove();
    };
  }, [siteKey]);

  // Callback function to handle the CAPTCHA token
  const handleCaptcha = (token) => {
    setCaptchaToken(token);
    console.log("Generated Token: ", token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      alert("Please complete the CAPTCHA.");
      return;
    }
  };

  const verifyRecaptch = async () => {
    // Send CAPTCHA token to the server for verification
    try {
      const response = await fetch("http://localhost:5000/api/verify-captcha", {
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

  useEffect(() => {
    captchaToken.length && verifyRecaptch();
  }, [captchaToken]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div id="recaptcha-container"></div>{" "}
        {/* The reCAPTCHA will be rendered here */}
        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default App;
