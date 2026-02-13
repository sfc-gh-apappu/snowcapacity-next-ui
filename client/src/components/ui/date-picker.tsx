"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  accentColor?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  accentColor = "#29B5E8",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const date = value ? new Date(value + "T00:00:00") : undefined

  const handleSelect = (selected: Date | undefined) => {
    if (selected && onChange) {
      const yyyy = selected.getFullYear()
      const mm = String(selected.getMonth() + 1).padStart(2, "0")
      const dd = String(selected.getDate()).padStart(2, "0")
      onChange(`${yyyy}-${mm}-${dd}`)
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            "bg-black border-[#1a1a1a] rounded-xl px-4 py-2.5 h-auto text-sm",
            "hover:bg-black hover:border-[#2a2a2a] hover:text-white",
            "focus:ring-2 focus:border-transparent transition-all",
            !date && "text-gray-500",
            date && "text-white",
            className
          )}
          style={{
            // @ts-expect-error CSS custom properties
            "--tw-ring-color": `${accentColor}33`,
            "focusRingColor": accentColor,
          }}
        >
          <CalendarIcon
            className="mr-2.5 h-4 w-4 flex-shrink-0"
            style={{ color: date ? accentColor : "#6b7280" }}
          />
          {date ? (
            <span>{format(date, "MMM d, yyyy")}</span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-[#0a0a0a] border-[#1a1a1a] rounded-xl shadow-2xl shadow-black/50"
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          className="bg-[#0a0a0a] text-white rounded-xl"
          classNames={{
            day: cn(
              "relative w-full h-full p-0 text-center group/day aspect-square select-none",
              "[&:first-child[data-selected=true]_button]:rounded-l-md",
              "[&:last-child[data-selected=true]_button]:rounded-r-md"
            ),
            today: "bg-[#1a1a1a] text-white rounded-md",
            weekday: "text-gray-500 rounded-md flex-1 font-normal text-[0.8rem] select-none",
            month_caption: "flex items-center justify-center h-8 w-full px-8",
            caption_label: "select-none font-medium text-sm text-white",
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
