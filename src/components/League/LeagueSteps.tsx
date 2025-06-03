import React from "react";
import downarr from '../../assets/images/down_arr.svg';
import Select from 'react-select'
import { colourOptions } from '../ui/Select2_data.tsx';
import FileUpload from "../ui/UploadFile.tsx";
import deleteIcon from '../../assets/images/trash_can.svg';
import { Link } from 'react-router';
import ModalPopUp from '../ui/ModalPopUp.tsx'


export const LeagueSteps: React.FC = () => {
    return (
        <>

            <div className="nf_leg_steps-block">
                <div className="nf_step_head-con relative flex items-center pb-5 border-b border-light-border">
                    <a href="#" className='absolute left-0 flex items-center gap-2 hover:opacity-[0.75] duration-300 text-white font-base lg:text-[1.26rem] py-2'>
                        <span>
                            <svg width="1.26rem" height="1.26rem" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.125 3.75L6.875 10L13.125 16.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </span>
                        Back
                    </a>
                    <h3 className="flex-1 text-white text-center font-bold text-[1.5rem]">Add new league</h3>
                </div>
            </div>

            <div className="leg_steps--con flex items-center justify-center my-[1.67rem] gap-[0.35rem]">
                <div className="leg_steps--num flex items-center gap-[0.35rem] active-step">
                    <span className="steps-num leading-none bg-[#007EFF] w-[1.67rem] h-[1.67rem] flex items-center justify-center  inline-block text-white rounded-[1.67rem]">1</span>
                    <span className="step-line inline-block w-[1rem] h-[0.1rem] bg-[#007EFF] rounded-[0.2rem]"></span>
                </div>
                <div className="leg_steps--num flex items-center gap-[0.35rem]">
                    <span className="steps-num leading-none bg-light-border w-[1.67rem] h-[1.67rem] flex items-center justify-center  inline-block text-white rounded-[1.67rem]">2</span>
                    <span className="step-line inline-block w-[1rem] h-[0.1rem] bg-light-border rounded-[0.2rem]"></span>
                </div>
                <div className="leg_steps--num flex items-center gap-[0.35rem]">
                    <span className="steps-num leading-none bg-light-border w-[1.67rem] h-[1.67rem] flex items-center justify-center  inline-block text-white rounded-[1.67rem]">3</span>
                    <span className="step-line inline-block w-[1rem] h-[0.1rem] bg-light-border rounded-[0.2rem]"></span>
                </div>
                <div className="leg_steps--num flex items-center gap-[0.35rem]">
                    <span className="steps-num leading-none bg-light-border w-[1.67rem] h-[1.67rem] flex items-center justify-center  inline-block text-white rounded-[1.67rem]">4</span>
                    <span className="step-line inline-block w-[1rem] h-[0.1rem] bg-light-border rounded-[0.2rem]"></span>
                </div>
                <div className="leg_steps--num flex items-center gap-[0.35rem]">
                    <span className="steps-num leading-none bg-light-border w-[1.67rem] h-[1.67rem] flex items-center justify-center  inline-block text-white rounded-[1.67rem]">5</span>
                </div>
            </div>

            {/* --- General Information Form --- */}

            <form className="max-w-[42.5rem] mx-auto genral_form-info mb-4">

                <h4 className="text-white mb-5 text-[1.0625rem] font-medium text-center">General Information</h4>

                <div className="relative float-label-input custom-input mb-4">
                    <input type="text" id="name" placeholder=" " className=" block w-full text-[0.94rem] text-white  focus:outline-0 focus:!border focus:!border-highlight-color  pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal " />
                    <label htmlFor="name" className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">League Name in English</label>
                </div>

                <div className="relative float-label-input custom-input mb-4">
                    <input type="text" id="name" placeholder=" " className=" block w-full text-[0.94rem] text-white  focus:outline-0 focus:!border focus:!border-highlight-color  pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal " />
                    <label htmlFor="name" className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">League Name in Arabic</label>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex-1 custom-input mb-4">
                        <label htmlFor="countries" className="absolute top-3 left-0 translate-y-[-0.3rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">Game</label>
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
                            <option selected>Select the game</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="FR">France</option>
                            <option value="DE">Germany</option>
                        </select>
                    </div>
                    <div className="relative flex-1 custom-input mb-4">
                        <label htmlFor="countries" className="absolute top-3 left-0 translate-y-[-0.3rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">Device</label>
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
                            <option selected>Select device type</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="FR">France</option>
                            <option value="DE">Germany</option>
                        </select>
                    </div>
                </div>

                <ul className="grid w-full gap-3 md:grid-cols-2 leg_radio-btn mb-4 bg-input-color px-3 py-2 rounded-[0.52rem]">
                    <li>
                        <input type="radio" id="hosting-small" name="hosting" value="hosting-small" className="hidden peer" required checked />
                        <label htmlFor="hosting-small" className="inline-block text-center justify-between w-full p-3 text-gray-500  border-transperent rounded-[0.52rem] cursor-pointer dark:peer-checked:text-highlight-color peer-checked:border-blue-600 dark:peer-checked:border-blue-600 dark:text-gray-400">                           
                            <div className="block">
                                <div className="w-full text-base font-medium leading-none">Solo</div>                                
                            </div>
                            
                        </label>
                    </li>
                    <li>
                        <input type="radio" id="hosting-big" name="hosting" value="hosting-big" className="hidden peer"/>
                        <label htmlFor="hosting-big" className="inline-block text-center justify-between w-full p-3 text-gray-500  border-transperent rounded-[0.52rem] cursor-pointer dark:peer-checked:text-highlight-color peer-checked:border-blue-600 dark:peer-checked:border-blue-600 dark:text-gray-400">
                            <div className="block">
                                <div className="w-full text-base font-medium leading-none">Team</div>                                
                            </div>                           
                        </label>
                    </li>
                </ul>

                <div className="relative mb-4">
                    <div className="float-label-input custom-input">
                        <input type="text" id="name" placeholder=" " className=" block w-full text-[0.94rem] text-white  focus:outline-0 focus:!border focus:!border-highlight-color  pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal " />
                        <label htmlFor="name" className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">Number of Participants</label>
                    </div>
                    <div className="flex mb-4 absolute top-[50%] right-2" style={{ transform: 'translateY(-50%)' }}>
                        <label className="inline-flex items-center w-full cursor-pointer">
                            <span className="mr-3 text-[0.94rem] text-custom-gray font-medium">Unlimited Number</span>
                            <input type="checkbox" value="" className="sr-only peer"/>
                            <div className="relative w-12 h-6 bg-custom-gray focus:outline-none  rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
                        </label>
                    </div>
                </div>
                
                <div className="relative custom-input flex items-center mb-4">
                    <div className="absolute border-r border-custom-gray pr-2 ps-3 pointer-events-none">
                        <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M9 4C9 3.44772 8.55229 3 8 3C7.44772 3 7 3.44772 7 4V5.00003C6.54097 5.00031 6.14075 5.00314 5.80498 5.03057C5.40963 5.06287 5.01641 5.13419 4.63803 5.32698C4.07355 5.6146 3.6146 6.07354 3.32698 6.63803C3.13419 7.01641 3.06287 7.40963 3.03057 7.80497C3.01363 8.01239 3.00607 8.2444 3.0027 8.49967C2.99906 8.77591 3.22407 9 3.50033 9H20.4997C20.7759 9 21.0009 8.77591 20.9973 8.49968C20.9939 8.2444 20.9864 8.01239 20.9694 7.80497C20.9371 7.40963 20.8658 7.01641 20.673 6.63803C20.3854 6.07354 19.9265 5.6146 19.362 5.32698C18.9836 5.13419 18.5904 5.06287 18.195 5.03057C17.8593 5.00314 17.459 5.00031 17 5.00003V4C17 3.44772 16.5523 3 16 3C15.4477 3 15 3.44772 15 4V5H9V4ZM21 11.5C21 11.2239 20.7761 11 20.5 11H3.5C3.22386 11 3 11.2239 3 11.5V16.8386C2.99998 17.3657 2.99997 17.8205 3.03057 18.195C3.06287 18.5904 3.13419 18.9836 3.32698 19.362C3.6146 19.9265 4.07355 20.3854 4.63803 20.673C5.01641 20.8658 5.40963 20.9371 5.80498 20.9694C6.17951 21 6.63438 21 7.16146 21H16.8387C17.3658 21 17.8205 21 18.195 20.9694C18.5904 20.9371 18.9836 20.8658 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C20.8658 18.9836 20.9371 18.5904 20.9694 18.195C21 17.8205 21 17.3657 21 16.8386L21 11.5Z" fill="#6B7897"/>
                        </svg>
                    </div>
                    <input id="default-datepicker" type="text" className="text-white bg-input-color text-sm rounded-lg focus:outline-0 focus:!border focus:!border-highlight-color block w-full ps-12 p-3 " placeholder="Ending Date"/>
                </div>

                <div className="flex items-center justify-end gap-2 mt-[1.8rem]">
                    <button type="button" className="bg-gray-gradient w-[6.25rem] mb-4 text-white bg-blue-700 hover:opacity-[0.75] font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 duration-300 focus:outline-none ">Back</button>
                    <button type="button" className="bg-primary-gradient w-[6.25rem] mb-4 text-white bg-blue-700 hover:opacity-[0.75] duration-300 font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 focus:outline-none ">Next Step</button>
                </div>
            </form>

            {/* --- About The League Form --- */}
            <form className="max-w-[42.5rem] mx-auto genral_form-info mb-4">

                <h4 className="text-white mb-5 text-[1.0625rem] font-medium text-center">About The League</h4>

               
                <div className="relative flex-1 custom-input mb-4">
                    <label htmlFor="countries" className="absolute top-3 left-0 translate-y-[-0.3rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">Partner</label>
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
                        <option selected>Select the partner</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="FR">France</option>
                        <option value="DE">Germany</option>
                    </select>
                </div>                    
               
                <div className="relative float-label-input custom-input mb-4">                        
                    <label htmlFor="message" className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">About League</label>
                    <textarea
                        className="block border-0 w-full text-[0.94rem] text-white  focus:outline-0 focus:!border focus:!border-highlight-color  pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal "
                        id="message"
                        placeholder=""
                        rows={4}
                    />
                </div>  

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

                <div className="flex items-center justify-end gap-2 mt-[1.8rem]">
                    <button type="button" className="bg-gray-gradient w-[6.25rem] mb-4 text-white bg-blue-700 hover:opacity-[0.75] font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 duration-300 focus:outline-none ">Back</button>
                    <button type="button" className="bg-primary-gradient w-[6.25rem] mb-4 text-white bg-blue-700 hover:opacity-[0.75] duration-300 font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 focus:outline-none ">Next Step</button>
                </div>
            </form>

            {/* --- Media Form --- */}
            <form className="max-w-[42.5rem] mx-auto genral_form-info mb-4">

                <h4 className="text-white mb-5 text-[1.0625rem] font-medium text-center">Media</h4>

                <FileUpload label="Card image (1920*1080)" id="card_img" />
                <FileUpload label="Header (1820*300)" id="head_img" />
                <FileUpload label="Logo (270*330)" id="logo_img" />
               
                <div className="check_setting flex items-center justify-between w-full text-[0.94rem] text-custom-gray mb-4  focus:outline-0 focus:!border focus:!border-highlight-color  py-[0.92rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal ">
                    <span className="text-white font-medium">Banner Ad</span>
                    <label className="inline-flex items-center cursor-pointer">                        
                        <input type="checkbox" value="" className="sr-only peer"/>
                        <div className="relative w-12 h-6 bg-custom-gray focus:outline-none  rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
                    </label>
                </div>                    
                <FileUpload label="Banner (490*490)" id="banner_img" />     

                <div className="relative float-label-input custom-input mb-4">
                    <input type="text" id="name" placeholder="Banner link" className=" block w-full text-[0.94rem] text-white  focus:outline-0 focus:!border focus:!border-highlight-color  py-[0.92rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal " />                    
                </div>                     

                <div className="flex items-center justify-end gap-2 mt-[1.8rem]">
                    <button type="button" className="bg-gray-gradient w-[6.25rem] mb-4 text-white bg-blue-700 hover:opacity-[0.75] font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 duration-300 focus:outline-none ">Back</button>
                    <button type="button" className="bg-primary-gradient w-[6.25rem] mb-4 text-white bg-blue-700 hover:opacity-[0.75] duration-300 font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 focus:outline-none ">Next Step</button>
                </div>
                
            </form>

            {/* --- Rules and regulations Form --- */}
            <form className="max-w-[42.5rem] mx-auto genral_form-info mb-4">

                <h4 className="text-white mb-5 text-[1.0625rem] font-medium text-center">Rules and regulations</h4>

                <h3 className="text-white mb-2 text-base font-medium text-left">Rule #1</h3>

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
                        className="bg-gray-gradient absolute top-[1.4rem] right-[-3.35rem] hover:opacity-80 p-[0.625rem] rounded-[0.52rem] duration-300">
                            <img src={deleteIcon} alt="Delete" style={{ width: '1.5rem' }} />
                    </Link>
                </div>            
               
                <div className="relative mb-4">
                    <div className="check_setting flex items-center justify-between w-full text-[0.94rem] text-custom-gray focus:outline-0 focus:!border focus:!border-highlight-color  py-[0.92rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal ">
                        <span className="text-white font-medium">Waiting list</span>
                        <label className="inline-flex items-center cursor-pointer">                        
                            <input type="checkbox" value="" className="sr-only peer"/>
                            <div className="relative w-12 h-6 bg-custom-gray focus:outline-none  rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
                        </label>
                    </div>
                    <span className="block text-[0.94rem] text-custom-gray mt-2">When checked, the system will only accepts teams with the minimum number of players in their roster excluding players in waiting list.</span>
                </div>                   

                <div className="relative mb-4">
                    <div className="check_setting flex items-center justify-between w-full text-[0.94rem] text-custom-gray focus:outline-0 focus:!border focus:!border-highlight-color  py-[0.92rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal ">
                        <span className="text-white font-medium">Verified accounts</span>
                        <label className="inline-flex items-center cursor-pointer">                        
                            <input type="checkbox" value="" className="sr-only peer"/>
                            <div className="relative w-12 h-6 bg-custom-gray focus:outline-none  rounded-full peer dark:bg-custom-gray peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-gradient dark:peer-checked:bg-primary-gradient"></div>
                        </label>
                    </div>
                    <span className="block text-[0.94rem] text-custom-gray mt-2">When checked, the system will only accepts verified users.</span>
                </div>  

                <h3 className="text-white mb-4 text-base font-medium text-left">Rule #2</h3>

                <div className="relative float-label-select custom-input mb-1">
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
                    <Link
                        to={'#'}
                        className="bg-gray-gradient absolute top-[0rem] right-[-3.35rem] hover:opacity-80 p-[0.625rem] rounded-[0.52rem] duration-300">
                            <img src={deleteIcon} alt="Delete" style={{ width: '1.5rem' }} />
                    </Link>
                </div>     

                <div className="inline-flex items-center justify-center w-full mb-5">
                    <hr className="w-full h-px bg-custom-gray border-0 opacity-[0.4]"/>
                    <span className="absolute px-3 font-medium -translate-1/2  bg-primary-color text-custom-gray">or</span>
                </div>            

                <div className="relative float-label-input custom-input mb-4">
                    <input type="text" id="name" placeholder=" " className=" block w-full text-[0.94rem] text-white  focus:outline-0 focus:!border focus:!border-highlight-color  pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal " />
                    <label htmlFor="name" className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">The title in English</label>
                </div>  

                <div className="relative float-label-input custom-input mb-1">
                    <input type="text" id="name" placeholder=" السؤال باللغة العربية" className=" block w-full border border-transparent text-[0.94rem] text-white text-right focus:outline-0 focus:!border focus:!border-highlight-color placeholder:text-right py-[0.52rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal " />
                </div>        

                <div className="inline-flex items-center justify-center w-full mb-4">
                    <hr className="w-full h-px bg-custom-gray border-0 opacity-[0.4]"/>                    
                </div>

                <div className="relative float-label-input custom-input mb-4">                        
                    <label htmlFor="message" className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">The description in English</label>
                    <textarea
                        className="block w-full border-0 text-[0.94rem] text-white  focus:outline-0 focus:!border focus:!border-highlight-color  pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal "
                        id="message"
                        placeholder=""
                        rows={2}
                    />
                </div>

                <div className="relative float-label-input custom-input mb-4">
                    <textarea
                            className="block w-full border-0 text-[0.94rem] text-white text-right placeholder:text-right  focus:outline-0 focus:!border focus:!border-highlight-color  py-[0.92rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal "
                            id="message"
                            placeholder="الإجابة باللغة العربية"
                            rows={2}
                        />
                </div>

                <div className="add_rule-btn">
                    <button className="w-full py-[0.45rem] border bg-input-color bg-opacity-40 rounded-[0.52rem] border-dashed border-custom-gray border-opacity-40 text-custom-gray text-[0.94rem] font-medium">+ Add new rule</button>
                </div>

                <div className="flex items-center justify-end gap-2 mt-[1.8rem]">
                    <button type="button" className="bg-gray-gradient w-[6.25rem] mb-4 text-white bg-blue-700 hover:opacity-[0.75] font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 duration-300 focus:outline-none ">Back</button>
                    <button type="button" className="bg-primary-gradient w-[6.25rem] mb-4 text-white bg-blue-700 hover:opacity-[0.75] duration-300 font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 focus:outline-none ">Next Step</button>
                </div>
                            
            </form>

            {/* --- Winners and badges Form --- */}
            <form className="max-w-[42.5rem] mx-auto genral_form-info mb-4">

                <h4 className="text-white mb-5 text-[1.0625rem] font-medium text-center">Winners and badges</h4>

                <div className="relative float-label-input custom-input mb-4">
                    <input type="text" id="name" placeholder=" " className=" block w-full text-[0.94rem] text-white  focus:outline-0 focus:!border focus:!border-highlight-color  pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal " />
                    <label htmlFor="name" className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.94rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray">Total prizepool</label>
                </div>          

                <div className="add_rule-btn mb-4">
                    <button className="w-full py-[0.45rem] border bg-input-color bg-opacity-40 rounded-[0.52rem] border-dashed border-custom-gray border-opacity-40 text-custom-gray text-[0.94rem] font-medium">+ Add new winner option</button>
                </div>

                <div className="edit_badges bg-input-color flex rounded-2xl ">
                    <p className="text-white flex items-center justify-center px-2 border-r border-[#2B3245] text-[0.94rem] w-10">#1</p>
                    <div className="edit_badges-form flex-1 py-4 px-4">                        
                        <div className="relative mb-3">
                            <label htmlFor="message" className="mb-2 inline-block relative text-[0.94rem] pointer-events-none transition duration-200 bg-transparent pr-3 text-white">Badge</label>
                            <select
                                id="countries"
                                className="block w-full text-[0.94rem] text-custom-gray border border-transparent focus:outline-0 focus:!border focus:!border-highlight-color py-[0.425rem] bg-[#2B3245] rounded-[0.52rem] px-3 block appearance-none leading-normal"
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
                        <div className="relative  mb-4">
                            <label htmlFor="message" className="mb-2 inline-block relative text-[0.94rem] pointer-events-none transition duration-200 bg-transparent pr-3 text-white">League tags</label>
                            <input type="text" id="name" placeholder=" Type the amount of points" className=" block w-full text-white text-[0.94rem] focus:outline-0 focus:!border focus:!border-highlight-color py-[0.425rem] border border-transparent bg-[#2B3245] rounded-[0.52rem]  px-3 block appearance-none leading-normal " />
                        </div>                      
                        <div className="relative ">
                            <label htmlFor="message" className="mb-2 inline-block relative text-[0.94rem] pointer-events-none transition duration-200 bg-transparent pr-3 text-white">League tags</label>
                            <input type="text" id="name" placeholder=" Type the amount of points" className=" block w-full text-white text-[0.94rem] focus:outline-0 focus:!border focus:!border-highlight-color py-[0.425rem] border border-transparent bg-[#2B3245] rounded-[0.52rem]  px-3 block appearance-none leading-normal " />
                        </div>                      
                    </div>
                    <Link
                        to={'#'}
                        className="px-2 flex items-center justify-center w-10 hover:opacity-80 border-l border-[#2B3245]  duration-300">
                            <img src={deleteIcon} alt="Delete" style={{ width: '1.5rem' }} />
                    </Link>
                </div>

                <div className="flex items-center justify-end gap-2 mt-[1.8rem]">
                    <button type="button" className="bg-gray-gradient w-[6.25rem] mb-4 text-white bg-blue-700 hover:opacity-[0.75] font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 duration-300 focus:outline-none ">Back</button>
                    <button type="button" className="bg-primary-gradient w-[6.25rem] mb-4 text-white bg-blue-700 hover:opacity-[0.75] duration-300 font-medium rounded-lg text-[0.94rem] px-5 py-[0.795rem] me-2 mb-2 focus:outline-none ">Next Step</button>
                </div>
                
            </form>

           <ModalPopUp />

        </>
    );
};