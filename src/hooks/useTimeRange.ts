// src/hooks/useTimeRange.ts
import { useState, useMemo } from 'react';
import { format as fnsFormat, parseISO } from 'date-fns';
import { toUTCStart, toUTCEnd, isSameDay } from '../utils/time';

type TimeRangePreset = 'today' | 'yesterday' | 'custom';
type TimeInterval = 'hourly' | 'daily';

interface TimeRange {
  start: string; // UTC ISO string
  end: string;   // UTC ISO string
  interval: TimeInterval;
}

export function useTimeRange(initialPreset: TimeRangePreset = 'today') {
  const [preset, setPreset] = useState<TimeRangePreset>(initialPreset);
  const [customStart, setCustomStart] = useState<string>(fnsFormat(new Date(), 'yyyy-MM-dd'));
  const [customEnd, setCustomEnd] = useState<string>(fnsFormat(new Date(), 'yyyy-MM-dd'));

  const range = useMemo<TimeRange>(() => {
    let startDate: Date;
    let endDate: Date;

    switch (preset) {
      case 'today':
        startDate = new Date();
        endDate = new Date();
        break;
      case 'yesterday':
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = yesterday;
        endDate = yesterday;
        break;
      case 'custom':
        startDate = parseISO(customStart);
        endDate = parseISO(customEnd);
        break;
    }

    return {
      start: toUTCStart(startDate),
      end: toUTCEnd(endDate),
      interval: isSameDay(startDate, endDate) ? 'hourly' : 'daily'
    };
  }, [preset, customStart, customEnd]);

  const setCustomRange = (start: string, end: string) => {
    setCustomStart(start);
    setCustomEnd(end);
    setPreset('custom');
  };

  return {
    preset,
    setPreset,
    customStart,
    customEnd,
    setCustomRange,
    ...range
  };
}

1