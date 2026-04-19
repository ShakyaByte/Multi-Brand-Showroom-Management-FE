"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
} from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/shared/components/ui/select"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:--spacing(8)]",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      /* Set a wide range so you can actually see the scrollbar work */
      startMonth={new Date(1900, 0)} 
      endMonth={new Date(2100, 11)}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date: any) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row relative",
          defaultClassNames.months
        ),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
          defaultClassNames.dropdowns
        ),
        // We hide the default dropdown styles since we are using custom components
        dropdown_root: cn("relative", defaultClassNames.dropdown_root),
        dropdown: cn(defaultClassNames.dropdown),
        
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "hidden", // Hide label when using custom dropdowns
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        day: cn(
          "relative w-full h-full p-0 text-center group/day aspect-square select-none",
          defaultClassNames.day
        ),
        today: cn(
          "bg-accent text-accent-foreground rounded-md",
          defaultClassNames.today
        ),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => (
          <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />
        ),
        // CUSTOM DROPDOWN COMPONENT
        Dropdown: ({ value, onChange, options }) => {
        const selected = options?.find((option) => option.value === value);
        const handleValueChange = (newValue: string) => {
          const event = {
            target: { value: newValue },
          } as React.ChangeEvent<HTMLSelectElement>;
          onChange?.(event);
        };

          return (
           <Select value={value?.toString()} onValueChange={handleValueChange}>
            <SelectTrigger className="h-8 w-fit gap-1 border-none bg-transparent px-2 py-1 font-medium shadow-none focus:ring-0">
              <SelectValue>{selected?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent 
              position="popper" 
              className="`min-w-(--radix-select-trigger-width) bg-popover text-popover-foreground shadow-md"
              // This style block is the "Nuclear Option" to force the height
              style={{ maxHeight: '280px' }} 
            >
              {/* If your Shadcn SelectContent includes a SelectScrollUpButton/DownButton, 
                  make sure the items are wrapped in a div that allows scrolling */}
              <div className="overflow-y-auto">
                {options?.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value.toString()}
                    className="py-1.5 focus:bg-accent focus:text-accent-foreground"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
          );
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") return <ChevronLeftIcon className={cn("size-4", className)} {...props} />;
          if (orientation === "right") return <ChevronRightIcon className={cn("size-4", className)} {...props} />;
          return <ChevronDownIcon className={cn("size-4", className)} {...props} />;
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-selected={modifiers.selected}
      className={cn(
        "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col font-normal",
        "data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }