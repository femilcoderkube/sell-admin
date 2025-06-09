import React from "react";
import downarr from "../../assets/images/down_arr.svg";
import Select from "react-select";
import { colourOptions } from "../ui/Select2_data.tsx";
import deleteIcon from "../../assets/images/trash_can.svg";
import { Link } from "react-router-dom";
import { League, Rule } from "../../app/types.ts";

interface LeagueSteps4Props {
  formData: Partial<League>;
  onChange: (data: Partial<League>) => void;
}

export const LeagueSteps4: React.FC<LeagueSteps4Props> = ({
  formData,
  onChange,
}) => {
  const addRule = () => {
    const newRule: Rule = {
      titleEn: "",
      titleAr: "",
      descriptionEn: "",
      descriptionAr: "",
    };
    onChange({ rules: [...(formData.rules || []), newRule] });
  };

  const updateRule = (index: number, updatedRule: Partial<Rule>) => {
    const updatedRules = (formData.rules || []).map((rule, i) =>
      i === index ? { ...rule, ...updatedRule } : rule
    );
    onChange({ rules: updatedRules });
  };

  const deleteRule = (index: number) => {
    onChange({ rules: (formData.rules || []).filter((_, i) => i !== index) });
  };

  return (
    <form className="max-w-[42.5rem] mx-auto genral_form-info mb-4">
      <h4 className="text-white mb-5 text-base font-medium text-center">
        Rules and regulations
      </h4>

      {(formData.rules || []).map((rule, index) => (
        <div key={index}>
          <h3 className="text-white mb-2 text-base font-medium text-left">
            Rule #{index + 1}
          </h3>
          <div className="custom_select2 mb-4 relative">
            <label
              htmlFor={`rule-${index}`}
              className="mb-1 relative text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent pr-3 text-custom-gray"
            >
              Select existing rule
            </label>
            <Select
              isMulti={false}
              name={`rule-${index}`}
              options={colourOptions}
              value={colourOptions.find((opt) => opt.value === rule.id) || null}
              onChange={(selected) =>
                updateRule(index, { id: selected?.value || "" })
              }
              className="basic-multi-select"
              classNamePrefix="select"
            />
            <button
              type="button"
              onClick={() => deleteRule(index)}
              className="bg-gray-gradient absolute top-[1.4rem] right-[-3.35rem] hover:opacity-80 p-[0.625rem] rounded-[0.52rem] duration-300"
            >
              <img src={deleteIcon} alt="Delete" style={{ width: "1.25rem" }} />
            </button>
          </div>

          <div className="inline-flex items-center justify-center w-full mb-5">
            <hr className="w-full h-px bg-custom-gray border-0 opacity-[0.4]" />
            <span className="absolute px-3 font-medium -translate-1/2 bg-primary-color text-custom-gray">
              or
            </span>
          </div>

          <div className="relative float-label-input custom-input mb-4">
            <input
              type="text"
              id={`titleEn-${index}`}
              placeholder=" "
              value={rule.titleEn || ""}
              onChange={(e) => updateRule(index, { titleEn: e.target.value })}
              className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
            />
            <label
              htmlFor={`titleEn-${index}`}
              className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
            >
              The title in English
            </label>
          </div>

          <div className="relative float-label-input custom-input mb-1">
            <input
              type="text"
              id={`titleAr-${index}`}
              placeholder="السؤال باللغة العربية"
              value={rule.titleAr || ""}
              onChange={(e) => updateRule(index, { titleAr: e.target.value })}
              className="block w-full border border-transparent text-[0.78125rem] text-white text-right focus:outline-0 focus:!border focus:!border-[#2792FF] placeholder:text-right py-[0.52rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
            />
          </div>

          <div className="inline-flex items-center justify-center w-full mb-4">
            <hr className="w-full h-px bg-custom-gray border-0 opacity-[0.4]" />
          </div>

          <div className="relative float-label-input custom-input mb-4">
            <label
              htmlFor={`descriptionEn-${index}`}
              className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
            >
              The description in English
            </label>
            <textarea
              id={`descriptionEn-${index}`}
              value={rule.descriptionEn || ""}
              onChange={(e) =>
                updateRule(index, { descriptionEn: e.target.value })
              }
              className="block w-full border-0 text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
              placeholder=""
              rows={2}
            />
          </div>

          <div className="relative float-label-input custom-input mb-4">
            <textarea
              id={`descriptionAr-${index}`}
              value={rule.descriptionAr || ""}
              onChange={(e) =>
                updateRule(index, { descriptionAr: e.target.value })
              }
              className="block w-full border-0 text-[0.78125rem] text-white text-right placeholder:text-right focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.92rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
              placeholder="الإجابة باللغة العربية"
              rows={2}
            />
          </div>
        </div>
      ))}

      <div className="relative mb-4">
        <div className="check_setting flex items-center justify-between w-full text-[0.78125rem] text-custom-gray focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.92rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal">
          <span className="text-white font-medium">Waiting list</span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.waitingList || false}
              onChange={(e) => onChange({ waitingList: e.target.checked })}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-custom-gray focus:outline-none rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after-translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
          </label>
        </div>
        <span className="block text-[0.78125rem] text-custom-gray mt-2">
          When checked, the system will only accepts teams with the minimum
          number of players in their roster excluding players in waiting list.
        </span>
      </div>

      <div className="relative mb-4">
        <div className="check_setting flex items-center justify-between w-full text-[0.78125rem] text-custom-gray focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.92rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal">
          <span className="text-white font-medium">Verified accounts</span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.verifiedAccounts || false}
              onChange={(e) => onChange({ verifiedAccounts: e.target.checked })}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-custom-gray focus:outline-none rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after-translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
          </label>
        </div>
        <span className="block text-[0.78125rem] text-custom-gray mt-2">
          When checked, the system will only accepts verified users.
        </span>
      </div>

      <div className="add_rule-btn">
        <button
          type="button"
          onClick={addRule}
          className="w-full py-[0.45rem] border bg-input-color bg-opacity-40 rounded-[0.52rem] border-dashed border-custom-gray border-opacity-40 text-custom-gray text-[0.78125rem] font-medium"
        >
          + Add new rule
        </button>
      </div>
    </form>
  );
};
