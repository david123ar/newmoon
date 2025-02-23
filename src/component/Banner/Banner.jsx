"use client";
import React, { useEffect, useRef } from "react";

const BannerAd = () => {
  const adRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && adRef.current && !adRef.current.hasChildNodes()) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "//disgustingmad.com/3e5c0db0e54f3f6872ff8546641e31c0/invoke.js";
      script.async = true;
      adRef.current.appendChild(script);
    }
  }, []);

  return (
    <div
      ref={adRef}
      style={{
        width: "468px",
        height: "60px",
        margin: "20px auto",
        textAlign: "center",
      }}
    >
      {/* Adsterra Banner will load here */}
    </div>
  );
};

export default BannerAd;
