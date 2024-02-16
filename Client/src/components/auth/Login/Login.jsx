import React from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { login } from "../../helper/userHelper";
import { loginVerify } from "../../../validation/loginValidation";

export default function Login() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const loginErrors = await loginVerify({
        username: values.username,
        password: values.password,
      });
      if (Object.keys(loginErrors).length === 0) {
        try {
          const response = await login(values.username, values.password);
          if (response.token) {
            navigate("/");
          } else {
            toast.error("Invalid username or password!");
          }
        } catch (error) {
          handleLoginError();
        }
      } else {
        Object.values(loginErrors).forEach((error) => toast.error(error));
      }
    },
  });

  const handleLoginError = () => {
    toast.error("Login failed!");
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className="">
          <div className="title flex flex-col items-center">
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Explore More by connecting with us.
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("username")}
                className=""
                type="text"
                placeholder="Username"
              />
              <input
                {...formik.getFieldProps("password")}
                className=""
                type="password"
                placeholder="Password"
              />
              <button className="" type="submit">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
