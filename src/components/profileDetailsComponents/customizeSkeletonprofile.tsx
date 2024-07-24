"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import customize from "../../../public/customize.svg";
import innerCustomize from "../../../public/customize2.svg";
import { auth, storage } from "@/utils/firebaseconfig";
import { userProps, websites } from "@/dataTypes";

import linkimage from "../../../public/link.svg";
import arrow from "../../../public/arrow.svg";
import addimage from "../../../public/addimage.svg";
import arrowFrontendMentor from "../../../public/arrowFrontendmentor.svg";
import { useStateContext } from "../context/stateContext";
import {
  getShowUser,
  linksOfUsersAndFirstNameAndLastName,
  uploadImageFile,
  UpdateImage,
} from "@/app/api/user";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  ref,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from "firebase/storage";
import { snapshotEqual } from "firebase/firestore";

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
    setCurrentUserIdData,
  } = useStateContext();
  const [linkAdd, setLinkAdd] = useState<addLinkprops[]>([
    {
      name: "",
      link: "",
      image: "",
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const users = await getShowUser();
        setUserDetails(users);

        const userId = auth.currentUser?.uid;
        console.log(userId);
        const currentUserData: any = users.find(
          (user: userProps) => user.userId === userId
        );

        if (currentUserData) {
          setCurrentUserIdData(currentUserData);
          if (currentUserData?.links) setLinkAdd(currentUserData?.links);
          setIsLoading(false);
        } else {
          router.push("/signup");
          toast.error("You need to sign in first to use this web app");
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

  const handleFirstName = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setFirstNameValue(e.target.value);
    setFirstNameError("");
  };
  const [lastNameValue, setLastNameValue] = useState("");
  const handleLastName = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setLastNameValue(e.target.value);
    setLastNameError("");
  };
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
  const [imageFile, setImageFile] = useState<File | null | any>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const types: string[] = ["image/png", "image/jpeg"];
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    console.log(file);
    if (file) {
      // Check file type
      const selectedFile = e.target.files && e.target.files[0];
      if (selectedFile && types.includes(selectedFile.type)) {
        // Check dimensions
        const img = new window.Image();
        img.src = URL.createObjectURL(file);
        img.onload = async () => {
          if (img.width > 1024 || img.height > 1024) {
            toast.error("Image dimensions must be below 1024x1024px");
            setImageFile(null);
            setImageURL(null);
            return;
          }

          setImageFile(file);
          setImageURL(URL.createObjectURL(file));

          try {
            const userId = auth.currentUser?.uid;
            let url = await uploadImageFile(
              `profile-images/${imageFile?.name}`,
              imageFile
            ); // Ensure a unique path

            setImageURL(url);
            await UpdateImage(userId, url);
          } catch (err) {
            console.error(err);
          }
        };
      } else {
        toast.error("Please select a valid image type (jpg, png)");
        setImageFile(null);
        setImageURL(null);
      }
    }
  };
  console.log({ imageFile });
  const handleUpload = () => {
    if (imageFile) {
      const storageRef = ref(storage, `profile-images/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot: UploadTaskSnapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`upload is ${progress}% done`);
        },
        (error) => {
          console.error(error.message);
        }
      );
    }
  };
  useEffect(() => {
    console.log({ imageURL });
  }, []);
  const handleSave = async (index: number) => {
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
      // ...
    }
  };

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (linkAdd.length === 5 || linkAdd.length > 5) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [linkAdd.length]);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <h1>LOADING...</h1>
        </div>
      ) : (
        <div className="flex grid-cols-2 mt-10 gap-6 mx-6 ">
          <div className="shadow-4xl  hidden self-start h-full w-[65rem]   max-w-full py-[6rem] border-solid border-2 rounded-[0.75rem] border-[#fff] px-[4rem] lg:flex flex-col bg-[#fff] justify-center items-center">
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
              <div className="flex justify-center  absolute top-24 left-[23%] flex-col items-center gap-6">
                {currentUserIdData && currentUserIdData.profileImage === "" ? (
                  <div className="bg-[#EEE] border-solid border rounded-[50%] border-[#EEE] w-[6rem] h-[6rem] flex justify-center items-center"></div>
                ) : (
                  <div className="bg-[#EEE] border-solid  rounded-[50%] border-4 border-[#633CFF] w-[6rem] h-[6rem] flex justify-center items-center">
                    <Image
                      src={currentUserIdData?.profileImage}
                      className="rounded-[50%] object-cover"
                      width={96}
                      height={96}
                      alt="profile image"
                    />
                  </div>
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
                      <div
                        className="h-[2.75rem] cursor-pointer justify-between px-4 flex items-center w-full rounded-[0.5rem]"
                        style={{
                          backgroundColor:
                            websites.find(
                              (web) =>
                                web.name.toLowerCase() ===
                                linkAdd[index].name.toLowerCase()
                            )?.backgroundColor || "#EEE",
                          color:
                            linkAdd[index].name.toLowerCase() ===
                            "frontend mentor"
                              ? "#333"
                              : websites.find(
                                  (web) =>
                                    web.name.toLowerCase() ===
                                    linkAdd[index].name.toLowerCase()
                                )?.textColor || "#000",
                          border:
                            linkAdd[index].name.toLowerCase() ===
                            "frontend mentor"
                              ? "1px solid #D9D9D9"
                              : "none",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {websites.find(
                            (web) =>
                              web.name.toLowerCase() ===
                              linkAdd[index].name.toLowerCase()
                          )?.image && (
                            <Image
                              className=""
                              src={
                                websites.find(
                                  (web) =>
                                    web.name.toLowerCase() ===
                                    linkAdd[index].name.toLowerCase()
                                )?.previewImage
                              }
                              alt={linkAdd[index]?.name}
                              height={16}
                              width={16}
                            />
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
                    ) : (
                      <div className="h-[2.75rem] w-full rounded-[0.5rem] bg-[#EEE]"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-[#FFF] w-[100%]  h-full p-[2.5rem] rounded-[0.75rem] ">
            <div>
              <h1 className="text-[#333] text-[2rem] font-bold leading-[150%]">
                Profile Details{" "}
              </h1>
              <p className="text-[#737373] text-base font-normal leading-[150%] ">
                Add your details to create a personal touch to your profile.
              </p>
            </div>
            <div className="flex gap-6  p-[1.25rem]  bg-[#FAFAFA]   rounded-[0.75rem]  items-center mt-[2.5rem]">
              <div className="sm:w-[35%]">
                <p className="text-[#737373] text-base font-normal leading-[150%] ">
                  Profile picture{" "}
                </p>{" "}
              </div>

              <label className="flex justify-center sm:w-[35%] py-[3.8rem] items-center flex-col  bg-[#EFEBFF] rounded-[0.75rem]">
                <Image src={addimage} alt="image" width={40} height={40} />
                <input type="file" hidden onChange={handleFileChange} />
                <p className="text-center cursor-pointer  text-[#633CFF] text-base font-semibold leading-[150%]">
                  + Upload Image
                </p>
              </label>

              <p className="text-[#737373] sm:w-[30%] text-[0.75rem] font-normal leading-[150%]">
                Image must be below 1024x1024px. Use PNG or JPG format.
              </p>
            </div>

            {/* input */}
            <div className="p-6 relative mt-[1.5rem] rounded-[0.75rem] flex flex-col bg-[#FAFAFA] gap-[0.75rem]">
              <div className="flex justify-center relative gap-4 items-center">
                <h1 className="text-[#737373] w-[15rem] max-w-full text-base font-normal leading-[150%]">
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
                  value={
                    currentUserIdData?.firstName === ""
                      ? firstNameValue
                      : currentUserIdData?.firstName
                  }
                  onChange={(e) =>
                    currentUserIdData?.lastName === "" ? handleFirstName(e) : ""
                  }
                  placeholder="e.g. John"
                />{" "}
                {firstNameError && (
                  <p className="text-red-500 absolute top-5 right-4 text-sm">
                    {firstNameError}
                  </p>
                )}
              </div>
              <div className="flex  relative justify-center gap-4 items-center">
                <h1 className="text-[#737373] w-[15rem] max-w-full text-base font-normal leading-[150%]">
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
                  value={
                    currentUserIdData?.lastName === ""
                      ? lastNameValue
                      : currentUserIdData?.lastName
                  }
                  onChange={(e) =>
                    currentUserIdData?.lastName === "" ? handleLastName(e) : ""
                  }
                  placeholder="e.g. Appleesed"
                />{" "}
                {lastNameError && (
                  <p className="text-red-500 absolute top-5 right-4 text-sm">
                    {lastNameError}
                  </p>
                )}
              </div>
              <div className="flex justify-center gap-4 items-center">
                <h1 className="text-[#737373] w-[15rem] max-w-full text-base font-normal leading-[150%]">
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
                className="text-white mt-[1.5rem] rounded-[0.5rem] cursor-pointer bg-[#633CFF]  py-[0.6875rem] px-[1.6875rem] text-base font-semibold leading-[150%]"
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
