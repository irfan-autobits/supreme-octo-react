// src/components/UI/SettingToggle.tsx
import React, { useEffect, useState } from "react";
import TailwindSwitch from "../../components/UI/TailwindSwitch";

const API_URL = import.meta.env.VITE_API_URL!;
if (!API_URL) throw new Error("VITE_API_URL not defined");

interface SettingToggleProps {
  /** the key in your settings JSON to fetch/post */
  settingKey: string;
  /** human‐friendly label for the switch */
  label?: string;
  setIsDetecting: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingToggle: React.FC<SettingToggleProps> = ({
  settingKey,
  label,
  setIsDetecting,
}) => {
  const [value, setValue] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // fetch initial
  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then((res) => res.json())
      .then((settings) => {
        if (typeof settings[settingKey] === "boolean") {
          setValue(settings[settingKey]);
          setIsDetecting(settings[settingKey]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [settingKey]);

  const toggle = () => {
    const next = !value;
    console.log("detection set to", next);
    // optimistically update
    setIsDetecting(next);
    setValue(next);
    fetch(`${API_URL}/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: settingKey, value: next }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save");
      })
      .catch((err) => {
        console.error(err);
        // rollback on error
        setIsDetecting((v) => !v);
        setValue((v) => !v);
      });
  };

  if (loading) return null;

  return (
    // <div className="flex items-center gap-2">
    <div
      className={`
          inline-flex items-center space-x-2 justify-between
          border border-gray-300 bg-white
          px-3 py-2 rounded-md
          transition-colors 
          hover:bg-gray-100 
          ${false ? "hover:border-transparent" : ""}
          text-sm text-gray-800
      `}
    >
      <span className="text-sm text-gray-700">{label ?? settingKey}</span>
      <TailwindSwitch enabled={value} setEnabled={() => toggle()} />
    </div>
  );
};

export default SettingToggle;
