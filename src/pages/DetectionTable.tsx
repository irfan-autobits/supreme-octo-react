// project/src/pages/DetectionTable.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Search } from 'lucide-react';
import Input from '../components/UI/Input';
import Table from '../components/UI/Table';
import { parseTimestamp, formatTimestamp, formatShort, localToUtcIso } from '../utils/time';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("VITE_API_URL is not defined");

interface Detection {
  id: string;
  subject: string;
  camera_name: string;
  camera_tag: string;
  det_score: number;
  distance: number;
  timestamp: string;
  image: string;
  det_face: string;
}

const DetectionTable: React.FC = () => {

    const [data, setData] = useState<Detection[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [sortField, setSortField] = useState('timestamp');
    const [sortOrder, setSortOrder] = useState<'asc'|'desc'>('desc');
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const ITEMS_PER_PAGE = 100;
    const limit = ITEMS_PER_PAGE;  // no need for useState

  
    const fetchData = async () => {
      setLoading(true);
      const qs = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        search,
        sort_field: sortField,
        sort_order: sortOrder
      });
      const res = await fetch(`${API_URL}/api/reco_table?${qs}`);
      const json = await res.json();
      setData(json.detections || []);
      setTotal(json.total || 0);
      setLoading(false);
    };
  
    // re-fetch on any dependency change
     useEffect(() => {
       setLoading(true);
       async function doFetch() {
         try {fetchData();
         } 
         finally {
           setLoading(false);
         }
       }
       doFetch();
     }, [page, search, sortField, sortOrder]);  // now the callback itself is sync
  
    const handleSort = (field: string) => {
      if (sortField === field) {
        setSortOrder(o => o === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortOrder("asc");
      }
      setPage(1);
    };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Detection Table</h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="max-w-md">
            <Input
              icon={<Search size={16} className="text-gray-400" />}
              placeholder="Search"
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Table headers={[
          'ID','Person Name','Camera Name','Camera Tag',
          'Detection Score','Distance From Know','Timestamp','Image'
        ]}>
          {data.map((d, i) => (
            <tr key={d.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {d.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {d.subject}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {d.camera_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {d.camera_tag}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {d.det_score.toFixed(1)}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {d.distance}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatTimestamp(parseTimestamp(d.timestamp))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <img
                  className="h-15 w-15 rounded-md object-cover"
                  src={d.det_face}
                  width={50}
                  height={50}
                  alt={`  ${d.subject}`}                   
                />
              </td>
            </tr>
          ))}
        </Table>

        <div className="pagination">
        <button onClick={()=>setPage(p=>Math.max(p-1,1))} disabled={page===1}>
          Prev
        </button>
        <span>
          Page {page} of {Math.ceil(total/limit)}
        </span>
        <button onClick={()=>setPage(p=>p+1)} disabled={page >= Math.ceil(total/limit)}>
          Next
        </button>
        </div>
      </div>
    </div>
  );
};

export default DetectionTable;