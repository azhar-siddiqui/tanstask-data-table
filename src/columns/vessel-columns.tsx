import MoneyWithCurrency from "@/components/common/money-with-currency/MoneyWithCurrency";

import { Vessel } from "@/data/data";
import { ColumnDef } from "@tanstack/react-table";

export const vesselColumns: ColumnDef<Vessel>[] = [
  {
    id: "vessels",
    accessorKey: "vesselName",
    header: () => "Vessels",
    size: 200,
    cell: ({ row }) => (
      <div className="capitalize text-left px-2 text-sm">
        {row.original.vesselName ?? "--"}
      </div>
    ),
  },
  {
    id: "segment",
    accessorKey: "segment",
    header: () => "Segment",
    cell: ({ row }) => (
      <div className="text-left px-2 text-sm">
        {row.original.segment ?? "--"}
      </div>
    ),
  },
  {
    id: "pool",
    accessorKey: "pool",
    header: () => "Pool",
    cell: ({ row }) => (
      <div className="text-left px-2 text-sm">{row.original.pool ?? "--"}</div>
    ),
  },
  {
    id: "participant",
    accessorKey: "participant",
    header: () => "Participants",
    cell: ({ row }) => (
      <div className="text-left px-2 text-sm">
        {row.original.participant.participantName ?? "--"}
      </div>
    ),
  },
  {
    id: "speed Percentage",
    accessorKey: "speedPercentage",
    header: () => "Speed Percentage",
    size: 180,
    cell: ({ row }) => (
      <div className="text-left px-2 text-sm">
        {row.original.speedPercentage ?? "--"}%
      </div>
    ),
  },
  {
    id: "age",
    accessorKey: "age",
    header: () => "Vessel Age (Yrs)",
    cell: ({ row }) => (
      <div className="text-left px-2 text-sm">{row.original.age ?? "--"}</div>
    ),
  },
  {
    id: "earnings",
    accessorKey: "earnings",
    header: () => "Earnings",
    cell: ({ row }) => {
      const earnings: number = row.getValue("earnings");
      return (
        <div className="text-left px-2 text-sm">
          <MoneyWithCurrency amount={earnings} />
        </div>
      );
    },
  },
];
// {
//   id: "earnings",
//   accessorKey: "earnings",
//   header: ({ column }) => {
//     const isSortedAsc = column.getIsSorted() === "asc";
//     const isSortedDesc = column.getIsSorted() === "desc";
//     return (
//       <span className="w-full">
//         Earnings
//         {isSortedAsc && <ArrowDown01 />}
//         {isSortedDesc && <ArrowUp01 />}
//       </span>
//     );
//   },
//   cell: ({ row }) => {
//     const earnings: number = row.getValue("earnings");
//     return (
//       <div className="text-left px-2 text-sm">
//         <MoneyWithCurrency amount={earnings} />
//       </div>
//     );
//   },
// },


// {
//   id: "earnings",
//   accessorKey: "earnings",
//   header: ({ column }) => {
//     // const isSortedAsc = column.getIsSorted() === "asc";
//     // const isSortedDesc = column.getIsSorted() === "desc";
//     return (
//       <p
//         className="w-full  justify-start ps-2"
//         // variant="ghost"
//         // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Earnings
//         {/* {isSortedAsc && <ArrowUpIcon />}
//         {isSortedDesc && <ArrowDownIcon />} */}
//       </p>
//     );
//   },
//   cell: ({ row }) => {
//     const earnings: number = row.getValue("earnings");
//     return (
//       <div className="text-left px-2 text-sm">
//         <MoneyWithCurrency amount={earnings} />
//       </div>
//     );
//   },
// },