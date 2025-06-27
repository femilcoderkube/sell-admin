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
      <div className="nf_legue_head--con gap-4 flex-col lg:flex-row flex-wrap flex justify-between items-center pt-3 pb-[2rem] border-b border-light-border">
        <div className="legue__head_left-con">
          <h3 className="font-bold text-[1.25rem] text-white">
            Games <span className="text-custom-gray">({games.length})</span>
          </h3>
        </div>
        <div className="legue__head_right-con flex-wrap flex gap-3 flex-1 justify-end">
          <form action="" className=" w-full sm:w-[20.8rem]">
            <div className="relative">
              <input
                className="text-white font-medium block  bg-input-color w-full sm:w-[20.8rem] text-gray-700 border rounded-[0.625rem] py-[0.6rem] pl-[2.5rem] pr-3 text-[1.0625rem] focus:outline-none border-0"
                placeholder="Search Game"
                type="text"
                name="search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button
                className="absolute left-[0.52rem] top-[0.6rem]"
                type="button"
                name="searchbtn"
                id="basic-addon2"
              >
                <SearchIcon />
              </button>
            </div>
          </form>
          <div
            className="bg-primary-gradient whitespace-nowrap sm:w-auto w-full font-medium flex hover:opacity-[0.85] duration-300 items-center gap-2 bg-[#46A2FF] hover:bg-blue-700 text-white font-base text-[1.0625rem] py-[0.6rem] px-4 rounded-[0.52rem]"
            onClick={() => setIsModalOpen(true)}
          >
            <span>
              <PlusIcon />
            </span>
            Add Game
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
