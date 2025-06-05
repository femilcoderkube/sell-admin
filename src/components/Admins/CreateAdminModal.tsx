import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { CancelIcon } from "../ui";
import {
  createAdmin,
  fetchAccessModules,
} from "../../app/features/admins/newadminSlice";

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubModule {
  name: string;
  hasAccess: boolean;
}

interface Module {
  name: string;
  hasAccess: boolean;
  subModules?: SubModule[];
}

const CreateAdminModal: React.FC<CreateAdminModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const { accessModules, loading, error } = useSelector(
    (state: RootState) =>
      state.newadmin || { accessModules: [], loading: false, error: null }
  );

  console.log("accessModules", accessModules);

  const [formData, setFormData] = useState({
    userName: "",
    role: "admin",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    if (isOpen) {
      dispatch(
        fetchAccessModules({ email: "admin@gmail.com", password: "12345678" })
      );
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (accessModules && accessModules.length > 0) {
      setModules(
        accessModules.map((module) => ({
          name: module.key,
          hasAccess: module.hasAccess || false,
          subModules: module.subModules?.map((sub) => ({
            name: sub.key,
            hasAccess: sub.hasAccess || false,
          })),
        }))
      );
    }
  }, [accessModules]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModuleChange = (moduleName: string) => {
    setModules((prev) =>
      prev.map((module) =>
        module.name === moduleName
          ? {
              ...module,
              hasAccess: !module.hasAccess,
              subModules: module.subModules?.map((sub) => ({
                ...sub,
                hasAccess: !module.hasAccess ? false : sub.hasAccess,
              })),
            }
          : module
      )
    );
  };

  const handleSubModuleChange = (moduleName: string, subModuleName: string) => {
    setModules((prev) =>
      prev.map((module) =>
        module.name === moduleName
          ? {
              ...module,
              subModules: module.subModules?.map((sub) =>
                sub.name === subModuleName
                  ? { ...sub, hasAccess: !sub.hasAccess }
                  : sub
              ),
            }
          : module
      )
    );
  };

  const handleSubmit = () => {
    dispatch(
      createAdmin({
        ...formData,
        adminAccess: { modules },
      })
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 transition-opacity ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full mx-auto">
        <div className="relative bg-dark-blue rounded-lg shadow-sm dark:bg-gray-700">
          <div className="relative p-4 md:p-5 border-b rounded-t border-light-border">
            <h3 className="text-[1.5rem] font-semibold text-white text-center">
              Create New Admin
            </h3>
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 bg-transparent rounded-lg hover:opacity-50 duration-300 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onClose}
            >
              <CancelIcon />
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className="p-4 md:p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                placeholder="Username"
                className="w-full p-2 rounded bg-gray-800 text-white border border-light-border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full p-2 rounded bg-gray-800 text-white border border-light-border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full p-2 rounded bg-gray-800 text-white border border-light-border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full p-2 rounded bg-gray-800 text-white border border-light-border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {loading && (
              <p className="text-gray-400 text-[0.94rem]">Loading...</p>
            )}
            {error && <p className="text-red-600 text-[0.94rem]">{error}</p>}

            {!loading && !error && modules.length > 0 && (
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div
                    key={index}
                    className="border-b pb-4 border-light-border"
                  >
                    <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={module.hasAccess}
                          onChange={() => handleModuleChange(module.name)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                      <h3 className="text-[1.2rem] font-semibold text-white">
                        {accessModules.find((m) => m.key === module.name)
                          ?.nameEn || module.name}{" "}
                        (
                        {accessModules.find((m) => m.key === module.name)
                          ?.nameAr || module.name}
                        )
                      </h3>
                    </div>
                    {module.subModules && module.subModules.length > 0 && (
                      <div className="ml-4 mt-2">
                        <h4 className="text-[1rem] font-medium text-gray-400">
                          Submodules:
                        </h4>
                        <ul className="list-disc ml-6 text-gray-400 text-[0.94rem]">
                          {module.subModules.map((subModule, subIndex) => (
                            <li
                              key={subIndex}
                              className="flex items-center gap-2"
                            >
                              <label className="relative inline-flex items-center cursor-pointer mb-1">
                                <input
                                  type="checkbox"
                                  checked={subModule.hasAccess}
                                  onChange={() =>
                                    handleSubModuleChange(
                                      module.name,
                                      subModule.name
                                    )
                                  }
                                  disabled={!module.hasAccess}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all disabled:opacity-50"></div>
                              </label>
                              {accessModules
                                .find((m) => m.key === module.name)
                                ?.subModules?.find(
                                  (s) => s.key === subModule.name
                                )?.nameEn || subModule.name}{" "}
                              (
                              {accessModules
                                .find((m) => m.key === module.name)
                                ?.subModules?.find(
                                  (s) => s.key === subModule.name
                                )?.nameAr || subModule.name}
                              )
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && modules.length === 0 && (
              <p className="text-gray-400 text-[0.94rem]">
                No access modules available
              </p>
            )}
          </div>

          <div className="flex items-center p-4 md:p-5 border-t border-light-border rounded-b gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-700 w-full text-white hover:opacity-[0.75] font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] duration-300 focus:outline-none"
            >
              Create
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

export default CreateAdminModal;
