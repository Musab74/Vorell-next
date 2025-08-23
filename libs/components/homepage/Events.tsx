import React, { useEffect, useState } from "react";

const heroLinks = [
  { label: "Top Watches", key: "top", target: "top-watches-section" },
  { label: "Top Stores", key: "collections", target: "stores-section" },
  { label: "Limited Edition", key: "stores", target: "limited-section" },
  { label: "News", key: "news", target: "news-section" },
];

const rolexGreen = "#217A3E";

const HeroSection: React.FC = () => {
  const [active, setActive] = useState("top");

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      let found = false;
      for (const l of heroLinks) {
        const section = document.getElementById(l.target);
        if (section) {
          const rect = section.getBoundingClientRect();
          // If section top is less than 140 and bottom is more than 120 (visible in viewport)
          if (rect.top < 140 && rect.bottom > 120) {
            setActive(l.key);
            found = true;
            break;
          }
        }
      }
      if (!found) setActive("top");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to section on click
  const handleClick = (target: string, key: string) => {
    const section = document.getElementById(target);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(key);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        boxShadow: "0 1px 0 #ececec",
        height: "58px",
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 97,
        transition: "box-shadow 0.2s",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          width: "100%",
          margin: "0 auto",
          height: "58px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "38px",
            alignItems: "center",
            fontFamily: "Lato, 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 700,
            fontSize: "17px",
            letterSpacing: 0,
            flex: 1,
            justifyContent: "center",
            height: "100%",
          }}
        >
          {heroLinks.map((l) => (
            <div
              key={l.key}
              style={{
                color: active === l.key ? rolexGreen : "#1a1a1a",
                fontWeight: active === l.key ? 700 : 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                position: "relative",
                padding: "0 7px",
                height: "100%",
                borderBottom:
                  active === l.key
                    ? `3px solid ${rolexGreen}`
                    : "3px solid transparent",
                transition: "color 0.22s, border-bottom 0.22s",
                textDecoration: "none",
                background: "none",
              }}
              onClick={() => handleClick(l.target, l.key)}
            >
              {l.label}
              {active === l.key && (
                <span
                  style={{
                    marginLeft: 7,
                    width: 8,
                    height: 8,
                    background: rolexGreen,
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                ></span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
