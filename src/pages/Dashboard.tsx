// project/src/pages/Dashboard.tsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { RedirectLink } from "../assets/icons/svgs";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HeatMapModule from "highcharts/modules/heatmap";
import GanttChart from "../components/UI/GanttChart";
import { format, parseISO, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { DateRangeCalendarPicker } from "react-datetime-range-super-picker";
// import CalendarHeatmap from "../features/Dashboard/HeatmapCalendar.tsx";
import CalendarHeatmap from "../features/Dashboard/HeatmapCalendar_backup.tsx";

// utility functions
import { toUTCStart, toUTCEnd, isSameDay } from "../utils/time";

HeatMapModule(Highcharts);

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("VITE_API_URL is not defined");

interface DateTimePickerOutput {
  date: string | Date;
}

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

export interface GanttTask {
  camera: string;
  name: string;
  start: string;
  end: string;
  type: "camera" | "feed";
}

interface DetectionStatsResponse {
  interval_stats: Array<{ interval: string; count: number }>;
  camera_stats: Array<{ camera: string; count: number }>;
  subject_stats: Array<{ subject: string; count: number }>;
}

interface CameraTimelineResponse {
  camData: Array<{
    camera: string;
    activePeriods: Array<{ start: string; end: string }>;
    feeds: Array<{ start: string; end: string }>;
  }>;
  range: { min: string; max: string };
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [sysstats, setSysStats] = useState<SystemStats>({
    model: "",
    total_subjects: 0,
    active_cameras: 0,
    total_cameras: 0,
    total_detections: 0,
    avg_response_time: 0,
    subjects: [],
  });
  const [dayData, setDayData] = useState<
    DetectionStatsResponse["interval_stats"]
  >([]);
  const [camData, setCamData] = useState<
    DetectionStatsResponse["camera_stats"]
  >([]);
  const [subData, setSubData] = useState<
    DetectionStatsResponse["subject_stats"]
  >([]);
  const [camTmln, setCamTmln] = useState<CameraTimelineResponse["camData"]>([]);
  const [camRange, setCamRange] = useState<CameraTimelineResponse["range"]>({
    min: "",
    max: "",
  });

  const [selectedTime, setSelectedTime] = useState("today");
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [intervalType, setIntervalType] = useState<string>("hourly");
  const [heatmapStart, setHeatmapStart] = useState<string>("");
  const [heatmapData, setHeatmapData] = useState<
    Array<{ date: string; count: number }>
  >([]);

  const timeOptions = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "custom", label: "Custom Date" },
  ];

  // fetch system stats

  const [isOpenDatepicker, setIsOpenDatepicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [heatmapOffset, setHeatmapOffset] = useState(0); // 0 = ending today, 1 = older by 112, 2 = even older

  const parsedStart = heatmapStart ? new Date(heatmapStart) : null;
  const endDateStr = parsedStart
    ? format(subDays(parsedStart, -111), "yyyy-MM-dd")
    : "";
  useEffect(() => {
    setLoading(true);

    axios
      .get(`${API_URL}/api/system_stats`)
      .then((res) => setSysStats(res.data as SystemStats))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  // heatmap data
  useEffect(() => {
    const now = new Date();
    const end = new Date(
      now.getTime() - heatmapOffset * 112 * 24 * 3600 * 1000
    );
    const start = new Date(end.getTime() - 111 * 24 * 3600 * 1000);
    const startStr = start.toISOString().slice(0, 10);
    const endStr = end.toISOString().slice(0, 10);
    setHeatmapStart(startStr);
    axios
      .get(`${API_URL}/api/detection_heatmap_range`, {
        params: { start: startStr, end: endStr },
      })
      .then((res) => setHeatmapData(res.data.data))
      .catch(console.error);
  }, [heatmapOffset]);

  // handle quick selectors
  useEffect(() => {
    let start: string, end: string;

    if (selectedTime === "today") {
      const today = new Date();
      start = toUTCStart(today.toISOString().slice(0, 10));
      end = toUTCEnd(today.toISOString().slice(0, 10));
      setIntervalType("hourly");
    } else if (selectedTime === "yesterday") {
      const y = new Date(Date.now() - 86400000);
      start = toUTCStart(y.toISOString().slice(0, 10));
      end = toUTCEnd(y.toISOString().slice(0, 10));
      setIntervalType("hourly");
    } else return;

    setStartDate(start);
    setEndDate(end);
    fetchDateStats(start, end);
  }, [selectedTime]);

  
  // apply custom
  const applyCustom = () => {
    const startUTC = toUTCStart(startDate);
    const endUTC = toUTCEnd(endDate);
    const same = isSameDay(new Date(startDate), new Date(endDate));
    setIntervalType(same ? "hourly" : "daily");
    fetchDateStats(startUTC, endUTC);
    setIsOpenDatepicker(false);
  };

  // fetch stats
  const fetchDateStats = (start: string, end?: string) => {
    setLoading(true);

    const hasEnd = !!end;
    const startDate = new Date(start);
    const endDate = hasEnd ? new Date(end) : startDate;
    const diffInDays = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
    );

    const interval = diffInDays === 0 ? "hourly" : "daily";
    setIntervalType(interval);

    axios
      .get(`${API_URL}/api/detections_stats`, {
        params: { start, ...(hasEnd ? { end } : {}), interval: intervalType },
      })
      .then((res) => {
        const det = res.data;
        setDayData(det.interval_stats || det.day_stats);
        setCamData(
          det.camera_stats.map((c: any) => ({
            ...c,
            target:
              Math.ceil(
                Math.max(...det.camera_stats.map((e: any) => e.count)) / 100
              ) * 100,
          }))
        );
        setSubData(det.subject_stats);
      })
      .catch(console.error);
    axios
      .get(`${API_URL}/api/camera_timeline`, {
        params: { start, end },
      })
      .then((res) => {
        setCamTmln(res.data.camData);
        setCamRange(res.data.range);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  };

  // datepicker handlers
  const ganttTasks: GanttTask[] = camTmln.flatMap((cam) => [
    ...cam.activePeriods.map((p) => ({
      camera: cam.camera,
      name: "Camera On",
      start: p.start,
      end: p.end,
      type: "camera" as const,
    })),
    ...cam.feeds.map((f) => ({
      camera: cam.camera,
      name: "Feed",
      start: f.start,
      end: f.end,
      type: "feed" as const,
    })),
  ]);

  // DatePicker
  let nowtime = new Date();
  const [from_date, setFromDate] = useState<Date | DateObject | string>({
    day: nowtime.getDate(),
    month: nowtime.getMonth(),
    year: nowtime.getFullYear(),
    hour: 12,
    minute: 0,
    meridiem: "AM",
    hour24: 0,
  });
  const [to_date, setToDate] = useState<Date | DateObject | string>({
    day: nowtime.getDate(),
    month: nowtime.getMonth(),
    year: nowtime.getFullYear(),
    hour: 11,
    minute: 59,
    meridiem: "PM",
    hour24: 0,
  });
  const handleFromDateUpdate = (arg: DateTimePickerOutput) => {
    console.log("FromDate raw arg:", arg);
    if (!arg || !arg.date) {
      console.error("Invalid arg or arg.date", arg);
      return;
    }
    const d = new Date(arg.date);
    if (isNaN(d.getTime())) {
      console.error("Invalid date format:", arg.date);
      return;
    }
    setFromDate(arg.date);
    // setStartDate(format(d, dateFormateStr));
    setStartDate(new Date(arg.date).toISOString().slice(0, 10));
  };

  const handleToDateUpdate = (arg: DateTimePickerOutput) => {
    console.log("To date update:", arg);

    if (!arg || !arg.date || isNaN(new Date(arg.date).getTime())) {
      console.error("Invalid date passed:", arg?.date);
      return;
    }

    const parsed = new Date(arg.date);
    setToDate(arg.date);
    // setEndDate(format(parsed, dateFormateStr));
    setEndDate(new Date(arg.date).toISOString().slice(0, 10));
    console.log("setEndDate", endDate);
  };
  return (
    <div className="h-full p-6 flex flex-col">
      {/* Header with selector */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <div className="relative">
          {/* <select className="px-3 py-2" value={selectedTime} onChange={e=>setSelectedTime(e.target.value)}>
            {timeOptions.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
          </select> */}
          {isOpenDatepicker === true && (
            // {selectedTime==="custom" && (
            // <div className="absolute top-full bg-white p-4 shadow">
            <div className="datepicker-wrapper shadow-2xl top-0 right-0">
              <DateRangeCalendarPicker
                from_date={from_date}
                to_date={to_date}
                onFromDateUpdate={handleFromDateUpdate}
                onToDateUpdate={handleToDateUpdate}
                format="yyyy-MM-dd"
                closeButtonText="Close"
              />
              <button onClick={applyCustom}>Apply</button>
            </div>
          )}

          {selectedTime === "custom" && (
            <ValueShow
              clickHandler={() => setIsOpenDatepicker(true)}
              value={`${startDate} To ${endDate}`}
              label="Date"
            />
          )}

          <Select
            label="Person"
            options={timeOptions}
            value={selectedTime}
            onChange={setSelectedTime}
          />
        </div>
      </div>
      <div className="flex flex-1">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 text-white">
            <WidgetCard
              title="Active Cameras"
              value={`${sysstats.active_cameras}/${sysstats.total_cameras}`}
              onClickHandler={() => navigate("/camera-manager")}
              isRedirectable={true}
            />
            <WidgetCard
              title="Total Detections"
              value={sysstats.total_detections || "–"}
              onClickHandler={() => navigate("/detection-tab")}
              isRedirectable={true}
            />
            <WidgetCard
              title="Total Subjects"
              value={sysstats.subjects.length}
              onClickHandler={() => navigate("/subject-manager")}
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
              <div className="text-zinc-400 hidden">Total Detection</div>
              <div className="text-zinc-400 hidden">Unique Detection</div>
              <div className="w-[1px] bg-zinc-400 hidden"></div>
              <div className="flex items-center mr-3 hidden">
                <span className="h-[10px] w-[10px] rounded-[20px] bg-zinc-900 block mr-[10px]"></span>
                Total
              </div>
              <div className="flex items-center mr-3 hidden">
                <span className="h-[10px] w-[10px] rounded-[20px] bg-[#85AF49] block mr-[10px]"></span>
                Unique
              </div>
            </div>
            <div className="highcharts-container">
              <HighchartsReact
                highcharts={Highcharts}
                options={ChartOption({
                  type: "line",
                  ht: "280px",
                  lgd: false,
                  xCatg: dayData.map((e) => {
                    const dt = new Date(e.interval); // JS Date parses it in local time
                    return intervalType === "hourly"
                      ? format(dt, "hh:mm a")
                      : format(dt, "MMM dd");
                  }),

                  //[{y: 150}, {y: 250}],
                  yCatg: null,
                  sers: [
                    {
                      name: "Total Detection",
                      data: dayData.map((e) => {
                        return { y: e.count };
                      }), //[{y: 150}, {y: 250}],
                      color: "#000",
                    },
                    // {
                    //   name: "Unique Detection",
                    //   data: [{y: 100}, {y: 50}],
                    //   color: "#85AF49",
                    // },
                  ],
                  maxVal: null,
                  minValEn: false,
                })}
              />
            </div>
          </div>

          {/* Widgets & charts omitted for brevity... */}
          {/* Insert all existing working code unchanged here */}
          <div className="m-2 bg-white flex-1 p-6 rounded-lg shadow-sm gap-3 flex flex-col">
            <div className="flex gap-3">
              <div className="font-bold">Activity overview by person</div>
            </div>

            <div className="highcharts-container">
              <HighchartsReact
                highcharts={Highcharts}
                options={ChartOption({
                  type: "column",
                  ht: "280px",
                  lgd: false,
                  xCatg: subData.map((e) => e.subject), //[{y: 150}, {y: 250}],
                  yCatg: null,
                  sers: [
                    {
                      name: "Subject",
                      data: subData.map((e) => {
                        return { y: e.count };
                      }), //[{y: 150}, {y: 250}],
                      color: "#85AF49",
                    },
                  ],
                  maxVal: null,
                  minValEn: false,
                })}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="m-2 bg-white p-6 rounded-lg shadow-sm gap-3 flex flex-col">
            <div className="flex justify-between mb-2">
              <button
                onClick={() => setHeatmapOffset((o) => o + 1)}
                className="btn"
              >
                ← Older
              </button>

              <span className="font-bold">
                {heatmapStart && endDateStr
                  ? `${heatmapStart} → ${endDateStr}`
                  : "Loading..."}
              </span>

              <button
                onClick={() => setHeatmapOffset((o) => Math.max(0, o - 1))}
                className="btn"
                disabled={heatmapOffset === 0}
              >
                Newer →
              </button>
            </div>

            <div className="highcharts-container">
              <CalendarHeatmap
                data={heatmapData}
                startDate={heatmapStart}
                // isCurrentChunk={heatmapOffset === 0}
              />
            </div>
          </div>

          <div className="m-2 bg-white p-6 rounded-lg shadow-sm gap-3 flex flex-col">
            <div className="flex gap-3">
              <div className="font-bold">Traffic by Camera</div>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(100px,_1fr))] gap-4">
              {camData.map((e) => (
                <div className="flex flex-1 items-center">
                  <div className="flex-1 text-sm font-bold mr-2">
                    {e.camera}
                  </div>
                  <div className="rounded-3xl h-[2px] flex-1 bg-zinc-300">
                    <div
                      className={`rounded-3xl h-full bg-zinc-900`}
                      style={{ width: `${(e.count / e.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="m-2 bg-white p-6 rounded-lg shadow-sm gap-3 flex flex-col">
        <div className="highcharts-container">
          <GanttChart
            title="Camera / Feed Timeline"
            categories={camTmln.map((c) => c.camera)}
            tasks={ganttTasks}
            range={camRange}
          />
        </div>
      </div>
      <div className="reacttable-table">
        <table>
          <thead>
            <tr className="tr">
              <th className="th">Name</th>
              <th className="th">Images</th>
              <th className="th">Embeddings</th>
            </tr>
          </thead>
          <tbody>
            {sysstats.subjects.map((s) => (
              <tr className="tr" key={s.subject_id}>
                <td className="td">{s.subject_name}</td>
                <td className="td">{s.image_count}</td>
                <td className="td">{s.embedding_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

interface WidgetCardProps {
  value: string | number;
  title: string | number;
  isRedirectable: boolean;
  onClickHandler?: () => void;
}

const WidgetCard = ({
  value,
  title,
  isRedirectable,
  onClickHandler,
}: WidgetCardProps) => {
  return (
    <div
      className={`m-2 bg-[#85AF49] ${
        isRedirectable === true && " hover:shadow-xl"
      } flex-1 p-3 rounded-lg shadow-sm flex flex-col`}
    >
      <div className="flex justify-between items-center">
        <div className="">{title}</div>
        {isRedirectable === true && (
          <div
            className="rounded-[30px] p-1 bg-[#ffffff4f] ml-3 cursor-pointer"
            onClick={onClickHandler}
          >
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
  yCatg: null | any[];
  xCatg: null | any[];
  sers: null | any[];
  maxVal: null | number;
  minValEn: null | boolean;
  dateEn?: null | boolean;
}

const ChartOption = ({
  type,
  ht,
  lgd,
  xCatg,
  yCatg,
  sers,
  maxVal,
  minValEn,
  dateEn,
}: ChartOptionProps) => {
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
        allowPointSelect: true,
      },
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },

    tooltip: {
      // positioner: function () {
      //   return {
      //     // right aligned
      //     x: this.chart.chartWidth - this.label.width,
      //     y: 0, // align to title
      //   };
      // },
      // borderWidth: 0,
      // backgroundColor: "none",
      pointFormat: "{point.y}",
      // headerFormat: "",
      // shadow: false,
      // style: {
      //   fontSize: "16px",
      //   color: "#000",
      // },
      format:
        '<span style="color:{color}">\u25CF</span> ' +
        "{name}: <b>{y}</b><br/>",
      xDateFormat: dateEn === true ? "%A, %e %b %Y %I:%M %p" : null,
    },
    series: sers,
  };

  if (type) opt.chart.type = type;
  if (dateEn === true) opt.xAxis.type = "datetime";
  if (type === "heatmap") {
    opt.colorAxis = {
      minColor: "#C5ECB2",
      maxColor: "#11865B",
    };
  }

  return opt;
};

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  options: { value: string; label: string }[];
  label?: string;
  onChange?: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
  options,
  label,
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="dateshow px-3 py-2 sm:text-sm relative">
      <select
        className="w-full bg-transparent font-bold px-3 py-2 pr-10 focus:outline-none appearance-none sm:text-sm"
        onChange={handleChange}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <ChevronDown size={16} className="text-gray-400" />
      </div>
    </div>
  );
};

interface ValueShowProps {
  value: string;
  label: string;
  clickHandler: () => void;
}

function ValueShow({ value, label, clickHandler }: ValueShowProps) {
  return (
    <div
      className="flex w-full flex-col gap-1 dateshow relative rounded-md shadow-sm border px-3 py-2 sm:text-sm border-[#F5F5F6] "
      onClick={clickHandler}
    >
      <div className="text-zinc-500">{label}</div>
      <div className="px-2 py-1">{value}</div>
    </div>
  );
}
