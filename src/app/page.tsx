"use client";

import { vesselData } from "@/data/data";
import { Card, CardContent } from "@/components/ui/card";
import { vesselColumns } from "@/columns/vessel-columns";
import DataTable from "@/components/common/data-table/DataTable";
import { useEffect, useState } from "react";
import { LineChart } from "@/components/charts/line-chart";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="container mx-auto w-full h-full flex flex-col gap-y-4">
      {/* Chart  */}
      <Card className="rounded-lg mt-4">
        <CardContent className="p-4 pt-6">
          <LineChart />
        </CardContent>
      </Card>
      
      {/* Table Card */}
      <Card className="rounded-lg">
        <CardContent className="pb-0">
          <DataTable
            data={vesselData}
            columns={vesselColumns}
            isLoading={isLoading}
            filterKey="vessels"
          />
        </CardContent>
      </Card>
    </div>
  );
}
