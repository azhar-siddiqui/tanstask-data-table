import { Button } from "@/components/ui/button";
import { ChartLine, CircleX, SquareArrowOutUpRight } from "lucide-react";
import React from "react";

const DataTableSelectionCount = ({
  selectedRowCount,
  maxRowsSelection,
  handleClearRowSelection,
}: {
  selectedRowCount: number;
  maxRowsSelection?: number;
  handleClearRowSelection: () => void;
}) => {
  return (
    <div className="px-4 py-2 w-full bg-blue-100/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-blue-100/50">
      <p className="text-sm font-medium">
        {selectedRowCount} / {maxRowsSelection} Rows Selected
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="ghost"
          className="text-red-400 font-bold hover:text-red-500"
          onClick={handleClearRowSelection}
        >
          <CircleX className="size-5" /> Clear Selection
        </Button>
        <Button variant="outline" className="">
          <ChartLine className="size-4" />
          Compare in Details
          <SquareArrowOutUpRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default DataTableSelectionCount;
