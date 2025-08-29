import React, { useEffect, useState } from "react";
import { GamesTable } from "./GamesTable";
import GameModal from "./GameModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import {
  deleteGame,
  fetchGames,
  setPage,
  setPerPage,
  setSearchTerm,
} from "../../app/features/games/gameSlice";
import { Pagination } from "../ui/Pagination";
import { GameType } from "../../app/types";
import { PlusIcon, SearchIcon } from "../ui";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";
import HandLogoLoader from "../Loader/Loader";

export * from "./GamesTable";

export const Game: React.FC = ({ title }: any) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [deleteId, setDeleteId] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const {
    games,
    loading,
    error,
    currentPage,
    perPage,
    totalCount,
    searchTerm,
  } = useSelector((state: RootState) => state.game);

  useEffect(() => {
    dispatch(fetchGames({ page: currentPage, perPage, searchTerm }));
  }, [dispatch, currentPage, perPage, searchTerm]);

  useEffect(() => {
    if (selectedGame) {
      setIsModalOpen(true);
    }
  }, [selectedGame]);

  useEffect(() => {
    if (deleteId) {
      setIsDeleteModalOpen(true);
    }
  }, [deleteId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handleDeleteGame = async () => {
    const resultAction = await dispatch(deleteGame(deleteId));
    if (deleteGame.fulfilled.match(resultAction)) {
      setDeleteId("");
      setIsDeleteModalOpen(false);
      dispatch(
        fetchGames({ page: 1, perPage: perPage, searchTerm: searchTerm })
      );
    }
  };

  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <>
      <div className="nf_legue_head--con bg-gradient-to-r from-slate-900/50 to-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-2xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div className="legue__head_left-con">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
              <h3 className="font-bold text-2xl lg:text-3xl text-white tracking-tight">
                {title}
                <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50">
                  ({totalCount})
                </span>
              </h3>
            </div>
          </div>
          <div className="lg:hidden">
            <div
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 w-full"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-1 bg-white/20 rounded-lg">
                  <PlusIcon />
                </div>
                <span>Add Game</span>
              </div>
            </div>
          </div>
        </div>
        <div className="legue__head_right-con flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <form action="" className="flex-1 max-w-md">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm"></div>
                <input
                  className="relative w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white placeholder-slate-400 rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 shadow-lg hover:bg-slate-700/50"
                  placeholder="Search Game"
                  type="text"
                  name="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors duration-200"
                  type="button"
                  name="searchbtn"
                  id="basic-addon2"
                >
                  <SearchIcon />
                </button>
              </div>
            </form>
          </div>
          <div className="hidden lg:block">
            <div
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 whitespace-nowrap"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-1 bg-white/20 rounded-lg">
                  <PlusIcon />
                </div>
                <span>Add Game</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <HandLogoLoader />
      ) : games.length > 0 ? (
        <GamesTable
          data={games}
          currentPage={currentPage}
          onEditClick={(game) => setSelectedGame(game)}
          onDeleteClick={(gameId) => setDeleteId(gameId)}
        />
      ) : (
        <div className="text-custom-gray flex items-center justify-center h-20">
          No games found.
        </div>
      )}

      <DeleteConfirmationModal
        show={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteId("");
        }}
        onDelete={handleDeleteGame}
      />

      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => handlePageChange(page)}
          onPagePrvious={() => handlePageChange(currentPage - 1)}
          onPageNext={() => handlePageChange(currentPage + 1)}
        />
      )}

      <GameModal
        show={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGame(null);
        }}
        selectedGame={selectedGame}
      />
    </>
  );
};
