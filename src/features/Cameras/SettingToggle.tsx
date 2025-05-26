// src/components/UI/SettingToggle.tsx
import React, { useEffect, useState } from 'react';
import Switch from '@mui/material/Switch';

const API_URL = import.meta.env.VITE_API_URL!;
if (!API_URL) throw new Error('VITE_API_URL not defined');

interface SettingToggleProps {
  /** the key in your settings JSON to fetch/post */
  settingKey: string;
  /** human‐friendly label for the switch */
  label?: string;
}

const SettingToggle: React.FC<SettingToggleProps> = ({ settingKey, label }) => {
  const [value, setValue] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // fetch initial
  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then(res => res.json())
      .then(settings => {
        if (typeof settings[settingKey] === 'boolean') {
          setValue(settings[settingKey]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [settingKey]);

  const toggle = () => {
    const next = !value;
    // optimistically update
    setValue(next);
    fetch(`${API_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: settingKey, value: next }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save');
      })
      .catch(err => {
        console.error(err);
        // rollback on error
        setValue(v => !v);
      });
  };

  if (loading) return null;

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-700">{label ?? settingKey}</span>
      <Switch
        checked={value}
        onChange={toggle}
        color="primary"
        size="small"
      />
    </div>
  );
};

export default SettingToggle;
