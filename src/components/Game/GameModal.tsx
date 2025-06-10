import React, { useEffect, useState } from "react";
import FileUpload from "../ui/UploadFile";
import { CancelIcon } from "../ui";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { useFormik } from "formik";
import { gameSchema } from "../../validation";
import {
  addGame,
  fetchGames,
  updateGame,
} from "../../app/features/games/gameSlice";
import { GameType } from "../../app/types";
import { baseURL } from "../../axios";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  selectedGame: GameType | null;
}

export const GameModal: React.FC<ModalProps> = ({
  show,
  onClose,
  selectedGame,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);
  const [logoFileName, setLogoFileName] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      name: selectedGame?.name || "",
      shortName: selectedGame?.shortName || "",
      logo: null as File | null,
      color: selectedGame?.color || "",
      logoUrl: selectedGame?.logo || "",
    },
    validationSchema: gameSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("shortName", values.shortName);
      if (values.logo) {
        formData.append("logo", values.logo);
      } else if (values.logoUrl && typeof values.logoUrl === 'string') {
        formData.append("logo", values.logoUrl);
      }
      formData.append("color", values.color);

      if (selectedGame) {
        const resultAction = await dispatch(
          updateGame({ id: selectedGame._id, device: formData })
        );
        resetForm();
        onClose();
        setLogoPreview(undefined);
        setLogoFileName("");
        if (updateGame.fulfilled.match(resultAction)) {
          dispatch(fetchGames({ page: 1, perPage: 10, searchTerm: "" }));
        }
      } else {
        const resultAction = await dispatch(addGame(formData));
        resetForm();
        onClose();
        setLogoPreview(undefined);
        setLogoFileName("");
        if (addGame.fulfilled.match(resultAction)) {
          dispatch(fetchGames({ page: 1, perPage: 10, searchTerm: "" }));
        }
      }
      resetForm();
      onClose();
    },
  });

  useEffect(() => {
    if (selectedGame?.logo) {
      if (typeof selectedGame.logo === 'string') {
        setLogoPreview(baseURL + "/api/v1/" + selectedGame.logo);
        const urlParts = selectedGame.logo.split('/');
        setLogoFileName(urlParts[urlParts.length - 1]);
      }
    } else {
      setLogoPreview(undefined);
      setLogoFileName("");
    }
  }, [selectedGame]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("logo", file);
      setLogoFileName(file.name);
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      formik.setFieldValue("logo", null);
      setLogoPreview(undefined);
      setLogoFileName("");
    }
  };

  return (
    <>
      <div
        id="default-modal"
        aria-hidden={!show}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 transition-opacity ${
          show ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <form
          onSubmit={formik.handleSubmit}
          className="relative p-4 w-full max-w-sm max-h-full mx-auto"
        >
          <div className="relative bg-dark-blue rounded-lg shadow-sm dark:bg-gray-700">
            <div className="relative p-4 md:p-5 border-b rounded-t border-light-border">
              <h3 className="text-[1.5rem] font-semibold text-white text-center">
                {`${selectedGame ? "Update" : "Add"} game`}
              </h3>
              <button
                type="button"
                className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 bg-transparent rounded-lg hover:opacity-50 duration-300 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="default-modal"
                onClick={() => {
                  formik.resetForm();
                  setLogoPreview(undefined);
                  setLogoFileName("");
                  onClose();
                }}
              >
                <CancelIcon />
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-4 md:p-5 space-y-4">
              <div className="relative float-label-input custom-input mb-4">
                <input
                  type="text"
                  id="name"
                  placeholder=" "
                  className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
                  {...formik.getFieldProps("name")}
                />
                <label
                  htmlFor="name"
                  className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                >
                  Game title
                </label>
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-600 !m-0 mt-1">{formik.errors.name as string}</p>
                )}
              </div>
              <div className="relative float-label-input custom-input mb-4">
                <input
                  type="text"
                  id="shortName"
                  placeholder=" "
                  className="w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
                  {...formik.getFieldProps("shortName")}
                />
                <label
                  htmlFor="shortName"
                  className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                >
                  Short name
                </label>
                {formik.touched.shortName && formik.errors.shortName && (
                  <p className="text-red-600 !m-0 mt-1">
                    {formik.errors.shortName as string}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-center gap-2 mb-4">
                <FileUpload
                  label="Game Logo"
                  id="head_img"
                  onChange={handleLogoChange}
                  fileName={logoFileName}
                  previewUrl={logoPreview}
                />
              </div>
              {formik.touched.logo && formik.errors.logo && (
                <p className="text-red-600 !m-0 mt-1">{formik.errors.logo as string}</p>
              )}

              <div className="relative float-label-input custom-input mb-4">
                <div className="flex items-center relative">
                  <input
                    type="color"
                    id="color"
                    className="w-0 h-0 opacity-0 absolute"
                    {...formik.getFieldProps("color")}
                    onChange={(e) => {
                      formik.setFieldValue("color", e.target.value);
                    }}
                  />
                  <input
                    type="text"
                    id="color-text"
                    placeholder=" "
                    className="w-full text-[0.94rem] text-white focus:outline-none focus:border focus:border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 pr-10 block appearance-none leading-normal"
                    {...formik.getFieldProps("color")}
                  />
                  <div
                    onClick={() => {
                      document.getElementById("color")?.click();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-sm border border-gray-300 cursor-pointer"
                    style={{ backgroundColor: formik.values.color }}
                  ></div>
                  <label
                    htmlFor="color-text"
                    className={`absolute left-3 transition-all duration-200 text-[0.94rem] font-bold text-custom-gray pointer-events-none
        ${
          formik.values.color
            ? "top-1 -translate-y-0.5 font-normal text-[13px]"
            : "focus:top-1 text-[13px]"
        }`}
                  >
                    Game Color
                  </label>
                </div>
                {formik.touched.color && formik.errors.color && (
                  <p className="text-red-600 !m-0 mt-1">
                    {formik.errors.color as string}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center p-4 md:p-5 border-t border-light-border rounded-b">
              <button
                type="button"
                onClick={() => {
                  formik.resetForm();
                  setLogoPreview(undefined);
                  setLogoFileName("");
                  onClose();
                }}
                className="bg-gray-gradient w-1/2 text-white bg-blue-700 hover:opacity-[0.75] font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 duration-300 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary-gradient w-1/2 text-white bg-blue-700 hover:opacity-[0.75] duration-300 font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 focus:outline-none"
              >
                {`${selectedGame ? "Update" : "Add"} game`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default GameModal;
