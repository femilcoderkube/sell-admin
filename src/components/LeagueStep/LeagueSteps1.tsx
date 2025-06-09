import React from "react";
import downarr from "../../assets/images/down_arr.svg";
import { League } from "../../app/types";

interface LeagueSteps1Props {
  formData: Partial<League>;
  onChange: (data: Partial<League>) => void;
}

export const LeagueSteps1: React.FC<LeagueSteps1Props> = ({
  formData,
  onChange,
}) => {
  return (
    <form className="max-w-[42.5rem] mx-auto genral_form-info mb-4">
      <h4 className="text-white mb-5 text-base font-medium text-center">
        General Information
      </h4>

      <div className="relative float-label-input custom-input mb-4">
        <input
          type="text"
          id="title"
          placeholder=" "
          value={formData.title || ""}
          onChange={(e) => onChange({ title: e.target.value })}
          className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
        />
        <label
          htmlFor="title"
          className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
        >
          League Title
        </label>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 custom-input mb-4">
          <label
            htmlFor="game"
            className="absolute top-3 left-0 translate-y-[-0.3rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
          >
            Game
          </label>
          <select
            id="game"
            value={formData.game || ""}
            onChange={(e) => onChange({ game: e.target.value })}
            className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
            style={{
              backgroundImage: `url(${downarr})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              backgroundSize: "16px 16px",
            }}
          >
            <option value="" disabled>
              Select the game
            </option>
            <option value="68401da5b0d3faf723887928">Call of Duty</option>
            <option value="rocket_league_id">Rocket League</option>
          </select>
        </div>
        <div className="relative flex-1 custom-input mb-4">
          <label
            htmlFor="platform"
            className="absolute top-3 left-0 translate-y-[-0.3rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
          >
            Platform
          </label>
          <select
            id="platform"
            value={formData.platform || ""}
            onChange={(e) => onChange({ platform: e.target.value })}
            className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
            style={{
              backgroundImage: `url(${downarr})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              backgroundSize: "16px 16px",
            }}
          >
            <option value="" disabled>
              Select platform
            </option>
            <option value="683ff9601cc1a0dadfd2996c">PlayStation 5</option>
            <option value="xbox_id">Xbox One</option>
          </select>
        </div>
      </div>

      <div className="relative flex-1 custom-input mb-4">
        <label
          htmlFor="format"
          className="absolute top-3 left-0 translate-y-[-0.3rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
        >
          Format
        </label>
        <select
          id="format"
          value={formData.format || ""}
          onChange={(e) => onChange({ format: e.target.value })}
          className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
          style={{
            backgroundImage: `url(${downarr})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            backgroundSize: "16px 16px",
          }}
        >
          <option value="" disabled>
            Select format
          </option>
          <option value="party queue">Party Queue</option>
          <option value="solo queue">Solo Queue</option>
          <option value="team queue">Team Queue</option>
        </select>
      </div>

      <div className="relative float-label-input custom-input mb-4">
        <input
          type="number"
          id="playersPerTeam"
          placeholder=" "
          value={formData.playersPerTeam || ""}
          onChange={(e) => onChange({ playersPerTeam: Number(e.target.value) })}
          className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
        />
        <label
          htmlFor="playersPerTeam"
          className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
        >
          Players Per Team
        </label>
      </div>
    </form>
  );
};
