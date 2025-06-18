// project/src/pages/PersonTracker.tsx
import React, { useState, useEffect } from "react";
import Select from "../components/UI/Select";
import DatePicker from "../components/UI/DatePicker";
import Button from "../components/UI/Button";
import ReactFlow, { Background, Controls } from "reactflow";
import CustomNode from "../features/Persons/CustomNode";
import { parseTimestamp, formatTimestamp, localToUtcIso } from "../utils/time";
import { format, parseISO } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("VITE_API_URL is not defined");

interface MovementEntry {
  camera_tag: string;
  entry_time: string;
  start_time_raw: string;
  duration: number | string;
}

const PersonTracker: React.FC = () => {

  const [selectedPerson, setSelectedPerson] = useState<string | undefined>(
    undefined
  );
  const [movementPerson, setmovementPerson] = useState(
    {imgURL: "", name: ""}
  );
  
  const [personOptions, setpersonOptions] = useState<any[]>([]);
  const [dataInfo, setdataInfo] = useState<string>("No Data to show");
  const [fromDate, setFromDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [movementNodes, setmovementNodes] = useState<any[]>([]);

  const fetchMovementHistory = async (personName: string | undefined) => {
    setdataInfo("Loading...");
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

      let nodes = {};

      data.forEach((e) => {
        let date = format(parseISO(e.start_time_raw), "dd MMM");
        nodes[date] = { date: date };
      });
      data.forEach((e) => {
        let date = format(parseISO(e.start_time_raw), "dd MMM");
        let time = format(parseISO(e.start_time_raw), "hh:mm a");

        if ("nodes" in nodes[date]) {
          nodes[date]["nodes"].push({...e, time});
        } else {
          nodes[date]["nodes"] = [{...e, time}];
        }
      });

      if(selectedPerson && personOptions.length > 0) {
        personOptions.forEach(o => {
          if(o.value === selectedPerson) {
            setmovementPerson({imgURL: o.imgURL, name: o.value});
          }
        });
      }
      
      setmovementNodes(Object.values(nodes));
    } catch(err) {
      console.log("Error: ", err);
    }
    setdataInfo("No Data to show");
  };

  useEffect(() => {
    fetch(`${API_URL}/api/subject_list`)
      .then((res) => res.json())
      .then((data) => {
        // setPeople(data.subjects.map((p: any) => p.subject_name));
        let opts = [{ label: "Select Person", value: "" }];
        opts.push(
          ...data.subjects.map((p: any) => {
            let imgURL = "";

            if(p.images.length > 0) {
              imgURL = p.images[0].url;
            }

            return { label: p.subject_name, value: p.subject_name, imgURL };
          })
        );
        setpersonOptions(opts);
      })
      .catch(() => setpersonOptions([]));
  }, []);


  return (
    <div className="h-full p-6 flex flex-col">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Person Tracker
      </h1>
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
            // disabled={!selectedPerson || !fromDate || !endDate}
          >
            Show Journey
          </Button>
        </div>
      </div>
      {/* <div className="grid grid-cols-4 gap-4 mb-6"> */}
      {/* grid grid-cols-1 gap-4 */}
      <div className="flex-1 flex rounded-lg bg-white p-6">
        {movementNodes.length > 0 ? (
          // <div
          //   style={{
          //     width: "100%",
          //     height: 700,
          //     border: "1px solid #ccc",
          //     marginTop: 20,
          //   }}
          // >
          //   <ReactFlow
          //     nodes={nodes}
          //     edges={edges}
          //     nodeTypes={{ custom: CustomNode }}
          //     nodesDraggable={false}
          //     zoomOnScroll={false}
          //     zoomOnPinch={false}
          //   >
          //     <Background color="#aaa" gap={16} />
          //     <Controls showInteractive={false} />
          //   </ReactFlow>
          // </div>

          <div className="flex flex-1 flex-col gap-5">
            <div className="flex gap-2">
              <div>
                <img
                  className="shadow-sm border border-zinc-200 w-[60px] h-[60px] rounded-[50%] object-cover"
                  src={movementPerson.imgURL}
                  // src="https://placehold.co/400"
                  alt="Preview"
                />
              </div>
              <div className="ml-2 flex flex-col justify-center">
                <div className="text-base font-bold">{movementPerson.name}</div>
                <div className="font-bold text-zinc-400 hidden">232</div>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              {movementNodes.map((dt, dti) => (
                <>
                  <div
                    className={
                      "flex" + `${dti % 2 === 0 ? " bg-zinc-100" : ""}`
                    }
                  >
                    <div className="text-center font-bold p-5">
                      {dt.date.split(" ").map((e) => (
                        <>
                          {e} <br />
                        </>
                      ))}
                    </div>
                    <div className="flex gap-5  flex-wrap">
                      {dt.nodes.map((te, tei) => (
                        <TrackerCard
                          isStart={Boolean(tei == 0)}
                          isEnd={Boolean(tei == dt.nodes.length - 1)}
                          title={te.camera_tag}
                          duration={te.duration}
                          time={te.time}
                        />
                      ))}
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 justify-center items-center">{dataInfo}</div>
        )}
      </div>
    </div>
  );
};

export default PersonTracker;

interface TrackerCard {
  isStart?: Boolean;
  isEnd?: Boolean;
  duration: string;
  time: string;
  title: string;
}

const TrackerCard: React.FC<TrackerCard> = ({
  isStart,
  isEnd,
  duration,
  time,
  title,
}) => {
  return (
    <div className="flex gap-5 py-5 px-1">
      <div className="flex flex-col items-center">
        <div className="text-zinc-400 flex-1 flex items-end">{time}</div>
        <div className="flex w-[100px] flex-1 justify-center">
          <div className="flex items-start w-full">
            <div className="flex items-center w-full">
              {isStart == true && (
                <div className="h-[10px] w-[10px] rounded-[10px] bg-zinc-400"></div>
              )}
              <div className="w-full h-[1px] bg-zinc-400"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start">
        <div className="flex-1 flex items-end font-bold">{title}</div>
        <div className="flex flex-1 justify-center">
          <div className="flex items-start w-full">
            <div className="flex items-center w-full font-light">
              Duration: {duration}
            </div>
          </div>
        </div>
      </div>
      {isEnd == true && (
        <div className="flex flex-col items-center">
          <div className="text-zinc-400 flex-1 flex items-end">{""}</div>
          <div className="flex w-[100px] flex-1 justify-center">
            <div className="flex items-start w-full">
              <div className="flex items-center w-full">
                <div className="w-full h-[1px] bg-zinc-400"></div>
                  <div className="h-[10px] w-[10px] rounded-[10px] bg-zinc-400"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
