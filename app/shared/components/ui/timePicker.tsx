import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popOver";

// ── helpers 

/** Parse "HH:MM" string → { hours, minutes } */
function parseTime(value?: string): { hours: number; minutes: number } {
    if (!value) return { hours: 0, minutes: 0 };
    const [h, m] = value.split(":").map(Number);
    return { hours: isNaN(h) ? 0 : h, minutes: isNaN(m) ? 0 : m };
}

/** Format { hours, minutes } → "HH:MM" string */
function formatTime(hours: number, minutes: number): string {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function pad(n: number) {
    return String(n).padStart(2, "0");
}

// ── ScrollColumn

interface ScrollColumnProps {
    items: number[];
    selected: number;
    onSelect: (v: number) => void;
    label: string;
}

const ScrollColumn = ({ items, selected, onSelect, label }: ScrollColumnProps) => {
    const ref = React.useRef<HTMLDivElement>(null);

    // Scroll to selected item on open
    React.useEffect(() => {
        const el = ref.current?.querySelector(`[data-value="${selected}"]`);
        if (el) {
            (el as HTMLElement).scrollIntoView({ block: "center", behavior: "instant" });
        }
    }, [selected]);

    return (
        <div className="flex flex-col items-center gap-1">
            <p className="text-xs font-medium text-gray-400 mb-1">{label}</p>
            <div
                ref={ref}
                className="h-44 overflow-y-auto scroll-smooth pr-0.5 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700"
                style={{ scrollbarWidth: "thin" }}
            >
                {items.map((item) => (
                    <button
                        key={item}
                        type="button"
                        data-value={item}
                        onClick={() => onSelect(item)}
                        className={cn(
                            "w-10 h-8 rounded-md text-sm font-medium transition-colors flex items-center justify-center",
                            selected === item
                                ? "bg-primary text-white"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                    >
                        {pad(item)}
                    </button>
                ))}
            </div>
        </div>
    );
};

// ── TimePicker ───────────────────────────────────────────────────────────────

interface TimePickerProps {
    value?: string;          // "HH:MM"
    onChange?: (val: string) => void;
    placeholder?: string;
    className?: string;
}

export const TimePicker = ({
    value,
    onChange,
    placeholder = "Select time",
    className,
}: TimePickerProps) => {
    const [open, setOpen] = React.useState(false);
    const { hours, minutes } = parseTime(value);

    const hours24 = Array.from({ length: 24 }, (_, i) => i);
    const mins60 = Array.from({ length: 60 }, (_, i) => i);

    const handleHour = (h: number) => onChange?.(formatTime(h, minutes));
    const handleMinute = (m: number) => onChange?.(formatTime(hours, m));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "px-4 py-2 rounded-lg border border-[#E9E9E9] dark:border-[#334155] text-sm h-[50px]",
                        "flex items-center justify-between w-full",
                        "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                        "dark:bg-transparent dark:text-white",
                        !value && "text-gray-400 dark:text-gray-500",
                        className
                    )}
                >
                    <span>{value ? formatTime(hours, minutes) : placeholder}</span>
                    <Clock className="h-4 w-4 shrink-0 text-gray-400" />
                </button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-4" align="start">
                <div className="flex gap-3 items-start">
                    <ScrollColumn
                        label="Hour"
                        items={hours24}
                        selected={hours}
                        onSelect={handleHour}
                    />

                    <div className="flex items-center self-center text-lg font-semibold text-gray-500 pb-1">
                        :
                    </div>

                    <ScrollColumn
                        label="Min"
                        items={mins60}
                        selected={minutes}
                        onSelect={handleMinute}
                    />
                </div>

                {/* Current selection display */}
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Selected</span>
                    <span className="text-sm font-semibold text-primary dark:text-white tracking-widest">
                        {value ? formatTime(hours, minutes) : "--:--"}
                    </span>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default TimePicker;
