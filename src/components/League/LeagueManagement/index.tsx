import React from 'react';
import { Link } from 'react-router';
import { AdminStar, Microphone, RightArrow, Scoreboard, Tshirt } from '../../ui';
import AddMoreBtn from '../../ui/AddMoreBtn';

export const LeagueManagement: React.FC = () => {
    return (
        <>
        <div className="nf_leg_manage-block">
            <div className="nf_manage_head-con relative flex items-center gap-3 justify-between pb-6 border-b border-light-border">
                <div className="nf_manage_left-con flex items-center gap-3">
                    <h3 className=" text-custom-gray font-bold text-[1.5rem] leading-normal">Nafes League</h3>
                    <hr className="w-6 h-0.5 rounded-[0.2rem] bg-custom-gray border-0 opacity-[0.4]"/>
                    <h3 className=" text-white font-bold text-[1.5rem] leading-normal">Rocket League A</h3>
                </div>

                <div className="nf_manage_right-con flex-1 flex gap-3 justify-end hidden">
                    <div className="custom_check-box ">
                        <div className="flex justify-between items-center gap-2 w-full text-[0.94rem] text-custom-gray  focus:outline-0 focus:!border focus:!border-highlight-color  py-[0.6rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal">
                            <label htmlFor="checkbox-1" className="text-[1.0625rem] font-medium text-custom-gray block">Unsolved Disputed</label>                                
                            <input id="checkbox-1" type="checkbox" value="" className="w-4 h-4 checked:bg-highlight-color bg-custom-gray  border-transperent rounded-[0.28rem] focus:ring-transparent focus:ring-offset-transparent focus:outline-0 focus:shadow-none" />
                        </div>
                    </div> 
                    <div className="custom_check-box ">
                        <div className="flex justify-between items-center gap-2 w-full text-[0.94rem] text-custom-gray  focus:outline-0 focus:!border focus:!border-highlight-color  py-[0.6rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal">
                            <label htmlFor="checkbox-2" className="text-[1.0625rem] font-medium text-custom-gray block">Disputed</label>                                
                            <input id="checkbox-2" type="checkbox" value="" className="w-4 h-4 checked:bg-highlight-color bg-custom-gray  border-transperent rounded-[0.28rem] focus:ring-transparent focus:ring-offset-transparent focus:outline-0 focus:shadow-none" />
                        </div>
                    </div> 
                    <div className="custom_check-box ">
                        <div className="flex justify-between items-center gap-2 w-full text-[0.94rem] text-custom-gray  focus:outline-0 focus:!border focus:!border-highlight-color  py-[0.6rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal">
                            <label htmlFor="checkbox-3" className="text-[1.0625rem] font-medium text-custom-gray block">In-progress</label>                                
                            <input id="checkbox-3" type="checkbox" value="" className="w-4 h-4 checked:bg-highlight-color bg-custom-gray  border-transperent rounded-[0.28rem] focus:ring-transparent focus:ring-offset-transparent focus:outline-0 focus:shadow-none" />
                        </div>
                    </div> 
                    
                    <div className="relative w-full sm:w-[15rem]">
                        <input
                            className="text-white font-medium block bg-input-color placeholder-custom-gray w-full text-gray-700 border rounded-xl py-[0.52rem] pl-[2.2rem] pr-3 text-[1.0625rem] focus:outline-none border-0"
                            placeholder="Search league name, game name"
                            type="text"
                            name="search" />
                        <button className="absolute left-[0.52rem] top-[0.7rem]" type="button" name="searchbtn" id="basic-addon2">
                            <svg width="1.5rem" height="1.5rem" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.6667 3.5C7.15634 3.5 3.5 7.15634 3.5 11.6667C3.5 16.177 7.15634 19.8333 11.6667 19.8333C13.5011 19.8333 15.1942 19.2285 16.5575 18.2074L22.5084 24.1583C22.964 24.6139 23.7027 24.6139 24.1583 24.1583C24.6139 23.7027 24.6139 22.964 24.1583 22.5084L18.2074 16.5575C19.2285 15.1942 19.8333 13.5011 19.8333 11.6667C19.8333 7.15634 16.177 3.5 11.6667 3.5ZM5.83333 11.6667C5.83333 8.445 8.445 5.83333 11.6667 5.83333C14.8883 5.83333 17.5 8.445 17.5 11.6667C17.5 14.8883 14.8883 17.5 11.6667 17.5C8.445 17.5 5.83333 14.8883 5.83333 11.6667Z" fill="#6B7897" fillOpacity="1" />
                            </svg>
                        </button>
                    </div>
                    
                    <Link
                        to={'#'}
                        className="bg-primary-gradient 2xl:whitespace-nowrap xl:whitespace-normal whitespace-nowrap sm:w-auto w-full font-medium flex hover:opacity-[0.85] duration-300 items-center gap-2 bg-[#46A2FF] hover:bg-blue-700 text-white font-base text-[1.0625rem] py-[0.5rem] px-4 rounded-[0.52rem] leading-normal">
                            <span>
                            <svg width="1.041rem" height="1.041rem" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M1.66797 10C1.66797 5.39763 5.39893 1.66667 10.0013 1.66667C14.6037 1.66667 18.3346 5.39763 18.3346 10C18.3346 14.6024 14.6037 18.3333 10.0013 18.3333C5.39893 18.3333 1.66797 14.6024 1.66797 10ZM10.8346 6.66667C10.8346 6.20643 10.4615 5.83333 10.0013 5.83333C9.54107 5.83333 9.16797 6.20643 9.16797 6.66667V9.16667H6.66797C6.20773 9.16667 5.83464 9.53976 5.83464 10C5.83464 10.4602 6.20773 10.8333 6.66797 10.8333H9.16797V13.3333C9.16797 13.7936 9.54107 14.1667 10.0013 14.1667C10.4615 14.1667 10.8346 13.7936 10.8346 13.3333V10.8333H13.3346C13.7949 10.8333 14.168 10.4602 14.168 10C14.168 9.53976 13.7949 9.16667 13.3346 9.16667H10.8346V6.66667Z" fill="white" />
                            </svg>
                        </span>
                        Generate new match
                    </Link>
                
                </div>
            </div>

            {/* ---- League Cards Block Start ---- */}
            
            <div className="nf_league_cards-block mt-6 flex lg:gap-4 gap-2 flex-wrap 2xl:flex-nowrap">

                <div className="nf_league--card flex-1 flex flex-col  bg-input-color p-3 rounded-2xl">
                    <div className="league_card-head flex items-center gap-2 justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                            <div className="nf_card-icon bg-light-blue p-[0.625rem] rounded-lg">
                                <Scoreboard/>
                            </div>
                            <span className='text-white'>Matches</span>
                        </div>
                        <Link to="#" className='inline-block pr-[0.45rem] pl-[0.55rem] py-[0.65rem] bg-light-blue rounded-lg hover:opacity-70 duration-300'>
                            <RightArrow />
                        </Link>
                    </div>
                    <div className="league_card-body sm:flex-nowrap flex-wrap flex-1 flex gap-2">
                        <div className="card_labels flex-1 flex flex-col justify-center bg-light-blue pt-1.5 pb-2 px-2  rounded-lg">
                            <label htmlFor="" className='text-custom-gray text-[0.94rem] 2xl:whitespace-nowrap xl:whitespace-normal whitespace-nowrap font-medium'>Completed matches:</label>
                            <h4 className='text-white text-[1.26rem]'>100</h4>
                        </div>
                        <div className="card_labels flex-1 flex flex-col justify-center bg-light-blue pt-1.5 pb-2 px-2  rounded-lg">
                            <label htmlFor="" className='text-custom-gray text-[0.94rem] 2xl:whitespace-nowrap xl:whitespace-normal whitespace-nowrap font-medium'>Disputed matches:</label>
                            <h4 className='text-white text-[1.26rem]'>3</h4>
                        </div>
                        <div className="card_labels flex-1 flex flex-col justify-center bg-light-blue pt-1.5 pb-2 px-2  rounded-lg">
                            <label htmlFor="" className='text-custom-gray text-[0.94rem] 2xl:whitespace-nowrap xl:whitespace-normal whitespace-nowrap font-medium'>Solved matches:</label>
                            <h4 className='text-white text-[1.26rem]'>2</h4>
                        </div>
                    </div>
                </div>
                
                <div className="nf_league--card flex-1 flex flex-col  bg-input-color p-3 rounded-2xl">
                    <div className="league_card-head flex items-center gap-2 justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                            <div className="nf_card-icon bg-light-blue p-[0.625rem] rounded-lg">
                                <Tshirt/>
                            </div>
                            <span className='text-white'>Participants</span>
                        </div>
                        <Link to="#" className='inline-block pr-[0.45rem] pl-[0.55rem] py-[0.65rem] bg-light-blue rounded-lg hover:opacity-70 duration-300'>
                            <RightArrow />
                        </Link>
                    </div>
                    <div className="league_card-body sm:flex-nowrap flex-wrap flex-1 flex gap-2">
                        <div className="card_labels flex-1 flex flex-col justify-center bg-light-blue pt-1.5 pb-2 px-2  rounded-lg">
                            <label htmlFor="" className='text-custom-gray text-[0.94rem] 2xl:whitespace-nowrap xl:whitespace-normal whitespace-nowrap font-medium'>Teams:</label>
                            <h4 className='text-white text-[1.26rem]'>100</h4>
                        </div>
                        <div className="card_labels flex-1 flex flex-col justify-center bg-light-blue pt-1.5 pb-2 px-2  rounded-lg">
                            <label htmlFor="" className='text-custom-gray text-[0.94rem] 2xl:whitespace-nowrap xl:whitespace-normal whitespace-nowrap font-medium'>Players:</label>
                            <h4 className='text-white text-[1.26rem]'>600</h4>
                        </div>
                       
                    </div>
                </div>

                <div className="nf_league--card flex-1 flex flex-col  bg-input-color p-3 rounded-2xl">
                    <div className="league_card-head flex items-center gap-2 justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                            <div className="nf_card-icon bg-light-blue p-[0.625rem] rounded-lg">
                            <Microphone />
                            </div>
                            <span className='text-white'>Bulk Registration</span>
                        </div>
                        <Link to="#" className='inline-block pr-[0.45rem] pl-[0.55rem] py-[0.65rem] bg-light-blue rounded-lg hover:opacity-70 duration-300'>
                            <RightArrow />
                        </Link>
                    </div>
                    <div className="league_card-body sm:flex-nowrap flex-wrap flex-1 flex gap-2">
                        <div className="card_labels flex-1 flex flex-col justify-center bg-light-blue pt-1.5 pb-2 px-2  rounded-lg">
                            <label htmlFor="" className='text-custom-gray text-[0.94rem] 2xl:whitespace-nowrap xl:whitespace-normal whitespace-nowrap font-medium 2xl:pr-2'>You can add participants manually to this league.</label>
                        </div>
                                              
                    </div>
                </div>
                
                <div className="nf_league--card flex-1 flex flex-col  bg-input-color p-3 rounded-2xl">
                    <div className="league_card-head flex items-center gap-2 justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                            <div className="nf_card-icon bg-light-blue p-[0.625rem] rounded-lg">
                                <AdminStar />
                            </div>
                            <span className='text-white'>Admins</span>
                        </div>
                        <Link to="#" className='inline-block pr-[0.45rem] pl-[0.55rem] py-[0.65rem] bg-light-blue rounded-lg hover:opacity-70 duration-300'>
                            <RightArrow />
                        </Link>
                    </div>
                    <div className="league_card-body sm:flex-nowrap flex-wrap flex-1 flex gap-2">
                        <div className="card_labels flex-1 flex flex-col justify-center bg-light-blue pt-1.5 pb-2 px-2  rounded-lg">
                            <label htmlFor="" className='text-custom-gray text-[0.94rem] 2xl:whitespace-nowrap xl:whitespace-normal whitespace-nowrap font-medium'>Number of admins:</label>
                            <h4 className='text-white text-[1.26rem]'>600</h4>
                        </div>
                        <div className="card_labels flex-1 flex flex-col justify-center bg-light-blue pt-1.5 pb-2 px-2  rounded-lg">
                            <label htmlFor="" className='text-custom-gray text-[0.94rem] 2xl:whitespace-nowrap xl:whitespace-normal whitespace-nowrap font-medium 2xl:pr-6'>You can add admins to manage this league.</label>
                        </div>                       
                    </div>
                </div>

            </div>
                {/* <AddMoreBtn text="Create Tournament" />
                <AddMoreBtn text="Add Another Team" /> */}
        </div>
            

        </>
    );
};
