import { Field, ErrorMessage } from "formik";
import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Eye, EyeOff } from "lucide-react";
import { Calendar } from "@/shared/components/ui/calendar";
import { TimePicker } from "@/shared/components/ui/timePicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popOver";
import { cn } from "@/lib/utils";

interface BaseFormInputProps {
  label: string;
  name: string;
  placeholder?: string;
  className?: string;
  id?: number | string;
  value?: string;
  readOnly?: boolean;
  containerClassName?: string;
  autoComplete?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface TextFormInputProps extends BaseFormInputProps {
  type?: "text" | "email" | "password" | "number" | "date" | "time";
}

interface TextareaFormInputProps extends BaseFormInputProps {
  type: "textarea";
  rows?: number;
}

interface DateRangeFormInputProps extends BaseFormInputProps {
  type: "daterange";
}

type FormInputProps =
  | TextFormInputProps
  | TextareaFormInputProps
  | DateRangeFormInputProps;

// Shadcn date picker wired into Formik
const DatePickerField = ({
  name,
  placeholder,
  className,
}: {
  name: string;
  placeholder?: string;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Field name={name}>
      {({ field, form }: any) => {
        const selectedDate = field.value ? new Date(field.value) : undefined;

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
                  !selectedDate && "text-gray-400 dark:text-gray-500",
                  className
                )}
              >
                <span>
                  {selectedDate
                    ? format(selectedDate, "dd MMM yyyy")
                    : placeholder || "Select date"}
                </span>
                <CalendarIcon
                  className="h-4 w-4 shrink-0"
                  style={{ color: "var(--text-secondary)" }}
                />
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date: any) => {
                  // Store as YYYY-MM-DD string to match original input[type=date] format
                  form.setFieldValue(
                    name,
                    date ? format(date, "yyyy-MM-dd") : ""
                  );
                  setOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      }}
    </Field>
  );
};

// Shadcn time picker wired into Formik
const TimePickerField = ({
  name,
  placeholder,
  className,
}: {
  name: string;
  placeholder?: string;
  className?: string;
}) => {
  return (
    <Field name={name}>
      {({ field, form }: any) => (
        <TimePicker
          value={field.value || ""}
          onChange={(val) => form.setFieldValue(name, val)}
          placeholder={placeholder || "Select time"}
          className={className}
        />
      )}
    </Field>
  );
};

// Shadcn date range picker wired into Formik
const DateRangePickerField = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  return (
    <Field name={name}>
      {({ field, form }: any) => {
        const startDate = field.value?.[0] ? new Date(field.value[0]) : undefined;
        const endDate = field.value?.[1] ? new Date(field.value[1]) : undefined;

        return (
          <div className="flex items-center gap-2">
            {/* Start date */}
            <Popover open={startOpen} onOpenChange={setStartOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "px-4 py-2 rounded-lg border border-[#E9E9E9] dark:border-[#334155] text-sm h-[50px]",
                    "flex items-center justify-between gap-2 w-full",
                    "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                    "dark:bg-transparent dark:text-white",
                    !startDate && "text-gray-400 dark:text-gray-500",
                    className
                  )}
                >
                  <span>
                    {startDate ? format(startDate, "dd MMM yyyy") : "Start date"}
                  </span>
                  <CalendarIcon
                    className="h-4 w-4 shrink-0"
                    style={{ color: "var(--text-secondary)" }}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date: any) => {
                    const newValue = [
                      date ? format(date, "yyyy-MM-dd") : "",
                      field.value?.[1] || "",
                    ];
                    form.setFieldValue(name, newValue);
                    setStartOpen(false);
                  }}
                  disabled={(date: any) =>
                    endDate ? date > endDate : false
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <span
              className="flex items-center mx-1.5 text-sm font-medium whitespace-nowrap"
              style={{ color: "var(--text-primary)" }}
            >
              to
            </span>

            {/* End date */}
            <Popover open={endOpen} onOpenChange={setEndOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "px-4 py-2 rounded-lg border border-[#E9E9E9] dark:border-[#334155] text-sm h-[50px]",
                    "flex items-center justify-between gap-2 w-full",
                    "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                    "dark:bg-transparent dark:text-white",
                    !endDate && "text-gray-400 dark:text-gray-500",
                    className
                  )}
                >
                  <span>
                    {endDate ? format(endDate, "dd MMM yyyy") : "End date"}
                  </span>
                  <CalendarIcon
                    className="h-4 w-4 shrink-0"
                    style={{ color: "var(--text-secondary)" }}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date: any) => {
                    const newValue = [
                      field.value?.[0] || "",
                      date ? format(date, "yyyy-MM-dd") : "",
                    ];
                    form.setFieldValue(name, newValue);
                    setEndOpen(false);
                  }}
                  disabled={(date : any) =>
                    startDate ? date < startDate : false
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      }}
    </Field>
  );
};

// Main FormInput 
const FormInput = (props: FormInputProps): React.ReactNode => {
  const {
    id,
    label,
    name,
    placeholder,
    className = "",
    containerClassName = "",
    type = "text",
  } = props;
  const [showPassword, setShowPassword] = useState(false);

  const { readOnly, value, onChange, autoComplete } = props as BaseFormInputProps;

  const baseInputClass =
    "px-4 py-2 rounded-lg border border-[#E9E9E9] dark:border-[#334155] placeholder:text-sm text-sm h-[50px] bg-surface dark:text-white focus:outline-none focus:border-[#E9E9E9] dark:focus:border-[#334155] autofill:bg-white dark:autofill:bg-secondary autofill:shadow-[0_0_0_1000px_white_inset] dark:autofill:shadow-[0_0_0_1000px_#1E293B_inset] autofill:[-webkit-text-fill-color:black] dark:autofill:[-webkit-text-fill-color:white] autofill:bg-secondary-light";

  const renderField = () => {
    // ✅ Replaced native date input with shadcn Calendar + Popover
    if (type === "date") {
      return (
        <DatePickerField
          name={name}
          placeholder={placeholder}
          className={className}
        />
      );
    }

    // Shadcn time picker
    if (type === "time") {
      return (
        <TimePickerField
          name={name}
          placeholder={placeholder}
          className={className}
        />
      );
    }

    // Replaced native daterange inputs with shadcn Calendar + Popover
    if (type === "daterange") {
      return <DateRangePickerField name={name} className={className} />;
    }

    if (type === "textarea") {
      const { rows = 4 } = props as TextareaFormInputProps;
      return (
        <Field
          as="textarea"
          id={id}
          name={name}
          placeholder={placeholder}
          rows={rows}
          className={`${baseInputClass} resize-none ${className}`}
        // style={borderStyle}
        />
      );
    }

    if (type === "password") {
      return (
        <div className="relative">
          <Field
            id={id}
            name={name}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            readOnly={readOnly}
            autoComplete={autoComplete}
            {...(value !== undefined ? { value } : {})}
            {...(onChange ? { onChange } : {})}
            className={`${baseInputClass} w-full pr-10 ${className} ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      );
    }

    return (
      <Field
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        readOnly={readOnly}
        autoComplete={autoComplete}
        {...(value !== undefined ? { value } : {})}
        {...(onChange ? { onChange } : {})}
        className={`${baseInputClass} ${className} ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
      />
    );
  };

  return (
    <div className={`flex flex-col ${label ? 'gap-1' : ''} ${containerClassName}`}>
      {label ? <label className="text-primary font-medium text-sm dark:text-white">{label}</label> : null}
      {renderField()}
      <ErrorMessage name={name} component="div" className="text-error text-sm" />
    </div>
  );
};

export default FormInput;