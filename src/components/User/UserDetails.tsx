import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserById } from "../../app/features/users/usersSlice";
import { RootState } from "../../app/store";
import HandLogoLoader from "../Loader/Loader";

const UserDetails: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, userDetail } = useSelector(
    (state: RootState) => state.users
  );

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return <HandLogoLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Error Loading User
          </h3>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!userDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No User Found
          </h3>
          <p className="text-gray-500">No user data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 mb-8 border border-gray-600/30">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <button
              onClick={() => navigate(-1)}
              className="self-start mb-4 md:mb-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 hover:bg-blue-500/40 transition-all duration-200 px-4 py-2 rounded-lg border border-blue-400/30 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              Back
            </button>
            <div className="flex-shrink-0 relative">
              {userDetail.profilePicture ? (
                <img
                  src={userDetail.profilePicture}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-blue-400/50 shadow-xl"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm flex items-center justify-center border-4 border-blue-400/50 shadow-xl">
                  <svg
                    className="w-14 h-14 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                {userDetail.firstName} {userDetail.lastName}
              </h1>
              <p className="text-xl text-gray-300 mb-3">
                @{userDetail.username}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                    userDetail.isBanned
                      ? "bg-red-500/20 text-red-300 border border-red-500/30"
                      : "bg-green-500/20 text-green-300 border border-green-500/30"
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full mr-2 shadow-sm ${
                      userDetail.isBanned ? "bg-red-400" : "bg-green-400"
                    }`}
                  ></span>
                  {userDetail.isBanned ? "Banned" : "Active"}
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-lg">
                  {userDetail.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-600/30">
              <h2 className="text-xl font-semibold mb-4 flex items-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                <svg
                  className="w-5 h-5 text-blue-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700/40 backdrop-blur-sm rounded-lg p-4 border border-gray-600/20">
                  <label className="text-sm font-medium text-gray-400 mb-2 block">
                    Email Address
                  </label>
                  <p className="text-gray-200 font-medium">
                    {userDetail.email}
                  </p>
                </div>
                <div className="bg-gray-700/40 backdrop-blur-sm rounded-lg p-4 border border-gray-600/20">
                  <label className="text-sm font-medium text-gray-400 mb-2 block">
                    Phone Number
                  </label>
                  <p className="text-gray-200 font-medium">
                    {userDetail.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-600/30">
              <h2 className="text-xl font-semibold mb-4 flex items-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                <svg
                  className="w-5 h-5 text-blue-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Personal Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700/40 backdrop-blur-sm rounded-lg p-4 border border-gray-600/20">
                  <label className="text-sm font-medium text-gray-400 mb-2 block">
                    Date of Birth
                  </label>
                  <p className="text-gray-200 font-medium">
                    {new Date(userDetail.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-700/40 backdrop-blur-sm rounded-lg p-4 border border-gray-600/20">
                  <label className="text-sm font-medium text-gray-400 mb-2 block">
                    Gender
                  </label>
                  <p className="text-gray-200 font-medium">
                    {userDetail.gender}
                  </p>
                </div>
                <div className="bg-gray-700/40 backdrop-blur-sm rounded-lg p-4 border border-gray-600/20 md:col-span-2">
                  <label className="text-sm font-medium text-gray-400 mb-2 block">
                    Nationality
                  </label>
                  <p className="text-gray-200 font-medium">
                    {userDetail.nationality}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-600/30">
              <h2 className="text-xl font-semibold mb-4 flex items-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                <svg
                  className="w-5 h-5 text-blue-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                  />
                </svg>
                Social Media
              </h2>
              {Object.keys(userDetail.socialMediaHandles).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(userDetail.socialMediaHandles).map(
                    ([platform, handle]) => (
                      <div
                        key={platform}
                        className="flex items-center p-4 bg-gray-700/40 backdrop-blur-sm rounded-lg border border-gray-600/20 hover:bg-gray-600/40 transition-all duration-200"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 border border-blue-400/30">
                          <span className="text-blue-300 font-bold text-sm">
                            {platform.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-400 capitalize">
                            {platform}
                          </p>
                          <p className="text-gray-200 font-medium">{handle}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="w-16 h-16 bg-gray-700/40 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                      />
                    </svg>
                  </div>
                  <p className="text-lg">No social media handles linked</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Activity */}
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-600/30">
              <h2 className="text-xl font-semibold mb-4 flex items-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                <svg
                  className="w-5 h-5 text-blue-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Activity
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 bg-gray-700/30 backdrop-blur-sm rounded-r-lg py-3">
                  <label className="text-sm font-medium text-gray-400 block mb-1">
                    Last Login
                  </label>
                  <p className="text-gray-200 text-sm font-medium">
                    {new Date(userDetail.lastLoginDate).toLocaleString()}
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 bg-gray-700/30 backdrop-blur-sm rounded-r-lg py-3">
                  <label className="text-sm font-medium text-gray-400 block mb-1">
                    Account Created
                  </label>
                  <p className="text-gray-200 text-sm font-medium">
                    {new Date(userDetail.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4 bg-gray-700/30 backdrop-blur-sm rounded-r-lg py-3">
                  <label className="text-sm font-medium text-gray-400 block mb-1">
                    Last Updated
                  </label>
                  <p className="text-gray-200 text-sm font-medium">
                    {new Date(userDetail.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Information */}
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-600/30">
              <h2 className="text-xl font-semibold mb-4 flex items-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                <svg
                  className="w-5 h-5 text-blue-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Technical Details
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-700/40 backdrop-blur-sm p-4 rounded-lg border border-gray-600/20">
                  <label className="text-sm font-medium text-gray-400 block mb-2">
                    IP Address
                  </label>
                  <p className="text-gray-200 font-mono text-sm bg-gray-800/50 px-3 py-2 rounded border border-gray-600/20">
                    {userDetail.ipAddress}
                  </p>
                </div>
                <div className="bg-gray-700/40 backdrop-blur-sm p-4 rounded-lg border border-gray-600/20">
                  <label className="text-sm font-medium text-gray-400 block mb-2">
                    Device Type
                  </label>
                  <p className="text-gray-200 text-sm bg-gray-800/50 px-3 py-2 rounded border border-gray-600/20">
                    {userDetail.deviceType}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
