import React from "react";
import downarr from "../../assets/images/down_arr.svg";
import deleteIcon from "../../assets/images/trash_can.svg";
import FileUpload from "../ui/UploadFile";
import { League, Winner } from "../../app/types";

interface LeagueSteps5Props {
  formData: Partial<League>;
  onChange: (data: Partial<League>) => void;
}

export const LeagueSteps5: React.FC<LeagueSteps5Props> = ({
  formData,
  onChange,
}) => {
  const addWinner = () => {
    const newWinner: Winner = {
      badgeId: "",
      position: (formData.positions?.length || 0) + 1,
      points: 0,
      prize: "",
    };
    onChange({ positions: [...(formData.positions || []), newWinner] });
  };

  const updateWinner = (index: number, updatedWinner: Partial<Winner>) => {
    const updatedPositions = (formData.positions || []).map((winner, i) =>
      i === index ? { ...winner, ...updatedWinner } : winner
    );
    onChange({ positions: updatedPositions });
  };

  const deleteWinner = (index: number) => {
    onChange({
      positions: (formData.positions || []).filter((_, i) => i !== index),
    });
  };

  return (
    <form className="max-w-[42.5rem] mx-auto genral_form-info mb-4">
      <h4 className="text-white mb-5 text-base font-medium text-center">
        Rules and Prizes
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
          <option value="68466ecb6e8d3444d55e85f1">Partner A</option>
        </select>
      </div>

      <FileUpload
        label="Rules (PDF)"
        id="rules"
        onChange={(file) => onChange({ rules: file })}
        accept="application/pdf"
      />

      <div className="relative float-label-input custom-input mb-4">
        <input
          type="number"
          id="prizepool"
          placeholder=" "
          value={formData.prizepool || ""}
          onChange={(e) => onChange({ prizepool: Number(e.target.value) })}
          className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
        />
        <label
          htmlFor="prizepool"
          className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
        >
          Total Prizepool
        </label>
      </div>

      <div className="check_setting flex items-center justify-between w-full text-[0.78125rem] text-custom-gray mb-4 focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.92rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal">
        <span className="text-white font-medium">Waiting List</span>
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

      <div className="check_setting flex items-center justify-between w-full text-[0.78125rem] text-custom-gray mb-4 focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.92rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal">
        <span className="text-white font-medium">Verified Accounts</span>
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

      <div className="mb-4">
        <h5 className="text-white mb-2 text-base font-medium">
          Winners and Badges
        </h5>
        <div className="add_rule-btn mb-4">
          <button
            type="button"
            onClick={addWinner}
            className="w-full py-[0.45rem] border bg-input-color bg-opacity-40 rounded-[0.52rem] border-dashed border-custom-gray border-opacity-40 text-custom-gray text-[0.78125rem] font-medium"
          >
            + Add New Winner Option
          </button>
        </div>
        {(formData.positions || []).map((winner, index) => (
          <div
            key={index}
            className="edit_badges bg-input-color flex rounded-[0.625rem] mb-4"
          >
            <p className="text-white flex items-center justify-center px-2 border-r border-[#2B3245] text-[0.78125rem] w-10">
              #{index + 1}
            </p>
            <div className="edit_badges-form flex-1 py-4 px-4">
              <div className="relative mb-3">
                <label
                  htmlFor={`badgeId-${index}`}
                  className="mb-2 inline-block relative text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent pr-3 text-white"
                >
                  Badge
                </label>
                <select
                  id={`badgeId-${index}`}
                  value={winner.badgeId}
                  onChange={(e) =>
                    updateWinner(index, { badgeId: e.target.value })
                  }
                  className="block w-full text-[0.78125rem] text-custom-gray border border-transparent focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.425rem] bg-[#2B3245] rounded-[0.52rem] px-3 block appearance-none leading-normal"
                  style={{
                    backgroundImage: `url(${downarr})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 10px center",
                    backgroundSize: "16px 16px",
                  }}
                >
                  <option value="" disabled>
                    Select a badge
                  </option>
                  <option value="67bee22e30e869b069ac5b50">Badge 1</option>
                  <option value="67bee24830e869b069ac5b52">Badge 2</option>
                </select>
              </div>
              <div className="relative mb-4">
                <label
                  htmlFor={`points-${index}`}
                  className="mb-2 inline-block relative text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent pr-3 text-white"
                >
                  Points
                </label>
                <input
                  type="number"
                  id={`points-${index}`}
                  placeholder="Type the amount of points"
                  value={winner.points || ""}
                  onChange={(e) =>
                    updateWinner(index, { points: Number(e.target.value) })
                  }
                  className="block w-full text-white text-[0.78125rem] focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.425rem] border border-transparent bg-[#2B3245] rounded-[0.52rem] px-3 block appearance-none leading-normal"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor={`prize-${index}`}
                  className="mb-2 inline-block relative text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent pr-3 text-white"
                >
                  Prize
                </label>
                <input
                  type="text"
                  id={`prize-${index}`}
                  placeholder="Type the prize"
                  value={winner.prize || ""}
                  onChange={(e) =>
                    updateWinner(index, { prize: e.target.value })
                  }
                  className="block w-full text-white text-[0.78125rem] focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.425rem] border border-transparent bg-[#2B3245] rounded-[0.52rem] px-3 block appearance-none leading-normal"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => deleteWinner(index)}
              className="px-2 flex items-center justify-center w-10 hover:opacity-80 border-l border-[#2B3245] duration-300"
            >
              <img src={deleteIcon} alt="Delete" style={{ width: "1.25rem" }} />
            </button>
          </div>
        ))}
      </div>
    </form>
  );
};
