"use client";
import React, { useState } from "react";
import devlinks from "../../../public/devlinks.svg";
import devlinkstext from "../../../public/devlinktext.svg";
import email from "../../../public/email.svg";
import password from "../../../public/password.svg";
import { signInWithEmailAndPassword } from "firebase/auth";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { auth } from "@/utils/firebaseconfig";
import { useRouter } from "next/navigation";
import { errorMessages } from "@/utils/errorFirebaseMessage";
import { useStateContext } from "@/components/context/stateContext";
import { ProtectedRoute } from "@/components/specialRoutes/protectedRoute";
const Login = () => {
  const [emailValue, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [passwordValue, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { setActivePage } = useStateContext();
  const validateForm = () => {
    let isValid = true;

    // Validate email
    if (!emailValue) {
      setErrorEmail("cant be empty");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(emailValue)) {
      setErrorEmail("email not valid");
      isValid = false;
    } else {
      setErrorEmail("");
    }

    // Validate password
    if (!passwordValue) {
      setErrorPassword("cant be empty");
      isValid = false;
    } else if (passwordValue.length < 8) {
      setErrorPassword("please check again");
      isValid = false;
    } else {
      setErrorPassword("");
    }

    return isValid;
  };

  const submitLogin = async () => {
    if (!validateForm()) {
      console.log('not valid')
      return;
    }
    console.log("clicked");
    setLoading(true);
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        emailValue,
        passwordValue
      );
      const user = userCredentials.user;
      const userId = auth?.currentUser?.uid;
      console.log(user);
      if (user) {
        // alert("success");
        setEmail("");
        setPassword("");
        // localStorage.setItem("loggedIn", JSON.stringify(true));
        toast.success("Log in successfully");
        router.push("addLink/" + userId);
        setActivePage("Links");
      } else {
        // alert("failed");
      }
    } catch (err: any) {
      const errorCode = err.code;
      const userFriendlyMessage =
        errorMessages[errorCode] ||
        "An unknown error occurred. Please try again.";
      console.error(err);
      toast.error(userFriendlyMessage);
    }
    setLoading(false);
  };

  return (
    <ProtectedRoute>

    <div className="bg-white flex w-full justify-center mt-8 sm:mt-0   sm:h-screen transition-all  items-center">
      <div className="border-2 border-white  pb-[2.5rem]  transition-all px-[2rem] sm:px-[2.5rem] border-solid shadow-lg flex flex-col gap-[3.19rem] ">
        <div className="flex sm:justify-center justify-start  transition-all items-center gap-2">
          <Image src={devlinks} width="40" height="40" alt="devlinks" />

          <Image src={devlinkstext} width="135" height="18" alt="devlinks" />
        </div>
        <div className="flex flex-col gap-[2.5rem] ">
          <div>
            <h1 className="text-[#333] text-[1.5rem] sm:text-[2rem] leading-[150%] font-bold ">
              Login
            </h1>
            <p className="pt-2 text-[#737373] text-base font-normal leading-[150%] ">
              Add your details below to get back into the app
            </p>
          </div>
          <div className="flex gap-6 flex-col w-full ">
            <div>
              {/* email */}
              <div className="w-full">
                <label
                  htmlFor="email_address"
                  className={`   ${
                    errorEmail !== "" ? "text-[#FF3939]" : "text-[#333]"
                  } text-[#333] text-[0.75rem] leading-[150% font-normal]`}
                >
                  Email address
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    className={` pl-9   focus:ring-input_focus focus:shadow-lg active:border-[#633CFF] outline-none   focus:ring-1 focus:ring-[#633CFF]   mt-[0.25rem] pr-4 py-3 text-opacity-50 placeholder:text-opacity-50   border border-solid w-full border-[#D9D9D9] rounded-[0.5rem] bg-[#fff] text-[#333] text-base leading-[150%]  font-normal   placeholder:text-[#333] placeholder:text-base placeholder:leading-[150%]  placeholder:font-normal 
                    ${
                      errorEmail !== ""
                        ? "border-[#FF3939] focus:ring-0 focus:ring-[#FF3939]    "
                        : "border-[#D9D9D9]"
                    }`}
                    placeholder="e.g. alex@email.com"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorEmail("");
                    }}
                  />
                  <Image
                    src={email}
                    className="absolute top-5 left-4"
                    width={16}
                    height={16}
                    alt="email"
                  />

                  <p className="absolute top-5 right-4 text-[#FF3939] text-[0.75rem] font-normal leading-[150%] text-right ">
                    {errorEmail}
                  </p>
                </div>
                {/* Password */}
              </div>
              <div className="mt-6">
                <label
                  htmlFor="password"
                  className={`   ${
                    errorPassword !== "" ? "text-[#FF3939]" : "text-[#333]"
                  } text-[#333] text-[0.75rem] leading-[150% font-normal]`}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    className={` pl-9  focus:ring-input_focus focus:shadow-lg active:border-[#633CFF] outline-none   focus:ring-1 focus:ring-[#633CFF]   mt-[0.25rem] pr-4 py-3 text-opacity-50 placeholder:text-opacity-50   border border-solid w-full border-[#D9D9D9] rounded-[0.5rem] bg-[#fff] text-[#333] text-base leading-[150%]  font-normal   placeholder:text-[#333] placeholder:text-base placeholder:leading-[150%]  placeholder:font-normal 
                    ${
                      errorPassword !== ""
                        ? "border-[#FF3939] focus:ring-0 focus:ring-[#FF3939]     "
                        : "border-[#D9D9D9]"
                    }`}
                    placeholder="Enter your password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorPassword("");
                    }}
                  />
                  <Image
                    src={password}
                    className="absolute top-5 left-4"
                    width={16}
                    height={16}
                    alt="email"
                  />

                  <p className=" absolute top-5 right-4 text-[#FF3939] text-[0.75rem] font-normal leading-[150%] text-right ">
                    {errorPassword}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={submitLogin}
                  className={` ${
                    loading && "bg-[#BEADFF] loading-email"
                  } text-[#fff] text-base  leading-[150%] font-semibold w-full py-[0.6875rem] px-[1.6875rem] flex justify-center items-center gap-2 rounded-[0.5rem] border-none bg-[#633CFF]`}
                >
                  Login
                </button>
              </div>
            </div>

            <p className=" text-[#737373] text-center text-base leading-[150%]">
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-[#633CFF] text-base underline-none"
              >
                Create account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>

  );
};

export default Login;
