// import React from "react";
// import { Link } from "react-router";
// interface ModalProps {
//   show: boolean;
//   onClose: () => void;
// }
// export const ModalPopUp: React.FC<ModalProps> = ({ show, onClose }) => {
//   return (
//     <>
//       <div
//         id="default-modal"
//         aria-hidden={!show}
//         className={`fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 transition-opacity ${
//           show ? "opacity-100 visible" : "opacity-0 invisible"
//         }`}
//       >
//         <div className="relative p-4 w-full max-w-sm max-h-full mx-auto">
//           <div className="relative bg-dark-blue rounded-lg shadow-sm dark:bg-gray-700">
//             <div className="relative p-4 md:p-5 border-b rounded-t border-light-border">
//               <h3 className="text-[1.5rem] font-semibold text-white text-center">
//                 League is created
//               </h3>
//               <button
//                 type="button"
//                 className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 bg-transparent rounded-lg hover:opacity-50 duration-300 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
//                 data-modal-hide="default-modal"
//                 onClick={onClose}
//               >
//                 <svg
//                   className="w-3 h-3"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 14 14"
//                 >
//                   <path
//                     stroke="#fff"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                     stroke-width="2"
//                     d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
//                   />
//                 </svg>
//                 <span className="sr-only">Close modal</span>
//               </button>
//             </div>

//             <div className="p-4 md:p-5 space-y-4">
//               <h3 className="text-[1.045rem] font-semibold text-white text-center">
//                 Congratulations, your league is ready to be published.
//               </h3>
//               <div className="custom_check-box">
//                 <label
//                   htmlFor="checkbox-1"
//                   className="text-[0.94rem] font-medium text-custom-gray mb-2 block"
//                 >
//                   Private league{" "}
//                 </label>
//                 <div className="flex justify-between w-full text-[0.94rem] text-custom-gray  focus:outline-0 focus:!border focus:!border-highlight-color  py-[0.92rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal">
//                   <span className=" text-[0.94rem] font-medium text-white leading-normal">
//                     Publish this league{" "}
//                   </span>
//                   <input
//                     id="checkbox-1"
//                     type="checkbox"
//                     value=""
//                     className="w-6 h-6 checked:bg-highlight-color bg-custom-gray  border-transparent rounded-md focus:ring-transparent focus:ring-offset-transparent focus:outline-0 focus:shadow-none"
//                   />
//                 </div>
//               </div>
//               <div className="custom_input">
//                 <div className="mb-0">
//                   <label
//                     htmlFor="success"
//                     className="text-[0.94rem] font-medium text-custom-gray mb-2 block"
//                   >
//                     Sharing link
//                   </label>
//                   <div className="relative flex justify-between w-full  focus:!border focus:!border-highlight-color  py-[0.92rem] bg-input-color rounded-[0.52rem]  px-3 block ">
//                     <input
//                       type="text"
//                       id="success"
//                       className="flex-1  py-0 pr-2 pl-0 text-[0.94rem] focus:outline-0 focus:ring-transparent focus:border-0 border-transparent bg-transparent text-white placeholder-white appearance-none leading-normal"
//                       placeholder="#"
//                     />
//                     <Link to="#">
//                       <svg
//                         width="1.5rem"
//                         height="1.5rem"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           d="M14 8H4C2.897 8 2 8.897 2 10V20C2 21.103 2.897 22 4 22H14C15.103 22 16 21.103 16 20V10C16 8.897 15.103 8 14 8Z"
//                           fill="#6B7897"
//                         />
//                         <path
//                           d="M20 2H10C9.46957 2 8.96086 2.21071 8.58579 2.58579C8.21071 2.96086 8 3.46957 8 4V6H16C16.5304 6 17.0391 6.21071 17.4142 6.58579C17.7893 6.96086 18 7.46957 18 8V16H20C20.5304 16 21.0391 15.7893 21.4142 15.4142C21.7893 15.0391 22 14.5304 22 14V4C22 3.46957 21.7893 2.96086 21.4142 2.58579C21.0391 2.21071 20.5304 2 20 2Z"
//                           fill="#6B7897"
//                         />
//                       </svg>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* <div className="flex items-center p-4 md:p-5 border-t border-light-border rounded-b ">
//                             <button data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
//                             <button data-modal-hide="default-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Decline</button>
//                         </div> */}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ModalPopUp;

// components/ui/ModalPopUp.tsx
import React from "react";

interface ModalPopUpProps {
  onConfirm: () => void;
  onCancel: () => void;
  isUpdate: any;
  isTrunament: any;
}

const ModalPopUp: React.FC<ModalPopUpProps> = ({
  onCancel,
  isUpdate,
  isTrunament = false,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-primary-color p-6 rounded-[0.52rem] text-white">
        {isTrunament ? (
          <h3 className="text-lg font-medium mb-4">
            {isUpdate
              ? "Confirm Tournament Updation"
              : "Confirm Tournament Creation"}
          </h3>
        ) : (
          <h3 className="text-lg font-medium mb-4">
            {isUpdate ? "Confirm League Updation" : "Confirm League Creation"}
          </h3>
        )}
        {isTrunament ? (
          <p className="mb-4">
            {isUpdate
              ? "Are you sure you want to update this tournament?"
              : "Are you sure you want to create this tournament?"}
          </p>
        ) : (
          <p className="mb-4">
            {isUpdate
              ? "Are you sure you want to update this league?"
              : "Are you sure you want to create this league?"}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="bg-gray-gradient px-4 py-2 rounded-[0.52rem] text-white hover:opacity-75"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary-gradient px-4 py-2 rounded-[0.52rem] text-white hover:opacity-75"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPopUp;
