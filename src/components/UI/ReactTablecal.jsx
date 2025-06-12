import { useEffect, useState } from "react";
// import { Box, Button, ButtonGroup, Icon, Text } from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ReactTable } from "./ReactTable";
// import DATA from "../data";
// import EditableCell from "./EditableCell";
// import StatusCell from "./StatusCell";
// import DateCell from "./DateCell";
// import Filters from "./Filters";
// import SortIcon from "./icons/SortIcon";

export const ReactTablecal = () => {

  return (
        <ReactTable
          rows={[
            {
              task: "Add a New Feature",
              notes: "This is a note",
            },
            {
              task: "Write Integration Tests",
              notes: "Use Jest",
            },
            {
              task: "Add a New Feature",
              notes: "This is a note",
            },
            {
              task: "Write Integration Tests",
              notes: "Use Jest",
            },
            {
              task: "Add a New Feature",
              notes: "This is a note",
            },
            {
              task: "Write Integration Tests",
              notes: "Use Jest",
            },
            {
              task: "Write Integration Tests",
              notes: "Use Jest",
            },
            {
              task: "Add a New Feature",
              notes: "This is a note",
            },
            {
              task: "Write Integration Tests",
              notes: "Use Jest",
            },
            {
              task: "Write Integration Tests",
              notes: "Use Jest",
            },
            {
              task: "Add a New Feature",
              notes: "This is a note",
            },
            {
              task: "Write Integration Tests",
              notes: "Use Jest",
            },
            {
              task: "Write Integration Tests",
              notes: "Use Jest",
            },
            {
              task: "Add a New Feature",
              notes: "This is a note",
            },
            {
              task: "Write Integration Tests",
              notes: "Use Jest",
            },
          ]}
          columns={[
            {
              accessorKey: "task",
              header: "Task",
              size: 10,
              cell: EditableCell,
              enableColumnFilter: true,
              filterFn: "includesString",
            },
            {
              accessorKey: "notes",
              header: "notes",
            },
            {
              accessorKey: "notes",
              header: "notes",
            },
            {
              accessorKey: "notes",
              header: "notes",
            },
            {
              accessorKey: "notes",
              header: "notes",
            },
          ]}
          pageIndex={0}
          pageSize={5}
          paginationEnabled={true}
        />
  )
};

function EditableCell({ getValue, row, column, table }) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      variant="filled"
      size="sm"
      overflow="hidden"
      // textOverflow="ellipsis"
      // whiteSpace="nowrap"
    />
  );
}