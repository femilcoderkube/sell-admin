import { FC } from "react";
import asideLogo_ltr from "../assets/images/logo-lrt.svg";
import { useDispatch, useSelector } from "react-redux";
import { setConfirmationPopUp } from "../../app/slices/constState/constStateSlice";
import { logout } from "../../app/slices/auth/authSlice";
import { cancelMatch } from "../../app/socket/socket";
import { RootState, AppDispatch } from "../../app/store"; // adjust path as per your store setup

// ---- Types ----
interface PlayerData {
    username?: string;
    [key: string]: any;
}

interface ConfirmationPopUpProps {
    onPlayerSelect?: (data: {
        did: string;
        Playerdata: PlayerData;
    }) => void;
    did: string;
    setConfirmationPopUp: any;
    confirmationPopUp: any;
    selectedPlayerData?: any;
}

const ConfirmationPopUp: FC<ConfirmationPopUpProps> = ({
    onPlayerSelect,
    did,
    setConfirmationPopUp,
    confirmationPopUp,
    selectedPlayerData
}) => {

    const handleOnClick = () => {
        if (confirmationPopUp === 3) {
            setConfirmationPopUp(0);
            if (selectedPlayerData && onPlayerSelect) {
                onPlayerSelect({
                    did,
                    Playerdata: selectedPlayerData,
                });
            }
        }
    };

    const getConfirmationTitle = () => {
        if (confirmationPopUp === 3) return "Confirm Player Selection";
        return "";
    };

    const getConfirmationMessage = () => {
        if (confirmationPopUp === 3 && selectedPlayerData) {
            return `Are you sure you want to select  ${selectedPlayerData?.username || "this player"}?`;
        }
        return "";
    };

    const getCancelText = () => {
        if (confirmationPopUp === 3) {
            return "Cancel";
        }
    };

    const getConfirmText = () => {
        if (confirmationPopUp === 3) return "Select Player";
        return "";
    };

    if (confirmationPopUp === 0) return null;

    return (
        // <>
        //     <div
        //         className="fixed inset-0 popup-overlay transition-opacity submit__score--popup bg-gray-800"
        //         aria-hidden="true"
        //     ></div>

        //     <div className="fixed modal_popup-con inset-0 overflow-y-auto flex justify-center items-center z-50">
        //         <div className="popup-wrap inline-flex items-center justify-center h-[fit-content] relative sd_before before:bg-[#010221] before:w-full before:h-full before:blur-2xl before:opacity-60">
        //             <div className="match_reg--popup submit_score--popup popup_bg relative sd_before sd_after ">
        //                 <div className="popup_header px-8 pt-4 flex items-start ltr:justify-end mt-3 text-center sm:mt-0 sm:text-left rtl:justify-start rtl:text-right">
        //                     <div className="flex items-center gap-2 h-8 absolute left-1/2 translate-x-[-50%] top-10">
        //                         <img src={asideLogo_ltr} alt="rules_icon" className=" h-10" />
        //                     </div>
        //                     <button
        //                         type="button"
        //                         className="pt-2 cursor-pointer"
        //                         onClick={() => setConfirmationPopUp(0)}
        //                     >
        //                         <svg
        //                             width="1.125rem"
        //                             height="1.125rem"
        //                             viewBox="0 0 18 18"
        //                             fill="none"
        //                             xmlns="http://www.w3.org/2000/svg"
        //                         >
        //                             <path
        //                                 d="M1 17L17 1M17 17L1 1"
        //                                 stroke="#7B7ED0"
        //                                 strokeWidth="1.5"
        //                                 strokeLinecap="round"
        //                                 strokeLinejoin="round"
        //                             />
        //                         </svg>
        //                     </button>
        //                 </div>
        //                 <div className="popup_body px-8 flex flex-col items-center gap-4 pt-15 justify-center">
        //                     <h2 className="text-2xl font-bold mb-4 purple_col">
        //                         {getConfirmationTitle()}
        //                     </h2>

        //                     {confirmationPopUp === 3 && selectedPlayerData && (
        //                         <div className="mb-4 text-center">
        //                             <p className="text-lg text-gray-700 mb-3">
        //                                 {getConfirmationMessage()}
        //                             </p>
        //                         </div>
        //                     )}

        //                     <div className="flex gap-4 justify-center">
        //                         <div className="flex sd_uaser-menu ">
        //                             <div className="game_status_tab--wrap">
        //                                 <div>
        //                                     <button
        //                                         className="py-2 px-4 text-xl font-medium transition-all sd_after sd_before relative font_oswald hover:opacity-50 duration-300"
        //                                         style={{ width: "10rem", height: "4rem" }}
        //                                         onClick={(e) => {
        //                                             e.preventDefault();
        //                                             setConfirmationPopUp(0);
        //                                         }}
        //                                     >
        //                                         {getCancelText()}
        //                                     </button>
        //                                 </div>
        //                             </div>
        //                             <div className="game_status_tab--wrap">
        //                                 <div className="game_status--tab rounded-xl">
        //                                     <button
        //                                         className="py-2 px-4 text-xl font-medium transition-all sd_after sd_before relative font_oswald hover:opacity-50 duration-300 active-tab polygon_border"
        //                                         style={{ width: "10rem", height: "4rem" }}
        //                                         onClick={(e) => {
        //                                             e.preventDefault();
        //                                             setConfirmationPopUp(0);
        //                                             handleOnClick();
        //                                         }}
        //                                     >
        //                                         {getConfirmText()}
        //                                     </button>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>

        //             <svg
        //                 width="0"
        //                 height="0"
        //                 viewBox="0 0 480 416"
        //                 xmlns="http://www.w3.org/2000/svg"
        //                 style={{ position: "absolute" }}
        //             >
        //                 <defs>
        //                     <clipPath id="myClipPath" clipPathUnits="objectBoundingBox">
        //                         <path
        //                             transform="scale(0.00208333, 0.00240385)"
        //                             d="M480 100L464 116V188L480 204V368L440 408H228L220 416H40L8 384V304L0 296V24L16 0H480V100Z"
        //                         />
        //                     </clipPath>
        //                 </defs>
        //             </svg>
        //         </div>
        //     </div>
        // </>

        <>
            <div
                className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity z-40"
                aria-hidden="true"
            />

            <div className="fixed inset-0 overflow-y-auto flex justify-center items-center z-50">
                <div className="relative">
                    <div className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 backdrop-blur-xl rounded-2xl border border-slate-600/50 shadow-2xl max-w-md w-full mx-4 relative">

                        {/* Header with Logo and Close */}
                        <div className="px-8 pt-6 flex items-start justify-end relative">
                            <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 top-6">
                                <img src="/api/placeholder/40/40" alt="logo" className="h-10" />
                            </div>
                            <button
                                type="button"
                                className="pt-2 cursor-pointer hover:opacity-70 transition-opacity"
                                onClick={() => setConfirmationPopUp(0)}
                            >
                                <svg
                                    width="1.125rem"
                                    height="1.125rem"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M1 17L17 1M17 17L1 1"
                                        stroke="#7B7ED0"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-8 pb-8 flex flex-col items-center gap-4 pt-16">
                            <h2 className="text-2xl font-bold mb-4 text-purple-400">
                                {getConfirmationTitle()}
                            </h2>

                            {confirmationPopUp === 3 && selectedPlayerData && (
                                <div className="mb-4 text-center">
                                    <p className="text-lg text-slate-300 mb-3">
                                        {getConfirmationMessage()}
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-4 justify-center">
                                <div className="flex gap-2">
                                    <div>
                                        <button
                                            className="py-3 px-6 text-lg font-medium transition-all relative font-semibold hover:opacity-70 duration-300 bg-slate-700 hover:bg-slate-600 text-white rounded-xl border border-slate-600/50"
                                            style={{ width: "10rem", height: "4rem" }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setConfirmationPopUp(0);
                                            }}
                                        >
                                            {getCancelText()}
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            className="py-3 px-6 text-lg font-medium transition-all relative font-semibold hover:opacity-90 duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl shadow-lg"
                                            style={{ width: "10rem", height: "4rem" }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setConfirmationPopUp(0);
                                                handleOnClick();
                                            }}
                                        >
                                            {getConfirmText()}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmationPopUp;
