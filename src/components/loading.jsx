import { useEffect } from "react";

export default function LoadingAnimation() {
  // Load the dotlottie web component script once
  useEffect(() => {
    const existing = document.querySelector(
      'script[src*="dotlottie-wc"]'
    );
    if (existing) return; // already loaded

    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.11/dist/dotlottie-wc.js";
    script.type = "module";
    document.head.appendChild(script);
  }, []);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    }}>
      {/* @ts-ignore — custom web component */}
      <dotlottie-wc
        src="https://lottie.host/23a885a4-39bf-4c5d-8efe-5bf17c6ece61/VbEK9pRCLx.lottie"
        style={{ width: 280, height: 280 }}
        autoplay
        loop
      />
    </div>
  );
}