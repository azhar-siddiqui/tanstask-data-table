"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, ArrowRight, CalendarIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isFuture,
  isSameMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MonthRangePicker: React.FC = () => {
  const today = new Date();
  const defaultStart = startOfMonth(subMonths(today, 5));
  const defaultEnd = startOfMonth(today);
  const endMonthOfDefaultEndDate = endOfMonth(defaultEnd);

  const [currentYear, setCurrentYear] = React.useState(today.getFullYear());
  const [selectedRanges, setSelectedRanges] = React.useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: defaultStart,
    end: defaultEnd,
  });
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    defaultStart
  );
  const [endDate, setEndDate] = React.useState<Date | undefined>(
    endMonthOfDefaultEndDate
  );

  const handleMonthClick = (monthIndex: number) => {
    const selectedDate = startOfMonth(new Date(currentYear, monthIndex));

    if (isFuture(selectedDate)) return;

    setSelectedRanges((prev) => {
      const { start, end } = prev;

      // If both start and end are not set, set start to the selected date
      if (!start && !end) return { start: selectedDate, end: null };

      // If start is set but end is not, set end and ensure start < end
      if (start && !end) {
        return isBefore(selectedDate, start)
          ? { start: selectedDate, end: start }
          : { start, end: selectedDate };
      }

      // If both start and end are set, reset and set start to the selected date
      return { start: selectedDate, end: null };
    });
  };

  const handlePreviousYear = () => setCurrentYear((prev) => prev - 1);
  const handleNextYear = () => setCurrentYear((prev) => prev + 1);

  const isFutureMonth = (monthIndex: number) =>
    isFuture(new Date(currentYear, monthIndex, 1));

  const isSelected = (monthIndex: number) => {
    const { start, end } = selectedRanges;
    const date = startOfMonth(new Date(currentYear, monthIndex));
    if (!start) return false;

    if (end) {
      return isAfter(date, start) && isBefore(date, end);
    }

    return isSameMonth(date, start);
  };

  const formatRange = () => {
    const { start, end } = selectedRanges;
    if (!start) return "Select Range";
    if (!end) return `${format(start, "MMM ''yy")} - Select End`;
    return `${format(start, "MMM ''yy")} - ${format(end, "MMM ''yy")}`;
  };

  const handleSaveSelection = () => {
    const { start, end } = selectedRanges;

    const formattedStart = start && format(start, "dd-MM-yyyy");
    const formattedEnd = end && format(endOfMonth(end), "dd-MM-yyyy");
    if (start && end) {
      setStartDate(start);
      setEndDate(endOfMonth(end));
    }

    console.log(`Start: ${formattedStart}, End: ${formattedEnd}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className=" rounded-none border-none focus-visible:ring-0 shadow-none hover:bg-white"
        >
          Month <span className="text-sky-900">{formatRange()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 shadow-none p-2" align="start">
        <DropdownMenuLabel>Show data for</DropdownMenuLabel>
        <div className="border rounded-md p-2">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="p-2 hover:bg-transparent"
              onClick={handlePreviousYear}
            >
              <ArrowLeft className="size-4" />
            </Button>
            <span className="text-sm">{currentYear}</span>
            <Button
              variant="ghost"
              className="p-2 hover:bg-transparent"
              onClick={handleNextYear}
              disabled={currentYear >= today.getFullYear()}
            >
              <ArrowRight className="size-4" />
            </Button>
          </div>
          <DropdownMenuGroup className="grid grid-cols-3 mt-2">
            {months.map((month, index) => {
              const isDisabled = isFutureMonth(index);
              const isInRange = isSelected(index);
              const isStart =
                selectedRanges.start &&
                isSameMonth(selectedRanges.start, new Date(currentYear, index));
              const isEnd =
                selectedRanges.end &&
                isSameMonth(selectedRanges.end, new Date(currentYear, index));

              return (
                <Button
                  key={month}
                  variant="ghost"
                  className={`hover:no-underline rounded-none hover:bg-sky-100 ${
                    isDisabled ? "text-gray-400 cursor-not-allowed" : ""
                  } ${
                    isInRange ? "bg-sky-100 text-sky-900 hover:bg-sky-100" : ""
                  } ${
                    isStart || isEnd
                      ? "bg-sky-900 text-white hover:bg-sky-900 hover:text-white"
                      : ""
                  }`}
                  onClick={() => handleMonthClick(index)}
                  disabled={isFutureMonth(index)}
                >
                  {month.slice(0, 3)}
                </Button>
              );
            })}
          </DropdownMenuGroup>
        </div>
        <Separator className="my-4 mb-2" />
        <DropdownMenuLabel>Show data trend for</DropdownMenuLabel>
        <div className="flex items-center justify-between gap-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                {startDate ? (
                  format(startDate, "dd-MM-yyyy")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                defaultMonth={startDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                {endDate ? (
                  format(endDate, "dd-MM-yyyy")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                defaultMonth={endDate}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button className="w-full">Last 1 month</Button>
          <Button variant="outline" className="w-full">
            Last 3 month
          </Button>
          <Button variant="outline" className="w-full">
            Last 6 month
          </Button>
          <Button variant="outline" className="w-full">
            Last 9 month
          </Button>
          <Button variant="outline" className="w-full">
            Last 12 month
          </Button>
          <Button variant="outline" className="w-full">
            Last 18 month
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <Button
            variant="destructive"
            onClick={() => setSelectedRanges({ start: null, end: null })}
          >
            Reset Changes
          </Button>
          <Button onClick={handleSaveSelection}>Save Selection</Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MonthRangePicker;
