// project/src/pages/PersonTracker.tsx
import React, { useState, useEffect } from 'react';
import Select from '../components/UI/Select';
import DatePicker from '../components/UI/DatePicker';
import Button from '../components/UI/Button';
import ReactFlow, { Background, Controls } from 'reactflow';
import CustomNode from '../features/Persons/CustomNode';
import { parseTimestamp, formatTimestamp, localToUtcIso } from '../utils/time';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error('VITE_API_URL is not defined');

interface MovementEntry {
  camera_tag: string;
  entry_time: string;
  duration: number | string;
}

const PersonTracker: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<string | undefined>(undefined);
  const [people, setPeople] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [movementHistory, setMovementHistory] = useState<MovementEntry[]>([]);

  const fetchMovementHistory = async (personName: string | undefined) => {
    if (!personName) return;
    try {
      const qs = new URLSearchParams({
        start: localToUtcIso(fromDate),
        end: localToUtcIso(endDate),
      }).toString();
      const response = await fetch(
        `${API_URL}/api/movement/${encodeURIComponent(personName)}?${qs}`
      );
      const data: MovementEntry[] = await response.json();
      console.log(`fetched data for ${personName}: ${data}`)
      setMovementHistory(data);
    } catch {
      setMovementHistory([]);
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/api/subject_list`)
      .then((res) => res.json())
      .then((data) => setPeople(data.subjects.map((p: any) => p.subject_name)))
      .catch(() => setPeople([]));
  }, []);

  const personOptions = people.map((person) => ({ value: person, label: person }));

  const generateNodesAndEdges = () => {
    if (movementHistory.length === 0) return { nodes: [], edges: [] };
    const numPerRow = 5;
    const xSpacing = 300;
    const ySpacing = 150;
    let grouped: { [key: string]: MovementEntry[] } = {};

    for (const entry of movementHistory) {
      // Pick the correct timestamp field:
      const dateObj = new Date(entry.entry_time); // or entry.start_time_raw if preferred

      const key = dateObj.toISOString().slice(0, 10); // e.g., "2025-06-10"

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(entry);
    }

    const nodes = movementHistory.map((entry, idx) => {
      console.log(`movement data ${JSON.stringify(entry)}`)
      const row = Math.floor(idx / numPerRow);
      const col = idx % numPerRow;
      const x = row % 2 === 0 ? col * xSpacing : (numPerRow - 1 - col) * xSpacing;
      const y = row * ySpacing;
      const date = parseTimestamp(entry.entry_time);

      return {
        id: `node-${idx}`,
        type: 'custom',
        data: { label: `${entry.camera_tag}\n at: ${formatTimestamp(date)}\n Duration: ${entry.duration}` },
        position: { x, y },
      };
    });
    
    const edges = movementHistory.slice(1).map((_, idx) => ({
      id: `edge-${idx}`,
      source: `node-${idx}`,
      target: `node-${idx + 1}`,
      animated: true,
    }));
    return { nodes, edges };
  };

  const { nodes, edges } = generateNodesAndEdges();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Person Tracker</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <Select
            label="Person"
            options={personOptions}
            value={selectedPerson}
            onChange={setSelectedPerson}
          />
          <DatePicker
            label="From date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <DatePicker
            label="End date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button
            variant="primary"
            onClick={() => fetchMovementHistory(selectedPerson)}
            disabled={!selectedPerson || !fromDate || !endDate}
          >
            Show Journey
          </Button>
        </div>
      </div>
      {/* <div className="grid grid-cols-4 gap-4 mb-6"> */}
      {/* grid grid-cols-1 gap-4 */}
      <div className=''>
        {movementHistory.length > 0 ? (
          <div style={{ width: '100%', height: 700, border: '1px solid #ccc', marginTop: 20 }}>
            <ReactFlow nodes={nodes} edges={edges} nodeTypes={{ custom: CustomNode }}
              nodesDraggable={false} zoomOnScroll={false} zoomOnPinch={false}>
              <Background color="#aaa" gap={16} />
              <Controls showInteractive={false} />
            </ReactFlow>
          </div>
        ) : (
          <p>No journey data available.</p>
        )}
      </div>
    </div>
  );
};

export default PersonTracker;