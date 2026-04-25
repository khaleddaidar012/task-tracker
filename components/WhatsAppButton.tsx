"use client";

import { useEffect, useState } from "react";

const WHATSAPP_URL =
  "https://wa.me/201092912431?text=جربت%20التطبيق%20وعندي%20رأي";

const SESSION_KEY = "whatsapp_btn_shown";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show immediately if already seen this session
    if (sessionStorage.getItem(SESSION_KEY)) {
      setVisible(true);
      return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        /* ---------- keyframes ---------- */
        @keyframes wa-fadein {
          from { opacity: 0; transform: translateY(16px) scale(0.85); }
          to   { opacity: 1; transform: translateY(0px)  scale(1);    }
        }

        @keyframes wa-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }

        /* ---------- wrapper ---------- */
        /*
          The wrapper is the SOLE hover target.
          It never changes size or position, so the cursor
          can't "escape" the hit-box and cause flicker.
        */
        .wa-wrapper {
          position: fixed;
          bottom: 24px;
          left: 24px;
          z-index: 9999;
          /* Reserve space for the tooltip above without shifting the button */
          padding-top: 44px;
          /* will-change scoped to transform only */
          will-change: transform;
        }

        /* ---------- floating animation (on the wrapper) ---------- */
        .wa-wrapper {
          animation:
            wa-fadein 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both,
            wa-float  3s ease-in-out 0.6s infinite;
        }

        /*
          On hover: stop the float and apply scale — all in one animation slot.
          No "animation: none" snap; we just switch to a static scale keyframe.
          transform is the only property that changes, so no layout shift.
        */
        .wa-wrapper:hover {
          animation:
            wa-fadein 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both,
            wa-hover-scale 0.2s ease forwards;
        }

        @keyframes wa-hover-scale {
          to { transform: scale(1.07); }
        }

        /* ---------- button itself ---------- */
        .wa-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2eea72 0%, #25D366 55%, #1da851 100%);
          box-shadow: 0 4px 15px rgba(37,211,102,0.4), 0 2px 6px rgba(0,0,0,0.14);
          /* Only transition shadow — transform is handled by the wrapper */
          transition: box-shadow 0.25s ease;
          /* Prevent the anchor itself from being a second hover surface */
          pointer-events: none;
          /* Make icon non-interactive so it can never steal mouse events */
          text-decoration: none;
          cursor: pointer;
        }

        /* The wrapper receives pointer events; pass clickability through */
        .wa-wrapper {
          pointer-events: auto;
          cursor: pointer;
        }

        .wa-wrapper:hover .wa-btn {
          box-shadow:
            0 0 0 3px rgba(37,211,102,0.35),
            0 6px 22px rgba(37,211,102,0.55),
            0 2px 6px rgba(0,0,0,0.14);
        }

        /* Focus ring for keyboard accessibility */
        .wa-btn:focus-visible {
          outline: 3px solid rgba(37,211,102,0.7);
          outline-offset: 3px;
        }

        /* ---------- tooltip ---------- */
        /*
          Absolute-positioned ABOVE the button.
          Does NOT affect document flow → cannot shift the button → no flicker.
        */
        .wa-tooltip {
          position: absolute;
          bottom: calc(100% + 10px); /* sit above the button + 10px gap */
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          direction: rtl;

          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 10px;
          padding: 5px 12px;
          font-size: 13px;
          font-weight: 600;
          color: #1a1a1a;
          box-shadow: 0 4px 16px rgba(0,0,0,0.10);

          /* Hidden by default */
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
          transform: translateX(-50%) translateY(4px);
        }

        .wa-tooltip-dark {
          background: rgba(30,30,30,0.90);
          color: #f0f0f0;
          border-color: rgba(255,255,255,0.10);
        }

        /* Show tooltip when wrapper is hovered */
        .wa-wrapper:hover .wa-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0px);
        }

        /* SVG must never steal pointer events */
        .wa-btn svg {
          pointer-events: none;
          display: block;
        }
      `}</style>

      {/*
        The <a> tag wraps the whole wrapper so the entire fixed area is clickable.
        This makes the hit-box exactly equal to the visible button area.
      */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="أرسل رأيك عبر واتساب"
        className="wa-wrapper"
      >
        {/* Tooltip — absolutely positioned, out of flow */}
        <span className="wa-tooltip" aria-hidden="true">
          قول رأيك 💬
        </span>

        {/* Button face — pointer-events: none so wrapper is sole hit target */}
        <span className="wa-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="30"
            height="30"
            fill="white"
            aria-hidden="true"
          >
            <path d="M16.002 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.37.63 4.664 1.826 6.675L2.667 29.333l6.84-1.793A13.29 13.29 0 0 0 16.002 29.333C23.366 29.333 29.333 23.366 29.333 16S23.366 2.667 16.002 2.667zm0 24a10.637 10.637 0 0 1-5.42-1.484l-.389-.23-4.06 1.064 1.083-3.953-.253-.406A10.633 10.633 0 0 1 5.333 16c0-5.88 4.789-10.667 10.669-10.667S26.667 10.12 26.667 16c0 5.882-4.787 10.667-10.665 10.667zm5.857-7.984c-.32-.16-1.892-.934-2.185-1.04-.293-.107-.506-.16-.72.16-.213.32-.826 1.04-.013 1.04-.107.32-.32 1.04-.693 1.04-.373.373-.64.427-.96.267-.32-.16-1.352-.498-2.575-1.589-.952-.848-1.594-1.895-1.781-2.215-.187-.32-.02-.493.14-.652.145-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.259-.624-.523-.54-.72-.55l-.613-.01c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.666s1.147 3.093 1.307 3.307c.16.213 2.253 3.44 5.466 4.827.764.33 1.36.527 1.824.674.766.243 1.465.209 2.016.127.615-.092 1.893-.774 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z" />
          </svg>
        </span>
      </a>
    </>
  );
}
