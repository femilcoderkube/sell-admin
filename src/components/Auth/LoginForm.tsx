import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { AppDispatch, RootState } from "../../app/store";
import { LoginRequest } from "../../app/types";
import { login } from "../../app/features/auth/authSlice";

export const LoginForm: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    console.log("====================================");
    console.log("hereeeeeee login");
    console.log("====================================");
    e.preventDefault();
    const loginRequest: LoginRequest = { email, password };
    dispatch(login(loginRequest));
  };

  return (
    <div className="nf_user_form">
      <form onSubmit={handleSubmit} id="form" className="validate">
        <h4 className="text-white mb-5 text-base font-medium text-center">
          Login
        </h4>
        <div className="relative float-label-input custom-input mb-4">
          <input
            type="email"
            id="email"
            name="email"
            placeholder=""
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className=" block w-full text-[0.78125rem] text-white  focus:outline-0 focus:!border focus:!border-[#2792FF]  pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal "
          />
          <label
            htmlFor="name"
            className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
          >
            Email
          </label>
        </div>
        <div className="relative float-label-input custom-input mb-4">
          <input
            type="password"
            id="password"
            name="password"
            placeholder=""
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=" block w-full text-[0.78125rem] text-white  focus:outline-0 focus:!border focus:!border-[#2792FF]  pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem]  px-3 block appearance-none leading-normal "
          />
          <label
            htmlFor="name"
            className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
          >
            Password
          </label>
        </div>
        <div className="flex items-center justify-end gap-2 mt-[1.8rem]">
          <button
            type="submit"
            className="bg-primary-gradient w-[6.25rem] mb-4 text-white bg-blue-700 hover:opacity-[0.75] duration-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none "
            disabled={loading}
          >
            {loading ? "Logging in" : "Login"}
          </button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};
