import React, { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { LeagueSteps1 } from "../../components/LeagueStep/LeagueStep1";
import { LeagueSteps2 } from "../../components/LeagueStep/LeagueStep2";
import { LeagueSteps3 } from "../../components/LeagueStep/LeagueSteps3";
import { LeagueSteps4 } from "../../components/LeagueStep/LeagueSteps4";
import { LeagueSteps5 } from "../../components/LeagueStep/LeagueSteps5";
import { Layout } from "../../components";
import ModalPopUp from "../../components/ui/ModalPopUp";
import { League } from "../../app/types";
import { addLeague } from "../../app/features/league/leagueSlice";

export const AddLeague: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<League>>({
    isSolo: true, // Default to Solo
    rules: [],
    positions: [],
  });
  const [showModal, setShowModal] = useState(false);

  const updateFormData = (data: Partial<League>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
    if (step === 5) setShowModal(true);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const btnBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/leagues");
    }
  };

  const handleStepClick = (selectedStep: number) => {
    setStep(selectedStep);
  };

  const handleSubmit = () => {
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.nameEn || "");
    formDataToSubmit.append("game", formData.game || "");
    formDataToSubmit.append("partner", formData.partner || "");
    formDataToSubmit.append("about", formData.about || "");
    formDataToSubmit.append("tags", JSON.stringify(formData.tags || []));
    formDataToSubmit.append("isSolo", String(formData.isSolo || false));
    formDataToSubmit.append("totalPlayers", String(formData.totalPlayers || 0));
    if (!formData.isSolo) {
      formDataToSubmit.append(
        "minPlayersPerTeam",
        String(formData.minPlayersPerTeam || 2)
      );
      formDataToSubmit.append(
        "maxPlayersPerTeam",
        String(formData.maxPlayersPerTeam || 5)
      );
    }
    formDataToSubmit.append("prizePool", String(formData.prizePool || 0));
    formDataToSubmit.append(
      "positions",
      JSON.stringify(formData.positions || [])
    );
    formDataToSubmit.append(
      "isEndlessPlayers",
      String(formData.isEndlessPlayers || false)
    );
    formDataToSubmit.append("isFeatured", String(formData.isFeatured || false));
    if (formData.hydraulicsImage)
      formDataToSubmit.append("hydraulicsImage", formData.hydraulicsImage);
    if (formData.mobileHeader)
      formDataToSubmit.append("mobileHeader", formData.mobileHeader);
    if (formData.bannerImage)
      formDataToSubmit.append("bannerImage", formData.bannerImage);
    formDataToSubmit.append(
      "leagueBannerLink",
      formData.leagueBannerLink || ""
    );
    formDataToSubmit.append("endDate", formData.endDate || "");
    formDataToSubmit.append(
      "rules",
      JSON.stringify(formData.rules?.map((rule) => rule.id || rule) || [])
    );
    formDataToSubmit.append(
      "startDate",
      formData.startDate || new Date().toISOString()
    );

    dispatch(addLeague(formDataToSubmit)).then((result) => {
      if (addLeague.fulfilled.match(result)) {
        navigate("/leagues");
      }
      setShowModal(false);
    });
  };

  return (
    <Layout>
      <div className="nf_leg_steps-block">
        <div className="nf_step_head-con flex items-center pb-4 border-b border-light-border">
          <a
            href="#"
            className="flex items-center gap-2 hover:opacity-[0.75] duration-300 text-white font-base lg:text-[1.26rem] py-2"
            onClick={btnBack}
          >
            <span>
              <svg
                width="1.26rem"
                height="1.26rem"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.125 3.75L6.875 10L13.125 16.25"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Back
          </a>
          <h3 className="flex-1 text-white text-center font-bold text-[1.25rem]">
            Add new league
          </h3>
        </div>
      </div>

      <div className="leg_steps--con flex items-center justify-center my-[1.67rem] gap-[0.35rem]">
        {[1, 2, 3, 4, 5].map((num) => (
          <div
            key={num}
            className={`leg_steps--num flex items-center gap-[0.35rem] ${
              step >= num ? "active-step" : ""
            }`}
            onClick={() => handleStepClick(num)}
            style={{ cursor: "pointer" }}
          >
            <span
              className={`steps-num leading-none ${
                step >= num ? "bg-[#007EFF]" : "bg-light-border"
              } w-[1.67rem] h-[1.67rem] flex items-center justify-center text-white rounded-[1.67rem]`}
            >
              {num}
            </span>
            {num !== 5 && (
              <span
                className={`step-line inline-block w-[1rem] h-[0.1rem] ${
                  step >= num ? "bg-[#007EFF]" : "bg-light-border"
                } rounded-[0.2rem]`}
              ></span>
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <LeagueSteps1 formData={formData} onChange={updateFormData} />
      )}
      {step === 2 && (
        <LeagueSteps2 formData={formData} onChange={updateFormData} />
      )}
      {step === 3 && (
        <LeagueSteps3 formData={formData} onChange={updateFormData} />
      )}
      {step === 4 && (
        <LeagueSteps4 formData={formData} onChange={updateFormData} />
      )}
      {step === 5 && (
        <LeagueSteps5 formData={formData} onChange={updateFormData} />
      )}

      <div className="max-w-[42.5rem] mx-auto genral_form-info mb-4">
        <div className="flex items-center justify-end gap-2 mt-[1.8rem]">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className="bg-gray-gradient w-[6.25rem] mb-4 text-white bg-blue-700 hover:opacity-[0.75] font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 duration-300 focus:outline-none disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="bg-primary-gradient w-[6.25rem] mb-4 text-white bg-blue-700 hover:opacity-[0.75] duration-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none disabled:opacity-50"
          >
            {step === 5 ? "Submit" : "Next Step"}
          </button>
        </div>
      </div>

      {showModal && (
        <ModalPopUp
          onConfirm={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      )}
    </Layout>
  );
};
