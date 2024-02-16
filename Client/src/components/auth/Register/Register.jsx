import React from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import registerValidation from "../../../validation/registerValidation";
import { register } from "../../helper/userHelper";
import { useAuthStore } from "../../../store/store";
import avatar from "../../../assets/profile.png";

export default function Register() {
  const navigate = useNavigate();
  const { setUserId, setIsAdmin, setUsername } = useAuthStore();

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const response = await register(values);
        if (response.success) {
          toast.success("Registered Successfully...!");
          setUserId(response.userId);
          setIsAdmin(response.isAdmin);
          setUsername(values.username);
          navigate("/");
        } else {
          toast.error("Could not Register.");
        }
      } catch (error) {
        toast.error("Could not Register.");
      }
    },
  });

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className="">
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Register</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Happy to join you!
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img src={avatar} className="" alt="avatar" />
              </label>
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("email")}
                className=""
                type="text"
                placeholder="Email*"
              />
              <input
                {...formik.getFieldProps("username")}
                className=""
                type="text"
                placeholder="Username*"
              />
              <input
                {...formik.getFieldProps("password")}
                className=""
                type="text"
                placeholder="Password*"
              />
              <button className="" type="submit">
                Register
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Already a member?{" "}
                <Link className="text-red-500" to="/login">
                  Login Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
