'use client';

import { useEffect } from 'react';

export default function GoogleTranslate() {
  useEffect(() => {
    // Add Google Translate script
    const addScript = document.createElement('script');
    addScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    addScript.async = true;
    document.body.appendChild(addScript);

    // Initialize function
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,kn,ta,te,ml', // English, Hindi, Kannada, Tamil, Telugu, Malayalam
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };
  }, []);

  return (
    <div 
      id="google_translate_element" 
      className="text-[13px] font-bold text-slate-500 overflow-hidden rounded-lg bg-slate-50 border border-slate-100"
    >
      {/* The Google Translate widget will render here */}
      <style dangerouslySetInnerHTML={{ __html: `
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: none !important;
          padding: 6px 10px !important;
          border-radius: 8px !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          cursor: pointer;
          color: #64748b !important;
          display: flex !important;
          align-items: center !important;
        }
        .goog-te-gadget-icon {
          display: none !important;
        }
        .goog-te-menu-value {
          color: #64748b !important;
          display: flex !important;
          align-items: center !important;
        }
        .goog-te-menu-value span {
          color: #64748b !important;
          font-family: inherit !important;
        }
        /* Hide the Google banner at the top */
        .goog-te-banner-frame.skiptranslate, iframe.goog-te-banner-frame, .VIpgJd-ZVi9od-aZ2wEe-wOHMyf, .VIpgJd-ZVi9od-ORHb-OEVmcd {
          display: none !important;
        }
        body {
          top: 0px !important;
          position: static !important;
        }
        /* Custom dropdown styling */
        .goog-te-menu-frame {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
          border-radius: 12px !important;
          border: 1px solid #f1f5f9 !important;
        }
      `}} />
    </div>
  );
}
