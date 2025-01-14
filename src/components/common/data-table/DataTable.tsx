"use client";
import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { toast } from "sonner";

import {
  ArrowDownAZ,
  ArrowUpAZ,
  ChevronDown,
  LoaderCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import DataTableSelectionCount from "./DataTableSelectionCount";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import DataTableFilter from "./DataTableFilter";
import DataTableFooter from "./DataTableFooter";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  maxRowsSelection?: number;
  enableRowsSelection?: boolean;
  filterKey: string;
  isTableHeader?: boolean;
  selectedRowCountHeader?: boolean;
  tableRowsOptions?: number[];
}

const DataTable = <TData, TValue>({
  data,
  columns,
  isLoading,
  maxRowsSelection = 8,
  enableRowsSelection = true,
  filterKey,
  isTableHeader = true,
  selectedRowCountHeader = true,
  tableRowsOptions,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const selectedRowCount = Object.keys(rowSelection).filter(
    (key) => rowSelection[key]
  ).length;

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableColumnResizing: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleClearRowSelection = () => {
    setRowSelection({});
  };

  const handleRowSelect = (row: Row<TData>, value: CheckedState) => {
    if (selectedRowCount === maxRowsSelection) {
      row.toggleSelected(false);
    } else {
      row.toggleSelected(!!value);
    }
  };

  const renderMaxrowSelectionMessage = () => {
    toast(
      `Select All is limited upto ${maxRowsSelection} ${filterKey}. Please select manually.`
    );
  };

  const renderDataTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell
            colSpan={
              enableRowsSelection ? columns.length + 2 : columns.length + 1
            }
            className="h-52 text-center border border-primary"
          >
            <div className="flex items-center justify-center">
              <LoaderCircle className="animate-spin size-16" />
            </div>
          </TableCell>
        </TableRow>
      );
    } else if (table.getRowModel().rows?.length) {
      return table.getRowModel().rows.map((row) => (
        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
          {enableRowsSelection && (
            <TableCell className="border border-primary px-0 text-center">
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => {
                  handleRowSelect(row, value);
                }}
                aria-label="Select all"
              />
            </TableCell>
          )}
          <TableCell className="border border-primary text-center p-0">
            <Button variant="ghost">
              <ChevronDown className="size-4" />
            </Button>
          </TableCell>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id} className="border border-primary px-0">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ));
    } else {
      return (
        <TableRow>
          <TableCell
            colSpan={
              enableRowsSelection ? columns.length + 2 : columns.length + 1
            }
            className="h-52 text-center border border-primary"
          >
            No results.
          </TableCell>
        </TableRow>
      );
    }
  };

  return (
    <div className="w-full h-full">
      {isTableHeader && <DataTableFilter filterKey={filterKey} table={table} />}

      {selectedRowCount > 0 && selectedRowCountHeader && (
        <DataTableSelectionCount
          selectedRowCount={selectedRowCount}
          maxRowsSelection={maxRowsSelection}
          handleClearRowSelection={handleClearRowSelection}
        />
      )}

      <div className="rounded-md">
        <Table>
          <TableHeader className="bg-primary/10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {enableRowsSelection && (
                  <TableHead className="border border-primary px-0 text-center min-w-10 w-10">
                    <Checkbox
                      checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                      }
                      onCheckedChange={(value) => {
                        if (
                          table.getRowModel().rows.length <= maxRowsSelection
                        ) {
                          table.toggleAllPageRowsSelected(!!value);
                        } else {
                          renderMaxrowSelectionMessage();
                        }
                      }}
                      aria-label="Select all"
                    />
                  </TableHead>
                )}
                <TableHead className="border border-primary px-0 text-center min-w-10 w-10"></TableHead>
                {headerGroup.headers.map((header) => {
                  const styles: React.CSSProperties = {
                    width: `${header.getSize()}px`,
                    minWidth: `${header.getSize()}px`,
                    maxWidth: `${header.getSize()}px`,
                  };

                  const enableSorting =
                    header.column.columnDef.enableSorting ?? true;

                  return (
                    <TableHead
                      key={header.id}
                      className="border border-primary px-0 text-center w-full"
                      style={styles}
                    >
                      <Button
                        variant="ghost"
                        className="font-bold focus-visible:ring-0 w-full px-2 justify-start rounded-none text-[#303030] cursor-pointer"
                        onClick={() => {
                          if (enableSorting) {
                            header.column.toggleSorting(
                              header.column.getIsSorted() === "asc"
                            );
                          }
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}

                        {enableSorting &&
                        header.column.getIsSorted() === "asc" ? (
                          <ArrowDownAZ className="size-5 text-sky-800" />
                        ) : (
                          <ArrowUpAZ className="size-5 text-sky-800" />
                        )}
                      </Button>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>{renderDataTableContent()}</TableBody>
        </Table>
      </div>
      <DataTableFooter table={table} tableRowsOptions={tableRowsOptions} />
    </div>
  );
};

export default DataTable;
