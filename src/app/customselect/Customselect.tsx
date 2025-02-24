import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
const platforms = [
  { name: "GitHub", value: "GitHub", icon: "/images/icon-github.svg" },
  { name: "Twitter", value: "Twitter", icon: "/images/icon-twitter.svg" },
  { name: "Youtube", value: "Youtube", icon: "/images/icon-youtube.svg" },
  { name: "LinkedIn", value: "LinkedIn", icon: "/images/icon-linkedin.svg" },
  { name: "Facebook", value: "Facebook", icon: "/images/icon-facebook.svg" },
  {
    name: "Frontendmentor",
    value: "Frontendmentor",
    icon: "/images/icon-frontend-mentor.svg",
  },
  { name: "Gitlab", value: "Gitlab", icon: "/images/icon-gitlab.svg" },
  {
    name: "Freecodecamp",
    value: "Freecodecamp",
    icon: "/images/icon-freecodecamp.svg",
  },
  {
    name: "Stackoverflow",
    value: "Stackoverflow",
    icon: "/images/icon-stack-overflow.svg",
  },
  {
    name: "Twitch",
    value: "Twitch",
    icon: "/images/icon-twitch.svg",
  },
  {
    name: "Devto",
    value: "Devto",
    icon: "/images/icon-devto.svg",
  },
  {
    name: "Codepen",
    value: "Codepen",
    icon: "/images/icon-codepen.svg",
  },
  {
    name: "CodeWars",
    value: "CodeWars",
    icon: "/images/icon-codewars.svg",
  },
  {
    name: "Hashnode",
    value: "Hashnode",
    icon: "/images/icon-hashnode.svg",
  },
];
interface CustomSelectProps {
  selected: string | null;
  setSelected: (value: string) => void;
}
export default function CustomSelect({
  selected,
  setSelected,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  console.log("selected platform custom select", selected);

  return (
    <div className="relative w-100 customSelect	" ref={dropdownRef}>
      <p className="lpt">Platform</p>
      <div
        className="flex mb-3 items-center  justify-between border px-4 py-3 rounded cursor-pointer rounded-lg "
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected ? (
          <div className="flex items-center gap-2 ">
            <Image
              src={platforms.find((p) => p.value === selected)?.icon || ""}
              alt="logo"
              width={20}
              height={20}
            />
            <span className="dropdownName">{selected}</span>
          </div>
        ) : (
          <div>
            <div
              key={"GitHub"}
              className={`flex items-center  cursor-pointer transition-colors 
     hover:text-[#633CFF] active:text-[#633CFF] group `}
              onClick={() => {
                setSelected("GitHub");
                setIsOpen(false);
              }}
            >
              <div
                style={{
                  maskImage: `url(/images/icon-github.svg)`,
                  WebkitMaskImage: `url(/images/icon-github.svg)`,
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                }}
                className="w-4 h-4 bg-[#737373] group-hover:bg-[#633CFF] mr-2"
              />

              <span className="group-hover:text-[#633CFF] group-active:text-[#633CFF] dropdownName">
                GitHub{" "}
              </span>
            </div>
          </div>
        )}{" "}
        <ChevronDown
          className={`transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute bg-white border rounded px-4 p-2  w-full shadow-lg max-h-[250px] overflow-y-auto z-50"
          >
            {platforms.map((platform, index) => (
              <div
                key={platform.value}
                className={`flex items-center py-3 cursor-pointer transition-colors 
     hover:text-[#633CFF] active:text-[#633CFF] group ${
       index !== platforms.length - 1 ? "border-b border-[#D9D9D9]" : ""
     }`}
                onClick={() => {
                  console.log("Setting Platform:", platform.value);

                  setSelected(platform.value);
                  setIsOpen(false);
                }}
              >
                <div
                  style={{
                    maskImage: `url(${platform.icon})`,
                    WebkitMaskImage: `url(${platform.icon})`,
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                  }}
                  className="w-4 h-4 bg-[#737373] group-hover:bg-[#633CFF] mr-2"
                />

                <span className="group-hover:text-[#633CFF] group-active:text-[#633CFF] dropdownName">
                  {platform.name}
                </span>
              </div>
            ))}
          </motion.div>
        )}{" "}
      </AnimatePresence>
    </div>
  );
}
