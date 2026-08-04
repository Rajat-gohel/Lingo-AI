// import { useEffect, useMemo, useRef, useState } from "react";
// import {
//   ArrowLeftRight,
//   Check,
//   ChevronDown,
//   Copy,
//   Download,
//   History,
//   Languages,
//   Menu,
//   Mic,
//   Moon,
//   RotateCcw,
//   Search,
//   Share2,
//   Sparkles,
//   Sun,
//   Trash2,
//   Volume2,
//   X,
// } from "lucide-react";

// const API_URL = "http://127.0.0.1:8000";

// /*
// |--------------------------------------------------------------------------
// | LANGUAGE -> BCP-47 VOICE CODES
// |--------------------------------------------------------------------------
// |
// | Your backend/model may return "Hindi", "English", etc.
// | Browser TTS and speech recognition need proper locale codes.
// |
// */

// const LANGUAGE_CODES = {
//   English: ["en-US", "en-GB", "en-IN", "en-AU"],
//   Hindi: ["hi-IN"],
//   Gujarati: ["gu-IN"],
//   Bengali: ["bn-IN"],
//   Marathi: ["mr-IN"],
//   Tamil: ["ta-IN"],
//   Telugu: ["te-IN"],
//   Kannada: ["kn-IN"],
//   Malayalam: ["ml-IN"],
//   Punjabi: ["pa-IN"],
//   Urdu: ["ur-IN"],
//   Nepali: ["ne-NP"],
//   Sanskrit: ["sa-IN"],

//   Arabic: ["ar-SA", "ar-AE", "ar-EG"],
//   Chinese: ["zh-CN", "zh-TW"],
//   Japanese: ["ja-JP"],
//   Korean: ["ko-KR"],
//   Thai: ["th-TH"],
//   Turkish: ["tr-TR"],
//   Persian: ["fa-IR"],
//   Russian: ["ru-RU"],
//   Spanish: ["es-ES", "es-MX"],
//   French: ["fr-FR", "fr-CA"],
//   Dutch: ["nl-NL"],
//   Portuguese: ["pt-PT", "pt-BR"],
//   Portugese: ["pt-PT", "pt-BR"],
//   Romanian: ["ro-RO"],
//   Swedish: ["sv-SE"],
//   Indonesian: ["id-ID"],
//   Estonian: ["et-EE"],
//   Pushto: ["ps-AF"],
//   Latin: ["la"],
// };

// /*
// |--------------------------------------------------------------------------
// | NORMALIZE LANGUAGE NAME
// |--------------------------------------------------------------------------
// */

// function normalizeLanguageName(name = "") {
//   return name
//     .toLowerCase()
//     .trim()
//     .replace("portugese", "portuguese");
// }

// /*
// |--------------------------------------------------------------------------
// | GET VOICE CODES
// |--------------------------------------------------------------------------
// */

// function getLanguageCodes(language) {
//   if (!language) return ["en-US"];

//   const name = language.name || language;

//   const normalized = normalizeLanguageName(name);

//   const entry = Object.entries(LANGUAGE_CODES).find(
//     ([key]) =>
//       normalizeLanguageName(key) === normalized
//   );

//   if (entry) {
//     return entry[1];
//   }

//   /*
//    * If backend already sends a code such as:
//    * hi-IN
//    * gu-IN
//    * en-US
//    */
//   if (
//     typeof language === "object" &&
//     language.code
//   ) {
//     return [language.code];
//   }

//   return ["en-US"];
// }

// /*
// |--------------------------------------------------------------------------
// | FIND BEST BROWSER VOICE
// |--------------------------------------------------------------------------
// */

// function findBestVoice(language, voices) {
//   if (!language || !voices?.length) {
//     return null;
//   }

//   const codes = getLanguageCodes(language);

//   const normalizedCodes = codes.map((code) =>
//     code.toLowerCase()
//   );

//   /*
//    * Exact match first
//    */

//   for (const code of normalizedCodes) {
//     const exact = voices.find(
//       (voice) =>
//         voice.lang.toLowerCase() === code
//     );

//     if (exact) return exact;
//   }

//   /*
//    * Match language family
//    *
//    * Example:
//    * hi-IN -> hi
//    * en-IN -> en
//    */

//   for (const code of normalizedCodes) {
//     const shortCode = code.split("-")[0];

//     const family = voices.find((voice) =>
//       voice.lang
//         .toLowerCase()
//         .startsWith(`${shortCode}-`)
//     );

//     if (family) return family;
//   }

//   /*
//    * Some browsers return:
//    * en_US
//    * hi_IN
//    */

//   for (const code of normalizedCodes) {
//     const shortCode = code
//       .split("-")[0]
//       .toLowerCase();

//     const alternative = voices.find(
//       (voice) =>
//         voice.lang
//           .toLowerCase()
//           .replace("_", "-")
//           .startsWith(shortCode)
//     );

//     if (alternative) return alternative;
//   }

//   return null;
// }

// /*
// |--------------------------------------------------------------------------
// | FEATURE
// |--------------------------------------------------------------------------
// */

// function Feature({ icon, title, text }) {
//   return (
//     <div className="feature-card">
//       <div className="feature-icon">
//         {icon}
//       </div>

//       <div>
//         <h3>{title}</h3>
//         <p>{text}</p>
//       </div>
//     </div>
//   );
// }

// /*
// |--------------------------------------------------------------------------
// | LANGUAGE DROPDOWN
// |--------------------------------------------------------------------------
// */

// function LanguageDropdown({
//   type,
//   open,
//   setOpen,
//   search,
//   setSearch,
//   items,
//   selected,
//   onSelect,
// }) {
//   return (
//     <div className="language-dropdown">
//       <button
//         className="language-select"
//         onClick={() => setOpen(!open)}
//       >
//         {selected ? (
//           <>
//             <span className="language-flag">
//               {selected.flag || "🌐"}
//             </span>

//             <span>{selected.name}</span>
//           </>
//         ) : (
//           <>
//             <span className="detect-icon">
//               ✨
//             </span>

//             <span>Detect language</span>
//           </>
//         )}

//         <ChevronDown size={17} />
//       </button>

//       {open && (
//         <div className="language-menu">
//           <div className="language-search">
//             <Search size={16} />

//             <input
//               value={search}
//               onChange={(e) =>
//                 setSearch(e.target.value)
//               }
//               placeholder="Search language..."
//               autoFocus
//             />

//             {search && (
//               <button
//                 onClick={() =>
//                   setSearch("")
//                 }
//               >
//                 <X size={14} />
//               </button>
//             )}
//           </div>

//           {type === "source" && (
//             <button
//               className="language-option detect-option"
//               onClick={() => {
//                 onSelect(null);
//                 setOpen(false);
//                 setSearch("");
//               }}
//             >
//               <span>✨</span>

//               <span>Detect language</span>
//             </button>
//           )}

//           {items.map((language) => (
//             <button
//               key={`${language.name}-${language.code || ""}`}
//               className="language-option"
//               onClick={() => {
//                 onSelect(language);
//                 setOpen(false);
//                 setSearch("");
//               }}
//             >
//               <span>
//                 {language.flag || "🌐"}
//               </span>

//               <span>{language.name}</span>

//               {selected?.name ===
//                 language.name && (
//                 <Check
//                   size={16}
//                   className="selected-check"
//                 />
//               )}
//             </button>
//           ))}

//           {!items.length && (
//             <div className="no-language">
//               No language found
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// /*
// |--------------------------------------------------------------------------
// | APP
// |--------------------------------------------------------------------------
// */

// export default function App() {
//   const [languages, setLanguages] = useState([]);

//   const [sourceLanguage, setSourceLanguage] =
//     useState(null);

//   const [targetLanguage, setTargetLanguage] =
//     useState(null);

//   const [sourceText, setSourceText] =
//     useState("");

//   const [translatedText, setTranslatedText] =
//     useState("");

//   const [detectedLanguage, setDetectedLanguage] =
//     useState(null);

//   const [confidence, setConfidence] =
//     useState(null);

//   const [loading, setLoading] =
//     useState(false);

//   const [detecting, setDetecting] =
//     useState(false);

//   const [error, setError] =
//     useState("");

//   const [copied, setCopied] =
//     useState(false);

//   const [listening, setListening] =
//     useState(false);

//   const [speaking, setSpeaking] =
//     useState(false);

//   const [darkMode, setDarkMode] =
//     useState(
//       localStorage.getItem(
//         "lingo-theme"
//       ) === "dark"
//     );

//   const [history, setHistory] =
//     useState(() => {
//       try {
//         return (
//           JSON.parse(
//             localStorage.getItem(
//               "lingo-history"
//             )
//           ) || []
//         );
//       } catch {
//         return [];
//       }
//     });

//   const [showHistory, setShowHistory] =
//     useState(false);

//   const [mobileMenu, setMobileMenu] =
//     useState(false);

//   const [sourceOpen, setSourceOpen] =
//     useState(false);

//   const [targetOpen, setTargetOpen] =
//     useState(false);

//   const [sourceSearch, setSourceSearch] =
//     useState("");

//   const [targetSearch, setTargetSearch] =
//     useState("");

//   /*
//    * Browser voices
//    */

//   const [voices, setVoices] =
//     useState([]);

//   const recognitionRef =
//     useRef(null);

//   /*
//   |--------------------------------------------------------------------------
//   | LOAD BROWSER VOICES
//   |--------------------------------------------------------------------------
//   */

//   useEffect(() => {
//     if (!window.speechSynthesis) {
//       return;
//     }

//     const loadVoices = () => {
//       const available =
//         window.speechSynthesis.getVoices();

//       setVoices(available);
//     };

//     loadVoices();

//     window.speechSynthesis.addEventListener(
//       "voiceschanged",
//       loadVoices
//     );

//     return () => {
//       window.speechSynthesis.removeEventListener(
//         "voiceschanged",
//         loadVoices
//       );
//     };
//   }, []);

//   /*
//   |--------------------------------------------------------------------------
//   | THEME
//   |--------------------------------------------------------------------------
//   */

//   useEffect(() => {
//     document.documentElement.classList.toggle(
//       "dark",
//       darkMode
//     );

//     localStorage.setItem(
//       "lingo-theme",
//       darkMode ? "dark" : "light"
//     );
//   }, [darkMode]);

//   /*
//   |--------------------------------------------------------------------------
//   | LOAD LANGUAGES
//   |--------------------------------------------------------------------------
//   */

//   useEffect(() => {
//     loadLanguages();
//   }, []);

//   async function loadLanguages() {
//     try {
//       setError("");

//       const response = await fetch(
//         `${API_URL}/languages`
//       );

//       if (!response.ok) {
//         throw new Error(
//           "Backend is not running."
//         );
//       }

//       const data =
//         await response.json();

//       if (
//         data.success &&
//         Array.isArray(data.languages)
//       ) {
//         const normalized =
//           data.languages.map(
//             (language) => ({
//               ...language,

//               /*
//                * Ensure every language has
//                * a voice code.
//                */

//               code:
//                 language.code ||
//                 getLanguageCodes(
//                   language
//                 )[0],
//             })
//           );

//         setLanguages(normalized);

//         const english =
//           normalized.find(
//             (x) =>
//               normalizeLanguageName(
//                 x.name
//               ) === "english"
//           );

//         if (english) {
//           setTargetLanguage(english);
//         } else if (normalized.length) {
//           setTargetLanguage(
//             normalized[0]
//           );
//         }
//       }
//     } catch (err) {
//       setError(
//         err.message ||
//           "Unable to load languages."
//       );
//     }
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | FILTER LANGUAGES
//   |--------------------------------------------------------------------------
//   */

//   const filteredSourceLanguages =
//     useMemo(() => {
//       return languages.filter(
//         (language) =>
//           language.name
//             .toLowerCase()
//             .includes(
//               sourceSearch.toLowerCase()
//             )
//       );
//     }, [
//       languages,
//       sourceSearch,
//     ]);

//   const filteredTargetLanguages =
//     useMemo(() => {
//       return languages.filter(
//         (language) =>
//           language.name
//             .toLowerCase()
//             .includes(
//               targetSearch.toLowerCase()
//             )
//       );
//     }, [
//       languages,
//       targetSearch,
//     ]);

//   /*
//   |--------------------------------------------------------------------------
//   | DETECT LANGUAGE
//   |--------------------------------------------------------------------------
//   */

//   async function detectLanguage(
//     text
//   ) {
//     if (!text.trim()) {
//       setDetectedLanguage(null);
//       setConfidence(null);
//       return;
//     }

//     try {
//       setDetecting(true);

//       const response =
//         await fetch(
//           `${API_URL}/detect`,
//           {
//             method: "POST",

//             headers: {
//               "Content-Type":
//                 "application/json",
//             },

//             body: JSON.stringify({
//               text: text.trim(),
//             }),
//           }
//         );

//       if (!response.ok) {
//         throw new Error(
//           "Detection request failed."
//         );
//       }

//       const data =
//         await response.json();

//       if (data.success) {
//         const detected =
//           languages.find(
//             (language) =>
//               normalizeLanguageName(
//                 language.name
//               ) ===
//               normalizeLanguageName(
//                 data.language
//               )
//           );

//         const result =
//           detected || {
//             name: data.language,
//             code:
//               data.code ||
//               getLanguageCodes(
//                 data.language
//               )[0],
//             flag:
//               data.flag || "🌐",
//           };

//         setDetectedLanguage(
//           result
//         );

//         setConfidence(
//           data.confidence
//         );
//       }
//     } catch {
//       /*
//        * Don't destroy UI if detection
//        * temporarily fails.
//        */
//     } finally {
//       setDetecting(false);
//     }
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | INPUT
//   |--------------------------------------------------------------------------
//   */

//   function handleSourceChange(
//     value
//   ) {
//     setSourceText(value);
//     setTranslatedText("");
//     setError("");

//     if (value.trim().length >= 3) {
//       detectLanguage(value);
//     } else {
//       setDetectedLanguage(null);
//       setConfidence(null);
//     }
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | TRANSLATE
//   |--------------------------------------------------------------------------
//   */

//   async function translateText() {
//     setError("");

//     if (!sourceText.trim()) {
//       setError(
//         "Please enter some text."
//       );
//       return;
//     }

//     if (!targetLanguage) {
//       setError(
//         "Please select a target language."
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const response =
//         await fetch(
//           `${API_URL}/translate`,
//           {
//             method: "POST",

//             headers: {
//               "Content-Type":
//                 "application/json",
//             },

//             body: JSON.stringify({
//               text:
//                 sourceText.trim(),

//               target_language:
//                 targetLanguage.name,
//             }),
//           }
//         );

//       if (!response.ok) {
//         throw new Error(
//           "Translation server error."
//         );
//       }

//       const data =
//         await response.json();

//       if (!data.success) {
//         throw new Error(
//           data.message ||
//             "Translation failed."
//         );
//       }

//       setTranslatedText(
//         data.translated_text
//       );

//       const detected =
//         languages.find(
//           (language) =>
//             normalizeLanguageName(
//               language.name
//             ) ===
//             normalizeLanguageName(
//               data.source_language
//             )
//         );

//       const finalDetected =
//         detected || {
//           name:
//             data.source_language,

//           code:
//             data.source_code ||
//             getLanguageCodes(
//               data.source_language
//             )[0],

//           flag:
//             data.source_flag ||
//             "🌐",
//         };

//       setDetectedLanguage(
//         finalDetected
//       );

//       setConfidence(
//         data.confidence
//       );

//       const newItem = {
//         id: Date.now(),

//         source:
//           sourceText,

//         result:
//           data.translated_text,

//         from:
//           data.source_language,

//         to:
//           data.target_language,
//       };

//       const updatedHistory = [
//         newItem,
//         ...history,
//       ].slice(0, 10);

//       setHistory(
//         updatedHistory
//       );

//       localStorage.setItem(
//         "lingo-history",
//         JSON.stringify(
//           updatedHistory
//         )
//       );
//     } catch (err) {
//       setError(
//         err.message ||
//           "Translation failed."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | SWAP
//   |--------------------------------------------------------------------------
//   */

//   function swapLanguages() {
//     if (
//       !detectedLanguage ||
//       !targetLanguage
//     ) {
//       return;
//     }

//     const oldSource =
//       detectedLanguage;

//     const oldTarget =
//       targetLanguage;

//     const oldSourceText =
//       sourceText;

//     const oldTranslatedText =
//       translatedText;

//     setSourceLanguage(
//       oldTarget
//     );

//     setTargetLanguage(
//       oldSource
//     );

//     setSourceText(
//       oldTranslatedText
//     );

//     setTranslatedText(
//       oldSourceText
//     );

//     setDetectedLanguage(
//       oldTarget
//     );

//     setConfidence(null);
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | COPY
//   |--------------------------------------------------------------------------
//   */

//   async function copyTranslation() {
//     if (!translatedText) {
//       return;
//     }

//     try {
//       await navigator.clipboard.writeText(
//         translatedText
//       );

//       setCopied(true);

//       setTimeout(
//         () => setCopied(false),
//         1500
//       );
//     } catch {
//       setError(
//         "Unable to copy text."
//       );
//     }
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | STOP SPEECH
//   |--------------------------------------------------------------------------
//   */

//   function stopSpeaking() {
//     if (
//       window.speechSynthesis
//     ) {
//       window.speechSynthesis.cancel();
//     }

//     setSpeaking(false);
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | BACKEND TTS
//   |--------------------------------------------------------------------------
//   */

//   async function backendSpeak(
//     text,
//     language
//   ) {
//     try {
//       setSpeaking(true);
//       setError("");

//       const code =
//         getLanguageCodes(
//           language
//         )[0];

//       const response =
//         await fetch(
//           `${API_URL}/tts`,
//           {
//             method: "POST",

//             headers: {
//               "Content-Type":
//                 "application/json",
//             },

//             body: JSON.stringify({
//               text,
//               language:
//                 language?.name,
//               code,
//             }),
//           }
//         );

//       if (!response.ok) {
//         throw new Error(
//           "Backend voice unavailable."
//         );
//       }

//       const blob =
//         await response.blob();

//       if (
//         !blob.type.startsWith(
//           "audio/"
//         )
//       ) {
//         throw new Error(
//           "Invalid audio response."
//         );
//       }

//       const audioUrl =
//         URL.createObjectURL(
//           blob
//         );

//       const audio =
//         new Audio(audioUrl);

//       audio.onended = () => {
//         setSpeaking(false);
//         URL.revokeObjectURL(
//           audioUrl
//         );
//       };

//       audio.onerror = () => {
//         setSpeaking(false);
//         URL.revokeObjectURL(
//           audioUrl
//         );
//         setError(
//           "Unable to play generated voice."
//         );
//       };

//       await audio.play();
//     } catch (err) {
//       setSpeaking(false);

//       throw err;
//     }
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | SPEAK
//   |--------------------------------------------------------------------------
//   |
//   | First:
//   | Browser native voice
//   |
//   | If browser doesn't have voice:
//   | FastAPI /tts
//   |
//   */

//   async function speak(
//     text,
//     language
//   ) {
//     if (
//       !text?.trim() ||
//       !language
//     ) {
//       return;
//     }

//     setError("");

//     /*
//      * Stop previous speech
//      */

//     stopSpeaking();

//     /*
//      * Try browser voice
//      */

//     if (
//       window.speechSynthesis
//     ) {
//       let availableVoices =
//         window.speechSynthesis.getVoices();

//       /*
//        * Some browsers return
//        * empty voices initially.
//        */

//       if (!availableVoices.length) {
//         await new Promise(
//           (resolve) =>
//             setTimeout(
//               resolve,
//               300
//             )
//         );

//         availableVoices =
//           window.speechSynthesis.getVoices();
//       }

//       const voice =
//         findBestVoice(
//           language,
//           availableVoices
//         );

//       if (voice) {
//         const utterance =
//           new SpeechSynthesisUtterance(
//             text
//           );

//         utterance.voice =
//           voice;

//         utterance.lang =
//           voice.lang;

//         utterance.rate = 0.9;
//         utterance.pitch = 1;
//         utterance.volume = 1;

//         utterance.onstart =
//           () => {
//             setSpeaking(true);
//           };

//         utterance.onend =
//           () => {
//             setSpeaking(false);
//           };

//         utterance.onerror =
//           async () => {
//             /*
//              * Browser voice failed.
//              * Try backend.
//              */

//             try {
//               await backendSpeak(
//                 text,
//                 language
//               );
//             } catch {
//               setError(
//                 `Unable to generate ${language.name} voice.`
//               );
//             }
//           };

//         setSpeaking(true);

//         window.speechSynthesis.speak(
//           utterance
//         );

//         return;
//       }
//     }

//     /*
//      * No browser voice.
//      * Use FastAPI.
//      */

//     try {
//       await backendSpeak(
//         text,
//         language
//       );
//     } catch {
//       setError(
//         `No browser voice found for ${language.name} and backend TTS is unavailable.`
//       );
//     }
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | MICROPHONE
//   |--------------------------------------------------------------------------
//   */

//   function startSpeechRecognition() {
//     const SpeechRecognition =
//       window.SpeechRecognition ||
//       window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       setError(
//         "Speech recognition is not supported. Use Chrome or Edge."
//       );

//       return;
//     }

//     /*
//      * Stop existing recognition
//      */

//     if (
//       recognitionRef.current
//     ) {
//       try {
//         recognitionRef.current.stop();
//       } catch {}
//     }

//     const recognition =
//       new SpeechRecognition();

//     recognition.continuous =
//       false;

//     recognition.interimResults =
//       true;

//     recognition.maxAlternatives =
//       1;

//     /*
//      * Important:
//      *
//      * If user manually selected
//      * source language -> use it.
//      *
//      * Otherwise detected language.
//      *
//      * Otherwise English.
//      */

//     const language =
//       sourceLanguage ||
//       detectedLanguage;

//     const code =
//       getLanguageCodes(
//         language
//       )[0];

//     recognition.lang =
//       code || "en-US";

//     recognition.onstart =
//       () => {
//         setListening(true);
//         setError("");
//       };

//     recognition.onresult =
//       (event) => {
//         let finalText = "";

//         for (
//           let i = event.resultIndex;
//           i < event.results.length;
//           i++
//         ) {
//           finalText +=
//             event.results[i][0]
//               .transcript;
//         }

//         if (finalText) {
//           handleSourceChange(
//             finalText
//           );
//         }
//       };

//     recognition.onerror =
//       (event) => {
//         console.error(
//           "Speech recognition:",
//           event.error
//         );

//         setListening(false);

//         if (
//           event.error ===
//           "not-allowed"
//         ) {
//           setError(
//             "Microphone permission was denied."
//           );
//         } else if (
//           event.error ===
//           "language-not-supported"
//         ) {
//           setError(
//             `${language?.name || "Selected language"} is not supported by browser speech recognition.`
//           );
//         } else {
//           setError(
//             "Could not recognize speech."
//           );
//         }
//       };

//     recognition.onend =
//       () => {
//         setListening(false);
//         recognitionRef.current =
//           null;
//       };

//     recognitionRef.current =
//       recognition;

//     try {
//       recognition.start();
//     } catch (err) {
//       setListening(false);
//       setError(
//         "Unable to start microphone."
//       );
//     }
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | CLEAR
//   |--------------------------------------------------------------------------
//   */

//   function clearAll() {
//     stopSpeaking();

//     if (
//       recognitionRef.current
//     ) {
//       try {
//         recognitionRef.current.stop();
//       } catch {}
//     }

//     setSourceText("");
//     setTranslatedText("");
//     setDetectedLanguage(null);
//     setConfidence(null);
//     setError("");
//     setListening(false);
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | DOWNLOAD
//   |--------------------------------------------------------------------------
//   */

//   function downloadTranslation() {
//     if (!translatedText) {
//       return;
//     }

//     const content = `
// LingoAI Translation

// Source Language:
// ${detectedLanguage?.name || "Unknown"}

// Target Language:
// ${targetLanguage?.name || "Unknown"}

// Original:
// ${sourceText}

// Translation:
// ${translatedText}
// `;

//     const blob =
//       new Blob(
//         [content],
//         {
//           type: "text/plain",
//         }
//       );

//     const url =
//       URL.createObjectURL(
//         blob
//       );

//     const link =
//       document.createElement(
//         "a"
//       );

//     link.href = url;

//     link.download =
//       "lingoai-translation.txt";

//     document.body.appendChild(
//       link
//     );

//     link.click();

//     document.body.removeChild(
//       link
//     );

//     URL.revokeObjectURL(
//       url
//     );
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | SHARE
//   |--------------------------------------------------------------------------
//   */

//   async function shareTranslation() {
//     if (!translatedText) {
//       return;
//     }

//     const text =
//       `${sourceText}\n\n${translatedText}`;

//     try {
//       if (
//         navigator.share
//       ) {
//         await navigator.share({
//           title:
//             "LingoAI Translation",
//           text,
//         });
//       } else {
//         await navigator.clipboard.writeText(
//           text
//         );

//         setCopied(true);

//         setTimeout(
//           () =>
//             setCopied(false),
//           1500
//         );
//       }
//     } catch {}
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | HISTORY
//   |--------------------------------------------------------------------------
//   */

//   function deleteHistory(id) {
//     const updated =
//       history.filter(
//         (item) =>
//           item.id !== id
//       );

//     setHistory(updated);

//     localStorage.setItem(
//       "lingo-history",
//       JSON.stringify(updated)
//     );
//   }

//   function clearHistory() {
//     setHistory([]);

//     localStorage.removeItem(
//       "lingo-history"
//     );
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | CLEANUP
//   |--------------------------------------------------------------------------
//   */

//   useEffect(() => {
//     return () => {
//       window.speechSynthesis?.cancel();

//       if (
//         recognitionRef.current
//       ) {
//         try {
//           recognitionRef.current.stop();
//         } catch {}
//       }
//     };
//   }, []);

//   /*
//   |--------------------------------------------------------------------------
//   | UI
//   |--------------------------------------------------------------------------
//   */

//   return (
//     <div className="app">

//       {/* NAVBAR */}

//       <header className="navbar">
//         <div className="logo-area">
//           <div className="logo">
//             <Languages size={23} />
//           </div>

//           <div>
//             <div className="logo-name">
//               Lingo<span>AI</span>
//             </div>

//             <div className="logo-subtitle">
//               Intelligent Language Platform
//             </div>
//           </div>
//         </div>

//         <nav className="desktop-nav">
//           <button
//             onClick={() =>
//               window.scrollTo({
//                 top: 0,
//                 behavior: "smooth",
//               })
//             }
//           >
//             Translate
//           </button>

//           <button
//             onClick={() =>
//               setShowHistory(true)
//             }
//           >
//             <History size={16} />
//             History
//           </button>
//         </nav>

//         <div className="nav-actions">
//           <button
//             className="icon-button"
//             onClick={() =>
//               setDarkMode(
//                 !darkMode
//               )
//             }
//             title="Theme"
//           >
//             {darkMode ? (
//               <Sun size={19} />
//             ) : (
//               <Moon size={19} />
//             )}
//           </button>

//           <button
//             className="mobile-menu-button"
//             onClick={() =>
//               setMobileMenu(
//                 !mobileMenu
//               )
//             }
//           >
//             <Menu size={21} />
//           </button>
//         </div>
//       </header>

//       {mobileMenu && (
//         <div className="mobile-nav">
//           <button
//             onClick={() => {
//               setShowHistory(true);
//               setMobileMenu(false);
//             }}
//           >
//             <History size={17} />
//             History
//           </button>
//         </div>
//       )}

//       {/* MAIN */}

//       <main className="main">

//         {/* HERO */}

//         <section className="hero">
//           <div className="hero-badge">
//             <Sparkles size={14} />
//             AI POWERED TRANSLATION
//           </div>

//           <h1>
//             Your words.
//             <br />

//             <span>
//               Any language.
//             </span>
//           </h1>

//           <p>
//             Detect, translate and listen
//             to languages instantly with
//             LingoAI.
//           </p>
//         </section>

//         {/* DETECTION */}

//         {sourceText && (
//           <div className="detection-bar">
//             <div className="detection-left">
//               <div className="ai-pulse">
//                 <Sparkles size={17} />
//               </div>

//               <div>
//                 <small>
//                   {detecting
//                     ? "AI DETECTING..."
//                     : "AI DETECTED"}
//                 </small>

//                 <strong>
//                   {detecting
//                     ? "Analyzing..."
//                     : detectedLanguage
//                     ? `${
//                         detectedLanguage.flag ||
//                         "🌐"
//                       } ${
//                         detectedLanguage.name
//                       }`
//                     : "Waiting..."}
//                 </strong>
//               </div>
//             </div>

//             {confidence !== null &&
//               !detecting && (
//                 <div className="confidence">
//                   <span>
//                     Confidence
//                   </span>

//                   <strong>
//                     {confidence}%
//                   </strong>
//                 </div>
//               )}
//           </div>
//         )}

//         {/* TRANSLATOR */}

//         <section className="translator">

//           {/* LANGUAGE BAR */}

//           <div className="translator-top">

//             <LanguageDropdown
//               type="source"
//               open={sourceOpen}
//               setOpen={
//                 setSourceOpen
//               }
//               search={sourceSearch}
//               setSearch={
//                 setSourceSearch
//               }
//               items={
//                 filteredSourceLanguages
//               }
//               selected={
//                 sourceLanguage ||
//                 detectedLanguage
//               }
//               onSelect={(language) => {
//                 setSourceLanguage(
//                   language
//                 );

//                 if (
//                   language
//                 ) {
//                   setDetectedLanguage(
//                     language
//                   );
//                 }
//               }}
//             />

//             <button
//               className="swap-button"
//               onClick={
//                 swapLanguages
//               }
//               title="Swap languages"
//             >
//               <ArrowLeftRight
//                 size={18}
//               />
//             </button>

//             <LanguageDropdown
//               type="target"
//               open={targetOpen}
//               setOpen={
//                 setTargetOpen
//               }
//               search={targetSearch}
//               setSearch={
//                 setTargetSearch
//               }
//               items={
//                 filteredTargetLanguages
//               }
//               selected={
//                 targetLanguage
//               }
//               onSelect={
//                 setTargetLanguage
//               }
//             />

//           </div>

//           {/* TEXT GRID */}

//           <div className="translation-grid">

//             {/* SOURCE */}

//             <div className="translation-panel">

//               <textarea
//                 value={sourceText}
//                 onChange={(e) =>
//                   handleSourceChange(
//                     e.target.value
//                   )
//                 }
//                 placeholder="Enter text..."
//                 maxLength={5000}
//               />

//               <div className="panel-bottom">

//                 <span className="character-count">
//                   {sourceText.length}/5000
//                 </span>

//                 <div className="panel-actions">

//                   {/* MICROPHONE */}

//                   <button
//                     onClick={
//                       startSpeechRecognition
//                     }
//                     className={
//                       listening
//                         ? "recording"
//                         : ""
//                     }
//                     title="Voice input"
//                   >
//                     <Mic size={19} />
//                   </button>

//                   {/* SOURCE SPEAK */}

//                   <button
//                     disabled={
//                       !sourceText ||
//                       !(
//                         sourceLanguage ||
//                         detectedLanguage
//                       ) ||
//                       speaking
//                     }
//                     onClick={() =>
//                       speak(
//                         sourceText,
//                         sourceLanguage ||
//                           detectedLanguage
//                       )
//                     }
//                     title="Listen"
//                   >
//                     <Volume2
//                       size={19}
//                     />
//                   </button>

//                   {/* CLEAR */}

//                   <button
//                     disabled={
//                       !sourceText
//                     }
//                     onClick={() =>
//                       setSourceText("")
//                     }
//                     title="Clear"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* RESULT */}

//             <div className="translation-panel result-panel">

//               {loading ? (
//                 <div className="loading-state">
//                   <div className="spinner" />

//                   <span>
//                     Translating...
//                   </span>
//                 </div>
//               ) : translatedText ? (
//                 <div className="result-text">
//                   {translatedText}
//                 </div>
//               ) : (
//                 <div className="empty-result">
//                   <div className="empty-icon">
//                     <Languages size={24} />
//                   </div>

//                   <span>
//                     Translation appears here
//                   </span>
//                 </div>
//               )}

//               <div className="panel-bottom">

//                 <span className="character-count">
//                   {translatedText.length}
//                 </span>

//                 <div className="panel-actions">

//                   {/* TARGET SPEAK */}

//                   <button
//                     disabled={
//                       !translatedText ||
//                       !targetLanguage ||
//                       speaking
//                     }
//                     onClick={() =>
//                       speak(
//                         translatedText,
//                         targetLanguage
//                       )
//                     }
//                     title="Listen"
//                   >
//                     <Volume2
//                       size={19}
//                     />
//                   </button>

//                   {/* STOP */}

//                   {speaking && (
//                     <button
//                       onClick={
//                         stopSpeaking
//                       }
//                       title="Stop voice"
//                     >
//                       <X size={18} />
//                     </button>
//                   )}

//                   {/* COPY */}

//                   <button
//                     disabled={
//                       !translatedText
//                     }
//                     onClick={
//                       copyTranslation
//                     }
//                     title="Copy"
//                   >
//                     {copied ? (
//                       <Check size={19} />
//                     ) : (
//                       <Copy size={19} />
//                     )}
//                   </button>

//                   {/* SHARE */}

//                   <button
//                     disabled={
//                       !translatedText
//                     }
//                     onClick={
//                       shareTranslation
//                     }
//                     title="Share"
//                   >
//                     <Share2 size={18} />
//                   </button>

//                   {/* DOWNLOAD */}

//                   <button
//                     disabled={
//                       !translatedText
//                     }
//                     onClick={
//                       downloadTranslation
//                     }
//                     title="Download"
//                   >
//                     <Download size={18} />
//                   </button>

//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ERROR */}

//           {error && (
//             <div className="error-box">
//               <span>⚠️</span>
//               {error}
//             </div>
//           )}

//           {/* ACTIONS */}

//           <div className="translator-actions">

//             <button
//               className="translate-button"
//               onClick={
//                 translateText
//               }
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <div className="button-spinner" />
//                   Translating...
//                 </>
//               ) : (
//                 <>
//                   <Sparkles size={19} />
//                   Translate
//                 </>
//               )}
//             </button>

//             <button
//               className="clear-button"
//               onClick={clearAll}
//             >
//               <RotateCcw size={17} />
//               Clear
//             </button>
//           </div>
//         </section>

//         {/* FEATURES */}

//         <section className="feature-grid">

//           <Feature
//             icon={
//               <Sparkles size={21} />
//             }
//             title="AI Detection"
//             text="Your trained machine-learning model automatically detects the language."
//           />

//           <Feature
//             icon={
//               <Languages size={21} />
//             }
//             title="Multi Language"
//             text={`${languages.length || 0} languages loaded directly from your trained model.`}
//           />

//           <Feature
//             icon={
//               <Volume2 size={21} />
//             }
//             title="Smart Voice"
//             text="Uses browser voices when available and FastAPI voice generation when they are not."
//           />

//         </section>

//         {/* HISTORY */}

//         {history.length > 0 && (
//           <section className="history-section">

//             <div className="section-header">
//               <div>
//                 <span>
//                   YOUR ACTIVITY
//                 </span>

//                 <h2>
//                   Recent translations
//                 </h2>
//               </div>

//               <button
//                 onClick={() =>
//                   setShowHistory(true)
//                 }
//               >
//                 View all
//               </button>
//             </div>

//             <div className="history-list">
//               {history
//                 .slice(0, 3)
//                 .map((item) => (
//                   <div
//                     className="history-card"
//                     key={item.id}
//                   >
//                     <div className="history-language">
//                       {item.from}

//                       <ArrowLeftRight
//                         size={14}
//                       />

//                       {item.to}
//                     </div>

//                     <p>
//                       {item.source}
//                     </p>

//                     <strong>
//                       {item.result}
//                     </strong>
//                   </div>
//                 ))}
//             </div>
//           </section>
//         )}

//       </main>

//       {/* FOOTER */}

//       <footer className="footer">

//         <div className="footer-logo">

//           <div className="mini-logo">
//             <Languages size={16} />
//           </div>

//           LingoAI
//         </div>

//         <span>
//           AI Language Detection &
//           Translation Platform
//         </span>

//         <span>
//           © 2026
//         </span>

//       </footer>

//       {/* HISTORY MODAL */}

//       {showHistory && (
//         <div
//           className="modal-backdrop"
//           onClick={() =>
//             setShowHistory(false)
//           }
//         >
//           <div
//             className="history-modal"
//             onClick={(e) =>
//               e.stopPropagation()
//             }
//           >
//             <div className="modal-header">

//               <div>
//                 <span>
//                   LINGOAI
//                 </span>

//                 <h2>
//                   Translation History
//                 </h2>
//               </div>

//               <button
//                 onClick={() =>
//                   setShowHistory(false)
//                 }
//               >
//                 <X />
//               </button>
//             </div>

//             {history.length === 0 ? (
//               <div className="no-history">
//                 <History size={35} />

//                 <p>
//                   No translations yet.
//                 </p>
//               </div>
//             ) : (
//               <>
//                 <div className="modal-history-list">

//                   {history.map(
//                     (item) => (
//                       <div
//                         className="modal-history-item"
//                         key={item.id}
//                       >
//                         <div>

//                           <span>
//                             {item.from}
//                             {" → "}
//                             {item.to}
//                           </span>

//                           <p>
//                             {item.source}
//                           </p>

//                           <strong>
//                             {item.result}
//                           </strong>
//                         </div>

//                         <button
//                           onClick={() =>
//                             deleteHistory(
//                               item.id
//                             )
//                           }
//                         >
//                           <Trash2
//                             size={17}
//                           />
//                         </button>
//                       </div>
//                     )
//                   )}

//                 </div>

//                 <button
//                   className="delete-history"
//                   onClick={
//                     clearHistory
//                   }
//                 >
//                   <Trash2 size={17} />
//                   Clear all history
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeftRight,
  Check,
  ChevronDown,
  Copy,
  Download,
  History,
  Languages,
  Menu,
  Mic,
  Moon,
  RotateCcw,
  Search,
  Share2,
  Sparkles,
  Sun,
  Trash2,
  Volume2,
  X,
} from "lucide-react";
import "./App.css";

/* =========================================================
   API
========================================================= */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

/* =========================================================
   FALLBACK LANGUAGES
========================================================= */

const FALLBACK_LANGUAGES = [
  { name: "English", code: "en", flag: "🇬🇧" },
  { name: "Gujarati", code: "gu", flag: "🇮🇳" },
  { name: "Hindi", code: "hi", flag: "🇮🇳" },
  { name: "Punjabi", code: "pa", flag: "🇮🇳" },
  { name: "Marathi", code: "mr", flag: "🇮🇳" },
  { name: "Bengali", code: "bn", flag: "🇮🇳" },
  { name: "Tamil", code: "ta", flag: "🇮🇳" },
  { name: "Telugu", code: "te", flag: "🇮🇳" },
  { name: "Kannada", code: "kn", flag: "🇮🇳" },
  { name: "Malayalam", code: "ml", flag: "🇮🇳" },
  { name: "Odia", code: "or", flag: "🇮🇳" },
  { name: "Assamese", code: "as", flag: "🇮🇳" },
  { name: "Nepali", code: "ne", flag: "🇳🇵" },
  { name: "Arabic", code: "ar", flag: "🇸🇦" },
  { name: "Chinese", code: "zh-CN", flag: "🇨🇳" },
  { name: "Japanese", code: "ja", flag: "🇯🇵" },
  { name: "Korean", code: "ko", flag: "🇰🇷" },
  { name: "French", code: "fr", flag: "🇫🇷" },
  { name: "Spanish", code: "es", flag: "🇪🇸" },
  { name: "German", code: "de", flag: "🇩🇪" },
  { name: "Portuguese", code: "pt", flag: "🇵🇹" },
  { name: "Russian", code: "ru", flag: "🇷🇺" },
  { name: "Turkish", code: "tr", flag: "🇹🇷" },
  { name: "Thai", code: "th", flag: "🇹🇭" },
  { name: "Dutch", code: "nl", flag: "🇳🇱" },
  { name: "Indonesian", code: "id", flag: "🇮🇩" },
  { name: "Persian", code: "fa", flag: "🇮🇷" },
  { name: "Urdu", code: "ur", flag: "🇵🇰" },
  { name: "Pashto", code: "ps", flag: "🇦🇫" },
  { name: "Romanian", code: "ro", flag: "🇷🇴" },
  { name: "Swedish", code: "sv", flag: "🇸🇪" },
  { name: "Estonian", code: "et", flag: "🇪🇪" },
  { name: "Latin", code: "la", flag: "🏛️" },
  { name: "Sanskrit", code: "sa", flag: "🇮🇳" },
  { name: "Sindhi", code: "sd", flag: "🇵🇰" },
  { name: "Kashmiri", code: "ks", flag: "🇮🇳" },
  { name: "Konkani", code: "gom", flag: "🇮🇳" },
];

/* =========================================================
   LANGUAGE -> BCP-47
========================================================= */

const LANGUAGE_CODES = {
  English: ["en-US", "en-GB", "en-IN", "en-AU"],
  Gujarati: ["gu-IN"],
  Hindi: ["hi-IN"],
  Punjabi: ["pa-IN"],
  Marathi: ["mr-IN"],
  Bengali: ["bn-IN"],
  Tamil: ["ta-IN"],
  Telugu: ["te-IN"],
  Kannada: ["kn-IN"],
  Malayalam: ["ml-IN"],
  Odia: ["or-IN"],
  Assamese: ["as-IN"],
  Nepali: ["ne-NP"],
  Arabic: ["ar-SA", "ar-AE", "ar-EG"],
  Chinese: ["zh-CN", "zh-TW"],
  Japanese: ["ja-JP"],
  Korean: ["ko-KR"],
  French: ["fr-FR", "fr-CA"],
  Spanish: ["es-ES", "es-MX"],
  German: ["de-DE"],
  Portuguese: ["pt-PT", "pt-BR"],
  Portugese: ["pt-PT", "pt-BR"],
  Russian: ["ru-RU"],
  Turkish: ["tr-TR"],
  Thai: ["th-TH"],
  Dutch: ["nl-NL"],
  Indonesian: ["id-ID"],
  Persian: ["fa-IR"],
  Urdu: ["ur-PK"],
  Pashto: ["ps-AF"],
  Pushto: ["ps-AF"],
  Romanian: ["ro-RO"],
  Swedish: ["sv-SE"],
  Estonian: ["et-EE"],
  Latin: ["la"],
  Sanskrit: ["sa-IN"],
  Sindhi: ["sd-IN"],
  Kashmiri: ["ks-IN"],
  Konkani: ["gom-IN"],
};

/* =========================================================
   LANGUAGE ALIASES
========================================================= */

const LANGUAGE_ALIASES = {
  portugese: "portuguese",
  portuguese: "portuguese",

  pushto: "pashto",
  pashto: "pashto",

  punjabi: "punjabi",
  panjabi: "punjabi",

  odia: "odia",
  oriya: "odia",

  chinese: "chinese",
  mandarin: "chinese",

  english: "english",
  hindi: "hindi",
  gujarati: "gujarati",
  bengali: "bengali",
  marathi: "marathi",
  tamil: "tamil",
  telugu: "telugu",
  kannada: "kannada",
  malayalam: "malayalam",
  assamese: "assamese",
  nepali: "nepali",
  arabic: "arabic",
  japanese: "japanese",
  korean: "korean",
  french: "french",
  spanish: "spanish",
  german: "german",
  russian: "russian",
  turkish: "turkish",
  thai: "thai",
  dutch: "dutch",
  indonesian: "indonesian",
  persian: "persian",
  urdu: "urdu",
  romanian: "romanian",
  swedish: "swedish",
  estonian: "estonian",
  latin: "latin",
  sanskrit: "sanskrit",
  sindhi: "sindhi",
  kashmiri: "kashmiri",
  konkani: "konkani",
};

/* =========================================================
   NORMALIZE
========================================================= */

function normalizeLanguageName(name = "") {
  const value = String(name)
    .toLowerCase()
    .trim()
    .replace(/_/g, "-");

  return (
    LANGUAGE_ALIASES[value] ||
    value
  );
}

/* =========================================================
   GET LANGUAGE CODES
========================================================= */

function getLanguageCodes(language) {
  if (!language) {
    return ["en-US"];
  }

  const name =
    typeof language === "object"
      ? language.name
      : language;

  const code =
    typeof language === "object"
      ? language.code
      : null;

  const normalized =
    normalizeLanguageName(name);

  const entry = Object.entries(
    LANGUAGE_CODES
  ).find(
    ([key]) =>
      normalizeLanguageName(key) ===
      normalized
  );

  if (entry) {
    return entry[1];
  }

  if (code) {
    if (
      String(code).includes("-")
    ) {
      return [code];
    }

    const codeMap = {
      en: ["en-US"],
      gu: ["gu-IN"],
      hi: ["hi-IN"],
      pa: ["pa-IN"],
      mr: ["mr-IN"],
      bn: ["bn-IN"],
      ta: ["ta-IN"],
      te: ["te-IN"],
      kn: ["kn-IN"],
      ml: ["ml-IN"],
      or: ["or-IN"],
      as: ["as-IN"],
      ne: ["ne-NP"],
      ar: ["ar-SA"],
      zh: ["zh-CN"],
      ja: ["ja-JP"],
      ko: ["ko-KR"],
      fr: ["fr-FR"],
      es: ["es-ES"],
      de: ["de-DE"],
      pt: ["pt-PT"],
      ru: ["ru-RU"],
      tr: ["tr-TR"],
      th: ["th-TH"],
      nl: ["nl-NL"],
      id: ["id-ID"],
      fa: ["fa-IR"],
      ur: ["ur-PK"],
      ps: ["ps-AF"],
      ro: ["ro-RO"],
      sv: ["sv-SE"],
      et: ["et-EE"],
      la: ["la"],
      sa: ["sa-IN"],
      sd: ["sd-IN"],
      ks: ["ks-IN"],
      gom: ["gom-IN"],
    };

    if (codeMap[code]) {
      return codeMap[code];
    }
  }

  return ["en-US"];
}

/* =========================================================
   FIND BROWSER VOICE
========================================================= */

function findBestVoice(
  language,
  voices
) {
  if (
    !language ||
    !voices?.length
  ) {
    return null;
  }

  const codes =
    getLanguageCodes(language);

  const normalizedCodes =
    codes.map((code) =>
      code
        .toLowerCase()
        .replace("_", "-")
    );

  /* Exact */

  for (const code of normalizedCodes) {
    const exact =
      voices.find(
        (voice) =>
          voice.lang
            .toLowerCase()
            .replace("_", "-") === code
      );

    if (exact) {
      return exact;
    }
  }

  /* Language family */

  for (const code of normalizedCodes) {
    const shortCode =
      code.split("-")[0];

    const family =
      voices.find((voice) =>
        voice.lang
          .toLowerCase()
          .replace("_", "-")
          .startsWith(
            `${shortCode}-`
          )
      );

    if (family) {
      return family;
    }
  }

  return null;
}

/* =========================================================
   FIND LANGUAGE OBJECT
========================================================= */

function findLanguage(
  languages,
  name,
  code
) {
  if (!name && !code) {
    return null;
  }

  const normalizedName =
    normalizeLanguageName(name);

  const normalizedCode =
    code
      ? String(code)
          .toLowerCase()
          .replace("_", "-")
      : "";

  return (
    languages.find(
      (language) => {
        const languageName =
          normalizeLanguageName(
            language.name
          );

        const languageCode =
          String(
            language.code || ""
          )
            .toLowerCase()
            .replace("_", "-");

        return (
          (normalizedName &&
            languageName ===
              normalizedName) ||
          (normalizedCode &&
            (languageCode ===
              normalizedCode ||
              languageCode.split(
                "-"
              )[0] ===
                normalizedCode.split(
                  "-"
                )[0]))
        );
      }
    ) || null
  );
}

/* =========================================================
   FEATURE
========================================================= */

function Feature({
  icon,
  title,
  text,
}) {
  return (
    <div className="feature-card">
      <div className="feature-icon">
        {icon}
      </div>

      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}

/* =========================================================
   LANGUAGE DROPDOWN
========================================================= */

function LanguageDropdown({
  type,
  open,
  setOpen,
  search,
  setSearch,
  items,
  selected,
  onSelect,
}) {
  return (
    <div className="language-dropdown">
      <button
        type="button"
        className="language-select"
        onClick={() =>
          setOpen(!open)
        }
      >
        {selected ? (
          <>
            <span className="language-flag">
              {selected.flag ||
                "🌐"}
            </span>

            <span>
              {selected.name}
            </span>
          </>
        ) : (
          <>
            <span className="detect-icon">
              ✨
            </span>

            <span>
              Detect language
            </span>
          </>
        )}

        <ChevronDown size={17} />
      </button>

      {open && (
        <div className="language-menu">
          <div className="language-search">
            <Search size={16} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search language..."
              autoFocus
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
              >
                <X size={14} />
              </button>
            )}
          </div>

          {type === "source" && (
            <button
              type="button"
              className="language-option detect-option"
              onClick={() => {
                onSelect(null);
                setOpen(false);
                setSearch("");
              }}
            >
              <span>✨</span>
              <span>
                Detect language
              </span>
            </button>
          )}

          {items.map(
            (language) => (
              <button
                type="button"
                key={`${language.name}-${language.code}`}
                className="language-option"
                onClick={() => {
                  onSelect(language);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <span>
                  {language.flag ||
                    "🌐"}
                </span>

                <span>
                  {language.name}
                </span>

                {selected?.name ===
                  language.name && (
                  <Check
                    size={16}
                    className="selected-check"
                  />
                )}
              </button>
            )
          )}

          {!items.length && (
            <div className="no-language">
              No language found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [languages, setLanguages] =
    useState(
      FALLBACK_LANGUAGES
    );

  const [
    sourceLanguage,
    setSourceLanguage,
  ] = useState(null);

  const [
    targetLanguage,
    setTargetLanguage,
  ] = useState(null);

  const [
    sourceText,
    setSourceText,
  ] = useState("");

  const [
    translatedText,
    setTranslatedText,
  ] = useState("");

  const [
    detectedLanguage,
    setDetectedLanguage,
  ] = useState(null);

  const [
    confidence,
    setConfidence,
  ] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [detecting, setDetecting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  const [listening, setListening] =
    useState(false);

  const [speaking, setSpeaking] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(
      localStorage.getItem(
        "lingo-theme"
      ) === "dark"
    );

  const [history, setHistory] =
    useState(() => {
      try {
        return (
          JSON.parse(
            localStorage.getItem(
              "lingo-history"
            )
          ) || []
        );
      } catch {
        return [];
      }
    });

  const [showHistory, setShowHistory] =
    useState(false);

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [sourceOpen, setSourceOpen] =
    useState(false);

  const [targetOpen, setTargetOpen] =
    useState(false);

  const [sourceSearch, setSourceSearch] =
    useState("");

  const [targetSearch, setTargetSearch] =
    useState("");

  const [voices, setVoices] =
    useState([]);

  const recognitionRef =
    useRef(null);

  const audioRef =
    useRef(null);

  /* =======================================================
     LOAD BROWSER VOICES
  ======================================================= */

  useEffect(() => {
    if (!window.speechSynthesis) {
      return;
    }

    const loadVoices = () => {
      setVoices(
        window.speechSynthesis.getVoices()
      );
    };

    loadVoices();

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      loadVoices
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        loadVoices
      );
    };
  }, []);

  /* =======================================================
     THEME
  ======================================================= */

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );

    localStorage.setItem(
      "lingo-theme",
      darkMode
        ? "dark"
        : "light"
    );
  }, [darkMode]);

  /* =======================================================
     LOAD LANGUAGES
  ======================================================= */

  useEffect(() => {
    loadLanguages();
  }, []);

  async function loadLanguages() {
    try {
      const response =
        await fetch(
          `${API_URL}/languages`
        );

      if (!response.ok) {
        throw new Error(
          "Backend is not running."
        );
      }

      const data =
        await response.json();

      if (
        data.success &&
        Array.isArray(
          data.languages
        ) &&
        data.languages.length
      ) {
        const normalized =
          data.languages.map(
            (language) => ({
              ...language,

              code:
                language.code ||
                getLanguageCodes(
                  language
                )[0],

              flag:
                language.flag ||
                "🌐",
            })
          );

        setLanguages(
          normalized
        );

        const english =
          findLanguage(
            normalized,
            "English"
          );

        if (english) {
          setTargetLanguage(
            english
          );
        }
      }
    } catch {
      /*
       * Keep fallback languages.
       */

      setLanguages(
        FALLBACK_LANGUAGES
      );

      const english =
        findLanguage(
          FALLBACK_LANGUAGES,
          "English"
        );

      setTargetLanguage(
        english
      );
    }
  }

  /* =======================================================
     FILTER LANGUAGES
  ======================================================= */

  const filteredSourceLanguages =
    useMemo(() => {
      return languages.filter(
        (language) =>
          language.name
            .toLowerCase()
            .includes(
              sourceSearch
                .toLowerCase()
            )
      );
    }, [
      languages,
      sourceSearch,
    ]);

  const filteredTargetLanguages =
    useMemo(() => {
      return languages.filter(
        (language) =>
          language.name
            .toLowerCase()
            .includes(
              targetSearch
                .toLowerCase()
            )
      );
    }, [
      languages,
      targetSearch,
    ]);

  /* =======================================================
     DETECT LANGUAGE
  ======================================================= */

  async function detectLanguage(
    text
  ) {
    if (!text.trim()) {
      setDetectedLanguage(
        null
      );
      setConfidence(null);
      return;
    }

    try {
      setDetecting(true);

      const response =
        await fetch(
          `${API_URL}/detect`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              text: text.trim(),
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Detection request failed."
        );
      }

      const data =
        await response.json();

      if (data.success) {
        const detected =
          findLanguage(
            languages,
            data.language,
            data.code ||
              data.source_code
          );

        const result =
          detected || {
            name:
              data.language ||
              "Unknown",

            code:
              data.code ||
              data.source_code ||
              getLanguageCodes(
                data.language
              )[0],

            flag:
              data.flag ||
              "🌐",
          };

        setDetectedLanguage(
          result
        );

        setConfidence(
          typeof data.confidence ===
            "number"
            ? Math.round(
                data.confidence
              )
            : data.confidence
        );
      }
    } catch {
      /*
       * Detection failure does not
       * destroy translator UI.
       */
    } finally {
      setDetecting(false);
    }
  }

  /* =======================================================
     SOURCE CHANGE
  ======================================================= */

  function handleSourceChange(
    value
  ) {
    setSourceText(value);
    setTranslatedText("");
    setError("");

    if (value.trim().length >= 3) {
      detectLanguage(value);
    } else {
      setDetectedLanguage(
        sourceLanguage || null
      );

      setConfidence(null);
    }
  }

  /* =======================================================
     TRANSLATE
  ======================================================= */

  async function translateText() {
    setError("");

    if (!sourceText.trim()) {
      setError(
        "Please enter some text."
      );
      return;
    }

    if (!targetLanguage) {
      setError(
        "Please select a target language."
      );
      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          `${API_URL}/translate`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              text:
                sourceText.trim(),

              target_language:
                targetLanguage.name,
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Translation failed."
        );
      }

      const resultText =
        data.translated_text ||
        "";

      setTranslatedText(
        resultText
      );

      const detected =
        findLanguage(
          languages,
          data.source_language,
          data.source_code
        );

      const finalDetected =
        detected || {
          name:
            data.source_language ||
            detectedLanguage?.name ||
            "Unknown",

          code:
            data.source_code ||
            getLanguageCodes(
              data.source_language
            )[0],

          flag:
            data.source_flag ||
            "🌐",
        };

      setDetectedLanguage(
        finalDetected
      );

      if (
        data.confidence !==
        undefined
      ) {
        setConfidence(
          typeof data.confidence ===
            "number"
            ? Math.round(
                data.confidence
              )
            : data.confidence
        );
      }

      const newItem = {
        id: Date.now(),

        source:
          sourceText,

        result:
          resultText,

        from:
          finalDetected.name,

        to:
          data.target_language ||
          targetLanguage.name,
      };

      const updatedHistory = [
        newItem,
        ...history,
      ].slice(0, 20);

      setHistory(
        updatedHistory
      );

      localStorage.setItem(
        "lingo-history",
        JSON.stringify(
          updatedHistory
        )
      );
    } catch (err) {
      setError(
        err.message ||
          "Translation failed."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     SWAP
  ======================================================= */

  function swapLanguages() {
    const currentSource =
      sourceLanguage ||
      detectedLanguage;

    if (
      !currentSource ||
      !targetLanguage
    ) {
      return;
    }

    const oldSourceText =
      sourceText;

    const oldTranslatedText =
      translatedText;

    setSourceLanguage(
      targetLanguage
    );

    setTargetLanguage(
      currentSource
    );

    setSourceText(
      oldTranslatedText
    );

    setTranslatedText(
      oldSourceText
    );

    setDetectedLanguage(
      targetLanguage
    );

    setConfidence(null);
    setError("");
  }

  /* =======================================================
     COPY
  ======================================================= */

  async function copyTranslation() {
    if (!translatedText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        translatedText
      );

      setCopied(true);

      setTimeout(
        () => setCopied(false),
        1500
      );
    } catch {
      setError(
        "Unable to copy text."
      );
    }
  }

  /* =======================================================
     STOP SPEAKING
  ======================================================= */

  function stopSpeaking() {
    try {
      window.speechSynthesis?.cancel();
    } catch {}

    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {}

      audioRef.current = null;
    }

    setSpeaking(false);
  }

  /* =======================================================
     BACKEND TTS
  ======================================================= */

  async function backendSpeak(
    text,
    language
  ) {
    const code =
      getLanguageCodes(
        language
      )[0];

    const payload = {
      text,
      language:
        language?.name ||
        language,
      code,
    };

    /*
     * First try /speak because
     * this is used by your first
     * backend implementation.
     */

    let response =
      await fetch(
        `${API_URL}/speak`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(
              payload
            ),
        }
      );

    /*
     * If /speak does not exist,
     * try /tts.
     */

    if (!response.ok) {
      response =
        await fetch(
          `${API_URL}/tts`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload
              ),
          }
        );
    }

    if (!response.ok) {
      let message =
        "Backend voice unavailable.";

      try {
        const data =
          await response.json();

        message =
          data.message ||
          data.details ||
          message;
      } catch {}

      throw new Error(
        message
      );
    }

    const blob =
      await response.blob();

    if (
      !blob.type.startsWith(
        "audio/"
      )
    ) {
      throw new Error(
        "Invalid audio response from backend."
      );
    }

    const audioUrl =
      URL.createObjectURL(
        blob
      );

    const audio =
      new Audio(audioUrl);

    audioRef.current =
      audio;

    audio.onended = () => {
      setSpeaking(false);

      URL.revokeObjectURL(
        audioUrl
      );

      audioRef.current =
        null;
    };

    audio.onerror = () => {
      setSpeaking(false);

      URL.revokeObjectURL(
        audioUrl
      );

      audioRef.current =
        null;

      setError(
        "Unable to play generated voice."
      );
    };

    await audio.play();
  }

  /* =======================================================
     SMART SPEAK
  ======================================================= */

  async function speak(
    text,
    language
  ) {
    if (
      !text?.trim() ||
      !language
    ) {
      return;
    }

    setError("");
    stopSpeaking();

    /*
     * Browser native TTS
     */

    if (
      window.speechSynthesis
    ) {
      let availableVoices =
        window.speechSynthesis.getVoices();

      /*
       * Chrome loads voices
       * asynchronously.
       */

      if (
        !availableVoices.length
      ) {
        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              500
            )
        );

        availableVoices =
          window.speechSynthesis.getVoices();
      }

      const voice =
        findBestVoice(
          language,
          availableVoices
        );

      if (voice) {
        const utterance =
          new SpeechSynthesisUtterance(
            text
          );

        utterance.voice =
          voice;

        utterance.lang =
          voice.lang;

        utterance.rate =
          0.9;

        utterance.pitch =
          1;

        utterance.volume =
          1;

        utterance.onstart =
          () => {
            setSpeaking(true);
          };

        utterance.onend =
          () => {
            setSpeaking(false);
          };

        utterance.onerror =
          async () => {
            /*
             * Browser voice failed.
             * Use backend.
             */

            try {
              await backendSpeak(
                text,
                language
              );
            } catch {
              setError(
                `Unable to generate ${language.name} voice.`
              );

              setSpeaking(false);
            }
          };

        setSpeaking(true);

        window.speechSynthesis.speak(
          utterance
        );

        return;
      }
    }

    /*
     * Browser has no voice.
     * Backend becomes fallback.
     */

    try {
      setSpeaking(true);

      await backendSpeak(
        text,
        language
      );
    } catch {
      setSpeaking(false);

      setError(
        `No browser voice found for ${language.name}. Backend TTS is also unavailable.`
      );
    }
  }

  /* =======================================================
     MICROPHONE
  ======================================================= */

  function startSpeechRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported. Please use Google Chrome or Microsoft Edge."
      );

      return;
    }

    if (listening) {
      try {
        recognitionRef.current?.stop();
      } catch {}

      setListening(false);
      return;
    }

    /*
     * Stop old recognition
     */

    if (
      recognitionRef.current
    ) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous =
      false;

    recognition.interimResults =
      true;

    recognition.maxAlternatives =
      1;

    /*
     * Important:
     *
     * Manual selection has
     * highest priority.
     *
     * Otherwise detected
     * language is used.
     *
     * Otherwise English.
     */

    const language =
      sourceLanguage ||
      detectedLanguage ||
      findLanguage(
        languages,
        "English"
      );

    const code =
      getLanguageCodes(
        language
      )[0] ||
      "en-US";

    recognition.lang =
      code;

    recognition.onstart =
      () => {
        setListening(true);
        setError("");
      };

    recognition.onresult =
      (event) => {
        let text = "";

        for (
          let i =
            event.resultIndex;
          i <
          event.results.length;
          i++
        ) {
          text +=
            event.results[i][0]
              .transcript;
        }

        if (text.trim()) {
          /*
           * Do not repeatedly
           * destroy detected
           * language.
           */

          setSourceText(
            text
          );

          setTranslatedText(
            ""
          );

          if (
            text.trim().length >=
            3
          ) {
            detectLanguage(text);
          }
        }
      };

    recognition.onerror =
      (event) => {
        console.error(
          "Speech Recognition:",
          event.error
        );

        setListening(false);

        switch (
          event.error
        ) {
          case "not-allowed":
            setError(
              "Microphone permission was denied. Please allow microphone access."
            );
            break;

          case "no-speech":
            setError(
              "No speech detected. Please try again."
            );
            break;

          case "audio-capture":
            setError(
              "No microphone was found."
            );
            break;

          case "language-not-supported":
            setError(
              `${language?.name || "Selected language"} is not supported by browser speech recognition.`
            );
            break;

          default:
            setError(
              `Speech recognition error: ${event.error}`
            );
        }
      };

    recognition.onend =
      () => {
        setListening(false);
        recognitionRef.current =
          null;
      };

    recognitionRef.current =
      recognition;

    try {
      recognition.start();
    } catch {
      setListening(false);

      setError(
        "Unable to start microphone."
      );
    }
  }

  /* =======================================================
     CLEAR
  ======================================================= */

  function clearAll() {
    stopSpeaking();

    if (
      recognitionRef.current
    ) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    setSourceText("");
    setTranslatedText("");
    setDetectedLanguage(null);
    setConfidence(null);
    setError("");
    setListening(false);
  }

  /* =======================================================
     DOWNLOAD TEXT
  ======================================================= */

  function downloadTranslation() {
    if (!translatedText) {
      return;
    }

    const content = `
LingoAI Translation

Source Language:
${
  detectedLanguage?.name ||
  sourceLanguage?.name ||
  "Unknown"
}

Target Language:
${targetLanguage?.name || "Unknown"}

Original:
${sourceText}

Translation:
${translatedText}
`;

    const blob =
      new Blob(
        [content],
        {
          type:
            "text/plain;charset=utf-8",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      "lingoai-translation.txt";

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(
      url
    );
  }

  /* =======================================================
     DOWNLOAD AUDIO
  ======================================================= */

  async function downloadAudio() {
    if (!translatedText) {
      setError(
        "Translate something first."
      );

      return;
    }

    try {
      const code =
        getLanguageCodes(
          targetLanguage
        )[0];

      const payload = {
        text: translatedText,
        language:
          targetLanguage?.name,
        code,
      };

      let response =
        await fetch(
          `${API_URL}/speak`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify(
                payload
              ),
          }
        );

      if (!response.ok) {
        response =
          await fetch(
            `${API_URL}/tts`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body:
                JSON.stringify(
                  payload
                ),
            }
          );
      }

      if (!response.ok) {
        throw new Error(
          "Audio generation failed."
        );
      }

      const blob =
        await response.blob();

      if (
        !blob.type.startsWith(
          "audio/"
        )
      ) {
        throw new Error(
          "Invalid audio response."
        );
      }

      const url =
        URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.download =
        "lingoai-speech.mp3";

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      URL.revokeObjectURL(
        url
      );
    } catch (err) {
      setError(
        err.message ||
          "Audio download failed."
      );
    }
  }

  /* =======================================================
     SHARE
  ======================================================= */

  async function shareTranslation() {
    if (!translatedText) {
      return;
    }

    const text =
      `${sourceText}\n\n${translatedText}`;

    try {
      if (
        navigator.share
      ) {
        await navigator.share({
          title:
            "LingoAI Translation",
          text,
        });
      } else {
        await navigator.clipboard.writeText(
          text
        );

        setCopied(true);

        setTimeout(
          () => setCopied(false),
          1500
        );
      }
    } catch {}
  }

  /* =======================================================
     HISTORY
  ======================================================= */

  function deleteHistory(id) {
    const updated =
      history.filter(
        (item) =>
          item.id !== id
      );

    setHistory(updated);

    localStorage.setItem(
      "lingo-history",
      JSON.stringify(updated)
    );
  }

  function clearHistory() {
    setHistory([]);

    localStorage.removeItem(
      "lingo-history"
    );
  }

  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis?.cancel();
      } catch {}

      if (
        recognitionRef.current
      ) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }

      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch {}
      }
    };
  }, []);

  /* =======================================================
     CLOSE DROPDOWNS ON OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {
    function handleClick(
      event
    ) {
      if (
        !event.target.closest(
          ".language-dropdown"
        )
      ) {
        setSourceOpen(false);
        setTargetOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="app">

      {/* ===================================================
          NAVBAR
      =================================================== */}

      <header className="navbar">

        <div className="logo-area">

          <div className="logo">
            <Languages size={23} />
          </div>

          <div>
            <div className="logo-name">
              Lingo<span>AI</span>
            </div>

            <div className="logo-subtitle">
              Intelligent Language Platform
            </div>
          </div>

        </div>

        <nav className="desktop-nav">

          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            Translate
          </button>

          <button
            type="button"
            onClick={() =>
              setShowHistory(true)
            }
          >
            <History size={16} />
            History
          </button>

        </nav>

        <div className="nav-actions">

          <button
            type="button"
            className="icon-button"
            onClick={() =>
              setDarkMode(
                !darkMode
              )
            }
            title="Theme"
          >
            {darkMode ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() =>
              setMobileMenu(
                !mobileMenu
              )
            }
          >
            <Menu size={21} />
          </button>

        </div>

      </header>

      {mobileMenu && (
        <div className="mobile-nav">

          <button
            type="button"
            onClick={() => {
              setShowHistory(true);
              setMobileMenu(false);
            }}
          >
            <History size={17} />
            History
          </button>

        </div>
      )}

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="main">

        {/* HERO */}

        <section className="hero">

          <div className="hero-badge">
            <Sparkles size={14} />
            AI POWERED TRANSLATION
          </div>

          <h1>
            Your words.
            <br />
            <span>
              Any language.
            </span>
          </h1>

          <p>
            Detect, translate and listen
            to languages instantly with
            LingoAI.
          </p>

        </section>

        {/* DETECTION */}

        {sourceText && (
          <div className="detection-bar">

            <div className="detection-left">

              <div className="ai-pulse">
                <Sparkles size={17} />
              </div>

              <div>
                <small>
                  {detecting
                    ? "AI DETECTING..."
                    : "AI DETECTED"}
                </small>

                <strong>
                  {detecting
                    ? "Analyzing..."
                    : detectedLanguage
                    ? `${
                        detectedLanguage.flag ||
                        "🌐"
                      } ${
                        detectedLanguage.name
                      }`
                    : "Waiting..."}
                </strong>
              </div>

            </div>

            {confidence !==
              null &&
              !detecting && (
                <div className="confidence">

                  <span>
                    Confidence
                  </span>

                  <strong>
                    {confidence}%
                  </strong>

                </div>
              )}

          </div>
        )}

        {/* TRANSLATOR */}

        <section className="translator">

          {/* LANGUAGE BAR */}

          <div className="translator-top">

            <LanguageDropdown
              type="source"
              open={sourceOpen}
              setOpen={
                setSourceOpen
              }
              search={
                sourceSearch
              }
              setSearch={
                setSourceSearch
              }
              items={
                filteredSourceLanguages
              }
              selected={
                sourceLanguage
                  ? sourceLanguage
                  : null
              }
              onSelect={(
                language
              ) => {
                setSourceLanguage(
                  language
                );

                if (language) {
                  setDetectedLanguage(
                    language
                  );

                  setConfidence(
                    null
                  );
                } else if (
                  sourceText.trim()
                ) {
                  detectLanguage(
                    sourceText
                  );
                }
              }}
            />

            <button
              type="button"
              className="swap-button"
              onClick={
                swapLanguages
              }
              title="Swap languages"
            >
              <ArrowLeftRight
                size={18}
              />
            </button>

            <LanguageDropdown
              type="target"
              open={targetOpen}
              setOpen={
                setTargetOpen
              }
              search={
                targetSearch
              }
              setSearch={
                setTargetSearch
              }
              items={
                filteredTargetLanguages
              }
              selected={
                targetLanguage
              }
              onSelect={
                setTargetLanguage
              }
            />

          </div>

          {/* TEXT GRID */}

          <div className="translation-grid">

            {/* SOURCE */}

            <div className="translation-panel">

              <textarea
                value={sourceText}
                onChange={(e) =>
                  handleSourceChange(
                    e.target.value
                  )
                }
                placeholder="Enter text..."
                maxLength={5000}
              />

              <div className="panel-bottom">

                <span className="character-count">
                  {sourceText.length}/5000
                </span>

                <div className="panel-actions">

                  <button
                    type="button"
                    onClick={
                      startSpeechRecognition
                    }
                    className={
                      listening
                        ? "recording"
                        : ""
                    }
                    title={
                      listening
                        ? "Stop recording"
                        : "Voice input"
                    }
                  >
                    <Mic size={19} />
                  </button>

                  <button
                    type="button"
                    disabled={
                      !sourceText ||
                      !(
                        sourceLanguage ||
                        detectedLanguage
                      ) ||
                      speaking
                    }
                    onClick={() =>
                      speak(
                        sourceText,
                        sourceLanguage ||
                          detectedLanguage
                      )
                    }
                    title="Listen"
                  >
                    <Volume2
                      size={19}
                    />
                  </button>

                  <button
                    type="button"
                    disabled={
                      !sourceText
                    }
                    onClick={() =>
                      setSourceText(
                        ""
                      )
                    }
                    title="Clear"
                  >
                    <Trash2
                      size={18}
                    />
                  </button>

                </div>

              </div>

            </div>

            {/* RESULT */}

            <div className="translation-panel result-panel">

              {loading ? (
                <div className="loading-state">

                  <div className="spinner" />

                  <span>
                    Translating...
                  </span>

                </div>
              ) : translatedText ? (
                <div className="result-text">
                  {translatedText}
                </div>
              ) : (
                <div className="empty-result">

                  <div className="empty-icon">
                    <Languages
                      size={24}
                    />
                  </div>

                  <span>
                    Translation appears here
                  </span>

                </div>
              )}

              <div className="panel-bottom">

                <span className="character-count">
                  {translatedText.length}
                </span>

                <div className="panel-actions">

                  <button
                    type="button"
                    disabled={
                      !translatedText ||
                      !targetLanguage ||
                      speaking
                    }
                    onClick={() =>
                      speak(
                        translatedText,
                        targetLanguage
                      )
                    }
                    title="Listen"
                  >
                    <Volume2
                      size={19}
                    />
                  </button>

                  {speaking && (
                    <button
                      type="button"
                      onClick={
                        stopSpeaking
                      }
                      title="Stop voice"
                    >
                      <X size={18} />
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={
                      !translatedText
                    }
                    onClick={
                      copyTranslation
                    }
                    title="Copy"
                  >
                    {copied ? (
                      <Check
                        size={19}
                      />
                    ) : (
                      <Copy
                        size={19}
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={
                      !translatedText
                    }
                    onClick={
                      shareTranslation
                    }
                    title="Share"
                  >
                    <Share2
                      size={18}
                    />
                  </button>

                  <button
                    type="button"
                    disabled={
                      !translatedText
                    }
                    onClick={
                      downloadTranslation
                    }
                    title="Download"
                  >
                    <Download
                      size={18}
                    />
                  </button>

                  <button
                    type="button"
                    disabled={
                      !translatedText
                    }
                    onClick={
                      downloadAudio
                    }
                    title="Download audio"
                  >
                    <Volume2
                      size={18}
                    />
                  </button>

                </div>

              </div>

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="error-box">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {/* ACTIONS */}

          <div className="translator-actions">

            <button
              type="button"
              className="translate-button"
              onClick={
                translateText
              }
              disabled={
                loading ||
                !sourceText.trim() ||
                !targetLanguage
              }
            >
              {loading ? (
                <>
                  <div className="button-spinner" />
                  Translating...
                </>
              ) : (
                <>
                  <Sparkles size={19} />
                  Translate
                </>
              )}
            </button>

            <button
              type="button"
              className="clear-button"
              onClick={clearAll}
            >
              <RotateCcw size={17} />
              Clear
            </button>

          </div>

        </section>

        {/* FEATURES */}

        <section className="feature-grid">

          <Feature
            icon={
              <Sparkles size={21} />
            }
            title="AI Detection"
            text="Your trained machine-learning model automatically detects the source language."
          />

          <Feature
            icon={
              <Languages size={21} />
            }
            title="Multi Language"
            text={`${languages.length} languages loaded from your translation system.`}
          />

          <Feature
            icon={
              <Volume2 size={21} />
            }
            title="Smart Voice"
            text="Uses browser voices first and automatically falls back to FastAPI TTS."
          />

        </section>

        {/* HISTORY */}

        {history.length > 0 && (
          <section className="history-section">

            <div className="section-header">

              <div>
                <span>
                  YOUR ACTIVITY
                </span>

                <h2>
                  Recent translations
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowHistory(true)
                }
              >
                View all
              </button>

            </div>

            <div className="history-list">

              {history
                .slice(0, 3)
                .map(
                  (item) => (
                    <div
                      className="history-card"
                      key={item.id}
                    >

                      <div className="history-language">
                        {item.from}

                        <ArrowLeftRight
                          size={14}
                        />

                        {item.to}
                      </div>

                      <p>
                        {item.source}
                      </p>

                      <strong>
                        {item.result}
                      </strong>

                    </div>
                  )
                )}

            </div>

          </section>
        )}

      </main>

      {/* FOOTER */}

      <footer className="footer">

        <div className="footer-logo">

          <div className="mini-logo">
            <Languages size={16} />
          </div>

          LingoAI

        </div>

        <span>
          AI Language Detection &
          Translation Platform
        </span>

        <span>
          © 2026
        </span>

      </footer>

      {/* HISTORY MODAL */}

      {showHistory && (
        <div
          className="modal-backdrop"
          onClick={() =>
            setShowHistory(false)
          }
        >

          <div
            className="history-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <span>
                  LINGOAI
                </span>

                <h2>
                  Translation History
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowHistory(false)
                }
              >
                <X />
              </button>

            </div>

            {history.length ===
            0 ? (
              <div className="no-history">

                <History
                  size={35}
                />

                <p>
                  No translations yet.
                </p>

              </div>
            ) : (
              <>

                <div className="modal-history-list">

                  {history.map(
                    (item) => (
                      <div
                        className="modal-history-item"
                        key={item.id}
                      >

                        <div>

                          <span>
                            {item.from}
                            {" → "}
                            {item.to}
                          </span>

                          <p>
                            {item.source}
                          </p>

                          <strong>
                            {item.result}
                          </strong>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            deleteHistory(
                              item.id
                            )
                          }
                        >
                          <Trash2
                            size={17}
                          />
                        </button>

                      </div>
                    )
                  )}

                </div>

                <button
                  type="button"
                  className="delete-history"
                  onClick={
                    clearHistory
                  }
                >
                  <Trash2
                    size={17}
                  />
                  Clear all history
                </button>

              </>
            )}

          </div>

        </div>
      )}

    </div>
  );
}