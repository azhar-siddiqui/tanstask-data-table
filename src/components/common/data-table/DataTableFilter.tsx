import React from "react";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileDown,
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
import { Separator } from "@/components/ui/separator";
import { Table } from "@tanstack/react-table";

interface DataTableFilterProps<TData> {
  filterKey: string;
  table: Table<TData>;
}

const DataTableFilter = <TData,>({
  filterKey,
  table,
}: DataTableFilterProps<TData>) => {
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

  return (
    <div className="pb-4 flex flex-col sm:flex-row sm:justify-between gap-4">
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
              <Button variant="outline" className="border-primary text-primary">
                None
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DataTableFilter;
