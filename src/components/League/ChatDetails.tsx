import React, { useEffect, useState } from "react";
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Search,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeagueMatchesByID,
  updateLeagueMatchesByID,
} from "../../app/features/league/leagueSlice";
import { RootState } from "../../app/store";
import MatchDetails from "./MatcheDetails";
import { baseURL } from "../../axios";

// Define the Message interface
interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isAdmin: boolean;
  avatar: string;
}
interface TeamScoreDetails {
  yourScore: number;
  opponentScore: number;
  description: string;
  attachment: string;
  submittedAt: string;
}
const ChatDetails: React.FC = () => {
  const { mid } = useParams<{ mid: string }>();
  const currentUser = "Admin"; // Example current user, replace with actual user data (e.g., from auth context)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { matcheDetail, loading, error } = useSelector(
    (state: RootState) => state.leagues
  ) as {
    matcheDetail: MatchDetails | null;
    loading: boolean;
    error: string | null;
  };

  const [editingTeam1, setEditingTeam1] = useState(false);
  const [editingTeam2, setEditingTeam2] = useState(false);

  const [team1Scores, setTeam1Scores] = useState<Partial<TeamScoreDetails>>({
    yourScore: 0,
    opponentScore: 0,
    description: "",
    attachment: "",
    submittedAt: "",
  });
  const [team2Scores, setTeam2Scores] = useState<Partial<TeamScoreDetails>>({
    yourScore: 0,
    opponentScore: 0,
    description: "",
    attachment: "",
    submittedAt: "",
  });
  useEffect(() => {
    if (mid) {
      dispatch(fetchLeagueMatchesByID({ matcheId: mid }));
    }
  }, [dispatch, mid]);

  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "John Doe",
      content: "Hey, I have an issue with my match result. Can you help me?",
      timestamp: "2:30 PM",
      isAdmin: false,
      avatar: "JD",
    },
    {
      id: 2,
      sender: "Admin",
      content:
        "Hello! I'd be happy to help you with your match result issue. Can you please provide more details about what happened?",
      timestamp: "2:32 PM",
      isAdmin: true,
      avatar: "A",
    },
    {
      id: 3,
      sender: "John Doe",
      content:
        "The match ended but the result shows as incomplete. We finished the game and I have screenshots as proof.",
      timestamp: "2:35 PM",
      isAdmin: false,
      avatar: "JD",
    },
    {
      id: 4,
      sender: "Admin",
      content:
        "Thank you for providing that information. Screenshots would be very helpful. Please share them and I'll review your case immediately.",
      timestamp: "2:37 PM",
      isAdmin: true,
      avatar: "A",
    },
    {
      id: 5,
      sender: "John Doe",
      content:
        "Perfect! I'll upload the screenshots now. Thanks for the quick response!",
      timestamp: "2:40 PM",
      isAdmin: false,
      avatar: "JD",
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: currentUser,
        content: message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isAdmin: true,
        avatar: "A",
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSaveTeam1 = () => {
    if (mid) {
      dispatch(
        updateLeagueMatchesByID({
          matcheId: mid,
          team1ScoreDetails: {
            ...team1Scores,
            submittedAt: new Date().toISOString(),
          } as TeamScoreDetails,
          // team1ScoreDetails: {
          //   ...team1Scores,
          //   submittedAt: team1Scores?.submittedAt || new Date().toISOString(),
          // } as TeamScoreDetails,
          team2ScoreDetails:
            matcheDetail?.team2ScoreDetails || ({} as TeamScoreDetails),
        })
      ).then((result) => {
        if (updateLeagueMatchesByID.fulfilled.match(result)) {
          setEditingTeam1(false);
          dispatch(fetchLeagueMatchesByID({ matcheId: mid }));
        }
      });
    }
  };

  const handleSaveTeam2 = () => {
    if (mid) {
      dispatch(
        updateLeagueMatchesByID({
          matcheId: mid,
          team1ScoreDetails:
            matcheDetail?.team1ScoreDetails || ({} as TeamScoreDetails),
          // team2ScoreDetails: {
          //   ...team2Scores,
          //   submittedAt: team2Scores?.submittedAt || new Date().toISOString(),
          // } as TeamScoreDetails,
          team2ScoreDetails: {
            ...team2Scores,
            submittedAt: new Date().toISOString(),
          } as TeamScoreDetails,
        })
      ).then((result) => {
        if (updateLeagueMatchesByID.fulfilled.match(result)) {
          setEditingTeam2(false);
          dispatch(fetchLeagueMatchesByID({ matcheId: mid }));
        }
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header - Improved with better spacing and visual hierarchy */}
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-xl border border-gray-600/30 rounded-2xl mb-6 shadow-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  className="p-3 hover:bg-gray-700/60 rounded-xl transition-all duration-300 hover:scale-105 group"
                  onClick={handleBack}
                >
                  <svg
                    className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 px-4 py-2 bg-gray-700/40 rounded-xl border border-gray-600/30">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-300 font-medium">
                      Ticket #{mid}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Chat Messages - Enhanced layout */}
          <div className="xl:col-span-2">
            <div className="bg-gradient-to-b from-gray-800/60 to-gray-800/40 backdrop-blur-xl border border-gray-600/30 rounded-2xl shadow-2xl overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-gray-700/60 to-gray-600/60 p-4 border-b border-gray-600/30">
                <h3 className="text-white font-semibold text-lg">
                  Support Chat
                </h3>
              </div>

              {/* Messages Container */}
              <div
                className="p-6 overflow-y-auto"
                style={{ height: "500px", scrollbarWidth: "thin" }}
              >
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-4 ${
                        msg.isAdmin ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!msg.isAdmin && (
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">
                          {msg.avatar}
                        </div>
                      )}
                      <div
                        className={`max-w-lg ${
                          msg.isAdmin ? "order-first" : ""
                        }`}
                      >
                        <div
                          className={`p-4 rounded-2xl shadow-lg backdrop-blur-sm ${
                            msg.isAdmin
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-auto border border-blue-500/30"
                              : "bg-gray-700/60 text-white border border-gray-600/40"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">
                            {msg.content}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-2 mt-2 text-xs text-gray-400 ${
                            msg.isAdmin ? "justify-end" : "justify-start"
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {msg.isAdmin && (
                            <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      {msg.isAdmin && (
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">
                          {msg.avatar}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Input - Enhanced design */}
              <div className="p-6 border-t border-gray-600/30 bg-gradient-to-r from-gray-700/40 to-gray-600/40">
                <div className="flex items-end gap-4">
                  <button className="p-3 hover:bg-gray-600/50 rounded-xl transition-all duration-300 text-gray-300 hover:text-white flex-shrink-0 hover:scale-105">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                  </button>

                  <div className="flex-1 relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="w-full bg-gray-800/60 border border-gray-600/40 rounded-xl px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
                      rows={1}
                      style={{ minHeight: "48px" }}
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-600/50 rounded-lg transition-all duration-300 text-gray-300 hover:text-white">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"
                        />
                      </svg>
                    </button>
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex-shrink-0 hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>

                {/* Quick Actions - Improved layout */}
                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-600/30">
                  <button className="px-4 py-2 bg-gray-700/60 hover:bg-gray-600/70 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-300 border border-gray-600/30 hover:border-gray-500/50 hover:scale-105">
                    Match Issue
                  </button>
                  <button className="px-4 py-2 bg-gray-700/60 hover:bg-gray-600/70 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-300 border border-gray-600/30 hover:border-gray-500/50 hover:scale-105">
                    Payment Query
                  </button>
                  <button className="px-4 py-2 bg-gray-700/60 hover:bg-gray-600/70 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-300 border border-gray-600/30 hover:border-gray-500/50 hover:scale-105">
                    Technical Support
                  </button>
                  <button className="px-4 py-2 bg-green-600/30 hover:bg-green-600/40 text-green-400 hover:text-green-300 rounded-lg text-sm font-medium transition-all duration-300 border border-green-500/40 hover:border-green-400/60 hover:scale-105">
                    Close Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Teams Section - Enhanced design */}
          <div className="space-y-8">
            {/* Team 1 */}
            <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/50 border border-gray-600/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="bg-gradient-to-r from-[#46A2FF]/20 to-transparent p-6 border-b border-gray-600/30">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-xl text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#46A2FF] to-[#3b8ce6] rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      1
                    </div>
                    Team 1
                  </h3>
                  <div className="flex gap-2">
                    {editingTeam1 ? (
                      <>
                        <button
                          onClick={handleSaveTeam1}
                          className="py-2 px-4 bg-gradient-to-r from-[#46A2FF] to-[#3b8ce6] text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium text-sm shadow-blue-500/25"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTeam1(false)}
                          className="py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium text-sm shadow-red-500/25"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      matcheDetail?.status === "in_dispute" && (
                        <button
                          onClick={() => setEditingTeam1(true)}
                          className="py-2 px-4 bg-gradient-to-r from-[#46A2FF] to-[#3b8ce6] text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium text-sm shadow-blue-500/25"
                        >
                          Edit
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Scores Section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-gray-300 font-semibold flex items-center gap-2 text-lg">
                    <span className="text-[#46A2FF] text-xl">🏆</span>
                    Match Scores
                  </h4>
                </div>

                {editingTeam1 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block font-medium">
                          Your Score
                        </label>
                        <input
                          type="number"
                          value={team1Scores?.yourScore}
                          onChange={(e) =>
                            setTeam1Scores({
                              ...team1Scores,
                              yourScore: Number(e.target.value),
                            })
                          }
                          className="w-full py-3 px-4 bg-gray-900/70 text-white rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-[#46A2FF] focus:border-transparent transition-all duration-300 font-bold text-center text-lg backdrop-blur-sm"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block font-medium">
                          Opponent Score
                        </label>
                        <input
                          type="number"
                          value={team1Scores?.opponentScore}
                          onChange={(e) =>
                            setTeam1Scores({
                              ...team1Scores,
                              opponentScore: Number(e.target.value),
                            })
                          }
                          className="w-full py-3 px-4 bg-gray-900/70 text-white rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-[#46A2FF] focus:border-transparent transition-all duration-300 font-bold text-center text-lg backdrop-blur-sm"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-6 rounded-xl border border-gray-600/40 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-6 mb-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#46A2FF] mb-2">
                          {team1Scores?.yourScore || 0}
                        </div>
                        <div className="text-sm text-gray-400 font-medium">
                          Your Score
                        </div>
                      </div>
                      <div className="text-gray-500 text-3xl font-bold">VS</div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#46A2FF] mb-2">
                          {team1Scores?.opponentScore || 0}
                        </div>
                        <div className="text-sm text-gray-400 font-medium">
                          Opponent
                        </div>
                      </div>
                    </div>
                    {team1Scores?.description && (
                      <div className="mt-4 p-4 bg-gray-800/60 rounded-lg border border-gray-600/30">
                        <p className="text-gray-300 text-sm">
                          <span className="font-semibold text-[#46A2FF]">
                            Note:
                          </span>{" "}
                          {team1Scores?.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Team 2 - Similar enhancements */}
            <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/50 border border-gray-600/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="bg-gradient-to-r from-orange-500/20 to-transparent p-6 border-b border-gray-600/30">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-xl text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      2
                    </div>
                    Team 2
                  </h3>
                  <div className="flex gap-2">
                    {editingTeam2 ? (
                      <>
                        <button
                          onClick={handleSaveTeam2}
                          className="py-2 px-4 bg-gradient-to-r from-[#46A2FF] to-[#3b8ce6] text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium text-sm shadow-blue-500/25"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTeam2(false)}
                          className="py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium text-sm shadow-red-500/25"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      matcheDetail?.status === "in_dispute" && (
                        <button
                          onClick={() => setEditingTeam2(true)}
                          className="py-2 px-4 bg-gradient-to-r from-[#46A2FF] to-[#3b8ce6] text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium text-sm shadow-blue-500/25"
                        >
                          Edit
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Scores */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-gray-300 font-semibold flex items-center gap-2 text-lg">
                    <span className="text-orange-500 text-xl">🏆</span>
                    Match Scores
                  </h4>
                </div>

                {editingTeam2 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block font-medium">
                          Your Score
                        </label>
                        <input
                          type="number"
                          value={team2Scores?.yourScore}
                          onChange={(e) =>
                            setTeam2Scores({
                              ...team2Scores,
                              yourScore: Number(e.target.value),
                            })
                          }
                          className="w-full py-3 px-4 bg-gray-900/70 text-white rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 font-bold text-center text-lg backdrop-blur-sm"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block font-medium">
                          Opponent Score
                        </label>
                        <input
                          type="number"
                          value={team2Scores?.opponentScore}
                          onChange={(e) =>
                            setTeam2Scores({
                              ...team2Scores,
                              opponentScore: Number(e.target.value),
                            })
                          }
                          className="w-full py-3 px-4 bg-gray-900/70 text-white rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 font-bold text-center text-lg backdrop-blur-sm"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-6 rounded-xl border border-gray-600/40 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-6 mb-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-500 mb-2">
                          {team2Scores?.yourScore || 0}
                        </div>
                        <div className="text-sm text-gray-400 font-medium">
                          Your Score
                        </div>
                      </div>
                      <div className="text-gray-500 text-3xl font-bold">VS</div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-500 mb-2">
                          {team2Scores?.opponentScore || 0}
                        </div>
                        <div className="text-sm text-gray-400 font-medium">
                          Opponent
                        </div>
                      </div>
                    </div>
                    {team2Scores?.description && (
                      <div className="mt-4 p-4 bg-gray-800/60 rounded-lg border border-gray-600/30">
                        <p className="text-gray-300 text-sm">
                          <span className="font-semibold text-orange-500">
                            Note:
                          </span>{" "}
                          {team2Scores?.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDetails;
