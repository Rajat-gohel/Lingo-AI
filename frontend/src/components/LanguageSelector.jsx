import {
  Check,
  ChevronDown,
  Search,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";


export default function LanguageSelector({
  value,
  onChange,
  languages,
  autoDetect = false,
  darkMode,
}) {

  const [open, setOpen] = useState(false);

  const [search, setSearch] =
    useState("");

  const wrapperRef =
    useRef(null);


  useEffect(() => {

    const handleClick = (event) => {

      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target
        )
      ) {

        setOpen(false);

      }

    };

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClick
      );

    };

  }, []);


  const filteredLanguages =
    languages.filter((language) =>
      language.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );


  const selectLanguage = (language) => {

    onChange(language);

    setOpen(false);

    setSearch("");

  };


  return (

    <div
      ref={wrapperRef}
      className="relative w-full"
    >

      <button
        type="button"
        onClick={() =>
          setOpen(!open)
        }
        className={
          darkMode
            ? "flex w-full items-center justify-between rounded-xl bg-[#0a0f1c] px-3 py-3 text-left transition hover:bg-white/10 sm:px-4"
            : "flex w-full items-center justify-between rounded-xl bg-slate-50 px-3 py-3 text-left transition hover:bg-slate-100 sm:px-4"
        }
      >

        <div className="flex min-w-0 items-center gap-2">

          <span className="text-lg">
            {autoDetect &&
            value === "Auto Detect"
              ? "🌐"
              : "🗣️"}
          </span>

          <span className="truncate text-xs font-bold sm:text-sm">
            {value}
          </span>

        </div>


        <ChevronDown
          size={16}
          className={
            open
              ? "rotate-180 text-slate-400 transition"
              : "text-slate-400 transition"
          }
        />

      </button>


      {open && (

        <div
          className={
            darkMode
              ? "absolute left-0 right-0 top-full z-[100] mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-2xl"
              : "absolute left-0 right-0 top-full z-[100] mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          }
        >

          {/* Search */}

          <div className="border-b border-slate-200 p-2 dark:border-white/10">

            <div className="relative">

              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search language..."
                autoFocus
                className={
                  darkMode
                    ? "w-full rounded-xl bg-[#0a0f1c] py-2.5 pl-9 pr-3 text-xs outline-none"
                    : "w-full rounded-xl bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none"
                }
              />

            </div>

          </div>


          {/* Languages */}

          <div className="max-h-64 overflow-y-auto p-1.5">

            {autoDetect &&
            !search && (

              <button
                type="button"
                onClick={() =>
                  selectLanguage(
                    "Auto Detect"
                  )
                }
                className={
                  value ===
                  "Auto Detect"
                    ? "flex w-full items-center justify-between rounded-xl bg-slate-100 px-3 py-2.5 text-left text-xs font-bold dark:bg-white/10"
                    : "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/5"
                }
              >

                <span>
                  🌐 Auto Detect
                </span>

                {value ===
                  "Auto Detect" && (
                  <Check size={15} />
                )}

              </button>

            )}


            {filteredLanguages.map(
              (language) => (

                <button
                  type="button"
                  key={language.code}
                  onClick={() =>
                    selectLanguage(
                      language.name
                    )
                  }
                  className={
                    value ===
                    language.name
                      ? "flex w-full items-center justify-between rounded-xl bg-slate-100 px-3 py-2.5 text-left text-xs font-bold dark:bg-white/10"
                      : "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/5"
                  }
                >

                  <span>
                    {getFlag(
                      language.code
                    )}{" "}
                    {language.name}
                  </span>

                  {value ===
                    language.name && (
                    <Check size={15} />
                  )}

                </button>

              )
            )}


            {filteredLanguages.length ===
              0 && (

              <div className="px-3 py-8 text-center text-xs text-slate-400">
                No language found.
              </div>

            )}

          </div>

        </div>

      )}

    </div>
  );
}


function getFlag(code) {

  const flags = {
    en: "🇬🇧",
    hi: "🇮🇳",
    gu: "🇮🇳",
    es: "🇪🇸",
    fr: "🇫🇷",
    de: "🇩🇪",
    it: "🇮🇹",
    pt: "🇵🇹",
    ru: "🇷🇺",
    ja: "🇯🇵",
    ko: "🇰🇷",
    "zh-CN": "🇨🇳",
    ar: "🇸🇦",
    bn: "🇧🇩",
    mr: "🇮🇳",
    ta: "🇮🇳",
    te: "🇮🇳",
    pa: "🇮🇳",
    ur: "🇵🇰",
    nl: "🇳🇱",
    tr: "🇹🇷",
    pl: "🇵🇱",
    uk: "🇺🇦",
    vi: "🇻🇳",
    id: "🇮🇩",
    ms: "🇲🇾",
    th: "🇹🇭",
  };

  return flags[code] || "🌍";
}