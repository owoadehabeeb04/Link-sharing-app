"use client";
import React, { useState } from "react";
import devlinks from "../../../public/devlinks.svg";
import devlinkstext from "../../../public/devlinktext.svg";
import email from "../../../public/email.svg";
import password from "../../../public/password.svg";
// import auth from "../../utils/firebaseconfig";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "@/utils/firebaseconfig";
import { useRouter } from "next/navigation";
import FirebaseError from "firebase/auth";
import { errorMessages } from "@/utils/errorFirebaseMessage";
import { createUser, getShowUser } from "../api/user";
import { useStateContext } from "@/components/context/stateContext";
const Signup = () => {
  const [emailValue, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [passwordValue, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const { setActivePage } = useStateContext();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    setUserDetails,
    userDetails,
    currentUserIdData,
    setCurrentUserIdData,
  } = useStateContext();

  const validateForm = () => {
    let isValid = true;

    // Validate email
    if (!emailValue) {
      setErrorEmail("cant be empty");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(emailValue)) {
      setErrorEmail("not valid");
      isValid = false;
    } else {
      setErrorEmail("");
    }

    // Validate password
    if (!passwordValue) {
      setErrorPassword("cant be required");
      isValid = false;
    } else if (passwordValue.length < 8) {
      setErrorPassword("Password must be at least 8 characters long");
      isValid = false;
    } else {
      setErrorPassword("");
    }

    // Validate confirm password
    if (!confirmPassword) {
      setErrorConfirmPassword("cant be empty");
      isValid = false;
    } else if (confirmPassword !== passwordValue) {
      setErrorConfirmPassword("Passwords do not match");
      isValid = false;
    } else {
      setErrorConfirmPassword("");
    }

    return isValid;
  };

  const submitLogin = async () => {
    // Reset errors
    if (!validateForm()) {
      return;
    }
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, emailValue, passwordValue);

      setLoading(true);
      toast.success("sign in succesfully");
      const userId = auth.currentUser?.uid;

      const mail = auth?.currentUser?.email;
      const userEmail = mail ?? "";
      console.log(userEmail);

      // Check if userId is defined
      if (!userId) {
        throw new Error("Failed to obtain user ID");
      }

      // Save user data to firebase
      await createUser({
        firstName: "",
        lastName: "",
        email: userEmail,
        userId: userId,
        password: passwordValue,
        profileImage: "",
        links: [
          {
            name: "",
            link: "",
            userId: "",
            backgroundColor: "",
          },
        ],
      });

      console.log("User ID:", userId);
      router.push("addLink/" + userId);
      setActivePage("Links");

      try {
        let users = await getShowUser();
        console.log({ users });
        setUserDetails(users);
        console.log({ userDetails });
        // console.log(userDetails);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      //
    } catch (err: any) {
      const errorCode = err.code;
      const userFriendlyMessage =
        errorMessages[errorCode] ||
        "An unknown error occurred. Please try again.";
      console.error(err);
      toast.error(userFriendlyMessage);
    }

    // Reset the loading state after login attempt
    setLoading(false);
  };

  return (
    <div className="bg-white flex w-full justify-center  h-screen transition-all  items-center">
      <div className="border-2 border-white w-[550px] max-w-full   pb-[2.5rem]  transition-all px-[2rem] sm:px-[2.5rem] border-solid shadow-lg flex flex-col gap-[3.19rem] ">
        <div className="flex sm:justify-center justify-start  transition-all items-center gap-2">
          <Image src={devlinks} width="40" height="40" alt="devlinks" />

          <Image src={devlinkstext} width="135" height="18" alt="devlinks" />
        </div>
        <div className="flex flex-col gap-[2.5rem] ">
          <div>
            <h1 className="text-[#333] text-[1.5rem] sm:text-[2rem] leading-[150%] font-bold ">
              Create account
            </h1>
            <p className="pt-2 text-[#737373] text-base font-normal leading-[150%] ">
              Let’s get you started sharing your links!{" "}
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
                    onChange={(e) => setEmail(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
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
              {/* confirmPassword */}
              <div className="mt-6">
                <label
                  htmlFor="password"
                  className={`   ${
                    errorConfirmPassword !== ""
                      ? "text-[#FF3939]"
                      : "text-[#333]"
                  } text-[#333] text-[0.75rem] leading-[150% font-normal]`}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    className={` pl-9  focus:ring-input_focus focus:shadow-lg active:border-[#633CFF] outline-none   focus:ring-1 focus:ring-[#633CFF]   mt-[0.25rem] pr-4 py-3 text-opacity-50 placeholder:text-opacity-50   border border-solid w-full border-[#D9D9D9] rounded-[0.5rem] bg-[#fff] text-[#333] text-base leading-[150%]  font-normal   placeholder:text-[#333] placeholder:text-base placeholder:leading-[150%]  placeholder:font-normal 
                    ${
                      errorConfirmPassword !== ""
                        ? "border-[#FF3939] focus:ring-0 focus:ring-[#FF3939]     "
                        : "border-[#D9D9D9]"
                    }`}
                    placeholder="Enter your password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Image
                    src={password}
                    className="absolute top-5 left-4"
                    width={16}
                    height={16}
                    alt="email"
                  />

                  <p className=" absolute top-5 right-4 text-[#FF3939] text-[0.75rem] font-normal leading-[150%] text-right ">
                    {errorConfirmPassword}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <p className=" text-[#737373] text-[0.75rem] text-left text-base leading-[150%]">
                  Password must contain at least 8 characters{" "}
                </p>
              </div>
              <div className="mt-6">
                <button
                  onClick={submitLogin}
                  className={` ${
                    loading && "bg-[#BEADFF] loading-email"
                  } text-[#fff] text-base  leading-[150%] font-semibold w-full py-[0.6875rem] px-[1.6875rem] flex justify-center items-center gap-2 rounded-[0.5rem] border-none bg-[#633CFF]`}
                >
                  Create new account{" "}
                </button>
              </div>
            </div>

            <p className=" text-[#737373] text-center text-base leading-[150%]">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#633CFF] text-base underline-none"
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
