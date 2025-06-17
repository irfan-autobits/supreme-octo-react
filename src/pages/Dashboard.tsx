// project/src/pages/Dashboard.tsx
import React, { useState, useEffect, useRef } from "react";
import { BarChartBig, User, Camera, Cpu } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/UI/StatCard";
import { RedirectLink } from "../assets/icons/svgs";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HeatMapModule from "highcharts/modules/heatmap";
import GanttHighcharts from 'highcharts/highcharts-gantt';


HeatMapModule(Highcharts);

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("VITE_API_URL is not defined");


const API_RESPONSE = [
  [0, 0, 10],
  [0, 1, 19],
  [0, 2, 8],
  [0, 3, 24],
  [0, 4, 67],
  [1, 0, 92],
  [1, 1, 58],
  [1, 2, 78],
  [1, 3, 117],
  [1, 4, 48],
  [2, 0, 35],
  [2, 1, 15],
  [2, 2, 123],
  [2, 3, 64],
  [2, 4, 52],
  [3, 0, 72],
  [3, 1, 132],
  [3, 2, 114],
  [3, 3, 19],
  [3, 4, 16],
  [4, 0, 38],
  [4, 1, 5],
  [4, 2, 8],
  [4, 3, 117],
  [4, 4, 115],
  [5, 0, 88],
  [5, 1, 32],
  [5, 2, 12],
  [5, 3, 6],
  [5, 4, 120],
  [6, 0, 13],
  [6, 1, 44],
  [6, 2, 88],
  [6, 3, 98],
  [6, 4, 96],
  [7, 0, 31],
  [7, 1, 1],
  [7, 2, 82],
  [7, 3, 32],
  [7, 4, 30],
  [8, 0, 85],
  [8, 1, 97],
  [8, 2, 123],
  [8, 3, 64],
  [8, 4, 84],
  [9, 0, 47],
  [9, 1, 114],
  [9, 2, 31],
  [9, 3, 48],
  [9, 4, 91],
  [10, 0, 47],
  [10, 1, 114],
  [10, 2, 31],
  [10, 3, 48],
  [10, 4, 91],
  [11, 0, 47],
  [11, 1, 114],
  [11, 2, 31],
  [11, 3, 48],
  [11, 4, 91],
  [12, 0, 47],
  [12, 1, 114],
  [12, 2, 31],
  [12, 3, 48],
  [12, 4, 91],
  [12, 0, 47],
  [12, 1, 114],
  [12, 2, 31],
  [12, 3, 48],
  [12, 4, 91],
  [13, 0, 47],
  [13, 1, 14],
  [13, 2, 31],
  [13, 3, 58],
  [13, 4, 91],
  [14, 0, 47],
  [14, 1, 14],
  [14, 2, 31],
  [14, 3, 48],
  [14, 4, 81],
  [15, 0, 47],
  [15, 1, 114],
  [15, 2, 21],
  [15, 3, 48],
  [15, 4, 11]
];

let chartOptions = {
    chart: {
      type: "heatmap",
      marginTop: 80,
      marginBottom: 70,
      plotBorderWidth: 0
    },

    plotOptions: {
      dataLabels: {
        enabled: true
      },
      heatmap: {
        allowPointSelect: true
      },
      series: {
        pointPadding: 8
      }
    },
    title: {
      text: "",
      style: {
        fontSize: "2px"
      }
    },

    xAxis: {
      labels: {
        rotation: 40,
        distance: 10,
        overflow: "justify",
        formatter: function () {
          return `<div class="grey-1">${this.value}</div>`;
        }
        // format: "<div style='color: red'><b>{text}</b><br></div>",
      },
      opposite: true,
      categories: [
        "Alexander",
        "Marie",
        "Maximilian",
        "Sophia",
        "Lukas",
        "Maria",
        "Leon",
        "Anna",
        "Tim",
        "Laura",
        "Christine",
        "John",
        "Katie",
        "Zach",
        "Chloe",
        "Parkar"
      ],
      tickInterval: 1
    },

    yAxis: {
      categories: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      title: null,
      reversed: true
    },

    accessibility: {
      point: {
        descriptionFormat:
          "{(add index 1)}. " +
          "{series.xAxis.categories.(x)} sales " +
          "{series.yAxis.categories.(y)}, {value}."
      }
    },

    colorAxis: {
      min: 0,
      minColor: "#E8F0FC",
      maxColor: "#2266E2"
    },

    legend: {
      align: "center",
      layout: "horizontal",
      verticalAlign: "bottom"
    },

    tooltip: {
      useHTML: true,
      // formatter: function () {
      //   console.log("this pointer category", this.point);
      // },
      format:
        " {series.xAxis}" +
        "<b>{series.xAxis.categories.(point.x)}</b> sold<br>" +
        "<b>{point.value}</b> items on <br>" +
        "<b>{series.yAxis.categories.(point.y)}</b>"
    },

    series: [
      {
        name: "",
        borderWidth: 0.5,
        data: API_RESPONSE,
        type: "heatmap",
        pointPadding: 8,
        dataLabels: {
          enabled: false,
          color: "#000000"
        }
      }
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            yAxis: {
              labels: {
                format: "{substr value 0 1}"
              }
            }
          }
        }
      ]
    },
    exporting: { enabled: false }
  };
interface SystemStats {
  model: string;
  total_subjects: number;
  active_cameras: number;
  total_cameras: number;
  total_detections: number;
  avg_response_time: number;
  subjects: Array<{
    subject_id: string;
    subject_name: string;
    image_count: number;
    embedding_count: number;
  }>;
}

const Dashboard: React.FC = () => {
  const ref = useRef();
  
  const [sysstats, setSysStats] = useState<SystemStats>({
    model: "",
    total_subjects: 0,
    active_cameras: 0,
    total_cameras: 0,
    total_detections: 0,
    avg_response_time: 0,
    subjects: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/system_stats`)
      .then((r) => r.json())
      .then((sys: SystemStats) => setSysStats(sys))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
    // also load today's stats
    console.log("active cameras", sysstats.active_cameras);
  }, []);

  // if (loading) return <div>Loading stats…</div>;
  // if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="h-full p-6 flex flex-col">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      <div className="flex flex-1">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 text-white">
            <WidgetCard
              title="Active Cameras"
              value={`${sysstats.active_cameras}/${sysstats.total_cameras}`}
              isRedirectable={true}
            />
            <WidgetCard
              title="Total Detections"
              value={sysstats.total_detections || "–"}
              isRedirectable={true}
            />
            <WidgetCard
              title="Total Subjects"
              value={sysstats.subjects.length}
              isRedirectable={true}
            />
            <WidgetCard
              title="Model Used"
              value={sysstats.model || "–"}
              isRedirectable={false}
            />
          </div>
          <div className="m-2 bg-white flex-1 p-6 rounded-lg shadow-sm gap-3 flex flex-col">
            <div className="flex gap-3">
              <div className="font-bold">Detection</div>
              <div className="text-zinc-400">Total Detection</div>
              <div className="text-zinc-400">Unique Detection</div>
              <div className="w-[1px] bg-zinc-400"></div>
              <div className="flex items-center mr-3">
                <span className="h-[10px] w-[10px] rounded-[20px] bg-zinc-900 block mr-[10px]"></span>
                Total
              </div>
              <div className="flex items-center mr-3">
                <span className="h-[10px] w-[10px] rounded-[20px] bg-[#85AF49] block mr-[10px]"></span>
                Unique
              </div>
            </div>
            <div className="highcharts-container">
              <HighchartsReact
                highcharts={Highcharts}
                options={
                  ChartOption({
                    type: "line",
                    ht: "280px",
                    lgd: false,
                    xCatg: null,
                    yCatg: null,
                    sers: [
                      {
                        name: "Total Detection",
                        data: [{y: 150}, {y: 250}],
                        color: "#000",
                      },
                      {
                        name: "Unique Detection",
                        data: [{y: 100}, {y: 50}],
                        color: "#85AF49",
                      },
                    ],
                    maxVal: null,
                    minValEn: false
                  })
                }
              />
            </div>
          </div>

          <div className="m-2 bg-white flex-1 p-6 rounded-lg shadow-sm gap-3 flex flex-col">
            <div className="flex gap-3">
              <div className="font-bold">Activity overview by person</div>
            </div>
            
            <div className="highcharts-container">
              <HighchartsReact
                highcharts={Highcharts}
                options={
                  ChartOption({
                    type: "column",
                    ht: "280px",
                    lgd: false,
                    xCatg: null,
                    yCatg: null,
                    sers: [
                      {
                        name: "Unique Detection",
                        data: [{y: 100}, {y: 50}],
                        color: "#85AF49",
                      },
                    ],
                    maxVal: null,
                    minValEn: false
                  })
                }
              />
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="m-2 bg-white p-6 rounded-lg shadow-sm gap-3 flex flex-col">
            <div className="flex gap-3">
              <div className="font-bold">Heat-map all camera</div>
            </div>
            <div className="highcharts-container">
              <HighchartsReact
                highcharts={Highcharts}
                options={
                  ChartOption({
                    type: "heatmap",
                    ht: "280px",
                    lgd: false,
                    yCatg: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    xCatg: [
                      "Alexander",
                      "Marie",
                      "Maximilian",
                      "Sophia",
                      "Lukas",
                      "Maria",
                      "Leon",
                      "Anna",
                      "Tim",
                      "Laura",
                      "Christine",
                      "John",
                      "Katie",
                      "Zach",
                      "Chloe",
                      "Parkar"
                    ],
                    sers: [
                      {
                        name: "",
                        borderWidth: 0.5,
                        data: API_RESPONSE,
                        type: "heatmap",
                        pointPadding: 4,
                        dataLabels: {
                          enabled: false,
                          color: "#000000"
                        }
                      }
                    ],
                    maxVal: null,
                    minValEn: false
                  })
                }
                // options={chartOptions}
                constructorType="chart"
                ref={ref}
              />
            </div>
          </div>

          <div className="m-2 bg-white p-6 rounded-lg shadow-sm gap-3 flex flex-col">
            <div className="flex gap-3">
              <div className="font-bold">Traffic by Camera</div>
            </div>
            <div className="p-6 border">
            </div>
          </div>
        </div>
      </div>
      <div className="m-2 bg-white p-6 rounded-lg shadow-sm gap-3 flex flex-col hidden">
        <div className="flex gap-3">
          <div className="font-bold">Traffic by Camera</div>
        </div>
        <div className="highcharts-container">
          <HighchartsReact 
            highcharts={GanttHighcharts} 
            constructorType="ganttChart" 
            options={
              ChartOption({
                type: null,
                ht: "280px",
                lgd: false,
                xCatg: null,
                yCatg: null,
                sers: [
                  {
                    name: 'Project 1',
                    data: [
                      {
                        name: 'Planning',
                        start: Date.UTC(2024, 5, 1),
                        end: Date.UTC(2024, 5, 5),
                      },
                      {
                        name: 'Development',
                        start: Date.UTC(2024, 5, 6),
                        end: Date.UTC(2024, 5, 15),
                      },
                      {
                        name: 'Testing',
                        start: Date.UTC(2024, 5, 16),
                        end: Date.UTC(2024, 5, 25),
                      },
                    ],
                  },
                ],
                maxVal: null,
                minValEn: false
              })
              
            } />
        </div>
      </div>

      {sysstats.subjects.length > 0 && (
        <table className="mt-6 w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Images</th>
              <th className="p-2">Embeddings</th>
            </tr>
          </thead>
          <tbody>
            {sysstats.subjects.map((s) => (
              <tr key={s.subject_id}>
                <td className="p-2 text-center">{s.subject_name}</td>
                <td className="p-2 text-center">{s.image_count}</td>
                <td className="p-2 text-center">{s.embedding_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;

interface WidgetCardProps {
  value: string | number;
  title: string | number;
  isRedirectable: boolean;
}

const WidgetCard = ({ value, title, isRedirectable }: WidgetCardProps) => {
  return (
    <div
      className={`m-2 bg-[#85AF49] ${
        isRedirectable === true && " hover:shadow-xl"
      } flex-1 p-3 rounded-lg shadow-sm flex flex-col`}
    >
      <div className="flex justify-between items-center">
        <div className="">{title}</div>
        {isRedirectable === true && (
          <div className="rounded-[30px] p-1 bg-[#ffffff4f] ml-3">
            <RedirectLink height="20px" fill="#fff" />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold mt-3">{value}</div>
    </div>
  );
};

interface ChartOptionProps {
  type: null | string;
  ht: null | string;
  lgd: null | boolean;
  yCatg: null | string[];
  xCatg: null | string[];
  sers: null | any[];
  maxVal: null | number;
  minValEn: null | boolean;
  dateEn?: null | boolean;
}

const ChartOption = ({type, ht, lgd, xCatg, yCatg, sers, maxVal, minValEn, dateEn} : ChartOptionProps) => {
  let minVal = Math.max(
    sers[0].data.reduce((acc, val) => Math.min(acc, val.y), 9999999999) - 20,
    0
  );
  let opt = {
    chart: {
      height: ht ? ht : "70%",
      backgroundColor: "none",
    },
    title: {
      text: "",
    },
    xAxis: {
      lineWidth: 0,
      categories: xCatg,
      labels: {
        enabled: true,
        format: dateEn === true ? "{value:%I:%M %p}" : null,
        style: {
          fontSize: "12px",
          color: "#000",
        },
      },
    },
    yAxis: {
      categories: yCatg,
      gridLineWidth: 0,
      min: minValEn ? minVal : null,
      max: maxVal,
      title: {
        text: "",
      },
      labels: {
        style: {
          color: "#000",
        },
      },
    },
    legend: {
      enabled: lgd,
    },
    plotOptions: {
      series: {
        animation: false,
      },
      heatmap: {
        allowPointSelect: true
      },
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },

    tooltip: {
      positioner: function () {
        return {
          // right aligned
          x: this.chart.chartWidth - this.label.width,
          y: 0, // align to title
        };
      },
      borderWidth: 0,
      backgroundColor: "none",
      pointFormat: "{point.y}",
      headerFormat: "",
      shadow: false,
      style: {
        fontSize: "16px",
        color: "#000",
      },
      format:
        '<span style="color:{color}">\u25CF</span> ' +
        "{name}: <b>{y}</b><br/>",
      xDateFormat: dateEn === true ? "%A, %e %b %Y %I:%M %p" : null,
    },
    series: sers,
  };


  if(type) opt.type = type;
  if(dateEn === true) opt.xAxis.type = "datetime";
  if(type === "heatmap"){
    opt.colorAxis = {
      minColor: "#C5ECB2",
      maxColor: "#11865B",
    }
  } 

  return opt
};
