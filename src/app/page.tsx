"use client";

import { vesselData } from "@/data/data";
import { Card, CardContent } from "@/components/ui/card";
import { vesselColumns } from "@/columns/vessel-columns";
import DataTable from "@/components/common/data-table/DataTable";
import { useEffect, useState } from "react";
import { LineChart } from "@/components/charts/line-chart";
import MonthRangePicker from "@/components/common/date-pickers/month-range-picker";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="container mx-auto w-full h-full flex flex-col gap-y-4 mt-4">
      <div className="bg-blue-50 py-4">
        <MonthRangePicker />
      </div>
      {/* Chart  */}
      <Card className="rounded-lg">
        <CardContent className="p-4 pt-6">
          <LineChart />
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="rounded-lg">
        <CardContent className="p-4">
          <DataTable
            data={vesselData}
            columns={vesselColumns}
            isLoading={isLoading}
            filterKey="vessels"
            // isTableHeader={false}
            // selectedRowCountHeader={false}
            // enableRowsSelection={false}
            // tableRowsOptions={[20, 30, 40]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
