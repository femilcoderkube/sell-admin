// src/components/TimePickerField.tsx
import React from "react";
import DatePicker from "react-datepicker";
import { useFormikContext, getIn } from "formik";
import { format } from "date-fns";

// Import the CSS for the datepicker
import "react-datepicker/dist/react-datepicker.css";
// We will create this custom CSS file in the next step
import "./TimePicker.css"; 

interface TimePickerFieldProps {
  label: string;
  name: string;
}

export const TimePickerField: React.FC<TimePickerFieldProps> = ({
  label,
  name,
}) => {
  const { values, setFieldValue, touched, errors } = useFormikContext<any>();

  // Safely get nested values and errors using Formik's `getIn` helper
  const fieldValue = getIn(values, name);
  const touchValue = getIn(touched, name);
  const errorValue = getIn(errors, name);

  // react-datepicker works with Date objects, but we store time as a "HH:mm" string.
  // We need to convert back and forth.
  const selectedTime = fieldValue ? new Date(`1970-01-01T${fieldValue}`) : null;

  const handleTimeChange = (date: Date | null) => {
    if (date) {
      // Format the date back to a "HH:mm" string before setting the Formik value
      setFieldValue(name, format(date, "HH:mm"));
    } else {
      setFieldValue(name, "");
    }
  };

  // This is a custom input component that matches your form's styling.
  // react-datepicker will pass props like `value` and `onClick` to it.
  const CustomTimeInput = React.forwardRef<
    HTMLInputElement,
    { value?: string; onClick?: () => void }
  >(({ value, onClick }, ref) => (
    <input
      value={value}
      onClick={onClick}
      ref={ref}
      readOnly // Make it read-only to force using the picker
      placeholder=" " // Important for the floating label
      className={`block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.92rem] bg-input-color rounded-[0.52rem] px-3 appearance-none leading-normal cursor-pointer ${
        touchValue && errorValue ? "border border-red-500" : ""
      }`}
    />
  ));

  return (
    <div className="relative float-label-input custom-input">
       <label
          
          className=" top-2 left-0 font-bold text-[0.78125rem] bg-transparent px-3 text-custom-gray"
        >
          {label}
        </label>
      <DatePicker
        selected={selectedTime}

        onChange={handleTimeChange}
        customInput={<CustomTimeInput />}
        // Time picker specific props
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="h:mm aa" // e.g., "5:30 PM"
      />
      {/* <label
        htmlFor={name}
        className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
      >
       
      </label> */}
      {touchValue && errorValue && (
        <div className="text-red-500 text-[0.7rem] mt-1">{errorValue}</div>
      )}
    </div>
  );
};