// src/components/ui/GanttChart.tsx
import React, { useEffect } from 'react';
import Highcharts from 'highcharts/highcharts-gantt';
import HighchartsReact from 'highcharts-react-official';

export interface GanttTask {
  camera: string;
  name: string;
  start: string | Date;
  end: string | Date;
  type: 'camera' | 'feed';
}

interface GanttProps {
  title: string;
  categories: string[];
  tasks: GanttTask[];
  range: { min: string | Date; max: string | Date };
}

const GanttChart: React.FC<GanttProps> = ({ title, categories, tasks, range }) => {
  useEffect(() => {
    Highcharts.setOptions({
      time: { useUTC: false }  // Use client's local timezone
    });
  }, []);

  // Convert all dates to timestamps
  const seriesData = tasks.map(t => {
    const startMs = t.start instanceof Date ? t.start.getTime() : Date.parse(t.start);
    const endMs = t.end instanceof Date ? t.end.getTime() : Date.parse(t.end);
    
    return {
      name: t.name,
      start: startMs,
      end: endMs,
      y: categories.indexOf(t.camera),
      color: t.type === 'feed' ? '#008000' : '#cdcd00' // Green for feed, blue for camera
    };
  });

  const minDate = range.min instanceof Date ? range.min.getTime() : Date.parse(range.min);
  const maxDate = range.max instanceof Date ? range.max.getTime() : Date.parse(range.max);

  const options: Highcharts.Options = {
    chart: {
      type: 'gantt',
      height: categories.length * 65 + 100
    },
    title: { text: title, align: 'left' },
    xAxis: {
      type: 'datetime',
      min: minDate,
      max: maxDate,
    },
    yAxis: {
      categories,
      reversed: true,
      title: { text: null }
    },
    series: [{
      type: 'gantt',
      name: title,
      data: seriesData,
      dataLabels: { 
        enabled: true, 
        format: '{point.name}',
        style: { color: 'white', fontWeight: 'bold' }
      },
      pointWidth: 20,  // Make bars thicker
    } as Highcharts.SeriesGanttOptions],
    tooltip: {
      pointFormatter(this: any) {
        const fmt = (d: number) => Highcharts.dateFormat('%Y-%m-%d %H:%M', d);
        return `<b>${this.name}</b><br/>${fmt(this.start)} → ${fmt(this.end)}`;
      }
    },
    navigator: {
      enabled: true,
      series: {
        type: 'gantt',
        data: seriesData,
        colorKey: 'color',
        pointWidth: 10,
        dataLabels: { enabled: false }
      } as any,
      height: 50
    },
    scrollbar: { enabled: true }
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType="ganttChart"
      options={options}
    />
  );
};

export default GanttChart;

// ___old_colored________
// // project/src/components/UI/GanttChart.tsx
// import React, { useEffect } from "react";
// // import Highcharts from "highcharts";
// import GanttModule from "highcharts/modules/gantt";
// // import HighchartsReact from "highcharts-react-official";
// import Highcharts from "highcharts/highcharts-gantt";
// import HighchartsReact from "highcharts-react-official";
// export interface GanttTask {
//   camera: string;
//   name: string;
//   start: string;
//   end: string;
//   type: "camera" | "feed";
// }
// interface GanttProps {
//   title: string;
//   categories: string[];
//   tasks: GanttTask[];
//   range: { min: string; max: string };
// }

// const GanttChart: React.FC<GanttProps> = ({ title, categories, tasks, range }) => {
//   useEffect(() => {
//     Highcharts.setOptions({ time: { useUTC: true } as any });
//   }, []);

//   // map your tasks into Highcharts X-range points
//   const seriesData = tasks.map((t) => ({
//     x: Date.parse(t.start),
//     x2: Date.parse(t.end),
//     y: categories.indexOf(t.camera),
//     name: t.name,
//     // you can switch on t.type here if you want
//   }));

//   const options: Highcharts.Options = {
//     chart: { type: "xrange", height: categories.length * 70 + 50 },
//     title: { text: title, align: "left" },
//     xAxis: {
//       type: "datetime",
//       min: Date.parse(range.min),
//       max: Date.parse(range.max),
//     },
//     yAxis: {
//       categories,
//       reversed: true,
//       title: { text: "" },
//     },
//     series: [
//       {
//         type: "xrange",
//         name: title,
//         data: seriesData,
//         dataLabels: { enabled: true, format: "{point.name}" },
//       },
//     ],
//     tooltip: {
//       pointFormatter(this: any) {
//         const fmt = (d: number) => Highcharts.dateFormat("%Y‑%m‑%d %H:%M", d);
//         return `<b>${this.name}</b><br/>${fmt(this.x)} → ${fmt(this.x2)}`;
//       },
//     },
//     navigator: { enabled: true },
//     scrollbar: { enabled: true },
//   };

//   return <HighchartsReact highcharts={Highcharts} options={options} />;
// };

// export default GanttChart;
