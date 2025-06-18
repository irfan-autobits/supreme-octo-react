// project/src/features/DetectionTab/DetTab.tsx
import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { Search } from "lucide-react";
import Input from "../../components/UI/Input";
import Table from "../../components/UI/Table";
import {
  parseTimestamp,
  formatTimestamp,
  formatShort,
  localToUtcIso,
} from "../../utils/time";
import { ReactTable } from "../../components/UI/ReactTable";
import {
  format,
  parse,
  parseISO,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
} from "date-fns";
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

const DetectionTable: React.FC<{
  activeCameraName: string;
  isDetecting: boolean;
}> = ({ activeCameraName, isDetecting }) => {
  let dateFormateStr = "dd-MM-yy hh:mm a";
  const [columnDef, setColumnDef] = useState<
    { accessorKey: string; header: string; cell?: any }[]
  >([
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "subject",
      header: "Person Name",
      cell: ({ row }: any) => (
        <PersonNameAndPhoto value={row.original.subject} />
      ),
    },
    {
      accessorKey: "camera_name",
      header: "Camera Name",
    },
    {
      accessorKey: "camera_tag",
      header: "Camera Tag",
    },
    {
      accessorKey: "det_score",
      header: "Detection Score",
    },
    {
      accessorKey: "distance",
      header: "Distance From Known",
    },
    {
      accessorKey: "timestamp",
      header: "Datetime",
    },
  ]);
  // const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPageCount, setTotalPageCount] = useState<number>(0);

  const [data, setData] = useState<Detection[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const ITEMS_PER_PAGE = 10;
  const limit = ITEMS_PER_PAGE; // no need for useState
  const isDetectingRef = useRef(isDetecting);
  const pageIndexRef = useRef(0);

  useEffect(() => {
    isDetectingRef.current = isDetecting;
  }, [isDetecting]);

  // useEffect(() => {
  //   console.log("pageIndex eff: ", pageIndex);
  // }, [pageIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Fetching data for", activeCameraName);
      if(activeCameraName) {
        fetchData();
      }
    }, 1000);
    return () => {
      console.log("Clearing interval for", activeCameraName);
      clearInterval(interval);
    };
  }, [activeCameraName, search]);

  const post = (path: string, body: any) =>
    fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  const fetchData = async () => {

    setLoading(true);

    const startDate = format(
      setMilliseconds(
        setSeconds(
          setMinutes(
            setHours(new Date(), 0), // subtract 1 day, set hour to 23
            0
          ),
          0
        ),
        0
      ),
      dateFormateStr
    );
    const endDate = format(
      setMilliseconds(
        setSeconds(
          setMinutes(
            setHours(new Date(), 23), // subtract 1 day, set hour to 23
            59
          ),
          0
        ),
        0
      ),
      dateFormateStr
    );
    let formatedstartDate = parse(startDate, dateFormateStr, new Date());
    let formatedendDate = parse(endDate, dateFormateStr, new Date());
    console.log("pageIndex fetc: ", pageIndexRef);

    const qs = {
      page: pageIndexRef.current + 1,
      // limit: 100,
      offset: pageSize,
      subject: "",
      camera: activeCameraName,
      // camera: "",
      tag: "",
      start: formatedstartDate,
      end: formatedendDate,
      sort_field: "",
      sort_order: "",
    };

    post(`/api/reco_table`, qs)
      .then((res) => res.json())
      .then((data) => {
        setData(
          data.detections.map((row: any) => {
            let timestamp = row.timestamp;
            const datetime = format(
              parseISO(timestamp),
              "dd/MM/yyyy, hh:mm:ss a"
            );

            return {
              ...row,
              timestamp: datetime,
              subject: {
                name: row.subject,
                photoUrl: row.det_face.replace(
                  "http://localhost:5757",
                  API_URL
                ),
              },
            };
          }) || []
        );
        setTotal(data.total || 0);
        setTotalPageCount(data.total_pages);
        console.log(data.total_pages);
      });
    setLoading(false);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handlePaginationAndSorting = (
    pageIndex: number,
    pageSize: number,
    sorting: SortingState
  ) => {

    pageIndexRef.current = pageIndex;
    // setPageIndex(pageIndex);
    setPageSize(pageSize);
    const sortColumn = sorting?.[0]?.id;
    const sortOrder = sorting?.[0]?.desc ? "desc" : "asc";
    console.log("sortOrder: ", sortOrder);
    console.log("sortColumn: ", sortColumn);
    setSortOrder(sortOrder);
    setSortField(sortColumn);

    // fetchDataFromServer({ pageIndex, pageSize, sortColumn, sortOrder });
  };

  const PersonNameAndPhoto: React.FC<{
    value: { name: string; photoUrl: string };
  }> = ({ value }) => {

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <img
          src={value.photoUrl}
          alt={value.name}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "32px",
            objectFit: "cover",
          }}
        />
        <span>{value.name}</span>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        {activeCameraName} Detection
      </h1>
      <div className="bg-white rounded-lg shadow-sm">
        <ReactTable
          rows={data}
          columns={columnDef}
          pageIndex={pageIndexRef.current}
          pageSize={pageSize}
          pageSizes={[1, 10, 20, 30, 50, 100]}
          totalCount={totalPageCount}
          onPaginationChange={(page, size, sorting) =>
            handlePaginationAndSorting(page, size, sorting)
          }
        />
      </div>
    </div>
  );
};

export default DetectionTable;
