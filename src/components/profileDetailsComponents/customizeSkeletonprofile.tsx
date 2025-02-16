"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import customize from "../../../public/customize.svg";
import innerCustomize from "../../../public/customize2.svg";
import { auth } from "@/utils/firebaseconfig";
import { userProps, websites } from "@/dataTypes";

import linkimage from "../../../public/link.svg";
import arrow from "../../../public/arrow.svg";
import addimage from "../../../public/addimage.svg";
import arrowFrontendMentor from "../../../public/arrowFrontendmentor.svg";
import changeimage from "../../../public/changeimage.svg";
import { useStateContext } from "../context/stateContext";
import {
  getShowUser,
  linksOfUsersAndFirstNameAndLastName,
  UpdateImage,
  updateFirstNameLastName
} from "@/app/api/user";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "../loader";
import { uploadToCloudinary } from "@/app/api/uploadImage";
import { Link2 } from "lucide-react"; 
interface addLinkprops {
  name: string;
  link: string;
  image?: string;
  backgroundColor?: string;
}
type openDropDownState = {
  boolean1: boolean;
};
const initialState: openDropDownState[] = [{ boolean1: false }];
const CustomizeProfileDetails = () => {
  const router = useRouter();

  const {
    userDetails,
    setUserDetails,
    currentUserIdData,
    setCurrentUserIdData
  } = useStateContext();
  const { linkAdd, setLinkAdd } = useStateContext();
console.log({linkAdd})
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const users = await getShowUser();
        console.log({ users });
        setUserDetails(users);

        const userId = auth.currentUser?.uid;
        console.log(userId);
        const currentUserData: any = users.find(
          (user: userProps) => user.userId === userId
        );
        console.log(currentUserData);
        if (currentUserData) {
          setCurrentUserIdData(currentUserData);
          console.log(currentUserData?.links);
          if (currentUserData?.links[0].name !== "") {
            setLinkAdd(currentUserData?.links);
          }
          setIsLoading(false);
        } else {
          // router.push("/signup");
          // toast.error("You need to sign in first to use this web app");
        }
        console.log({ currentUserIdData });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);
  console.log({ userDetails });

  const [firstNameValue, setFirstNameValue] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const handleFirstName = (e: { target: { value: string } }) => {
    const value = e.target.value.trim();
    if (!value.includes(" ")) {
      setFirstNameValue(value);
      setFirstNameError("");
    }
  };
  useEffect(() => {
    if (currentUserIdData?.firstName) {
      setFirstNameValue(currentUserIdData.firstName);
    }
  }, [currentUserIdData?.firstName]);

  const [lastNameValue, setLastNameValue] = useState("");
  const handleLastName = (e: { target: { value: string } }) => {
    const value = e.target.value.trim();
    if (!value.includes(" ")) {
      setLastNameValue(value);
      setLastNameError("");
    }
  };
  useEffect(() => {
    if (currentUserIdData?.lastName) {
      setLastNameValue(currentUserIdData.lastName);
    }
  }, [currentUserIdData?.firstName]);
  const validateLinks = () => {
    const newErrors =
      linkAdd &&
      linkAdd.map((linkItem, index) => {
        const website = websites.find((website) =>
          linkItem.link.toLowerCase().startsWith(website.link.toLowerCase())
        );

        if (!linkItem.link.trim()) {
          return "Link cannot be empty";
        }

        if (!website) {
          return "Link NO valid";
        }

        return null;
      });
  };
  //   image logic
  const [profileImage, setProfileImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null | any>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const types: string[] = ["image/png", "image/jpeg"];
  const [imageIsLoading, setImageIsLoading] = useState(true);
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select JPG or PNG files only");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return;
    }

    try {
      setImageLoading(true);
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("Not authenticated");

      const cloudinaryUrl = await uploadToCloudinary(file);
      await UpdateImage(userId, cloudinaryUrl);

      setImageURL(cloudinaryUrl);
      setCurrentUserIdData((prev) => ({
        ...prev,
        profileImage: cloudinaryUrl
      }));

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    console.log({ imageURL });
  }, [imageURL]);
  const [saveLoading, setSaveLoading] = useState(false);
  const handleSave = async (index: number) => {
    setSaveLoading(true);
    // Clear previous error messages
    setFirstNameError("");
    setLastNameError("");

    // Validate first name and last name
    let valid = true;
    if (!firstNameValue.trim()) {
      setFirstNameError("First name cannot be empty");
      valid = false;
    }
    if (!lastNameValue.trim()) {
      setLastNameError("Last name cannot be empty");
      valid = false;
    }

    // Proceed if there are no validation errors
    if (valid) {
      validateLinks();
      // Your existing save logic here
      const userId = auth?.currentUser?.uid;
      const update = await updateFirstNameLastName(
        userId,
        firstNameValue,
        lastNameValue
      );
      setCurrentUserIdData((prevData: any) => ({
        ...prevData,
        firstName: firstNameValue,
        lastName: lastNameValue
      }));

      toast.success("saved successfully");
      setSaveLoading(false);
      // ...
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center">
          {/* <h1>LOADING...</h1> */}
          <Loader />
        </div>
      ) : (
        <div className="flex grid-cols-2 mt-10 gap-6 mx-6 ">
          <div className="shadow-4xl  max-[1180px]:hidden  self-start h-full w-[40rem] xl:w-[65rem]   max-w-full py-[6rem] border-solid border-2 rounded-[0.75rem] border-[#fff] px-[4rem] flex flex-col bg-[#fff] justify-center items-center">
            <div className="relative w-[304px] flex flex-col items-start justify-start max-w-full">
              <Image src={customize} width={304} height={615} alt="phone" />
              <Image
                className="absolute top-3  left-3   flex justify-center items-center"
                src={innerCustomize}
                width={280}
                height={634}
                alt="phone"
              />
              {/* profile image */}
              <div className="flex justify-center  absolute top-24 left-[-50%] right-[-50%] flex-col items-center gap-6">
                {currentUserIdData.profileImage ? (
                  <div className="bg-[#EEE] border-solid rounded-[50%] border-4 border-[#633CFF] w-[6rem] h-[6rem] flex justify-center items-center overflow-hidden">
                    <Image
                      src={currentUserIdData.profileImage}
                      className={`rounded-[50%] w-full h-full object-cover transition-opacity duration-300 ${
                        imageIsLoading ? "opacity-0" : "opacity-100"
                      }`}
                      width={96}
                      height={96}
                      alt="profile image"
                      loading="lazy"
                      onLoadingComplete={() => setImageIsLoading(false)}
                      onError={() => setImageIsLoading(false)}
                    />
                    {imageIsLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#633CFF]" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-[#EEE] border-solid border rounded-[50%] border-[#EEE] w-[6rem] h-[6rem] flex justify-center items-center" />
                )}
                <div className="flex justify-center items-center flex-col">
                  {currentUserIdData &&
                  currentUserIdData.firstName === "" &&
                  currentUserIdData?.lastName === "" ? (
                    <div className="w-[10rem] h-[1rem] bg-[#EEE] rounded-[6.5rem] "></div>
                  ) : (
                    <div>
                      <p className="text-[#737373] font-normal text-base leading-[150%]">
                        {" "}
                        {currentUserIdData?.firstName}{" "}
                        {currentUserIdData?.lastName}
                      </p>{" "}
                    </div>
                  )}
                  {currentUserIdData && currentUserIdData.email === "" ? (
                    <div className="w-[4.5rem] mt-2 h-[0.5rem] bg-[#EEE] rounded-[6.5rem] "></div>
                  ) : (
                    <div>
                      <p className="text-[#737373] font-normal text-base leading-[150%]">
                        {" "}
                        {currentUserIdData?.email}
                      </p>{" "}
                    </div>
                  )}
                </div>
              </div>
              {/* the links */}
              <div className="flex flex-col absolute top-[17rem] left-[10%] w-[80%] gap-5">
                {/* {websites.find(
                          (web) =>
                            web.name.toLowerCase() === links.name.toLowerCase()
                        )?.image */}

                {[...Array(5)].map((_, index) => (
                  <React.Fragment key={index}>
                    {linkAdd[index] ? (
                      <Link href={linkAdd[index].link} target="blank">
                        <div
                          className="h-[2.75rem]  cursor-pointer justify-between px-4 flex items-center w-full rounded-[0.5rem]"
                          // onClick={() => router.push(linkAdd[index].link)}
                          style={{
                            backgroundColor:
                              websites.find(
                                (web) =>
                                  web.name.toLowerCase() ===
                                  linkAdd[index].name.toLowerCase()
                              )?.backgroundColor || "#633CFF",
                            color:
                              linkAdd[index].name.toLowerCase() ===
                              "frontend mentor"
                                ? "#333"
                                : websites.find(
                                    (web) =>
                                      web.name.toLowerCase() ===
                                      linkAdd[index].name.toLowerCase()
                                  )?.textColor || "#fff",
                            border:
                              linkAdd[index].name.toLowerCase() ===
                              "frontend mentor"
                                ? "1px solid #D9D9D9"
                                : "none"
                          }}
                        >
<div className="flex items-center gap-2">
  {websites.find(
    (web) =>
      web.name.toLowerCase() === linkAdd[index].name.toLowerCase()
  )?.image ? (
    <Image
      className=""
      src={
        websites.find(
          (web) =>
            web.name.toLowerCase() === linkAdd[index].name.toLowerCase()
        )?.previewImage
      }
      alt={linkAdd[index]?.name}
      height={16}
      width={16}
    />
  ) : (
    <Link2 size={16} color="white" />
  )}
  <h1 className="text-[0.75rem] font-normal leading-[150%]">
    {linkAdd[index]?.name}
  </h1>
</div>
                          <Image
                            className=""
                            src={
                              linkAdd[index].name.toLowerCase() ===
                              "frontend mentor"
                                ? arrowFrontendMentor
                                : arrow
                            }
                            alt="arrow"
                            width={16}
                            height={16}
                          />
                        </div>
                      </Link>
                    ) : (
                      <div className="h-[2.75rem] w-full rounded-[0.5rem] bg-[#EEE]"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-[#FFF] w-[100%]  h-full p-4 max-[320px]:p-0 sm:p-[2.5rem] rounded-[0.75rem] ">
            <div>
              <h1 className="text-[#333] text-[1.5rem] sm:text-[2rem] font-bold leading-[150%]">
                Profile Details{" "}
              </h1>
              <p className="text-[#737373] text-base font-normal leading-[150%] ">
                Add your details to create a personal touch to your profile.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-6  p-[1.25rem]  bg-[#FAFAFA]   rounded-[0.75rem]  items-center mt-[2.5rem]">
              <div className="lg:w-[35%]">
                <p className="text-[#737373] text-base font-normal leading-[150%] ">
                  Profile picture{" "}
                </p>{" "}
              </div>
              <div className="flex sm:flex-row flex-col  sm:items-center gap-[1.5rem]">
                {currentUserIdData.profileImage === "" ? (
                  <label className="flex justify-center max-[640px]:w-[70%] p py-[3.8rem] sm:w-[100%] lg:w-[50%] items-center flex-col bg-[#EFEBFF] rounded-[0.75rem]">
                    {imageLoading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#633CFF]"></div>
                        <p className="text-[#633CFF] text-sm">Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <Image
                          src={addimage}
                          alt="image"
                          width={40}
                          height={40}
                        />
                        <input
                          type="file"
                          accept=".jpg .png"
                          hidden
                          onChange={handleFileChange}
                        />
                        <p className="text-center cursor-pointer text-[#633CFF] text-base font-semibold leading-[150%]">
                          + Upload Image
                        </p>
                      </>
                    )}
                  </label>
                ) : (
                  <div className="relative lg:w-[35%] max-[370px]:w-full max-[640px]:w-[70%] items-center flex-col rounded-[0.75rem]">
                    {imageLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-[0.875rem]">
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                          <p className="text-white text-sm">Uploading...</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Image
                          src={currentUserIdData.profileImage}
                          alt="profileimage"
                          className="rounded-[0.875rem] w-full h-full object-cover"
                          width={204}
                          height={204}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-[0.875rem]">
                          <label className="text-center flex justify-center items-center flex-col cursor-pointer text-[#fff] text-[0.7rem] sm:text-base font-semibold leading-[150%]">
                            <Image
                              src={changeimage}
                              width={40}
                              height={40}
                              className="w-1/2"
                              alt="change image"
                            />
                            <input
                              type="file"
                              accept="image/jpeg, image/jpg, image/png"
                              hidden
                              onChange={handleFileChange}
                            />
                            Change Image
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <p className="text-[#737373] sm:w-[30%] text-[0.75rem] font-normal leading-[150%]">
                  Image must be below 1024x1024px. Use PNG or JPG format.
                </p>
              </div>
            </div>

            {/* input */}
            <div className="p-6 relative mt-[1.5rem] rounded-[0.75rem] flex flex-col bg-[#FAFAFA] gap-[0.75rem]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex justify-center relative gap-0 sm:gap-4 items-center">
                <h1 className="text-[#737373] w-[15rem] max-w-full text-[0.75rem] sm:text-base font-normal leading-[150%]">
                  First name*
                </h1>
                <input
                  type="text"
                  className={`px-4 ${
                    firstNameError
                      ? "border-red-500 border focus:ring-0 focus:ring-red-500 hover:shadow-[white] hover:border-red-500"
                      : ""
                  } "px-4  hover:shadow-purple-2xl ring:shadow-purple-2xl hover:border-[#633CFF] cursor-pointer focus:ring-input_focus focus:shadow-lg  outline-none focus:ring-1 focus:ring-[#633CFF] mt-[0.25rem]  py-3 text-opacity-50 placeholder:text-opacity-50 border border-solid w-full border-[#D9D9D9] rounded-[0.5rem] bg-[#fff] text-[#333] text-base leading-[150%] font-normal placeholder:text-[#333] placeholder:text-base placeholder:leading-[150%] placeholder:font-normal"
                  `}
                  value={firstNameValue}
                  onKeyDown={(e) => {
                    if (e.key === " ") {
                      e.preventDefault();
                    }
                  }}
                  onChange={handleFirstName}
                  placeholder="e.g. John"
                />{" "}
                {firstNameError && (
                  <p className="text-red-500 sm:absolute  top-[2.45rem] sm:top-5 right-4 text-[0.75rem] sm:text-sm">
                    {firstNameError}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex justify-center relative gap-0 sm:gap-4 items-center">
                <h1 className="text-[#737373] w-[15rem] max-w-full text-[0.75rem] sm:text-base font-normal leading-[150%]">
                  Last name*
                </h1>
                <input
                  type="text"
                  className={`px-4 ${
                    lastNameError
                      ? "border-red-500 border focus:ring-0 focus:ring-red-500 hover:shadow-[white] hover:border-red-500"
                      : ""
                  } "px-4  hover:shadow-purple-2xl ring:shadow-purple-2xl hover:border-[#633CFF] cursor-pointer focus:ring-input_focus focus:shadow-lg  outline-none focus:ring-1 focus:ring-[#633CFF] mt-[0.25rem]  py-3 text-opacity-50 placeholder:text-opacity-50 border border-solid w-full border-[#D9D9D9] rounded-[0.5rem] bg-[#fff] text-[#333] text-base leading-[150%] font-normal placeholder:text-[#333] placeholder:text-base placeholder:leading-[150%] placeholder:font-normal"
                `}
                  value={lastNameValue}
                  onChange={handleLastName}
                  onKeyDown={(e) => {
                    if (e.key === " ") {
                      e.preventDefault();
                    }
                  }}
                  placeholder="e.g. Appleesed"
                />{" "}
                {lastNameError && (
                  <p className="text-red-500 sm:absolute  top-[2.45rem] sm:top-5 right-4 text-[0.75rem] sm:text-sm">
                    {lastNameError}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex justify-center relative gap-0 sm:gap-4 items-center">
                <h1 className="text-[#737373] w-[15rem] max-w-full text-[0.75rem] sm:text-base font-normal leading-[150%]">
                  Email
                </h1>
                <input
                  type="email"
                  disabled={false}
                  className={`px-4        outline-none   mt-[0.25rem]  py-3 text-opacity-50 placeholder:text-opacity-50 border border-solid w-full border-[#D9D9D9] rounded-[0.5rem] bg-[#fff] text-[#333] text-base leading-[150%] font-normal placeholder:text-[#333] placeholder:text-base placeholder:leading-[150%] placeholder:font-normal`}
                  value={currentUserIdData?.email}
                  placeholder="e.g. email@example.com"
                />{" "}
              </div>
            </div>
            <hr className="bg-[#D9D9D9] mt-[2.5rem]" />
            <div className="flex justify-end items-end">
              {/* {allLinksMatch && ( */}
              <button
                onClick={() => handleSave(0)}
                className={`${
                  saveLoading ? "bg-[#BEADFF]" : "bg-[#633CFF]"
                } text-white mt-[1.5rem] sm:w-fit w-full rounded-[0.5rem] cursor-pointer bg-[#633CFF]  py-[0.6875rem] px-[1.6875rem] text-base font-semibold leading-[150%]`}
              >
                Save
              </button>
              {/* )} */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomizeProfileDetails;
