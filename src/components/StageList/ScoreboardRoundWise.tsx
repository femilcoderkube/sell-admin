import React from "react";
import topArrow from "../../assets/images/nf_top-arrow.svg";
import downArrow from "../../assets/images/nf_bottom-arrow.svg";
const ScoreboardRoundWise = ({
  localScores,
  setLocalScores,
  scoreSettings,
}: any) => {
  // Function to calculate total points
  const calculateTotalPoints = (placement: any, kills: any) => {
    if (!scoreSettings) return 0;

    // Calculate Kill Score
    const killScore = kills * (scoreSettings.killPoints || 0);

    // Calculate Placement Score
    let placementScore = 0;
    if (scoreSettings.placePoints && Array.isArray(scoreSettings.placePoints)) {
      const matchedPlacement = scoreSettings.placePoints.find(
        (point: any) => point.position === placement
      );
      placementScore = matchedPlacement ? matchedPlacement.point : 0;
    }

    return placementScore + killScore;
  };

  // Handle input change for placement or kills
  const handleInputChange = (index: any, field: any, value: any) => {
    // Prevent negative values
    const sanitizedValue = Math.max(0, parseInt(value) || 0);

    setLocalScores((prevScores: any) =>
      prevScores.map((score: any, i: any) =>
        i === index
          ? {
              ...score,
              placePoints:
                field === "placement" ? sanitizedValue : score.placePoints,
              killPoints: field === "kills" ? sanitizedValue : score.killPoints,
              totalPoints: calculateTotalPoints(
                field === "placement" ? sanitizedValue : score.placePoints,
                field === "kills" ? sanitizedValue : score.killPoints
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
              [field === "placement" ? "placePoints" : "killPoints"]:
                (field === "placement" ? score.placePoints : score.killPoints) +
                1,
              totalPoints: calculateTotalPoints(
                field === "placement"
                  ? score.placePoints + 1
                  : score.placePoints,
                field === "kills" ? score.killPoints + 1 : score.killPoints
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
              [field === "placement" ? "placePoints" : "killPoints"]: Math.max(
                0,
                (field === "placement" ? score.placePoints : score.killPoints) -
                  1
              ),
              totalPoints: calculateTotalPoints(
                field === "placement"
                  ? Math.max(0, score.placePoints - 1)
                  : score.placePoints,
                field === "kills"
                  ? Math.max(0, score.killPoints - 1)
                  : score.killPoints
              ),
            }
          : score
      )
    );
  };

  // Group scores by stageRound.roundName and then by stageGroup.name
  const groupedScores = localScores.reduce(
    (acc: any, score: any, index: any) => {
      const roundName = score.stageRound.roundName;
      const groupName = score.stageGroup.name;

      if (!acc[roundName]) {
        acc[roundName] = {};
      }
      if (!acc[roundName][groupName]) {
        acc[roundName][groupName] = [];
      }
      acc[roundName][groupName].push({ ...score, originalIndex: index });
      return acc;
    },
    {}
  );

  return (
    <div>
      {Object.keys(groupedScores).map((roundName) => (
        <div key={roundName} className="round-section  mb-12">
          <h1 className="text-3xl font-bold mb-6 text-white">{roundName}</h1>
          {Object.keys(groupedScores[roundName]).map((groupName) => (
            <div key={groupName} className="group-section mb-8 pl-4">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                {groupName}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 grid-cols-1 items-center mt-5 gap-3 mb-3">
                {groupedScores[roundName][groupName].map((val: any) => (
                  <div
                    key={val.originalIndex}
                    className="nf_manage-wrap flex justify-between nf_battel-score nf_battel bg-gray-100 p-4 mb-2 rounded-lg"
                  >
                    <div className="nf_manage-content">
                      <div className="nf_manage-num flex items-center">
                        <h4 className="player-number text-lg font-semibold mr-4">
                          {val.originalIndex + 1}
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
                              className="form-control placement_point w-16 p-1 border rounded"
                              value={val?.placePoints || 0}
                              onChange={(e) =>
                                handleInputChange(
                                  val.originalIndex,
                                  "placement",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              min="0"
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
                              value={val?.killPoints || 0}
                              onChange={(e) =>
                                handleInputChange(
                                  val.originalIndex,
                                  "kills",
                                  (e.target.value) || 0
                                )
                              }
                              min="0"
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
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ScoreboardRoundWise;
