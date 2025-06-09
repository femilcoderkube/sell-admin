import React from "react";
import deleteIcon from "../../assets/images/trash_can.svg";
import { League } from "../../app/types";

interface LeagueSteps3Props {
  formData: Partial<League>;
  onChange: (data: Partial<League>) => void;
}

export const LeagueSteps3: React.FC<LeagueSteps3Props> = ({
  formData,
  onChange,
}) => {
  const addTimeline = () => {
    const newTimeline = {
      title: "",
      description: "",
    };
    onChange({ timeLine: [...(formData.timeLine || []), newTimeline] });
  };

  const updateTimeline = (
    index: number,
    updatedTimeline: { title?: string; description?: string }
  ) => {
    const updatedTimelines = (formData.timeLine || []).map((timeline, i) =>
      i === index ? { ...timeline, ...updatedTimeline } : timeline
    );
    onChange({ timeLine: updatedTimelines });
  };

  const deleteTimeline = (index: number) => {
    onChange({
      timeLine: (formData.timeLine || []).filter((_, i) => i !== index),
    });
  };

  const addCustomField = () => {
    const newField = {
      fieldName: "",
      fieldType: "text",
      required: false,
    };
    onChange({
      customRegistrationFields: [
        ...(formData.customRegistrationFields || []),
        newField,
      ],
    });
  };

  const updateCustomField = (
    index: number,
    updatedField: { fieldName?: string; fieldType?: string; required?: boolean }
  ) => {
    const updatedFields = (formData.customRegistrationFields || []).map(
      (field, i) => (i === index ? { ...field, ...updatedField } : field)
    );
    onChange({ customRegistrationFields: updatedFields });
  };

  const deleteCustomField = (index: number) => {
    onChange({
      customRegistrationFields: (
        formData.customRegistrationFields || []
      ).filter((_, i) => i !== index),
    });
  };

  return (
    <form className="max-w-[42.5rem] mx-auto genral_form-info mb-4">
      <h4 className="text-white mb-5 text-base font-medium text-center">
        Timeline and Registration
      </h4>

      <div className="mb-4">
        <h5 className="text-white mb-2 text-base font-medium">Timeline</h5>
        {(formData.timeLine || []).map((timeline, index) => (
          <div
            key={index}
            className="mb-4 bg-input-color p-4 rounded-[0.52rem]"
          >
            <div className="flex justify-between items-center mb-2">
              <h6 className="text-white text-[0.78125rem] font-medium">
                Timeline #{index + 1}
              </h6>
              <button
                type="button"
                onClick={() => deleteTimeline(index)}
                className="bg-gray-gradient hover:opacity-80 p-[0.625rem] rounded-[0.52rem] duration-300"
              >
                <img
                  src={deleteIcon}
                  alt="Delete"
                  style={{ width: "1.25rem" }}
                />
              </button>
            </div>
            <div className="relative float-label-input custom-input mb-4">
              <input
                type="text"
                id={`timelineTitle-${index}`}
                placeholder=" "
                value={timeline.title || ""}
                onChange={(e) =>
                  updateTimeline(index, { title: e.target.value })
                }
                className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-[#2B3245] rounded-[0.52rem] px-3 block appearance-none leading-normal"
              />
              <label
                htmlFor={`timelineTitle-${index}`}
                className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0 78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
              >
                Title
              </label>
            </div>
            <div className="relative float-label-input custom-input">
              <input
                type="text"
                id={`timelineDescription-${index}`}
                placeholder=" "
                value={timeline.description || ""}
                onChange={(e) =>
                  updateTimeline(index, { description: e.target.value })
                }
                className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-[#2B3245] rounded-[0.52rem] px-3 block appearance-none leading-normal"
              />
              <label
                htmlFor={`timelineDescription-${index}`}
                className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
              >
                Description
              </label>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addTimeline}
          className="w-full py-[0.45rem] border bg-input-color bg-opacity-40 rounded-[0.52rem] border-dashed border-custom-gray border-opacity-40 text-custom-gray text-[0.78125rem] font-medium"
        >
          + Add Timeline Entry
        </button>
      </div>

      <div className="mb-4">
        <h5 className="text-white mb-2 text-base font-medium">
          Custom Registration Fields
        </h5>
        {(formData.customRegistrationFields || []).map((field, index) => (
          <div
            key={index}
            className="mb-4 bg-input-color p-4 rounded-[0.52rem]"
          >
            <div className="flex justify-between items-center mb-2">
              <h6 className="text-white text-[0.78125rem] font-medium">
                Field #{index + 1}
              </h6>
              <button
                type="button"
                onClick={() => deleteCustomField(index)}
                className="bg-gray-gradient hover:opacity-80 p-[0.625rem] rounded-[0.52rem] duration-300"
              >
                <img
                  src={deleteIcon}
                  alt="Delete"
                  style={{ width: "1.25rem" }}
                />
              </button>
            </div>
            <div className="relative float-label-input custom-input mb-4">
              <input
                type="text"
                id={`fieldName-${index}`}
                placeholder=" "
                value={field.fieldName || ""}
                onChange={(e) =>
                  updateCustomField(index, { fieldName: e.target.value })
                }
                className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-[#2B3245] rounded-[0.52rem] px-3 block appearance-none leading-normal"
              />
              <label
                htmlFor={`fieldName-${index}`}
                className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
              >
                Field Name
              </label>
            </div>
            <div className="relative flex-1 custom-input mb-4">
              <label
                htmlFor={`fieldType-${index}`}
                className="absolute top-3 left-0 translate-y-[-0.3rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
              >
                Field Type
              </label>
              <select
                id={`fieldType-${index}`}
                value={field.fieldType || ""}
                onChange={(e) =>
                  updateCustomField(index, { fieldType: e.target.value })
                }
                className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-[#2B3245] rounded-[0.52rem] px-3 block appearance-none leading-normal"
                style={{
                  backgroundImage: `url(${downarr})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                  backgroundSize: "16px 16px",
                }}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="select">Select</option>
              </select>
            </div>
            <div className="check_setting flex items-center justify-between w-full text-[0.78125rem] text-custom-gray focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.92rem] bg-[#2B3245] rounded-[0.52rem] px-3 block appearance-none leading-normal">
              <span className="text-white font-medium">Required</span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.required || false}
                  onChange={(e) =>
                    updateCustomField(index, { required: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="relative w-9 h-5 bg-custom-gray focus:outline-none rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after-translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
              </label>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addCustomField}
          className="w-full py-[0.45rem] border bg-input-color bg-opacity-40 rounded-[0.52rem] border-dashed border-custom-gray border-opacity-40 text-custom-gray text-[0.78125rem] font-medium"
        >
          + Add Custom Field
        </button>
      </div>
    </form>
  );
};
