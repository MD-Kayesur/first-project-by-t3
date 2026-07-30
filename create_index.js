const fs = require('fs');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flowstate - Deep Work in a Distracted World</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500&display=swap" rel="stylesheet">
  
  <script type="importmap">
    {
      "imports": {
        "lenis": "https://unpkg.com/lenis@1.3.19/dist/lenis.mjs"
      }
    }
  </script>
  
  <style>
    :root {
      --hero-base:            #04050c;
      --heading:             #eef0f6;
      --body-muted:          #b9becf;
      --on-media:            #ffffff;
      --action-inverse:      #ffffff;
      --action-inverse-fg:   #2f2f33;
      --glass-fill:          rgba(255,255,255,0.08);
      --glass-border:        rgba(255,255,255,0.16);
      --scrim:               rgba(4,5,12,0.46);
      --scrim-strong:        rgba(4,5,12,0.68);
      --scrim-soft:          rgba(4,5,12,0.12);
      --duration-fast:       150ms;
      --ease-entrance:       cubic-bezier(0.2, 0, 0, 1);
    }

    html { font-size: 16px; }
    @media (max-width: 1920px) { html { font-size: 0.833333vw; } }
    @media (max-width: 1440px) { html { font-size: 1.111111vw; } }
    @media (max-width: 1024px) { html { font-size: 1.5625vw;   } }
    @media (max-width: 640px)  { html { font-size: 4.444444vw; } }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    a, button, input { text-decoration: none; color: inherit; border: none; background: none; font: inherit; }
    button { cursor: pointer; }
    
    body {
      background: var(--hero-base);
      color: var(--heading);
      overflow-x: hidden;
      font-family: "Onest", sans-serif;
      font-weight: 400;
    }

    section {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100lvh;
      width: 100vw;
      overflow: hidden;
      background: var(--hero-base);
      text-align: center;
      padding: 0 1.25rem;
    }
    @media (min-width: 640px) {
      section { padding: 0 2.5rem; }
    }

    canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
    }

    .scrim {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background: radial-gradient(115% 95% at 50% 46%, var(--scrim-strong) 0%, var(--scrim-strong) 24%, var(--scrim) 52%, var(--scrim-soft) 100%);
    }

    header {
      position: absolute;
      inset-inline: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem;
      z-index: 20;
    }
    @media (min-width: 640px) {
      header { padding: 1.75rem 2.5rem; }
    }

    .brand-link {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-weight: 500;
      font-size: 1.15rem;
      color: var(--on-media);
      letter-spacing: -0.01em;
    }
    @media (min-width: 640px) {
      .brand-link { font-size: 1.375rem; }
    }
    .brand-link svg {
      width: 1.35rem;
      height: 1.35rem;
      stroke: currentColor;
    }
    @media (min-width: 640px) {
      .brand-link svg { width: 1.5rem; height: 1.5rem; }
    }

    .glass-nav { display: none; }
    @media (min-width: 640px) {
      .glass-nav {
        display: flex;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        height: 3rem;
        align-items: center;
        gap: 2.25rem;
        border-radius: 9999px;
        border: 1px solid var(--glass-border);
        background: var(--glass-fill);
        padding: 0 1.75rem;
        backdrop-filter: blur(12px);
      }
    }
    .glass-nav a {
      font-size: 0.95rem;
      color: var(--body-muted);
      transition: color var(--duration-fast) var(--ease-entrance);
      white-space: nowrap;
    }
    .glass-nav a:hover { color: var(--heading); }

    .pill-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 2.5rem;
      border-radius: 9999px;
      background: var(--action-inverse);
      padding: 0 1.125rem;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--action-inverse-fg);
      box-shadow: 0 1px 2px rgba(0,0,0,.05);
      transition: background var(--duration-fast) var(--ease-entrance), box-shadow var(--duration-fast) var(--ease-entrance);
    }
    @media (min-width: 640px) {
      .pill-button { height: 2.75rem; padding: 0 1.375rem; font-size: 0.95rem; }
    }
    .pill-button:hover { background: rgba(255,255,255,0.85); }
    .pill-button:focus-visible { outline: none; box-shadow: 0 0 0 2px rgba(255,255,255,.7); }

    .center-column {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: 22rem;
    }
    @media (min-width: 640px) { .center-column { max-width: 40rem; } }
    @media (min-width: 1024px) { .center-column { max-width: 52rem; } }

    .badge {
      display: inline-flex;
      align-items: center;
      border-radius: 9999px;
      border: 1px solid var(--glass-border);
      background: var(--glass-fill);
      padding: 0.4rem 0.875rem;
      font-size: 0.72rem;
      color: var(--body-muted);
      backdrop-filter: blur(12px);
      font-weight: 500;
    }
    @media (min-width: 640px) { .badge { font-size: 0.8rem; } }

    h1 {
      margin-top: 1.25rem;
      max-width: 20rem;
      font-size: 2rem;
      font-weight: 500;
      line-height: 1.1;
      letter-spacing: -0.02em;
      color: var(--heading);
      text-align: center;
    }
    @media (min-width: 640px) { h1 { margin-top: 1.75rem; max-width: 34rem; font-size: 3.5rem; } }
    @media (min-width: 1024px) { h1 { max-width: 46rem; font-size: 5rem; } }

    .sub-line {
      margin-top: 1rem;
      max-width: 20rem;
      font-size: 1rem;
      line-height: 1.5;
      color: var(--body-muted);
    }
    @media (min-width: 640px) { .sub-line { margin-top: 1.25rem; max-width: 34rem; font-size: 1.1rem; } }
    @media (min-width: 1024px) { .sub-line { max-width: none; font-size: 1.2rem; } }

    .waitlist-form {
      margin-top: 1.75rem;
      display: flex;
      justify-content: center;
      width: 100%;
    }
    @media (min-width: 640px) { .waitlist-form { margin-top: 2.5rem; } }

    form {
      width: 37rem;
      max-width: 100%;
    }

    .glass-bar {
      display: flex;
      align-items: center;
      height: 3.5rem;
      border-radius: 9999px;
      border: 1px solid var(--glass-border);
      background: var(--glass-fill);
      backdrop-filter: blur(12px);
      box-shadow: 0 1px 2px rgba(0,0,0,.05);
      padding-left: 1.25rem;
      padding-right: 0.35rem;
    }
    @media (min-width: 640px) { .glass-bar { height: 4rem; padding-left: 1.5rem; padding-right: 0.4rem; } }

    .glass-bar input {
      flex: 1;
      min-width: 0;
      height: 100%;
      background: transparent;
      color: var(--heading);
      font-size: 0.95rem;
      border: none;
      outline: none;
    }
    .glass-bar input::placeholder { color: var(--body-muted); }
    @media (min-width: 640px) { .glass-bar input { font-size: 1.15rem; } }

    footer {
      position: absolute;
      inset-inline: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      padding: 1.25rem;
      font-size: 0.72rem;
      color: var(--body-muted);
      z-index: 20;
    }
    @media (min-width: 640px) { footer { padding: 1.5rem 2.5rem; font-size: 0.8rem; } }

    /* Reveal animations */
    .reveal-block {
      opacity: 0;
      animation: reveal-block 700ms var(--ease-entrance) forwards;
    }
    @keyframes reveal-block {
      to { opacity: 1; transform: translateY(0); }
    }
    
    .nav-reveal { transform: translateY(-0.75rem); animation-delay: 150ms; }
    .badge-reveal { transform: translateY(1.25rem); animation-delay: 320ms; }
    .form-reveal { transform: translateY(1.25rem); animation-delay: 1450ms; }
    .footer-reveal { transform: translateY(1.25rem); animation-delay: 1650ms; }
  </style>
</head>
<body>

  <section>
    <canvas id="fluid-canvas" aria-hidden="true"></canvas>
    <div class="scrim" aria-hidden="true"></div>
    
    <header class="reveal-block nav-reveal">
      <a href="/" class="brand-link">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M2.5 9c2.5 0 2.5 4.2 5 4.2S10 9 12 9s2.5 4.2 5 4.2S19.5 9 21.5 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M2.5 15c2.5 0 2.5 4.2 5 4.2S10 15 12 15s2.5 4.2 5 4.2S19.5 15 21.5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/>
        </svg>
        Flowstate
      </a>
      <div class="glass-nav">
        <a href="#how-it-works">How it works?</a>
        <a href="#pricing">Pricing</a>
        <a href="#products">Products</a>
        <a href="#blog">Blog</a>
      </div>
      <a href="#get-started" class="pill-button">Get Started</a>
    </header>
    
    <div class="center-column">
      <p class="badge reveal-block badge-reveal">10K+ already in flow</p>
      <h1 id="heading">Deep Work in a Distracted World</h1>
      <p class="sub-line" id="subline">Cut through the noise, reclaim your attention, and do work that truly matters.</p>
      
      <div class="waitlist-form reveal-block form-reveal">
        <form id="waitlist-form">
          <div class="glass-bar">
            <input type="email" required placeholder="Enter your email">
            <button type="submit" class="pill-button">Join Waitlist</button>
          </div>
        </form>
      </div>
    </div>

    <footer class="reveal-block footer-reveal">
      © 2026 Flowstate — engineered for deep work.
    </footer>
  </section>

  <script type="module">
    import Lenis from "lenis";
    const lenis = new Lenis({ smoothWheel: true });
    function raf(t) {
      lenis.raf(t);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  </script>

  <script>
    document.addEventListener("DOMContentLoaded", () => {
        const easeOutCubic = "cubic-bezier(0.215, 0.61, 0.355, 1)";
        function revealWords(id, yOffset, duration, stagger, baseDelay) {
            const el = document.getElementById(id);
            if (!el) return;
            const text = el.innerText.trim();
            const words = text.split(/\s+/);
            el.innerHTML = "";
            words.forEach((word) => {
                const span = document.createElement("span");
                span.innerText = word;
                span.style.display = "inline-block";
                span.style.opacity = "0";
                span.style.transform = \`translateY(\${yOffset}px)\`;
                el.appendChild(span);
                el.appendChild(document.createTextNode(" "));
            });
            
            void el.offsetWidth; // Force reflow

            Array.from(el.querySelectorAll("span")).forEach((span, index) => {
                const delay = baseDelay + index * stagger;
                span.style.transition = \`opacity \${duration}ms \${easeOutCubic} \${delay}ms, transform \${duration}ms \${easeOutCubic} \${delay}ms\`;
                span.style.opacity = "1";
                span.style.transform = "translateY(0)";
            });
        }

        revealWords("heading", 26, 720, 85, 480);
        revealWords("subline", 14, 600, 22, 1150);

        document.getElementById("waitlist-form").addEventListener("submit", (e) => {
            e.preventDefault();
        });

        // Start fluid simulation
        fluidSimulation(document.getElementById("fluid-canvas"));
    });
  </script>
</body>
</html>
\`;

const webglContent = fs.readFileSync('/Users/bdcalling/Desktop/kayesur/first-project-by-t3/fluid_original.js', 'utf8');
// We need to inject the webgl script before </body>, wait, I can just build it from parts.
`;
fs.writeFileSync('/Users/bdcalling/Desktop/kayesur/first-project-by-t3/create_index.js', htmlContent);
