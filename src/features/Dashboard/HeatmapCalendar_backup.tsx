// src/features/Dashboard/HeatmapCalendar_backup.tsx
import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HeatmapModule from "highcharts/modules/heatmap";
import { parseISO, format, addDays, isAfter, isValid } from "date-fns";

HeatmapModule(Highcharts);

interface Props {
  data: { date: string; count: number }[];
  startDate: string; // ISO yyyy‑MM‑dd for the very first cell
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKS = 16;
const DAYS = 7;

const CalendarHeatmap: React.FC<Props> = ({ data, startDate }) => {
  // 1) Guard against invalid startDate
  const parsed = parseISO(startDate);
  if (!isValid(parsed)) {
    return <div className="py-8 text-center">Loading heatmap…</div>;
  }

  // 2) Build our 16×7 calendar from that first Sunday
  const allDates = useMemo(
    () =>
      Array.from({ length: WEEKS * DAYS }, (_, i) => addDays(parsed, i)),
    [parsed]
  );

  // 3) Build a quick lookup
  const lookup = useMemo(() => {
    const m = new Map<string, number>();
    data.forEach(({ date, count }) => m.set(date, count));
    return m;
  }, [data]);

  const today = new Date();

// 4) build seriesData with your wkCnt logic…
let wkCnt = 0, prevDay = -1;
const seriesData = allDates.map((d, i) => {
  const dy = d.getDay();
  if (prevDay > dy) wkCnt++;
  prevDay = dy;
  const val = isAfter(d, today) ? null
             : (lookup.get(format(d,'yyyy-MM-dd')) ?? 0) || null;
  return { x: wkCnt, y: dy, value: val, date: d.toISOString() };
});

// 5) now build monthLabels using the same x:
const monthLabels = allDates
  .map((d,i) => ({ d, i }))
  .filter(({d}) => d.getDate() === 1)
  .map(({d,i}) => ({
    x: (seriesData[i] as any).x,
    text: format(d, "MMM"),
  }));


  // 6) Chart options
  const options: Highcharts.Options = {
  chart: {
    type: "heatmap",
    height: 300,               // enough vertical real estate
    marginBottom: 50,          // room for month labels
    backgroundColor: "none",
  },
  title: { text: "" },
  xAxis: {
    categories: Array(16).fill(""),
    tickLength: 0,             // hide ticks
    labels: {
        formatter() {
          const pos = (this as any).pos as number;
          const ml = monthLabels.find((m) => m.x === pos);
          return ml?.text ?? "";
        },
      style: { fontSize: "12px", color: "#333" },
    },
    title: { text: null },
  },
  yAxis: {
    categories: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], //or WEEKDAYS
    reversed: true, // false = Sun top → Sat bottom
    title: { text: null },
    labels: { style: { fontSize: "10px", color: "#333" } },
  },
  colorAxis: {
    min: 0,
    minColor: "#C5ECB2",
    maxColor: "#11865B",
    nullColor: "transparent",
  },
  legend: { enabled: false },
  plotOptions: {
    heatmap: {
      pointPadding: 2,         // small gap between cells
      borderWidth: 0.5,        // fine white line
    },
    series: { animation: false },
  },
  tooltip: {
  formatter() {
    const p = this.point as any;
    // read back the exact ISO we embedded:
    const iso = p.options.date as string;
    const d = parseISO(iso);
    const cnt = p.value ?? 0;
    return `<b>${format(d, "EEE, MMM d, yyyy")}</b><br/>Count: ${cnt}`;
  },
},
  series: [{
    name: "Detections",
    borderWidth: 0.5,          // reinforce grid lines
    data: seriesData,          // your [x,y,value,date] array
    type: "heatmap",
    dataLabels: { enabled: false },
    pointPadding: 2,
  }],
};

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default CalendarHeatmap;
