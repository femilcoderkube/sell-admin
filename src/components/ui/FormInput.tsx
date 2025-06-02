import React from "react";
import downarr from '../../assets/images/down_arr.svg';
import Select from 'react-select'
import { colourOptions } from './Select2_data.tsx';
import FileUpload from "./UploadFile.tsx";
import deleteIcon from '../../assets/images/trash_can.svg';
import { Link } from 'react-router';

export const FormInput: React.FC = () => {
    return(
        <>

        {/* ----- SearchBar ----- */}
        <div className="relative w-full sm:w-[15rem]">
            <input
                className="text-white font-medium block bg-input-color placeholder-custom-gray w-full text-gray-700 border rounded-2xl py-[0.6rem] pl-[2.2rem] pr-3 text-[1.0625rem] focus:outline-none border-0"
                placeholder="Search league name, game name"
                type="text"
                name="search" />
            <button className="absolute left-[0.52rem] top-[0.7rem]" type="button" name="searchbtn" id="basic-addon2">
                <svg width="1.5rem" height="1.5rem" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M11.6667 3.5C7.15634 3.5 3.5 7.15634 3.5 11.6667C3.5 16.177 7.15634 19.8333 11.6667 19.8333C13.5011 19.8333 15.1942 19.2285 16.5575 18.2074L22.5084 24.1583C22.964 24.6139 23.7027 24.6139 24.1583 24.1583C24.6139 23.7027 24.6139 22.964 24.1583 22.5084L18.2074 16.5575C19.2285 15.1942 19.8333 13.5011 19.8333 11.6667C19.8333 7.15634 16.177 3.5 11.6667 3.5ZM5.83333 11.6667C5.83333 8.445 8.445 5.83333 11.6667 5.83333C14.8883 5.83333 17.5 8.445 17.5 11.6667C17.5 14.8883 14.8883 17.5 11.6667 17.5C8.445 17.5 5.83333 14.8883 5.83333 11.6667Z" fill="#6B7897" fillOpacity="1" />
                </svg>
            </button>
        </div>

        {/* ----- Add new league ----- */}
         <Link
            to={'#'}
            className="mb-4 bg-primary-gradient whitespace-nowrap sm:w-auto w-full font-medium flex hover:opacity-[0.85] duration-300 items-center gap-2 bg-[#46A2FF] hover:bg-blue-700 text-white font-base text-[1.0625rem] py-[0.6rem] px-4 rounded-[0.52rem]">
                <span>
                <svg width="1.041rem" height="1.041rem" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M1.66797 10C1.66797 5.39763 5.39893 1.66667 10.0013 1.66667C14.6037 1.66667 18.3346 5.39763 18.3346 10C18.3346 14.6024 14.6037 18.3333 10.0013 18.3333C5.39893 18.3333 1.66797 14.6024 1.66797 10ZM10.8346 6.66667C10.8346 6.20643 10.4615 5.83333 10.0013 5.83333C9.54107 5.83333 9.16797 6.20643 9.16797 6.66667V9.16667H6.66797C6.20773 9.16667 5.83464 9.53976 5.83464 10C5.83464 10.4602 6.20773 10.8333 6.66797 10.8333H9.16797V13.3333C9.16797 13.7936 9.54107 14.1667 10.0013 14.1667C10.4615 14.1667 10.8346 13.7936 10.8346 13.3333V10.8333H13.3346C13.7949 10.8333 14.168 10.4602 14.168 10C14.168 9.53976 13.7949 9.16667 13.3346 9.16667H10.8346V6.66667Z" fill="white" />
                </svg>
            </span>
            Add new league
        </Link>

        {/* ----- Input Field ----- */}
        <div className="relative float-label-input custom-input mb-4">
            <input type="text" id="name" placeholder=" " className=" block w-full text-[0.94rem] text-white  focus:outline-0 focus:!border focus:!border-highlight-color  pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal " />
            <label htmlFor="name" className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">Empty</label>
        </div>

        {/* ----- Input Field without label ----- */}
        <div className="relative float-label-input custom-input mb-4">
            <input type="text" id="name" placeholder=" السؤال باللغة العربية" className=" block w-full text-[0.94rem] text-white text-right focus:outline-0 focus:!border focus:!border-highlight-color placeholder:text-right py-[0.52rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal " />
        </div> 

        {/* ----- Select Field with Label----- */}
        <div className="relative float-label-select custom-input mb-4">
            <label htmlFor="countries" className="absolute top-3 left-0 translate-y-[-0.3rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">Empty</label>
            <select
                    id="countries"
                    className="block w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
                    style={{
                        backgroundImage: `url(${downarr})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 10px center',
                        backgroundSize: '16px 16px'
                    }}
                >
                <option selected>Choose a country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="FR">France</option>
                <option value="DE">Germany</option>
            </select>
        </div>

        {/* ----- Select Field without Label----- */}
        <div className="relative float-label-select custom-input mb-4">
            <select
                id="countries"
                className="block w-full text-[0.94rem] text-white focus:outline-0 focus:!border focus:!border-highlight-color py-[0.625rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
                style={{
                backgroundImage: `url(${downarr})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
                backgroundSize: "16px 16px",
                }}
                defaultValue=""
            >
                <option value="" disabled hidden>
                    Select a rule from the database
                </option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="FR">France</option>
                <option value="DE">Germany</option>
            </select>
        </div>
    
        {/* -----  On/Off button Field  ----- */}
        <div className="inline-flex mb-4">
          <label className="inline-flex items-center w-full cursor-pointer">
            <span className="mr-3 text-[0.94rem] text-custom-gray font-medium">Enable notifications</span>
            <input type="checkbox" value="" className="sr-only peer"/>
            <div className="relative w-12 h-6 bg-custom-gray focus:outline-none  rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
          </label>
        </div>

        {/* -----  Date Input Field  ----- */}
        <div className="relative custom-input flex items-center mb-4">
            <div className="absolute border-r border-custom-gray pr-2 ps-3 pointer-events-none">
                <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9 4C9 3.44772 8.55229 3 8 3C7.44772 3 7 3.44772 7 4V5.00003C6.54097 5.00031 6.14075 5.00314 5.80498 5.03057C5.40963 5.06287 5.01641 5.13419 4.63803 5.32698C4.07355 5.6146 3.6146 6.07354 3.32698 6.63803C3.13419 7.01641 3.06287 7.40963 3.03057 7.80497C3.01363 8.01239 3.00607 8.2444 3.0027 8.49967C2.99906 8.77591 3.22407 9 3.50033 9H20.4997C20.7759 9 21.0009 8.77591 20.9973 8.49968C20.9939 8.2444 20.9864 8.01239 20.9694 7.80497C20.9371 7.40963 20.8658 7.01641 20.673 6.63803C20.3854 6.07354 19.9265 5.6146 19.362 5.32698C18.9836 5.13419 18.5904 5.06287 18.195 5.03057C17.8593 5.00314 17.459 5.00031 17 5.00003V4C17 3.44772 16.5523 3 16 3C15.4477 3 15 3.44772 15 4V5H9V4ZM21 11.5C21 11.2239 20.7761 11 20.5 11H3.5C3.22386 11 3 11.2239 3 11.5V16.8386C2.99998 17.3657 2.99997 17.8205 3.03057 18.195C3.06287 18.5904 3.13419 18.9836 3.32698 19.362C3.6146 19.9265 4.07355 20.3854 4.63803 20.673C5.01641 20.8658 5.40963 20.9371 5.80498 20.9694C6.17951 21 6.63438 21 7.16146 21H16.8387C17.3658 21 17.8205 21 18.195 20.9694C18.5904 20.9371 18.9836 20.8658 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C20.8658 18.9836 20.9371 18.5904 20.9694 18.195C21 17.8205 21 17.3657 21 16.8386L21 11.5Z" fill="#6B7897"/>
                </svg>
            </div>
            <input id="default-datepicker" type="text" className="text-white bg-input-color text-sm rounded-lg focus:outline-0 focus:!border focus:!border-highlight-color block w-full ps-12 p-3 " placeholder="Select date"/>
        </div>

        {/* ----- Textarea Field -----  */}        
        <div className="relative float-label-input custom-input mb-4">                        
            <label htmlFor="message" className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">About League</label>
            <textarea
                className="block w-full border-0 text-[0.94rem] text-white  focus:outline-0 focus:!border focus:!border-highlight-color  pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal "
                id="message"
                placeholder=""
                rows={4}
            />
        </div>

        {/* ----- Textarea Field without label ----- */}
        <div className="relative float-label-input custom-input mb-4">
            <input type="text" id="name" placeholder=" السؤال باللغة العربية" className=" block w-full text-[0.94rem] text-white text-right focus:outline-0 focus:!border focus:!border-highlight-color placeholder:text-right py-[0.52rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal " />
        </div>

        {/* ---- Select2 Input ---- */}
        <div className="custom_select2">
            <label htmlFor="message" className="mb-1 relative text-[0.94rem] pointer-events-none transition duration-200 bg-transparent pr-3 text-custom-gray">League tags</label>
            <Select 
                defaultValue={[colourOptions[2], colourOptions[3]]}
                isMulti
                name="colors"
                options={colourOptions}
                className="basic-multi-select"
                classNamePrefix="select"
            />
        </div>

        {/* ---- Upload Media File Input ---- */}
        <FileUpload label="Card image (1920*1080)" id="card_img" />
        <FileUpload label="Header (1820*300)" id="head_img" /> 

        {/* ---- check on/off label input ---- */}
        <div className="relative mb-4">
            <div className="check_setting flex items-center justify-between w-full text-[0.94rem] text-custom-gray focus:outline-0 focus:!border focus:!border-highlight-color  py-[0.92rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal ">
                <span className="text-white font-medium">Banner Ad</span>
                <label className="inline-flex items-center cursor-pointer">                        
                    <input type="checkbox" value="" className="sr-only peer"/>
                    <div className="relative w-12 h-6 bg-custom-gray focus:outline-none  rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
                </label>
            </div>
        </div>

        {/* ---- Paste input ---- */}
        <div className="relative float-label-input custom-input mb-4">
            <input type="text" id="name" placeholder="Banner link" className=" block w-full text-[0.94rem] text-white  focus:outline-0 focus:!border focus:!border-highlight-color  py-[0.92rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal " />                    
        </div>  

        {/* ---- Select2 Width Delete Icon ---- */}
        <div className="custom_select2 mb-4 relative">
            <label htmlFor="message" className="mb-1 relative text-[0.94rem] pointer-events-none transition duration-200 bg-transparent pr-3 text-custom-gray">League tags</label>
            <Select 
                defaultValue={[colourOptions[2], colourOptions[3]]}
                isMulti
                name="colors"
                options={colourOptions}
                className="basic-multi-select"
                classNamePrefix="select"
            />                    
            <Link
                to={'#'}
                className="bg-gray-gradient absolute top-[1.4rem] right-[-3.35rem] hover:opacity-80 p-[0.625rem] rounded-[0.42rem] duration-300">
                    <img src={deleteIcon} alt="Delete" style={{ width: '1.5rem' }} />
            </Link>
        </div>

        {/* ----- Cancel / Submit Button -----  */}        
        <button type="button" className="bg-gray-gradient w-[6.25rem] mb-4 text-white bg-blue-700 hover:opacity-[0.75] font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 duration-300 focus:outline-none ">Back</button>
                    <button type="button" className="bg-primary-gradient w-[6.25rem] mb-4 text-white bg-blue-700 hover:opacity-[0.75] duration-300 font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 focus:outline-none ">Next Step</button>
        
        {/* ----- Add Rult Button -----  */}        
        <div className="add_rule-btn mb-4">
            <button className="w-full py-[0.45rem] border bg-input-color bg-opacity-40 rounded-[0.52rem] border-dashed border-custom-gray border-opacity-40 text-custom-gray text-[0.94rem] font-medium">+ Add new rule</button>
        </div>

        {/* ----- OR Seprator -----  */}   
        <div className="inline-flex items-center justify-center w-full">
            <hr className="w-full h-px bg-custom-gray border-0 opacity-[0.4]"/>
            <span className="absolute px-3 font-medium  -translate-1/2  bg-primary-color text-custom-gray">or</span>
        </div>  

        {/* ----- custom_check-box -----  */} 
        <div className="custom_check-box">
            <label htmlFor="checkbox-1" className="text-[0.94rem] font-medium text-custom-gray mb-2 block">Private league </label>
            <div className="flex justify-between w-full text-[0.94rem] text-custom-gray  focus:outline-0 focus:!border focus:!border-highlight-color  py-[0.92rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal">
                <span  className=" text-[0.94rem] font-medium text-white">Publish this league </span>
                <input id="checkbox-1" type="checkbox" value="" className="w-4 h-4 bg-custom-gray  border-transperent rounded-[0.28rem] focus:ring-transparent focus:ring-offset-transparent focus:outline-0 focus:shadow-none" />
            </div>
        </div>    
              
    </>
    );
};

