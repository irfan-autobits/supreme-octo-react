// project/src/components/UI/TailwindSwitch.tsx
import { Switch } from "@headlessui/react";

export default function TailwindSwitch({
  enabled,
  setEnabled,
}: {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
}) {
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${
        enabled ? "bg-green-600" : "bg-gray-300"
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none`}
    >
      <span
        className={`${
          enabled ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300`}
      />
    </Switch>
  );
}
