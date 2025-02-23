"use client";
import Script from "next/script";
import React from "react";

const BannerAd = () => {
  return (
    <div
      style={{
        width: "468px",
        height: "60px",
        margin: "20px auto",
        textAlign: "center",
        backgroundColor: "#f0f0f0", // Temporary background to check visibility
      }}
    >
      <Script
        id="adsterra-banner"
        strategy="afterInteractive" // Ensures it loads after page hydration
        dangerouslySetInnerHTML={{
          __html: `
            atOptions = {
              'key' : '3e5c0db0e54f3f6872ff8546641e31c0',
              'format' : 'iframe',
              'height' : 60,
              'width' : 468,
              'params' : {}
            };
          `,
        }}
      />
      <Script
        id="adsterra-script"
        strategy="afterInteractive"
        src="//disgustingmad.com/3e5c0db0e54f3f6872ff8546641e31c0/invoke.js"
      />
    </div>
  );
};

export default BannerAd;
