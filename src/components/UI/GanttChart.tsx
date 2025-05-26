// project/src/components/UI/GanttChart.tsx
import React, { useEffect } from "react";
// import Highcharts from "highcharts";
import GanttModule from "highcharts/modules/gantt";
// import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highcharts-gantt";
import HighchartsReact from "highcharts-react-official";
export interface GanttTask {
  camera: string;
  name: string;
  start: string;
  end: string;
  type: "camera" | "feed";
}
interface GanttProps {
  title: string;
  categories: string[];
  tasks: GanttTask[];
  range: { min: string; max: string };
}

const GanttChart: React.FC<GanttProps> = ({ title, categories, tasks, range }) => {
  useEffect(() => {
    Highcharts.setOptions({ time: { useUTC: true } as any });
  }, []);

  // map your tasks into Highcharts X-range points
  const seriesData = tasks.map((t) => ({
    x: Date.parse(t.start),
    x2: Date.parse(t.end),
    y: categories.indexOf(t.camera),
    name: t.name,
    // you can switch on t.type here if you want
  }));

  const options: Highcharts.Options = {
    chart: { type: "xrange", height: categories.length * 70 + 50 },
    title: { text: title, align: "left" },
    xAxis: {
      type: "datetime",
      min: Date.parse(range.min),
      max: Date.parse(range.max),
    },
    yAxis: {
      categories,
      reversed: true,
      title: { text: "" },
    },
    series: [
      {
        type: "xrange",
        name: title,
        data: seriesData,
        dataLabels: { enabled: true, format: "{point.name}" },
      },
    ],
    tooltip: {
      pointFormatter(this: any) {
        const fmt = (d: number) => Highcharts.dateFormat("%Y‑%m‑%d %H:%M", d);
        return `<b>${this.name}</b><br/>${fmt(this.x)} → ${fmt(this.x2)}`;
      },
    },
    navigator: { enabled: true },
    scrollbar: { enabled: true },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default GanttChart;
