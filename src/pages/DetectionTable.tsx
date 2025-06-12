// project/src/pages/DetectionTable.tsx
import React, { useState, useEffect, ChangeEvent } from "react";
import { CloudCog, Search, SearchIcon } from "lucide-react";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import Table from "../components/UI/Table";
import {
  parseTimestamp,
  formatTimestamp,
  formatShort,
  localToUtcIso,
} from "../utils/time";
import Select from "../components/UI/Select";
import { ReactTable } from "../components/UI/ReactTable";
import { DateTimeRangePicker } from "react-datetime-range-super-picker";
import "react-datetime-range-super-picker/dist/index.css";
import { RangePickerProps } from "react-datetime-range-super-picker/dist/interfaces/rangepicker.interfaces";
import {
  DateObject,
  DateTimePickerOutPut,
} from "react-datetime-range-super-picker/dist/interfaces/datetimepicker.interfaces";
import {
  format,
  formatISO,
  parse,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
  subDays,
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

const DetectionTable: React.FC = () => {
  let nowtime = new Date();
  let dateFormateStr = "dd-MM-yy hh:mm a";
  const [data, setData] = useState<Detection[]>([]);
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalRowsCount, setTotalRowsCount] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>(
    format(
      setMilliseconds(
        setSeconds(
          setMinutes(
            setHours(subDays(new Date(), 1), 23), // subtract 1 day, set hour to 23
            59
          ),
          0
        ),
        0
      ),
      dateFormateStr
    )
  );
  const [endDate, setEndDate] = useState<string>(
    format(
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
    )
  );
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [isOpenDatepicker, setIsOpenDatepicker] = useState<boolean>(false);
  const [people, setPeople] = useState<string[]>([]);
  const [cameras, setCameras] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const [from_date, setFromDate] = useState<Date | DateObject | string>({
    day: nowtime.getDate() - 1,
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
    hour: 12,
    minute: 0,
    meridiem: "AM",
    hour24: 0,
  });
  // OR use JSON object with : day, month, year

  // onFromDateTimeUpdate: ({}: DateTimePickerOutPut) => void;
  // onToDateTimeUpdate: ({}: DateTimePickerOutPut) => void;
  const handleFromDateUpdate = ({ date }: DateTimePickerOutPut) => {
    setFromDate(date.date);
    setStartDate(format(date.date, dateFormateStr));
  };
  const handleToDateUpdate = ({ date }: DateTimePickerOutPut) => {
    setToDate(date.date);
    setEndDate(format(date.date, dateFormateStr));
  };
  // useEffect(() => {
  //   // console.log( typeof from_date === "object" ? format(from_date, "do MMMM yyyy, hh:mm aaa") : "");
  //   console.log(typeof from_date, from_date, " => ", to_date);
  // }, [from_date, to_date]);

  const ITEMS_PER_PAGE = 100;
  const limit = ITEMS_PER_PAGE; // no need for useState

  const post = (path: string, body: any) =>
    fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  const fetchData = async () => {
    setLoading(true);
    let formatedstartDate = parse(startDate, dateFormateStr, new Date() );
    let formatedendDate = parse(endDate, dateFormateStr, new Date());

    const qs = {
      page: pageIndex,
      limit: 100,
      offset: pageSize,
      subject: selectedSubject,
      camera: selectedCamera,
      tag: selectedTag,
      start: formatedstartDate,
      end: formatedendDate,
      sort_field: sortField,
      sort_order: sortOrder,
    };

    post(`/api/reco_table`, qs)
      .then((res) => res.json())
      .then((data) => {
        setData(data.detections || []);
        setTotal(data.total || 0);
      });
    setLoading(false);
  };

  useEffect(() => {
    fetch(`${API_URL}/api/subject_list`)
      .then((res) => res.json())
      .then((data) => setPeople(data.subjects.map((p: any) => p.subject_name)))
      .catch(() => setPeople([]));

    fetch(`${API_URL}/api/camera_list`)
      .then((res) => res.json())
      .then((data) => {
        // At this point, `data` is the parsed JSON from /api/camera_list
        // Suppose `data.cameras` is an array of objects like { camera_name, tag }
        const cameraNames = data.cameras.map((c: any) => c.camera_name);
        const cameraTags = data.cameras.map((c: any) => c.tag);

        setCameras(cameraNames);
        setTags(cameraTags);
      })
      .catch(() => {
        setCameras([]);
        setTags([]);
      });
  }, []);
  const personOptions = people.map((person) => ({
    value: person,
    label: person,
  }));

  const cameraOptions = cameras.map((camera) => ({
    value: camera,
    label: camera,
  }));

  const tagOptions = tags.map((tag) => ({
    value: tag,
    label: tag,
  }));

  // re-fetch on any dependency change
  useEffect(() => {
    setLoading(true);
    async function doFetch() {
      try {
        fetchData();
      } finally {
        setLoading(false);
      }
    }
    doFetch();
  }, [selectedTag, pageIndex, pageSize]); // now the callback itself is sync

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Detection Table
      </h1>

      <div className="bg-white rounded-lg shadow-sm relative">
        <div className="flex-inline p-4 border-b border-gray-200 space-y-4">
          {/* 1) Date range: */}
          <div className="flex space-x-2 ">
            {isOpenDatepicker === true && (
              <div className="datepicker-wrapper">
                <DateTimeRangePicker
                  from_date={from_date}
                  to_date={to_date}
                  onFromDateTimeUpdate={handleFromDateUpdate}
                  onToDateTimeUpdate={handleToDateUpdate}
                  format={dateFormateStr}
                  dateFormat="yyyy-MM-dd"
                  timeFormat="HH:mm"
                  weekStartsOn={0} // 0 = Sunday, 1 = Monday
                  colors={{
                    primary_color: "#fff",
                    primary_font_color: "#00000091",
                    light_font_color: "#00000059",
                    secondary_color: "#efefef",
                    primary_highlight_color: "#88B04B",
                    secondary_highlight_color: "#00AAB2",
                  }}
                  onDone={() => {
                    setIsOpenDatepicker(false);
                  }}
                  closeButtonText="Apply"
                />
              </div>
            )}

            <ValueShow
              clickHandler={() => setIsOpenDatepicker(true)}
              value={`${startDate} To ${endDate}`}
              label="Date"
            />

            {/* <label>
              From:&nbsp;
            </label>
            <label>
              To:&nbsp;
            </label> */}

            {/* 2) Person/Subject dropdown: */}
            <Select
              label="Person"
              options={personOptions}
              value={selectedSubject}
              onChange={setSelectedSubject}
            />

            {/* 3) Camera name dropdown: */}
            <Select
              label="Camera"
              options={cameraOptions}
              value={selectedCamera}
              onChange={setSelectedCamera}
            />

            {/* 4) Camera tag dropdown: */}
            <Select
              label="Tag"
              options={tagOptions}
              value={selectedTag}
              onChange={setSelectedTag}
              // disabled={!selectedCamera}
            />
           <SearchIcon size={80} />
          </div>
        </div>
        <ReactTable
          rows={data}
          columns={[
            {
              accessorKey: "id",
              header: "ID",
            },
            {
              accessorKey: "subject",
              header: "Person Name",
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
              header: "Timestamp",
            },
          ]}
          pageIndex={pageIndex}
          pageSize={pageSize}
          pageSizes={[1, 10, 20, 30]}
          totalCount={totalRowsCount}
          onPaginationChange={(newPage, newSize) => {
            setPageIndex(newPage);
            setPageSize(newSize);
          }}
        />

        {false && (
          <Table
            headers={[
              "ID",
              "Person Name",
              "Camera Name",
              "Camera Tag",
              "Detection Score",
              "Distance From Know",
              "Timestamp",
              "Image",
            ]}
          >
            {data.map((d, i) => (
              <tr key={d.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {d.id}
                </td>
                ?
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
        )}
        {false && (
          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span>
              Page {page} of {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(total / limit)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetectionTable;

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
