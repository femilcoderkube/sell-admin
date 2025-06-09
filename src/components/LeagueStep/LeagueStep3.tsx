import React from "react";
import FileUpload from "../ui/UploadFile.tsx";
import { League } from "../../app/types.ts";

interface LeagueSteps3Props {
  formData: Partial<League>;
  onChange: (data: Partial<League>) => void;
}

export const LeagueSteps3: React.FC<LeagueSteps3Props> = ({
  formData,
  onChange,
}) => {
  return (
    <form className="max-w-[42.5rem] mx-auto genral_form-info mb-4">
      <h4 className="text-white mb-5 text-base font-medium text-center">
        Media
      </h4>

      <FileUpload
        label="Card image (1920*1080)"
        id="hydraulicsImage"
        onChange={(file) => onChange({ hydraulicsImage: file })}
      />
      <FileUpload
        label="Header (1820*300)"
        id="mobileHeader"
        onChange={(file) => onChange({ mobileHeader: file })}
      />
      <FileUpload
        label="Logo (270*330)"
        id="bannerImage"
        onChange={(file) => onChange({ bannerImage: file })}
      />

      <div className="check_setting flex items-center justify-between w-full text-[0.78125rem] text-custom-gray mb-4 focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.92rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal">
        <span className="text-white font-medium">Banner Ad</span>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isFeatured || false}
            onChange={(e) => onChange({ isFeatured: e.target.checked })}
            className="sr-only peer"
          />
          <div className="relative w-9 h-5 bg-custom-gray focus:outline-none rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
        </label>
      </div>
      <div className="relative float-label-input custom-input mb-4">
        <input
          type="text"
          id="leagueBannerLink"
          placeholder="Banner link"
          value={formData.leagueBannerLink || ""}
          onChange={(e) => onChange({ leagueBannerLink: e.target.value })}
          className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.92rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
        />
      </div>
    </form>
  );
};
