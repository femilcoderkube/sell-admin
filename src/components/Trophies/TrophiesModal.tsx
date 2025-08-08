import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  addTrophie,
  updateTrophie,
  fetchTrophies,
} from "../../app/features/trophies/trophiesSlice";
import { addTrophieSchema } from "../../validation";
import { TrophieType, BadgeNameType } from "../../app/types";
import { CancelIcon } from "../ui";

interface TrophiesModalProps {
  show: boolean;
  onClose: () => void;
  selectedTrophie: TrophieType | null;
  badges: BadgeNameType[];
}

const TrophiesModal: React.FC<TrophiesModalProps> = ({
  show,
  onClose,
  selectedTrophie,
  badges,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const formik = useFormik({
    initialValues: {
      BadgeID: "",
      position: 1,
      points: 0,
      prize: "",
    },
    validationSchema: addTrophieSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        BadgeID: values.BadgeID,
        position: values.position,
        points: values.points,
        prize: values.prize,
      };
      if (selectedTrophie) {
        const result = await dispatch(
          updateTrophie({ id: selectedTrophie._id, trophie: payload })
        );
        if (updateTrophie.fulfilled.match(result)) {
          resetForm();
          onClose();
          dispatch(fetchTrophies({ page: 1, perPage: 10, searchTerm: "" }));
        }
      } else {
        const result = await dispatch(addTrophie(payload));
        if (addTrophie.fulfilled.match(result)) {
          resetForm();
          onClose();
          dispatch(fetchTrophies({ page: 1, perPage: 10, searchTerm: "" }));
        }
      }
    },
  });

  useEffect(() => {
    if (selectedTrophie) {
      formik.setValues({
        BadgeID:
          typeof selectedTrophie.BadgeID === "string"
            ? selectedTrophie.BadgeID
            : selectedTrophie.BadgeID._id,
        position: selectedTrophie.position,
        points: selectedTrophie.points,
        prize: selectedTrophie.prize,
      });
    } else {
      formik.resetForm();
    }
    // eslint-disable-next-line
  }, [selectedTrophie]);

  // Handle pasted or programmatic input
  const handlePrizeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Allow only digits
    formik.setFieldValue(e, value); // Update Formik state
  };

  const handlePointInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .replace(/[^0-9.]/g, "") // Allow digits and decimal point
      .replace(/(\..*)\./g, "$1"); // Allow only one decimal point
    formik.setFieldValue("points", value); // Update Formik state
  };

  const handlePointKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      ".", // Allow decimal point
    ];
    if (
      allowedKeys.includes(e.key) ||
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase())) ||
      // Allow only digits (0-9), block minus sign
      (/^\d$/.test(e.key) && e.key !== "-")
    ) {
      return;
    }
    e.preventDefault();
  };
  // Restrict prize input to digits only, block negative sign
  const handlePrizeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
    ];
    if (
      allowedKeys.includes(e.key) ||
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase())) ||
      // Allow only digits (0-9), block minus sign
      (/^\d$/.test(e.key) && e.key !== "-")
    ) {
      return;
    }
    e.preventDefault();
  };

  return (
    <div
      aria-hidden={!show}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 transition-opacity ${
        show ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="relative p-4 w-full max-w-lg max-h-full mx-auto"
      >
        <div className="relative bg-dark-blue rounded-lg shadow-sm">
          <div className="relative p-4 md:p-5 border-b rounded-t border-light-border">
            <h3 className="text-[1.5rem] font-semibold text-white text-center">
              {`${selectedTrophie ? "Update" : "Add"} Trophy`}
            </h3>
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 bg-transparent rounded-lg hover:opacity-50 duration-300 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={() => {
                formik.resetForm();
                onClose();
              }}
            >
              <CancelIcon />
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className="p-4 md:p-5 space-y-4">
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Badge <span className="text-red-500">*</span>
              </label>
              <select
                name="BadgeID"
                className="w-full text-[0.94rem] text-white focus:outline-0 bg-input-color rounded-[0.52rem] px-3 py-2"
                value={formik.values.BadgeID}
                onChange={formik.handleChange}
              >
                <option value="">Select Badge</option>
                {badges.map((badge) => (
                  <option key={badge._id} value={badge._id}>
                    {badge.name}
                  </option>
                ))}
              </select>
              {formik.touched.BadgeID && formik.errors.BadgeID && (
                <p className="text-red-600 text-sm">{formik.errors.BadgeID}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full text-[0.94rem] text-white focus:outline-0 bg-input-color rounded-[0.52rem] px-3 py-2"
                {...formik.getFieldProps("position")}
                onKeyDown={handlePrizeKeyDown}
                onInput={handlePrizeInput}
              />
              {formik.touched.position && formik.errors.position && (
                <p className="text-red-600 text-sm">{formik.errors.position}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Points <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full text-[0.94rem] text-white focus:outline-0 bg-input-color rounded-[0.52rem] px-3 py-2"
                {...formik.getFieldProps("points")}
                onKeyDown={handlePointKeyDown}
                onInput={handlePointInput}
              />
              {formik.touched.points && formik.errors.points && (
                <p className="text-red-600 text-sm">{formik.errors.points}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Prize <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full text-[0.94rem] text-white focus:outline-0 bg-input-color rounded-[0.52rem] px-3 py-2"
                {...formik.getFieldProps("prize")}
                onKeyDown={handlePrizeKeyDown}
                onInput={handlePrizeInput}
              />
              {formik.touched.prize && formik.errors.prize && (
                <p className="text-red-600 text-sm">{formik.errors.prize}</p>
              )}
            </div>
          </div>

          <div className="flex items-center p-4 md:p-5 border-t border-light-border rounded-b">
            <button
              type="button"
              onClick={() => {
                formik.resetForm();
                onClose();
              }}
              className="bg-gray-gradient w-1/2 text-white font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 duration-300 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary-gradient w-1/2 text-white font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 focus:outline-none"
            >
              {`${selectedTrophie ? "Update" : "Add"} Trophie`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TrophiesModal;
