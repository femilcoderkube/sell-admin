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
          id="nameEn"
          placeholder=" "
          value={formData.nameEn || ""}
          onChange={(e) => onChange({ nameEn: e.target.value })}
          className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
        />
        <label
          htmlFor="nameEn"
          className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
        >
          League Name in English
        </label>
      </div>

      <div className="relative float-label-input custom-input mb-4">
        <input
          type="text"
          id="nameAr"
          placeholder=" "
          value={formData.nameAr || ""}
          onChange={(e) => onChange({ nameAr: e.target.value })}
          className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
        />
        <label
          htmlFor="nameAr"
          className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
        >
          League Name in Arabic
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
            {/* Replace with actual game options from API */}
            <option value="67bedaeb4ea4d30ac2b6ae0b">Call of Duty</option>
            <option value="rocket_league_id">Rocket League</option>
          </select>
        </div>
        <div className="relative flex-1 custom-input mb-4">
          <label
            htmlFor="device"
            className="absolute top-3 left-0 translate-y-[-0.3rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
          >
            Device
          </label>
          <select
            id="device"
            value={formData.device || ""}
            onChange={(e) => onChange({ device: e.target.value })}
            className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
            style={{
              backgroundImage: `url(${downarr})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              backgroundSize: "16px 16px",
            }}
          >
            <option value="" disabled>
              Select device type
            </option>
            {/* Replace with actual device options from API */}
            <option value="67bdc8364550479a427392d3">PlayStation 5</option>
            <option value="xbox_id">Xbox One</option>
          </select>
        </div>
      </div>

      <ul className="grid w-full gap-3 md:grid-cols-2 leg_radio-btn mb-4 bg-input-color px-3 py-2 rounded-[0.52rem]">
        <li>
          <input
            type="radio"
            id="solo"
            name="isSolo"
            value="solo"
            checked={formData.isSolo === true}
            onChange={() => onChange({ isSolo: true })}
            className="hidden peer"
          />
          <label
            htmlFor="solo"
            className="inline-block text-center justify-between w-full p-3 text-gray-500 border-transperent rounded-[0.52rem] cursor-pointer dark:peer-checked:text-[#2792FF] peer-checked:border-blue-600 dark:peer-checked:border-blue-600 dark:text-gray-400"
          >
            <div className="block">
              <div className="w-full text-base font-medium leading-none">
                Solo
              </div>
            </div>
          </label>
        </li>
        <li>
          <input
            type="radio"
            id="team"
            name="isSolo"
            value="team"
            checked={formData.isSolo === false}
            onChange={() => onChange({ isSolo: false })}
            className="hidden peer"
          />
          <label
            htmlFor="team"
            className="inline-block text-center justify-between w-full p-3 text-gray-500 border-transperent rounded-[0.52rem] cursor-pointer dark:peer-checked:text-[#2792FF] peer-checked:border-blue-600 dark:peer-checked:border-blue-600 dark:text-gray-400"
          >
            <div className="block">
              <div className="w-full text-base font-medium leading-none">
                Team
              </div>
            </div>
          </label>
        </li>
      </ul>

      <div className="relative mb-4">
        <div className="float-label-input custom-input">
          <input
            type="number"
            id="totalPlayers"
            placeholder=" "
            value={formData.totalPlayers || ""}
            onChange={(e) => onChange({ totalPlayers: Number(e.target.value) })}
            disabled={formData.isEndlessPlayers}
            className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
          />
          <label
            htmlFor="totalPlayers"
            className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
          >
            Number of Participants
          </label>
        </div>
        <div
          className="flex mb-4 absolute top-[50%] right-2"
          style={{ transform: "translateY(-50%)" }}
        >
          <label className="inline-flex items-center w-full cursor-pointer">
            <span className="mr-3 text-[0.78125rem] text-custom-gray font-medium">
              Unlimited Number
            </span>
            <input
              type="checkbox"
              checked={formData.isEndlessPlayers || false}
              onChange={(e) => onChange({ isEndlessPlayers: e.target.checked })}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-custom-gray focus:outline-none rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
          </label>
        </div>
      </div>

      <div className="relative custom-input flex items-center mb-4">
        <div className="absolute border-r border-custom-gray pr-2 ps-3 pointer-events-none">
          <svg
            width="1.25rem"
            height="1.25rem"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9 4C9 3.44772 8.55229 3 8 3C7.44772 3 7 3.44772 7 4V5.00003C6.54097 5.00031 6.14075 5.00314 5.80498 5.03057C5.40963 5.06287 5.01641 5.13419 4.63803 5.32698C4.07355 5.6146 3.6146 6.07354 3.32698 6.63803C3.13419 7.01641 3.06287 7.40963 3.03057 7.80497C3.01363 8.01239 3.00607 8.2444 3.0027 8.49967C2.99906 8.77591 3.22407 9 3.50033 9H20.4997C20.7759 9 21.0009 8.77591 20.9973 8.49968C20.9939 8.2444 20.9864 8.01239 20.9694 7.80497C20.9371 7.40963 20.8658 7.01641 20.673 6.63803C20.3854 6.07354 19.9265 5.6146 19.362 5.32698C18.9836 5.13419 18.5904 5.06287 18.195 5.03057C17.8593 5.00314 17.459 5.00031 17 5.00003V4C17 3.44772 16.5523 3 16 3C15.4477 3 15 3.44772 15 4V5H9V4ZM21 11.5C21 11.2239 20.7761 11 20.5 11H3.5C3.22386 11 3 11.2239 3 11.5V16.8386C2.99998 17.3657 2.99997 17.8205 3.03057 18.195C3.06287 18.5904 3.13419 18.9836 3.32698 19.362C3.6146 19.9265 4.07355 20.3854 4.63803 20.673C5.01641 20.8658 5.40963 20.9371 5.80498 20.9694C6.17951 21 6.63438 21 7.16146 21H16.8387C17.3658 21 17.8205 21 18.195 20.9694C18.5904 20.9371 18.9836 20.8658 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C20.8658 18.9836 20.9371 18.5904 20.9694 18.195C21 17.8205 21 17.3657 21 16.8386L21 11.5Z"
              fill="#6B7897"
            />
          </svg>
        </div>
        <input
          id="endDate"
          type="date"
          value={formData.endDate || ""}
          onChange={(e) => onChange({ endDate: e.target.value })}
          className="text-white bg-input-color text-sm rounded-lg focus:outline-0 focus:!border focus:!border-[#2792FF] block w-full ps-12 p-3"
          placeholder="Ending Date"
        />
      </div>
    </form>
  );
};
