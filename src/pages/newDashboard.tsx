// src/pages/newDashboard.tsx
import React, { useState, useEffect } from "react";
import { useTimeRange } from "../hooks/useTimeRange";
import * as dashboardService from "../features/services/dashboardService";
import { format, subDays } from "date-fns";

// Import all your components (WidgetCard, CalendarHeatmap, etc.)
// ...

const Dashboard: React.FC = () => {
  // Time range management
  const {
    preset,
    setPreset,
    customStart,
    customEnd,
    setCustomRange,
    start: startDate,
    end: endDate,
    interval: intervalType
  } = useTimeRange();

  // System state
  const [sysstats, setSysStats] = useState<SystemStats>({ /* ... */ });
  const [detectionStats, setDetectionStats] = useState<DetectionStatsResponse | null>(null);
  const [camTimeline, setCamTimeline] = useState<CameraTimelineResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Heatmap state
  const [heatmapOffset, setHeatmapOffset] = useState(0);
  const [heatmapData, setHeatmapData] = useState<Array<{ date: string; count: number }>>([]);

  // Date picker state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Fetch system stats on mount
  useEffect(() => {
    const loadSystemStats = async () => {
      try {
        const stats = await dashboardService.fetchSystemStats();
        setSysStats(stats);
      } catch (err) {
        setError('Failed to load system stats');
      }
    };
    loadSystemStats();
  }, []);

  // Fetch detection data when time range changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [stats, timeline] = await Promise.all([
          dashboardService.fetchDetectionStats(startDate, endDate, intervalType),
          dashboardService.fetchCameraTimeline(startDate, endDate)
        ]);
        
        setDetectionStats(stats);
        setCamTimeline(timeline);
      } catch (err) {
        setError('Failed to load detection data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [startDate, endDate, intervalType]);

  // Fetch heatmap data
  useEffect(() => {
    const now = new Date();
    const end = new Date(now.getTime() - heatmapOffset * 112 * 24 * 3600 * 1000);
    const start = new Date(end.getTime() - 111 * 24 * 3600 * 1000);
    
    const loadHeatmap = async () => {
      try {
        const data = await dashboardService.fetchHeatmapData(
          format(start, 'yyyy-MM-dd'),
          format(end, 'yyyy-MM-dd')
        );
        setHeatmapData(data);
      } catch (err) {
        console.error('Failed to load heatmap data', err);
      }
    };

    loadHeatmap();
  }, [heatmapOffset]);

  // Handle date picker apply
  const handleApplyCustomDate = (start: string, end: string) => {
    setCustomRange(start, end);
    setIsDatePickerOpen(false);
  };

  // Render loading/error states
  if (loading && !detectionStats) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-full p-6 flex flex-col">
      {/* Header with time selector */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        
        <div className="relative">
          {isDatePickerOpen && (
            <DateRangePicker 
              startDate={customStart}
              endDate={customEnd}
              onApply={handleApplyCustomDate}
              onCancel={() => setIsDatePickerOpen(false)}
            />
          )}

          <TimeRangeSelector
            preset={preset}
            onPresetChange={setPreset}
            onCustomClick={() => setIsDatePickerOpen(true)}
            customLabel={`${format(new Date(startDate), 'MMM d')} - ${format(new Date(endDate), 'MMM d')}`}
          />
        </div>
      </div>

      {/* Dashboard content */}
      <div className="flex flex-1">
        {/* Left column */}
        <div className="flex flex-1 flex-col">
          {/* Stats widgets */}
          <div className="flex flex-1 text-white">
            <WidgetCard 
              title="Active Cameras"
              value={`${sysstats.active_cameras}/${sysstats.total_cameras}`}
              onClick={() => navigate("/camera-manager")}
              isRedirectable
            />
            {/* Other widgets... */}
          </div>

          {/* Detection chart */}
          {detectionStats && (
            <DetectionChart 
              data={detectionStats.interval_stats}
              intervalType={intervalType}
            />
          )}

          {/* Subject activity */}
          {detectionStats && (
            <SubjectActivityChart 
              data={detectionStats.subject_stats}
            />
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-1 flex-col">
          {/* Heatmap */}
          <HeatmapSection 
            data={heatmapData}
            offset={heatmapOffset}
            onOffsetChange={setHeatmapOffset}
          />

          {/* Camera traffic */}
          {detectionStats && (
            <CameraTraffic 
              data={detectionStats.camera_stats}
            />
          )}
        </div>
      </div>

      {/* Timeline */}
      {camTimeline && (
        <CameraTimeline 
          data={camTimeline.camData}
          range={camTimeline.range}
        />
      )}

      {/* Subjects table */}
      <SubjectsTable subjects={sysstats.subjects} />
    </div>
  );
};

export default Dashboard;

1