// project/src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { BarChartBig, User, Camera, Cpu } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/UI/StatCard";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("VITE_API_URL is not defined");

interface SystemStats {
  model: string;
  total_subjects: number;
  active_cameras: number;
  total_detections: number;
  avg_response_time: number;
  subjects: Array<{ subject_id: string; subject_name: string; image_count: number; embedding_count: number }>;
}

const Dashboard: React.FC = () => {
  const [sysstats, setSysStats] = useState<SystemStats>({
    model: "",
    total_subjects: 0,
    active_cameras: 0,
    total_detections: 0,
    avg_response_time: 0,
    subjects: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/system_stats`)
      .then(r => r.json())
      .then((sys: SystemStats) => setSysStats(sys))
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
    // also load today's stats
    console.log("active cameras", sysstats.active_cameras)
  }, []);

  if (loading) return <div>Loading stats…</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex items-center gap-3">
            <Cpu className="text-primary" />
            <CardTitle>Model Used</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-foreground">
            {sysstats.model || "–"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-3">
            <Camera className="text-primary" />
            <CardTitle>Active Cameras</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-foreground">
            {sysstats.active_cameras}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-3">
            <BarChartBig className="text-primary" />
            <CardTitle>Total Detections</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-foreground">
            {sysstats.total_detections}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-3">
            <User className="text-primary" />
            <CardTitle>Total Subjects</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-foreground">
            {sysstats.subjects.length}
          </CardContent>
        </Card>
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
            {sysstats.subjects.map(s => (
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