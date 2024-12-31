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
  ChevronLeft,
  ChevronRight,
  Download,
  FileDown,
  LoaderCircle,
  Search,
  Settings2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import DataTableSelectionCount from "./DataTableSelectionCount";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  maxRowsSelection?: number;
  enableRowsSelection?: boolean;
  filterKey: string;
}

const DataTable = <TData, TValue>({
  data,
  columns,
  isLoading,
  maxRowsSelection = 8,
  enableRowsSelection = true,
  filterKey,
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

  const columnLength = table
    .getAllColumns()
    .filter((col) => col.getIsVisible()).length;

  const handleSelectAllColumns = () => {
    table.getAllColumns().forEach((column) => {
      column.toggleVisibility(true);
    });
  };

  const handleDeselectAllColumns = () => {
    const allColumns = table
      .getAllColumns()
      .filter((column) => column.getCanHide());
    const visibleColumns = allColumns.filter((column) => column.getIsVisible());

    // Ensure at least one column remains visible
    if (visibleColumns.length > 1) {
      allColumns.forEach((column) => {
        // Hide all columns except the first visible one
        if (visibleColumns[0] !== column) {
          column.toggleVisibility(false);
        }
      });
    }

    // If no columns are visible, ensure the first column becomes visible
    if (visibleColumns.length === 0) {
      const firstColumn = allColumns[0];
      if (firstColumn) {
        firstColumn.toggleVisibility(true);
      }
    }
  };

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
            colSpan={enableRowsSelection ? columns.length + 1 : columns.length}
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
            colSpan={enableRowsSelection ? columns.length + 1 : columns.length}
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
      <div className="py-4 flex flex-col sm:flex-row sm:justify-between gap-4">
        <Input
          placeholder={`Filter ${filterKey}...`}
          value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterKey)?.setFilterValue(event.target.value)
          }
          className="w-full max-w-lg capitalize"
          startIcon={<Search className="size-4" />}
        />
        <div className="flex gap-2">
          <div className="flex items-center w-full">
            <Button variant="link">
              <ChevronLeft />
            </Button>
            <p className="text-primary text-sm font-medium">Nov&apos;24</p>
            <Button variant="link">
              <ChevronRight />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="link"
                className="w-full ml-auto focus-visible:ring-0 hover:no-underline"
              >
                Exports <FileDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="p-2 mx-4 md:mx-auto flex flex-col gap-y-2"
            >
              <Button
                variant="outline"
                className="group w-full ml-auto focus-visible:ring-0 hover:no-underline flex items-center justify-between px-2 text-primary hover:text-primary border-primary"
              >
                Export All Data
                <Download className="group-hover:animate-bounce" />
              </Button>
              <Button
                variant="outline"
                className="group w-full ml-auto focus-visible:ring-0 hover:no-underline flex items-center justify-between px-2 text-primary hover:text-primary border-primary"
              >
                Export All Vessel Data
                <Download className="group-hover:animate-bounce" />
              </Button>
              <Button
                variant="outline"
                className="group w-full ml-auto focus-visible:ring-0 hover:no-underline flex items-center justify-between px-2 text-primary hover:text-primary border-primary"
              >
                Export All Voyage Data
                <Download className="group-hover:animate-bounce" />
              </Button>
              <Button
                variant="outline"
                className="group w-full ml-auto focus-visible:ring-0 hover:no-underline flex items-center justify-between px-2 text-primary hover:text-primary border-primary"
              >
                Export Monthly Vessel Data
                <Download className="group-hover:animate-bounce" />
              </Button>
              <Button
                variant="outline"
                className="group w-full ml-auto focus-visible:ring-0 hover:no-underline flex items-center justify-between px-2 text-primary hover:text-primary border-primary"
              >
                Export Monthly Voyage Data
                <Download className="group-hover:animate-bounce" />
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="hidden sm:block">
                <Button
                  variant="link"
                  className="w-full ml-auto focus-visible:ring-0 hover:no-underline "
                >
                  Settings <Settings2 />
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-72 md:w-96 p-2 mx-4 md:mx-auto"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">Show Columns</p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="link"
                    className="hover:no-underline p-0"
                    onClick={handleSelectAllColumns}
                  >
                    Select All
                  </Button>
                  <Separator
                    orientation="vertical"
                    className="border border-primary h-4"
                  />
                  <Button
                    variant="link"
                    className="hover:no-underline p-0"
                    onClick={handleDeselectAllColumns}
                  >
                    Deselect All
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pb-2">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <Button
                        className="capitalize border border-primary backdrop-blur-xl"
                        key={column.id}
                        onClick={() => {
                          if (
                            columnLength > 1 ||
                            (columnLength === 1 && !column.getIsVisible())
                          ) {
                            column.toggleVisibility(!column.getIsVisible());
                          } else if (columnLength === 1) {
                            column.toggleVisibility(true);
                          }
                        }}
                        variant={column.getIsVisible() ? "default" : "outline"}
                      >
                        {column.id}
                      </Button>
                    );
                  })}
              </div>
              <Separator className="my-4" />
              <div>
                <p className="text-sm font-bold mb-2">Group by</p>
                <Button
                  variant="outline"
                  className="border-primary text-primary"
                >
                  None
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {selectedRowCount > 0 && (
        <DataTableSelectionCount
          selectedRowCount={selectedRowCount}
          maxRowsSelection={maxRowsSelection}
          handleClearRowSelection={handleClearRowSelection}
        />
      )}

      <div className="rounded-md">
        <Table>
          <TableHeader className="bg-primary/15">
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
                        if (data.length <= maxRowsSelection) {
                          table.toggleAllPageRowsSelected(!!value);
                        } else {
                          renderMaxrowSelectionMessage();
                        }
                      }}
                      aria-label="Select all"
                    />
                  </TableHead>
                )}
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
                        className="font-bold focus-visible:ring-0 w-full px-2 justify-start rounded-none"
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
                          <ArrowDownAZ className="size-5" />
                        ) : (
                          <ArrowUpAZ className="size-5" />
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
