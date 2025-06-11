import React, { useState, useEffect } from "react";
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

  const [editedModules, setEditedModules] = useState<Module[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (modules && modules.length > 0) {
      setEditedModules(modules);
      // Auto-expand modules that have access
      const expanded = new Set<string>();
      modules.forEach(module => {
        if (module.hasAccess) {
          expanded.add(module._id);
        }
      });
      setExpandedModules(expanded);
    }
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

    // Toggle expanded state
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
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

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    dispatch(updateAdminAccess({ adminId, modules: editedModules }));
    setTimeout(() => {
      dispatch(fetchAdmin({ page: 1, perPage: 10, searchTerm: "" }));
    }, 1000);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 transition-opacity ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="relative p-4 w-full max-w-4xl max-h-full mx-auto">
        <div className="relative bg-dark-blue rounded-lg shadow-sm dark:bg-gray-700">
          <div className="relative p-4 md:p-5 border-b rounded-t border-light-border">
            <h3 className="text-[1.5rem] font-semibold text-white text-center">
              Admin Access Details
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

          <div className="p-4 md:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-white mb-2">Admin Access Permissions</h4>
              <p className="text-gray-400 text-sm">
                Configure module access permissions for the admin. Click on modules to expand and configure submodule permissions.
              </p>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-400">Loading modules...</span>
              </div>
            )}
            
            {error && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {!loading && !error && editedModules.length > 0 && (
              <div className="space-y-3">
                {editedModules.map((module) => (
                  <div
                    key={module._id}
                    className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden transition-all duration-200 hover:border-gray-600"
                  >
                    {/* Module Header */}
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={module.hasAccess}
                              onChange={() => handleModuleChange(module._id)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all duration-200"></div>
                          </label>
                          <div>
                            <h3 className="text-lg font-medium text-white">
                              {module.nameEn}
                            </h3>
                            <p className="text-sm text-gray-400">{module.nameAr}</p>
                          </div>
                        </div>
                        
                        {module.subModules && module.subModules.length > 0 && (
                          <button
                            type="button"
                            onClick={() => toggleModuleExpansion(module._id)}
                            className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                          >
                            <svg
                              className={`w-5 h-5 transform transition-transform duration-200 ${
                                expandedModules.has(module._id) ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}
                      </div>
                      
                      {module.subModules && module.subModules.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          {module.subModules.filter(sub => sub.hasAccess).length} of {module.subModules.length} submodules enabled
                        </div>
                      )}
                    </div>

                    {/* Submodules */}
                    {module.subModules && 
                     module.subModules.length > 0 && 
                     expandedModules.has(module._id) && (
                      <div className="border-t border-gray-700 bg-gray-900/30">
                        <div className="p-4 space-y-3">
                          <h4 className="text-sm font-medium text-gray-300 mb-3">
                            Submodule Permissions
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {module.subModules.map((subModule) => (
                              <div
                                key={subModule._id}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                                  module.hasAccess 
                                    ? 'bg-gray-800 border-gray-600 hover:border-gray-500' 
                                    : 'bg-gray-800/50 border-gray-700 opacity-50'
                                }`}
                              >
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={subModule.hasAccess && module.hasAccess}
                                    onChange={() =>
                                      handleSubModuleChange(module._id, subModule._id)
                                    }
                                    disabled={!module.hasAccess}
                                    className="sr-only peer"
                                  />
                                  <div className="w-9 h-5 bg-gray-600 rounded-full peer peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all duration-200 peer-disabled:opacity-50"></div>
                                </label>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-white truncate">
                                    {subModule.nameEn}
                                  </p>
                                  <p className="text-xs text-gray-400 truncate">
                                    {subModule.nameAr}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && editedModules.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">📋</div>
                <p className="text-gray-400 text-lg">No access modules available</p>
                <p className="text-gray-500 text-sm mt-2">Contact your administrator to configure access modules.</p>
              </div>
            )}

            <div className="flex items-center p-4 md:p-5 border-t border-light-border rounded-b gap-3">
              <button
                type="button"
                onClick={handleSave}
                className="bg-gradient-to-r from-green-600 to-green-700 w-full text-white hover:from-green-700 hover:to-green-800 font-medium rounded-lg text-sm px-5 py-3 duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 w-full text-white hover:bg-gray-700 font-medium rounded-lg text-sm px-5 py-3 duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};