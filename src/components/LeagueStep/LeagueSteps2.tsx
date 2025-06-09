import React from "react";
import downarr from "../../assets/images/down_arr.svg";
import deleteIcon from "../../assets/images/trash_can.svg";
import { League } from "../../app/types";

interface LeagueSteps2Props {
  formData: Partial<League>;
  onChange: (data: Partial<League>) => void;
}

export const LeagueSteps2: React.FC<LeagueSteps2Props> = ({
  formData,
  onChange,
}) => {
  const addSchedule = () => {
    const newSchedule = {
      days: [],
      times: [],
    };
    onChange({
      queueSettings: {
        ...formData.queueSettings,
        schedule: newSchedule,
      },
    });
  };

  const updateScheduleDay = (day: string) => {
    const currentDays = formData.queueSettings?.schedule?.days || [];
    const updatedDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    onChange({
      queueSettings: {
        ...formData.queueSettings,
        schedule: {
          ...formData.queueSettings?.schedule,
          days: updatedDays,
        },
      },
    });
  };

  const updateScheduleTime = (index: number, time: string) => {
    const currentTimes = formData.queueSettings?.schedule?.times || [];
    const updatedTimes = [...currentTimes];
    updatedTimes[index] = time;
    onChange({
      queueSettings: {
        ...formData.queueSettings,
        schedule: {
          ...formData.queueSettings?.schedule,
          times: updatedTimes,
        },
      },
    });
  };

  const addTime = () => {
    const currentTimes = formData.queueSettings?.schedule?.times || [];
    onChange({
      queueSettings: {
        ...formData.queueSettings,
        schedule: {
          ...formData.queueSettings?.schedule,
          times: [...currentTimes, ""],
        },
      },
    });
  };

  const deleteTime = (index: number) => {
    const currentTimes = formData.queueSettings?.schedule?.times || [];
    onChange({
      queueSettings: {
        ...formData.queueSettings,
        schedule: {
          ...formData.queueSettings?.schedule,
          times: currentTimes.filter((_, i) => i !== index),
        },
      },
    });
  };

  return (
    <form className="max-w-[42.5rem] mx-auto genral_form-info mb-4">
      <h4 className="text-white mb-5 text-base font-medium text-center">
        League Settings
      </h4>

      <div className="check_setting flex items-center justify-between w-full text-[0.78125rem] text-custom-gray mb-4 focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.92rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal">
        <span className="text-white font-medium">Limit Matches Per Player</span>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.maxMatchesPerPlayer?.isActive || false}
            onChange={(e) =>
              onChange({
                maxMatchesPerPlayer: {
                  ...formData.maxMatchesPerPlayer,
                  isActive: e.target.checked,
                },
              })
            }
            className="sr-only peer"
          />
          <div className="relative w-9 h-5 bg-custom-gray focus:outline-none rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
        </label>
      </div>

      {formData.maxMatchesPerPlayer?.isActive && (
        <div className="relative float-label-input custom-input mb-4">
          <input
            type="number"
            id="maxMatches"
            placeholder=" "
            value={formData.maxMatchesPerPlayer?.maxMatches || ""}
            onChange={(e) =>
              onChange({
                maxMatchesPerPlayer: {
                  ...formData.maxMatchesPerPlayer,
                  maxMatches: Number(e.target.value),
                },
              })
            }
            className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
          />
          <label
            htmlFor="maxMatches"
            className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
          >
            Maximum Matches
          </label>
        </div>
      )}

      <div className="check_setting flex items-center justify-between w-full text-[0.78125rem] text-custom-gray mb-4 focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.92rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal">
        <span className="text-white font-medium">Always On Queue</span>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.queueSettings?.alwaysOn || false}
            onChange={(e) =>
              onChange({
                queueSettings: {
                  ...formData.queueSettings,
                  alwaysOn: e.target.checked,
                },
              })
            }
            className="sr-only peer"
          />
          <div className="relative w-9 h-5 bg-custom-gray focus:outline-none rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after-translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
        </label>
      </div>

      {!formData.queueSettings?.alwaysOn && (
        <div className="mb-4">
          <h5 className="text-white mb-2 text-base font-medium">
            Queue Schedule
          </h5>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <label
                key={day}
                className="inline-flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.queueSettings?.schedule?.days?.includes(
                    day
                  )}
                  onChange={() => updateScheduleDay(day)}
                  className="sr-only peer"
                />
                <div className="relative w-9 h-5 bg-custom-gray focus:outline-none rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
                <span className="ml-2 text-[0.78125rem] text-white">{day}</span>
              </label>
            ))}
          </div>
          {(formData.queueSettings?.schedule?.times || []).map(
            (time, index) => (
              <div key={index} className="relative flex items-center mb-2">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => updateScheduleTime(index, e.target.value)}
                  className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] py-[0.92rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
                />
                <button
                  type="button"
                  onClick={() => deleteTime(index)}
                  className="bg-gray-gradient absolute right-[-3.35rem] hover:opacity-80 p-[0.625rem] rounded-[0.52rem] duration-300"
                >
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    style={{ width: "1.25rem" }}
                  />
                </button>
              </div>
            )
          )}
          <button
            type="button"
            onClick={addTime}
            className="w-full py-[0.45rem] border bg-input-color bg-opacity-40 rounded-[ irresistibly dashed border-custom-gray border-opacity-40 text-custom-gray text-[0.78125rem] font-medium"
          >
            + Add Time
          </button>
        </div>
      )}

      <div className="relative float-label-input custom-input mb-4">
        <input
          type="number"
          id="qualifyingLine"
          placeholder=" "
          value={formData.qualifyingLine || ""}
          onChange={(e) => onChange({ qualifyingLine: Number(e.target.value) })}
          className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
        />
        <label
          htmlFor="qualifyingLine"
          className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
        >
          Qualifying Line
        </label>
      </div>
    </form>
  );
};
