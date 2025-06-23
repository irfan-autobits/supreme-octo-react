// src/features/services/dashboardService.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchSystemStats = async () => {
  const response = await axios.get(`${API_URL}/api/system_stats`);
  return response.data;
};

export const fetchDetectionStats = async (start: string, end: string, interval: 'hourly' | 'daily') => {
  const params = { start, interval };
  if (end) params.end = end;
  
  const response = await axios.get(`${API_URL}/api/detections_stats`, { params });
  return response.data;
};

export const fetchCameraTimeline = async (start: string, end: string) => {
  const response = await axios.get(`${API_URL}/api/camera_timeline`, { params: { start, end } });
  return response.data;
};

export const fetchHeatmapData = async (start: string, end: string) => {
  const response = await axios.get(`${API_URL}/api/detection_heatmap_range`, { params: { start, end } });
  return response.data.data;
};

1