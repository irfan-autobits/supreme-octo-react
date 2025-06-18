// project/src/pages/DetectionTable.tsx
import React, { useState, useEffect, ChangeEvent } from "react";
import { CloudCog, Search, SearchIcon, XCircleIcon, XIcon } from "lucide-react";
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
  parseISO,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
  subDays,
} from "date-fns";
import { SortingState } from "@tanstack/react-table";
import { Preloader } from "../assets/icons/svgs";

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

  const [loading, setLoading] = useState(true);

  let dateFormateStr = "dd-MM-yy hh:mm a";
  const [startDate, setStartDate] = useState<string>(
    format(
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
  
  // Table
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
  const [data, setData] = useState<Detection[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortField, setSortField] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  ///////
  
  // Query Form
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [isOpenDatepicker, setIsOpenDatepicker] = useState<boolean>(false);
  ///////

  // form options
  const [personOptions, setpersonOptions] = useState<
    { value: any; label: any }[]
  >([]);
  const [cameraOptions, setcameraOptions] = useState<
    { value: any; label: any }[]
  >([]);
  const [tagOptions, settagOptions] = useState<any>([]);
  const [groupedTagOption, setgroupedTagOption] = useState<any>({});
  ///////
  
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
  const handleFromDateUpdate = ({ date }: DateTimePickerOutPut) => {
    setFromDate(date.date);
    setStartDate(format(date.date, dateFormateStr));
  };
  const handleToDateUpdate = ({ date }: DateTimePickerOutPut) => {
    setToDate(date.date);
    setEndDate(format(date.date, dateFormateStr));
  };
  ///////

  // API
  const post = (path: string, body: any) =>
    fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  const fetchData = async () => {
    setLoading(true);
    let formatedstartDate = parse(startDate, dateFormateStr, new Date());
    let formatedendDate = parse(endDate, dateFormateStr, new Date());

    const qs = {
      page: pageIndex + 1,
      // limit: 100,
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
        setTotalPageCount(data.total_pages);
      });

    setLoading(false);
  };
  ///////

  // Table
  const handlePaginationAndSorting = (
    pageIndex: number,
    pageSize: number,
    sorting: SortingState
  ) => {
    setPageIndex(pageIndex);
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
            width: 32,
            height: 32,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <span>{value.name}</span>
      </div>
    );
  };
  ///////

  // Query Form
  const handleSubmit = () => {
    try {
      setPageIndex(0);

      fetchData();

      setSortField("timestamp");
      setSortOrder("desc");
    } finally {
    }
  };
  const handleResetSearch = () => {
    setStartDate(
      format(
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
      )
    );
    setEndDate(
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
    setSelectedSubject("");
    setSelectedCamera("");
    setSelectedTag("");
    setPageIndex(0);
    setSortField("timestamp");
    setSortOrder("desc");

    fetchData();
  };
  ///////

  useEffect(() => {
    fetch(`${API_URL}/api/subject_list`)
      .then((res) => res.json())
      .then((data) => {
        let options = [
          {
            value: "",
            label: "Select Person",
          },
        ];
        options.push(
          ...data.subjects.map((p: any) => ({
            value: p.subject_name,
            label: p.subject_name,
          }))
        );
        setpersonOptions(options);
      })
      .catch(() =>
        setpersonOptions([
          {
            value: "",
            label: "Loading...",
          },
        ])
      );

    fetch(`${API_URL}/api/camera_list`)
      .then((res) => res.json())
      .then((data) => {
        // At this point, `data` is the parsed JSON from /api/camera_listAPI_URL
        // Suppose `data.cameras` is an array of objects like { camera_name, tag }

        setgroupedTagOption(
          data.cameras.reduce((acc: any, cam: any) => {
            if (!acc[cam.tag]) {
              acc[cam.tag] = [];
            }
            acc[cam.tag].push(cam);
            return acc;
          }, {})
        );
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, sortOrder]); // now the callback itself is sync

  useEffect(() => {
    let options = [
      {
        value: "",
        label: "Select Tag",
      },
    ];
    options.push(
      ...Object.keys(groupedTagOption).map((tag) => {
        return { value: tag, label: tag };
      })
    );
    settagOptions(options);
  }, [groupedTagOption]);

  useEffect(() => {
    let options = [
      {
        value: "",
        label: "Select Camera",
      },
    ];
    if (selectedTag) {
      options.push(
        ...groupedTagOption[selectedTag].map((c: any) => {
          return {
            value: c.camera_name,
            label: c.camera_name,
          };
        })
      );
    } else if (selectedTag !== "" && tagOptions.length > 1) {
      options.push(
        ...groupedTagOption[Object.keys(groupedTagOption)[1]].map((c: any) => {
          return {
            value: c.camera_name,
            label: c.camera_name,
          };
        })
      );
    }
    setcameraOptions(options);
  }, [selectedTag, tagOptions]); // now the callback itself is sync


  return (
    <div className="p-6 flex h-full flex-col">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Detection Table
      </h1>

      <div className="bg-white flex flex-1 flex-col rounded-lg shadow-sm relative">
        <div className="flex-inline p-4 border-b border-gray-200 space-y-4">
          {/* 1) Date range: */}
          <div className="flex gap-3 ">
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

            {/* 4) Camera tag dropdown: */}
            <Select
              label="Tag"
              options={tagOptions}
              value={selectedTag}
              onChange={setSelectedTag}
              // disabled={!selectedCamera}
            />

            {/* 3) Camera name dropdown: */}
            <Select
              label="Camera"
              options={cameraOptions}
              value={selectedCamera}
              onChange={setSelectedCamera}
            />
            
            {loading == false ? (
              <>

                <div
                  className="flex items-center"
                  onClick={() => handleSubmit()}
                >
                  <SearchIcon size={30} />
                </div>

                <div
                  className="flex items-center"
                  onClick={() => handleResetSearch()}
                >
                  <XIcon size={30} />
                </div>
              </>
            ) : (
              // <Preloader height="50px" fill={"#88B04B"} />
              <span className="flex mx-2 items-center text-zinc-400">Loading...</span>
            )}
          </div>
        </div>
        {loading == false ? (
          <ReactTable
            rows={data}
            columns={columnDef}
            pageIndex={pageIndex}
            pageSize={pageSize}
            pageSizes={[1, 5, 10, 20, 30, 50, 100]}
            totalCount={totalPageCount}
            onPaginationChange={(page, size, sorting) =>
              handlePaginationAndSorting(page, size, sorting)
            }
          />
        ) : (
          // <Preloader height="50px" fill={"#88B04B"} />
          <span className="w-full flex-1 my-6 text-xl font-bold text-center text-zinc-400">Loading...</span>
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
