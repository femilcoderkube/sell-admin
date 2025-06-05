import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { CancelIcon } from "../ui";
import { updateAdminAccess } from "../../app/features/admins/adminAccessSlice";
import { fetchAdmin } from "../../app/features/admins/adminSlice";

interface AdminAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminId: string;
}

interface Module {
  _id: string;
  nameEn: string;
  nameAr: string;
  hasAccess: boolean;
  subModules: SubModule[];
}

interface SubModule {
  _id: string;
  nameEn: string;
  nameAr: string;
  hasAccess: boolean;
}

export const AdminAccessModal: React.FC<AdminAccessModalProps> = ({
  isOpen,
  onClose,
  adminId,
}) => {
  const dispatch = useDispatch();
  const { modules, loading, error } = useSelector(
    (state: RootState) => state.adminAccess
  );

  const [editedModules, setEditedModules] = useState<Module[]>(modules);

  React.useEffect(() => {
    setEditedModules(modules);
  }, [modules]);

  const handleModuleChange = (moduleId: string) => {
    setEditedModules((prev) =>
      prev.map((module) =>
        module._id === moduleId
          ? {
              ...module,
              hasAccess: !module.hasAccess,
              subModules: module.subModules.map((sub) => ({
                ...sub,
                hasAccess: !module.hasAccess ? false : sub.hasAccess,
              })),
            }
          : module
      )
    );
  };

  const handleSubModuleChange = (moduleId: string, subModuleId: string) => {
    setEditedModules((prev) =>
      prev.map((module) =>
        module._id === moduleId
          ? {
              ...module,
              subModules: module.subModules.map((sub) =>
                sub._id === subModuleId
                  ? { ...sub, hasAccess: !sub.hasAccess }
                  : sub
              ),
            }
          : module
      )
    );
  };

  const handleSave = () => {
    console.log("editedModules", editedModules);
    dispatch(updateAdminAccess({ adminId, modules: editedModules }));
    setTimeout(() => {
      dispatch(fetchAdmin({ page: 1, perPage: 10, searchTerm: "" }));
    }, 1000);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="default-modal"
      aria-hidden={!isOpen}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 transition-opacity ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full mx-auto">
        <div className="relative bg-dark-blue rounded-lg shadow-sm dark:bg-gray-700">
          <div className="relative p-4 md:p-5 border-b rounded-t border-light-border">
            <h3 className="text-[1.5rem] font-semibold text-white text-center">
              Admin Access Details
            </h3>
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 bg-transparent rounded-lg hover:opacity-50 duration-300 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="default-modal"
              onClick={onClose}
            >
              <CancelIcon />
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className="p-4 md:p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            {loading && (
              <p className="text-gray-400 text-[0.94rem]">Loading...</p>
            )}
            {error && <p className="text-red-600 text-[0.94rem]">{error}</p>}

            {!loading && !error && editedModules.length > 0 && (
              <div className="space-y-4">
                {editedModules.map((module) => (
                  <div
                    key={module._id}
                    className="border-b pb-4 border-light-border"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={module.hasAccess}
                        onChange={() => handleModuleChange(module._id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <h3 className="text-[1.2rem] font-semibold text-white">
                        {module.nameEn} ({module.nameAr})
                      </h3>
                    </div>
                    {module.subModules.length > 0 && (
                      <div className="ml-4 mt-2">
                        <h4 className="text-[1rem] font-medium text-gray-400">
                          Submodules:
                        </h4>
                        <ul className="list-disc ml-6 text-gray-400 text-[0.94rem]">
                          {module.subModules.map((subModule) => (
                            <li
                              key={subModule._id}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                checked={subModule.hasAccess}
                                onChange={() =>
                                  handleSubModuleChange(
                                    module._id,
                                    subModule._id
                                  )
                                }
                                disabled={!module.hasAccess}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                              />
                              {subModule.nameEn} ({subModule.nameAr})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && editedModules.length === 0 && (
              <p className="text-gray-400 text-[0.94rem]">
                No access data available
              </p>
            )}
          </div>

          <div className="flex items-center p-4 md:p-5 border-t border-light-border rounded-b gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-700 w-full text-white hover:opacity-[0.75] font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] duration-300 focus:outline-none"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 w-full text-white hover:opacity-[0.75] font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] duration-300 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
