import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AppDispatch, RootState } from "../../app/store";
import { LoginRequest } from "../../app/types";
import { login } from "../../app/features/auth/authSlice";

// Define validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .matches(/^\S.*\S$/, "Email cannot start or end with spaces"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required")
    .matches(/^\S.*\S$/, "Password cannot start or end with spaces"),
});

export const LoginForm: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector(
    (state: RootState) => state.auth
  );

  React.useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="nf_user_form h-screen flex justify-center items-center">
      <div className="w-[400px]">
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values: LoginRequest, { resetForm }) => {
            dispatch(login(values));
            setTimeout(() => {
              resetForm();
            }, 1000);
          }}
        >
          {({ isSubmitting }) => (
            <Form id="form" className="validate">
              <h4 className="text-white mb-5 text-base font-medium text-center">
                Login
              </h4>
              <div className="relative float-label-input custom-input mb-4">
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder=""
                  className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
                />
                <label
                  htmlFor="email"
                  className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                >
                  Email
                </label>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-[0.78125rem] mt-1"
                />
              </div>
              <div className="relative float-label-input custom-input mb-4">
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder=""
                  className="block w-full text-[0.78125rem] text-white focus:outline-0 focus:!border focus:!border-[#2792FF] pt-[1.5rem] pb-[0.35rem] bg-input-color rounded-[0.52rem] px-3 block appearance-none leading-normal"
                />
                <label
                  htmlFor="password"
                  className="absolute top-3 left-0 translate-y-[0.2rem] font-bold text-[0.78125rem] pointer-events-none transition duration-200 bg-transparent px-3 text-custom-gray"
                >
                  Password
                </label>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-[0.78125rem] mt-1"
                />
              </div>
              <div className="flex items-center justify-end gap-2 mt-[1.8rem]">
                <button
                  type="submit"
                  className="bg-primary-gradient w-[6.25rem] mb-4 text-white bg-blue-700 hover:opacity-[0.75] duration-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
                  disabled={loading || isSubmitting}
                >
                  {loading || isSubmitting ? "Logging in" : "Login"}
                </button>
              </div>
              {error && <p className="text-red-500">{error}</p>}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
