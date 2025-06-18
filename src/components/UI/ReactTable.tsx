import { Fragment, useEffect, useState } from "react";
import "./reacttable.css";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  ColumnFiltersState,
  RowData,
  TableMeta,
  CellContext,
  SortingState,
} from "@tanstack/react-table";

// Define types for component props
interface ReactTableProps<TData extends RowData> {
  rows?: TData[];
  columns?: ColumnDef<TData>[];
  pageSizes?: number[];
  pageIndex?: number;
  pageSize?: number;
  totalCount: number; // <- required to calculate total pages
  onPaginationChange: (
    pageIndex: number,
    pageSize: number,
    sorting: SortingState
  ) => void;
}

// Define meta type for table
interface CustomTableMeta<TData extends RowData> extends TableMeta<TData> {
  updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
}

// Icon props interface
interface IconProps {
  height: string;
  fill: string;
}

// Cell component props
interface CellProps<TData> {
  getValue: () => any;
  row: { index: number };
  column: { id: string };
  table: { options: { meta?: CustomTableMeta<TData> } };
}

export const ReactTable = <TData extends RowData>({
  rows = [],
  columns = [],
  pageSizes = [],
  pageIndex = 0,
  pageSize = 5,
  totalCount,
  onPaginationChange,
}: ReactTableProps<TData>) => {
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize,
  });

  const [data, setData] = useState<TData[]>(rows);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    setData(rows);
  }, [rows]);

  useEffect(() => {
    onPaginationChange(pagination.pageIndex, pagination.pageSize, sorting);
    setSorting(sorting);
  }, [pagination, sorting]); // <-- add `sorting`

  useEffect(() => {
    setPagination({
      pageIndex,
      pageSize,
    });
  }, [pageIndex, pageSize]); // <-- add `sorting`

  const table = useReactTable<TData>({
    data,
    columns,
    manualPagination: true, // <-- very important for server-side
    pageCount: totalCount,
    state: {
      columnFilters,
      pagination,
      sorting, // <-- add this
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting, // <-- set this
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((prev) =>
          prev.map(
            (row, index) => {
              console.log("type: ", typeof prev[index], prev[index]);
              return row;
            }
            // index === rowIndex ? { ...prev[index], [columnId]: value } : row
          )
        );
      },
    } as CustomTableMeta<TData>,
  });

  return (
    <Fragment>
      <style>
        {`
.reacttable-table {
  background: #F5F5F6;
  color: #000;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
}
.reacttable-table .RT-pagination {
  align-self: flex-end;
  display: flex;
  margin-top: 20px;
  gap: 2em;
  align-items: center;
}
.reacttable-table .RT-pagination .btn-group {
  align-self: flex-end;
  display: flex;
  gap: 5px;
  align-items: center;
}
.reacttable-table table {
  border-collapse: separate; /* Required for border-spacing to work */
  border-spacing: 0 8px; /* 8px vertical gap between rows */
}
.reacttable-table .normal-btn {
    padding: 13px 15px;
    background: #fff;
    border-radius: 5px;
}
.reacttable-table th, .reacttable-table td {
  padding: 15px;
  text-align: left;
  color: #000;
  background-color: #fff;
}
.reacttable-table th {
  font-weight: 800;
  border-bottom: 1px solid var(--miscellaneous-alert-menu-action-sheet-separators, #8080808C)
}
.reacttable-table td {
  font-weight: 400;
}
.reacttable-table input {
  background-color: transparent;
}

.custom-dropdown {
  position: relative;
  display: inline-block;
  margin-left: 10px;
  min-width: 50px;
}

.dropdown-toggle {
      padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    background: white;
    display: flex;
    align-items: center;
}

.dropdown-options {
  position: absolute;
  bottom: 100%; /* Forces dropdown to open upwards */
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-shadow: 0 -2px 5px rgba(0,0,0,0.1); /* Shadow on top */
  z-index: 1;
}

.dropdown-options div {
  padding: 5px 10px;
  cursor: pointer;
}

.dropdown-options div:hover {
  background: #f0f0f0;
}
.pagesize-wrapper {
  display: flex;
  align-items: center;
}`}
      </style>
      <div className="reacttable-table">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className="tr" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className="th"
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex gap-1 min-h-[33px]">
                      <span>{header.column.columnDef.header}</span>
                      {sorting.length > 0 &&
                      sorting[0].id === header.column.columnDef.accessorKey &&
                      sorting[0].desc === true ? (
                        <DescSort height={"30px"} fill="#000" />
                      ) : (
                        ""
                      )}
                      {sorting.length > 0 &&
                      sorting[0].id === header.column.columnDef.accessorKey &&
                      sorting[0].desc === false ? (
                        <AscSort height={"30px"} fill="#000" />
                      ) : (
                        ""
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, ri) => (
              <tr className="tr" key={row.id}>
                {row.getVisibleCells().map((cell, ci) => (
                  <td className="td" key={`${ri}-${ci}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="RT-pagination">
          <div className="pagesize-wrapper">
            <span>Result per page</span>
            <div className="custom-dropdown">
              <div
                className="dropdown-toggle"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span style={{ marginRight: "10px" }}>
                  {table.getState().pagination.pageSize}
                </span>
                {isDropdownOpen ? (
                  <UpArrow fill="#626262" height="15px" />
                ) : (
                  <DownArrow fill="#626262" height="15px" />
                )}
              </div>
              {isDropdownOpen && (
                <div className="dropdown-options" style={{ bottom: "100%" }}>
                  {pageSizes.map((size) => (
                    <div
                      key={size}
                      onClick={() => {
                        table.setPageSize(size);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>

          <div className="btn-group">
            <button
              className="normal-btn"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <DoubleBackwardIcon fill="#626262" height="9px" />
            </button>
            <button
              className="normal-btn"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <BackwardIcon fill="#626262" height="9px" />
            </button>
            <button
              className="normal-btn"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ForwardIcon fill="#626262" height="9px" />
            </button>
            <button
              className="normal-btn"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <DoubleForwardIcon fill="#626262" height="9px" />
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

// Cell Components
export function SimpleCell<TData>({ getValue }: CellProps<TData>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <>{value}</>;
}

export function EditableCell<TData>({
  getValue,
  row,
  column,
  table,
}: CellProps<TData>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData?.(row.index, column.id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
  );
}

// Icon Components
const BackwardIcon = ({ height, fill }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fill}
    height={height}
    stroke={fill}
    strokeWidth="1"
    viewBox="0 0 24 24"
  >
    <g>
      <polygon points="17.2,23.7 5.4,12 17.2,0.3 18.5,1.7 8.4,12 18.5,22.3" />
    </g>
  </svg>
);

const ForwardIcon = ({ height, fill }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fill}
    height={height}
    stroke={fill}
    strokeWidth="1"
    viewBox="0 0 24 24"
  >
    <g>
      <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12" />
    </g>
  </svg>
);

const DoubleBackwardIcon = ({ height, fill }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fill}
    height={height}
    stroke={fill}
    strokeWidth="13"
    viewBox="0 0 512 512"
  >
    <path d="M297.2,478l20.7-21.6L108.7,256L317.9,55.6L297.2,34L65.5,256L297.2,478z M194.1,256L425.8,34l20.7,21.6L237.3,256  l209.2,200.4L425.8,478L194.1,256z" />
  </svg>
);

const DoubleForwardIcon = ({ height, fill }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fill}
    height={height}
    stroke={fill}
    strokeWidth="13"
    viewBox="0 0 512 512"
  >
    <path d="M214.78,478l-20.67-21.57L403.27,256,194.11,55.57,214.78,34,446.46,256ZM317.89,256,86.22,34,65.54,55.57,274.7,256,65.54,456.43,86.22,478Z" />
  </svg>
);

const DownArrow = ({ height, fill }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z"
      fill={fill}
    />
  </svg>
);

const UpArrow = ({ height, fill }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M16.0686 15H7.9313C7.32548 15 7.02257 15 6.88231 15.1198C6.76061 15.2237 6.69602 15.3797 6.70858 15.5392C6.72305 15.7231 6.93724 15.9373 7.36561 16.3657L11.4342 20.4343C11.6322 20.6323 11.7313 20.7313 11.8454 20.7684C11.9458 20.8011 12.054 20.8011 12.1544 20.7684C12.2686 20.7313 12.3676 20.6323 12.5656 20.4343L16.6342 16.3657C17.0626 15.9373 17.2768 15.7231 17.2913 15.5392C17.3038 15.3797 17.2392 15.2237 17.1175 15.1198C16.9773 15 16.6744 15 16.0686 15Z"
      stroke={fill}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const DescSort = ({ height, fill }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M16.0686 15H7.9313C7.32548 15 7.02257 15 6.88231 15.1198C6.76061 15.2237 6.69602 15.3797 6.70858 15.5392C6.72305 15.7231 6.93724 15.9373 7.36561 16.3657L11.4342 20.4343C11.6322 20.6323 11.7313 20.7313 11.8454 20.7684C11.9458 20.8011 12.054 20.8011 12.1544 20.7684C12.2686 20.7313 12.3676 20.6323 12.5656 20.4343L16.6342 16.3657C17.0626 15.9373 17.2768 15.7231 17.2913 15.5392C17.3038 15.3797 17.2392 15.2237 17.1175 15.1198C16.9773 15 16.6744 15 16.0686 15Z"
      stroke={fill}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const AscSort = ({ height, fill }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M7.9313 9.00005H16.0686C16.6744 9.00005 16.9773 9.00005 17.1175 8.88025C17.2393 8.7763 17.3038 8.62038 17.2913 8.46082C17.2768 8.27693 17.0626 8.06274 16.6342 7.63436L12.5656 3.56573C12.3676 3.36772 12.2686 3.26872 12.1544 3.23163C12.054 3.199 11.9458 3.199 11.8454 3.23163C11.7313 3.26872 11.6323 3.36772 11.4342 3.56573L7.36561 7.63436C6.93724 8.06273 6.72305 8.27693 6.70858 8.46082C6.69602 8.62038 6.76061 8.7763 6.88231 8.88025C7.02257 9.00005 7.32548 9.00005 7.9313 9.00005Z"
      stroke={fill}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
