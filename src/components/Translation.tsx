import { useEffect, useRef } from 'react';

interface GoogleTranslateConfig {
  pageLanguage: string;
  floating: boolean;
}

interface GoogleTranslateElement {
  new (config: GoogleTranslateConfig, element: string): void;
}

interface GoogleTranslateAPI {
  translate: {
    TranslateElement: GoogleTranslateElement;
  };
}

declare global {
  interface Window {
    google: {
      translate: GoogleTranslateAPI['translate'];
    };
    googleTranslateElementInit: () => void;
  }
}


/**
 * GoogleTranslate component to integrate Google Translate functionality into a webpage.
 *
 * This component initializes the Google Translate widget and allows users to translate
 * the content of the webpage. The floating toolbar is hidden by default, and the translation
 * UI is styled to fit seamlessly into the page.
 *
 * @returns {JSX.Element} A `div` element that serves as the container for the Google Translate UI.
 */
const GoogleTranslate = () => {
  const initialized = useRef(false);

  useEffect(() => {
    const hideFloatingToolbar = () => {
      const toolbar = document.querySelector('.goog-te-banner-frame');
      if (toolbar) {
        (toolbar as HTMLElement).style.display = 'none';
      }
    };

    const style = document.createElement('style');
    style.innerHTML = `
      .goog-te-banner-frame { display: none !important; }
      .goog-te-combo {
        font-size: 15px !important; 
        padding: 8px 15px !important; 
        background-color: white !important; 
        color: black !important; 
        border-radius: 5px !important;
        border: 0.5px solid black !important;
        margin: 1px !important;
      }

      .goog-te-badge {
        display: inline-flex !important;           
        flex-direction: row !important;             
        align-items: center !important;            
        white-space: nowrap !important;             
        padding: 0 5px !important;                 
        font-size: 8px !important;                  
        overflow: hidden !important;                
        max-width: 200px !important; 
      }
    `;
    document.head.appendChild(style);

    if (initialized.current) return;

    const loadGoogleTranslate = () => {
      if (window.google?.translate?.TranslateElement) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              floating: false,
            },
            'google_translate_element'
          );
          
          hideFloatingToolbar();
        } catch (error) {
          console.error('Google Translate initialization failed', error);
        }
      } else {
        console.error('Google Translate API is not available or TranslateElement is not a constructor');
      }
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;

    window.googleTranslateElementInit = loadGoogleTranslate;

    script.onload = () => {
      console.log('Google Translate script loaded successfully!');
    };

    document.body.appendChild(script);

    initialized.current = true;

    return () => {
      const scriptTags = document.querySelectorAll('script[src="//translate.google.com/translate_a/element.js"]');
      scriptTags.forEach((scriptTag) => {
        if (scriptTag.parentNode) {
          scriptTag.parentNode.removeChild(scriptTag);
        }
      });
    };
  }, []);

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;