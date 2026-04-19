// FormSelect.tsx
import { Field, ErrorMessage,  } from "formik";
import CustomSelect from "./CustomSelect";

const FormSelect = ({ 
  label, 
  name, 
  options, 
  placeholder, 
  className = "", 
  containerClassName = "",
  value, 
  onChange, 
  disabled 
}: any) => {
  const isControlled = value !== undefined && onChange !== undefined;

  // Consistent container class handling
  const finalContainerClass = containerClassName || className;

  // For Formik integration
  const FormikCustomSelect = ({ field, form }: any) => {
    return (
      <CustomSelect
        options={options}
        value={field.value}
        onChange={(val) => form.setFieldValue(name, val)}
        placeholder={placeholder}
        disabled={disabled}
        className={containerClassName ? className : ""}
      />
    );
  };

  if (isControlled) {
    return (
      <div className={`flex flex-col gap-1 ${finalContainerClass}`}>
        {label && <label className="text-sm text-primary font-medium dark:text-white">{label}</label>}
        <CustomSelect
          options={options}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={containerClassName ? className : ""}
        />
      </div>
    );
  }

  // Formik mode
  return (
    <div className={`flex flex-col gap-1 ${finalContainerClass} `}  >
      {label && <label className="text-sm text-primary font-medium dark:text-white">{label}</label>}
      
      <Field name={name} component={FormikCustomSelect} />

      <ErrorMessage
        name={name}
        component="div"
        className="text-sm text-error"
      />
    </div>
  );
};

export default FormSelect;