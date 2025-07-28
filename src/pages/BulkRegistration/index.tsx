import { FC, useState } from "react";
import { Layout } from "../../components/layout";
import { Link, useNavigate } from "react-router-dom";
import { AsyncPaginate } from "react-select-async-paginate";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { fetchEligibleParticipants } from "../../app/features/tournament/tournamentSlice";
import { bulkJoinTournament } from "../../app/features/tournament/bulkJoinSlice";

interface OptionType {
  value: string; // Team ID
  label: string; // Team name or display text
}

interface BulkRegistrationProps {
  title: string;
  tournamentId?: string; // Optional prop if not using useParams
}

export const BulkRegistration: FC<BulkRegistrationProps> = ({ title }) => {
  const navigate = useNavigate();
  const tournamentId = window.location.pathname.split("/")[3];
  const effectiveTournamentId = tournamentId;
  const dispatch = useDispatch<AppDispatch>();
  const { eligibleParticipantsLoading, eligibleParticipantsError } =
    useSelector((state: RootState) => state.tournaments);
  const [selectedTeams, setSelectedTeams] = useState<OptionType[]>([]);

  // Function to load options for AsyncPaginate
  const loadOptions = async (search: string, loadedOptions: OptionType[]) => {
    try {
      if (!effectiveTournamentId) {
        throw new Error("Tournament ID is missing");
      }
      const response = await dispatch(
        fetchEligibleParticipants({
          tournamentId: effectiveTournamentId,
        })
      ).unwrap();

      console.log("response", response);

      // Map response to options
      let options: OptionType[] = response.map((team: any) => ({
        value: team.username, // Adjust based on API response (e.g., team.id)
        label: team.username,
      }));

      // Filter options based on search term (client-side)
      if (search) {
        options = options.filter((option) =>
          option.label.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Limit to 100 options
      options = options.slice(0, 100);

      return {
        options,
      };
    } catch (error) {
      console.error("Error loading options:", error);
      return {
        options: [],
      };
    }
  };

  // Handle selection change
  const handleChange = (selectedOptions: OptionType[]) => {
    setSelectedTeams(selectedOptions);
  };

  // Handle bulk join submission
  const handleSubmit = async () => {
    if (!effectiveTournamentId) {
      alert("Tournament ID is missing");
      return;
    }
    if (selectedTeams.length === 0) {
      alert("Please select at least one team");
      return;
    }
    try {
      const payload = {
        tournament: effectiveTournamentId,
        participants: selectedTeams.map((team) => ({ team: team.value })),
      };
      await dispatch(bulkJoinTournament(payload)).unwrap();
      setSelectedTeams([]); // Clear selection after success
      navigate(-1); // Navigate back after successful submission
    } catch (error) {
      console.error("Error submitting teams:", error);
      // Error toast is handled in the bulkJoinTournament thunk
    }
  };

  // Handle back navigation
  const btnBack = () => {
    navigate(-1);
  };

  return (
    <Layout>
      <div className="nf_legue_head--con gap-4 flex-col lg:flex-row flex-wrap flex items-center pt-3 pb-[2rem] border-b border-light-border">
        <Link
          to={""}
          className="flex items-center gap-2 hover:opacity-[0.75] duration-300 text-white font-base lg:text-[1.26rem] py-2"
          onClick={btnBack}
        >
          <span>
            <svg
              width="1.26rem"
              height="1.26rem"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.125 3.75L6.875 10L13.125 16.25"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          Back
        </Link>
        <div className="legue__head_left-con">
          <h3 className="font-bold text-[1.25rem] text-white">{title}</h3>
        </div>
      </div>
      <div className="py-4">
        <label className="text-white font-medium text-[1rem] mb-2 block">
          Select Eligible Teams
        </label>
        <AsyncPaginate
          value={selectedTeams}
          onChange={handleChange}
          loadOptions={loadOptions}
          isMulti // Enable multi-select
          placeholder="Search and select teams..."
          isLoading={eligibleParticipantsLoading}
          isSearchable={true}
          debounceTimeout={300}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: "40px",
              backgroundColor: "#1a1a1a", // Match dark theme
              borderColor: eligibleParticipantsError ? "red" : "#4a4a4a",
              color: "white",
            }),
            menu: (base) => ({
              ...base,
              zIndex: 9999,
              backgroundColor: "#1a1a1a",
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: "#2a2a2a",
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: "white",
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: "white",
              ":hover": {
                backgroundColor: "#ff4d4d",
                color: "white",
              },
            }),
            input: (base) => ({
              ...base,
              color: "white",
            }),
            placeholder: (base) => ({
              ...base,
              color: "#a0a0a0",
            }),
            singleValue: (base) => ({
              ...base,
              color: "white",
            }),
          }}
        />
        {eligibleParticipantsError && (
          <p className="text-red-500 text-sm mt-2">
            {eligibleParticipantsError}
          </p>
        )}
        <div className="mt-4">
          <h4 className="text-white font-medium text-[1rem] mb-2">
            Selected Teams:
          </h4>
          {selectedTeams.length > 0 ? (
            <ul className="list-disc pl-5 text-white">
              {selectedTeams.map((team) => (
                <li key={team.value}>{team.label}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No teams selected</p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={eligibleParticipantsLoading || !selectedTeams.length}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Add Selected Teams
        </button>
      </div>
    </Layout>
  );
};