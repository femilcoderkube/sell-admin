import React from "react";
import topArrow from "../../assets/images/nf_top-arrow.svg";
import downArrow from "../../assets/images/nf_bottom-arrow.svg";
import { expandPositions } from "../../utils/constant";

const Scoreboard = ({ localScores, setLocalScores, scoreSettings }: any) => {
  // Function to calculate total points
  const calculateTotalPoints = (placement: any, kills: any) => {
    if (!scoreSettings) return 0;

    // Calculate Kill Points
    const killPoints = kills * (scoreSettings.killPoints || 0);

    // Calculate Placement Score
    const result = expandPositions(scoreSettings?.placePoints);
    let placementScore = 0;
    if (result && Array.isArray(result)) {
      const matchedPlacement = result.find(
        (point: any) => point.position === placement
      );
      placementScore = matchedPlacement ? matchedPlacement.point : 0;
    }

    return placementScore + killPoints;
  };

  // Calculate placePoints based on placement
  const calculatePlacePoints = (placement: any) => {
    if (!scoreSettings || !scoreSettings.placePoints) return 0;
    const result = expandPositions(scoreSettings.placePoints);
    if (result && Array.isArray(result)) {
      const matchedPlacement = result.find(
        (point: any) => point.position === placement
      );
      return matchedPlacement ? matchedPlacement.point : 0;
    }
    return 0;
  };

  // Calculate killPoints based on kills
  const calculateKillPoints = (kills: any) => {
    if (!scoreSettings || !scoreSettings.killPoints) return 0;
    return kills * (scoreSettings.killPoints || 0);
  };

  // Handle input change for placement or kills
  const handleInputChange = (index: any, field: any, value: any) => {
    setLocalScores((prevScores: any) =>
      prevScores.map((score: any, i: any) =>
        i === index
          ? {
              ...score,
              placement: field === "placement" ? value : score.placement,
              kills: field === "kills" ? value : score.kills,
              killPoints:
                field === "kills"
                  ? calculateKillPoints(value)
                  : score.killPoints,
              placePoints:
                field === "placement"
                  ? calculatePlacePoints(value)
                  : score.placePoints,
              totalPoints: calculateTotalPoints(
                field === "placement" ? value : score.placement,
                field === "kills" ? value : score.kills
              ),
            }
          : score
      )
    );
  };

  // Handle increment/decrement buttons
  const handleIncrement = (index: any, field: any) => {
    setLocalScores((prevScores: any) =>
      prevScores.map((score: any, i: any) =>
        i === index
          ? {
              ...score,
              [field === "placement" ? "placement" : "kills"]:
                (field === "placement" ? score.placement : score.kills) + 1,
              killPoints:
                field === "kills"
                  ? calculateKillPoints(score.kills + 1)
                  : score.killPoints,
              placePoints:
                field === "placement"
                  ? calculatePlacePoints(score.placement + 1)
                  : score.placePoints,
              totalPoints: calculateTotalPoints(
                field === "placement" ? score.placement + 1 : score.placement,
                field === "kills" ? score.kills + 1 : score.kills
              ),
            }
          : score
      )
    );
  };

  const handleDecrement = (index: any, field: any) => {
    setLocalScores((prevScores: any) =>
      prevScores.map((score: any, i: any) =>
        i === index
          ? {
              ...score,
              [field === "placement" ? "placement" : "kills"]: Math.max(
                0,
                (field === "placement" ? score.placement : score.kills) - 1
              ),
              killPoints:
                field === "kills"
                  ? calculateKillPoints(Math.max(0, score.kills - 1))
                  : score.killPoints,
              placePoints:
                field === "placement"
                  ? calculatePlacePoints(Math.max(0, score.placement - 1))
                  : score.placePoints,
              totalPoints: calculateTotalPoints(
                field === "placement"
                  ? Math.max(0, score.placement - 1)
                  : score.placement,
                field === "kills" ? Math.max(0, score.kills - 1) : score.kills
              ),
            }
          : score
      )
    );
  };

  // Group scores by stageGroup.name
  const groupedScores = localScores.reduce(
    (acc: any, score: any, index: any) => {
      const groupName = score.stageGroup.name;
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push({ ...score, originalIndex: index });
      return acc;
    },
    {}
  );

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-2 grid-cols-1 items-center mt-5 gap-3 mb-3">
      {Object.keys(groupedScores).map((groupName) => (
        <div key={groupName} className="group-section mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">{groupName}</h2>
          {groupedScores[groupName].map((val: any, index: any) => (
            <div
              key={val.originalIndex}
              className="nf_manage-wrap flex justify-between nf_battel-score nf_battel bg-gray-100 p-4 mb-2 rounded-lg"
            >
              <div className="nf_manage-content">
                <div className="nf_manage-num flex items-center">
                  <h4 className="player-number text-lg font-semibold mr-4">
                    {index + 1}
                  </h4>
                  <h5 className="player-name text-lg">
                    {val?.participant?.team?.teamName}
                  </h5>
                  <input
                    type="hidden"
                    className="player-sortname"
                    defaultValue="sr01"
                  />
                  <input
                    type="hidden"
                    className="user-id"
                    defaultValue={val?.userId || 1219}
                  />
                </div>
              </div>
              <div className="nf_manage-cont flex space-x-4">
                <div className="nf-cont-title">
                  <div className="nf-cont-wrap flex items-center justify-between">
                    <h6 className="text-sm font-medium">Placement</h6>
                    <button
                      type="button"
                      className="btn btn-nf-gray tr_up_placement p-1"
                      onClick={() =>
                        handleIncrement(val.originalIndex, "placement")
                      }
                    >
                      <img
                        className=""
                        height={10}
                        width={10}
                        src={topArrow}
                        alt="Increase"
                      />
                    </button>
                  </div>
                  <div className="nf-cont-wrap flex items-center justify-between">
                    <h6 className="placement">
                      <input
                        type="number"
                        min={0}
                        className="form-control placement_point w-16 p-1 border rounded"
                        value={val?.placement || 0}
                        onChange={(e) =>
                          handleInputChange(
                            val.originalIndex,
                            "placement",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </h6>
                    <button
                      type="button"
                      className="btn btn-nf-gray tr_down_placement p-1"
                      onClick={() =>
                        handleDecrement(val.originalIndex, "placement")
                      }
                    >
                      <img
                        className=""
                        height={10}
                        width={10}
                        src={downArrow}
                        alt="Decrease"
                      />
                    </button>
                  </div>
                </div>
                <div className="nf-cont-title">
                  <div className="nf-cont-wrap flex items-center justify-between">
                    <h6 className="text-sm font-medium">Kills</h6>
                    <button
                      type="button"
                      className="btn btn-nf-gray tr_up_kills p-1"
                      onClick={() =>
                        handleIncrement(val.originalIndex, "kills")
                      }
                    >
                      <img
                        className=""
                        height={10}
                        width={10}
                        src={topArrow}
                        alt="Increase"
                      />
                    </button>
                  </div>
                  <div className="nf-cont-wrap flex items-center justify-between">
                    <h6 className="kills">
                      <input
                        className="form-control kill_point w-16 p-1 border rounded"
                        type="number"
                        min={0}
                        value={val?.kills || 0}
                        onChange={(e) =>
                          handleInputChange(
                            val.originalIndex,
                            "kills",
                            (e.target.value) || 0
                          )
                        }
                      />
                    </h6>
                    <button
                      type="button"
                      className="btn btn-nf-gray tr_down_kills w-4 p-1"
                      onClick={() =>
                        handleDecrement(val.originalIndex, "kills")
                      }
                    >
                      <img
                        className=""
                        height={10}
                        width={10}
                        src={downArrow}
                        alt="Decrease"
                      />
                    </button>
                  </div>
                </div>
                <div className="nf-cont-title">
                  <div className="nf-cont-wrap flex items-center">
                    <h6 className="text-sm font-medium">Points</h6>
                  </div>
                  <div className="nf-cont-wrap flex items-center">
                    <h6 className="points">
                      <input
                        type="number"
                        className="form-control total_points w-16 p-1 border rounded bg-gray-200"
                        readOnly={true}
                        value={val?.totalPoints || 0}
                      />
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Scoreboard;
