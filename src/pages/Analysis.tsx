// project/src/pages/Analysis.tsx
import React, { useState, useEffect, ChangeEvent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer, } from "recharts";
import { formatTimestamp } from '../utils/time';
import GanttChart, { GanttTask } from "../components/UI/GanttChart";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("VITE_API_URL is not defined");

interface DetectionStatsResponse {
  day_stats: Array<{ date: string; count: number }>;
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

const Analysis: React.FC = () => {
  const [dayData, setDayData] = useState<DetectionStatsResponse["day_stats"]>([]);
  const [camData, setCamData] = useState<DetectionStatsResponse["camera_stats"]>([]);
  const [subData, setSubData] = useState<DetectionStatsResponse["subject_stats"]>([]);
  const [camTmln, setCamTmln] = useState<CameraTimelineResponse["camData"]>([]);
  const [camRange, setCamRange] = useState<CameraTimelineResponse["range"]>({ min: "", max: "" });
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(today);
  const [dateLoading, setDateLoading] = useState<boolean>(false);

  // fetch system stats once
  useEffect(() => {
    fetchDateStats();
  }, []);

  const fetchDateStats = () => {
    setDateLoading(true);
    Promise.all([
      fetch(`${API_URL}/api/detections_stats?start=${startDate}&end=${endDate}`).then(r => r.json()),
      fetch(`${API_URL}/api/camera_timeline?start=${startDate}&end=${endDate}`).then(r => r.json()),
    ])
      .then(([det, camtl]: [DetectionStatsResponse, CameraTimelineResponse]) => {
        setDayData(det.day_stats);
        setCamData(det.camera_stats);
        setSubData(det.subject_stats);
        setCamTmln(camtl.camData);
        setCamRange(camtl.range);
      })
      .catch(e => setError(String(e)))
      .finally(() => setDateLoading(false));
  };

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

  if (dateLoading) return <div>Loading stats…</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="font-medium text-lg mb-4">Detection Analytics</h2>
        <div className="date-picker-row mb-4">
          <label>
            Start:&nbsp;
            <input type="date" value={startDate} max={endDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)} />
          </label>
          <label className="ml-4">
            End:&nbsp;
            <input type="date" value={endDate} min={startDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)} />
          </label>
          <button className="ml-4 px-4 py-1 bg-primary text-white rounded"
            onClick={fetchDateStats} disabled={dateLoading}>
            {dateLoading ? "Loading…" : "Show"}
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-2">Day‑wise Detections</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={ts => formatTimestamp(new Date(ts))} />
            <YAxis />
            <Tooltip labelFormatter={ts => formatTimestamp(new Date(ts))} />
            <Line type="monotone" dataKey="count" />
          </LineChart>
        </ResponsiveContainer>

        <h3 className="text-xl font-semibold my-2">Camera‑wise Detections</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={camData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="camera" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>

        <h3 className="text-xl font-semibold my-2">Subject‑wise Detections</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    <GanttChart
      title="Camera / Feed Timeline"
      categories={camTmln.map((c) => c.camera)}
      tasks={ganttTasks}
      range={camRange}
    />
    </div>
  );
};

export default Analysis;