import React from "react";
import downarr from "../../assets/images/down_arr.svg";
import Select from "react-select";
import { colourOptions } from "../ui/Select2_data.tsx";
import { League } from "../../app/types.ts";

interface LeagueSteps2Props {
  formData: Partial<League>;
  onChange: (data: Partial<League>) => void;
}

export const LeagueSteps2: React.FC<LeagueSteps2Props> = ({
  formData,
  onChange,
}) => {
  return (
    <form className="max-w-[42.5rem] mx-auto genral_form-info mb-4">
      <h4 className="text-white mb-5 text-base font-medium text-center">
        About The League
      </h4>

      <div className="relative flex-1 custom-input mb-4">
        <label
          htmlFor="partner"
          className="absolute top-3 left-0 translate-y-[-0.3rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
        >
          Partner
        </label>
        <select
          id="partner"
          value={formData.partner || ""}
          onChange={(e) => onChange({ partner: e.target.value })}
          className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
          style={{
            backgroundImage: `url(${downarr})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            backgroundSize: "16px 16px",
          }}
        >
          <option value="" disabled>
            Select the partner
          </option>
          {/* Replace with actual partner options from API */}
          <option value="67beee39d8e2dae54da310c5">Partner A</option>
        </select>
      </div>

      <div className="relative float-label-input custom-input mb-4">
        <label
          htmlFor="about"
          className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
        >
          About League
        </label>
        <textarea
          id="about"
          value={formData.about || ""}
          onChange={(e) => onChange({ about: e.target.value })}
          className="block border-0 w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
          placeholder=""
          rows={4}
        />
      </div>

      <div className="custom_select2">
        <label
          htmlFor="tags"
          className="mb-1 relative text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent pr-3 text-custom-gray"
        >
          League tags
        </label>
        <Select
          isMulti
          name="tags"
          options={colourOptions}
          value={colourOptions.filter((option) =>
            formData.tags?.includes(option.value)
          )}
          onChange={(selected) =>
            onChange({ tags: selected.map((opt) => opt.value) })
          }
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </div>
    </form>
  );
};
