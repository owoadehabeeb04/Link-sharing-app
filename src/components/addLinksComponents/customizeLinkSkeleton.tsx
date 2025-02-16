"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import customize from "../../../public/customize.svg";
import innerCustomize from "../../../public/customize2.svg";
import EmptyLink from "./emptyLink";
import { auth } from "@/utils/firebaseconfig";
import { userProps, websites } from "@/dataTypes";

import linkimage from "../../../public/link.svg";
import arrow from "../../../public/arrow.svg";
import arrowFrontendMentor from "../../../public/arrowFrontendmentor.svg";
import { useStateContext } from "../context/stateContext";
import {
  getShowUser,
  linksOfUsersAndFirstNameAndLastName
} from "@/app/api/user";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "../loader";
import { MoreHorizontal, Link2 } from "lucide-react";

type openDropDownState = {
  boolean1: boolean;
};
interface addLinkprops {
  name: string;
  link: string;
  image?: string;
  backgroundColor?: string;
  textColor?: string;
}
const initialState: openDropDownState[] = [{ boolean1: false }];
const CustomizeLinkSkeleton = () => {
  const router = useRouter();

  const {
    userDetails,
    setUserDetails,
    currentUserIdData,
    setCurrentUserIdData
  } = useStateContext();
  const { linkAdd, setLinkAdd } = useStateContext();

  const [isLoading, setIsLoading] = useState(true);
  console.log({ linkAdd });
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
        console.log(currentUserData);

        if (currentUserData) {
          setCurrentUserIdData(currentUserData);
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

  const CurrentUser = (userDetails: userProps[], currentID: any) => {
    return userDetails.filter((user: userProps) => user.userId === currentID);
  };
  console.log(userDetails);
  const [openDropDown, setOpenDropDown] =
    useState<openDropDownState[]>(initialState);
  const getBooleanValue = (index: number, booleanIndex: number) => {
    const key = `boolean${booleanIndex + 1}`;
    return (
      openDropDown[index] &&
      openDropDown[index][key as keyof openDropDownState] &&
      openDropDown[index][key as keyof openDropDownState]
    );
  };
  const [errors, setErrors] = useState<any[]>([]);

  const [selectedWebsite, setSelectedWebsite] = useState<{
    index: number;
    website: string;
  } | null>(null);
  const toggleDropDown = (index: number) => {
    const key = `boolean${index + 1}`;

    setOpenDropDown((prevOpenDown: any) => {
      const newDropDown = [...prevOpenDown];

      if (!newDropDown[index]) {
        newDropDown[index] = {};
      }

      newDropDown[index] = {
        ...newDropDown[index],
        [key]: !newDropDown[index][key]
      };
      return newDropDown;
    });

    setSelectedWebsite((prev) =>
      prev?.index === index ? null : { index, website: "" }
    );
  };

  // Add state for custom platform
  const [customPlatform, setCustomPlatform] = useState<{
    [key: number]: { name: string; link: string };
  }>({});

  // Update handleWebsiteSelect
  const handleWebsiteSelect = (
    index: number,
    website: { link: string; image?: any; name: string; isCustom?: boolean }
  ) => {
    if (website.isCustom) {
      setCustomPlatform({
        ...customPlatform,
        [index]: { name: "", link: "" }
      });
    } else {
      // Clear custom platform when selecting regular link
      const newCustomPlatform = { ...customPlatform };
      delete newCustomPlatform[index];
      setCustomPlatform(newCustomPlatform);
    }

    const updatedLinkAdd = [...linkAdd];
    updatedLinkAdd[index] = {
      ...updatedLinkAdd[index],
      link: website.link,
      name: website.name,
      image: typeof website.image === "string" ? website.image : ""
    };
    setLinkAdd(updatedLinkAdd);

    // Close dropdown
    const key = `boolean${index + 1}`;
    setOpenDropDown((prevOpenDown) => {
      const newDropDown = [...prevOpenDown];
      newDropDown[index] = { boolean1: false };
      return newDropDown;
    });
    setErrors([]);
  };

  // Add custom platform input handlers
  const handleCustomPlatformChange = (
    index: number,
    field: "name" | "link",
    value: string
  ) => {
    setCustomPlatform({
      ...customPlatform,
      [index]: {
        ...customPlatform[index],
        [field]: value
      }
    });

    if (field === "name") {
      const updatedLinkAdd = [...linkAdd];
      updatedLinkAdd[index] = {
        ...updatedLinkAdd[index],
        name: value,
        backgroundColor: "#633CFF",
        textColor: "#FFFFFF"
      };
      setLinkAdd(updatedLinkAdd);
    }
  };

  const addLink = () => {
    setLinkAdd([
      ...linkAdd,
      {
        name: "Github",
        link: "https://www.github.com/"
      }
    ]);
    openDropDown.push({
      boolean1: false
    });
  };
  const removeLink = async (index: number) => {
    setLinkAdd(linkAdd.filter((_: any, i: number) => i !== index));
    // const userId: any = auth?.currentUser?.uid;
    // await removeLinkByIndex(userId, index);
  };
  const handleLinkChange = (index: number, newLink: string) => {
    const updatedLinks = linkAdd.map((link, i) =>
      i === index ? { ...link, link: newLink } : link
    );
    setLinkAdd(updatedLinks);
    setErrors([""]);
  };

  const matchedLinks =
    linkAdd &&
    linkAdd.filter((linkItem) =>
      websites.some((website) => website.link.includes(linkItem.link))
    );
  console.log({ matchedLinks });
  const validateLinks = () => {
    const newErrors = linkAdd.map((linkItem) => {
      // Check if link is empty
      if (!linkItem.link.trim()) {
        return "Link cannot be empty";
      }
      console.log({linkItem})

      // Check if it's a custom platform (Other)
      const isCustomPlatform = !websites.some(website => website.name === linkItem.name);
      if (isCustomPlatform) {
        // For custom platforms, just verify it's a valid URL with http/https and has a domain extension
        const urlPattern =
          /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})(\/[\w.-]*)*\/?$/i;
        if (!urlPattern.test(linkItem.link)) {
          return "Please enter a valid URL starting with http:// or https:// and include a domain extension";
        }

        return null;
      } else {
        // For predefined platforms, check if link matches the platform's format
const platform = websites.find((web) => web.name === linkItem.name);
        console.log({platform})
        if (!platform) {
          return "Please select a platform";
        }

        // Check if the entered link starts with the platform's base URL
        if (
          !linkItem.link.toLowerCase().startsWith(platform.link.toLowerCase())
        ) {
          return `Please use the format: ${platform.link}username`;
        }
        return null;}
      
    });

    setErrors(newErrors);
    return newErrors;
  };
  const [saveLoading, setSaveLoading] = useState(false);
  const handleSave = async (index: number) => {
    setSaveLoading(true);
    if (linkAdd.length === 0) {
      toast.error("kindly pick a link");
      return;
    }

    const validationErrors = validateLinks();
    console.log({ validationErrors });
    const hasErrors = validationErrors.some((error) => error != null && error !== undefined);
    console.log({ hasErrors });
    if (!hasErrors) {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          toast.error("User not authenticated");
          return;
        }

        let newUserIdData = { ...currentUserIdData };
        newUserIdData.Links = linkAdd;

        await linksOfUsersAndFirstNameAndLastName(userId, newUserIdData.Links);
        setLinkAdd(newUserIdData.Links);
        toast.success("saved links successfully");
        setSaveLoading(false);
      } catch (error) {
        console.error("Error saving links:", error);
        toast.error("Failed to save links");
        setSaveLoading(false);
      }
    } else {
      const errorMessage = validationErrors[index] || "Invalid link format";
      toast.error(errorMessage);
      setSaveLoading(false);
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

  useEffect(() => {
    console.log({ errors });
  }, [errors]);
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center">
          {/* <h1>LOADING...</h1> */}
          <Loader />
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
              <div className="flex justify-center  absolute top-24 left-[-50%] right-[-50%] flex-col items-center gap-6">
                {currentUserIdData && currentUserIdData.profileImage === "" ? (
                  <div className="bg-[#EEE] border-solid border rounded-[50%] border-[#EEE] w-[6rem] h-[6rem] flex justify-center items-center"></div>
                ) : (
                  <div className="bg-[#EEE] border-solid  rounded-[50%] border-4 border-[#633CFF] w-[6rem] h-[6rem] flex justify-center items-center">
                    <Image
                      src={currentUserIdData.profileImage}
                      className={`rounded-[50%] w-full h-full object-cover transition-opacity duration-300 
                                   `}
                      width={96}
                      height={96}
                      alt="profile image"
                      loading="lazy"
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
                      <Link href={linkAdd[index].link} target="blank">
                        <div
                          className="h-[2.75rem] cursor-pointer justify-between px-4 flex items-center w-full rounded-[0.5rem]"
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
                Customize your links
              </h1>
              <p className="text-[#737373] text-base font-normal leading-[150%] ">
                Add/edit/remove links below and then share all your profiles
                with the world!
              </p>
              <div className=" relative mt-[2.5rem]">
                <button
                  disabled={disabled}
                  onClick={addLink}
                  className=" text-[#633CFF] cursor-pointer addLinkButton  text-base hover:bg-[#EFEBFF] transition-all font-semibold leading-[150%] flex justify-center rounded-[0.5rem] w-full bg-[#fff] border border-solid border-[#633CFF] items-center px-[1.6875rem] py-[0.6875rem] gap-[0.5rem]"
                >
                  + Add new link
                </button>

                {linkAdd.length > 0 && (
                  <div className="w-full">
                    {linkAdd.map((links: addLinkprops, i: number) => (
                      <div
                        key={i}
                        className="flex flex-col w-full max-[320px]:p-2 p-[1.25rem] bg-[#FAFAFA] rounded-[0.75rem] mt-[1.5rem] justify-start items-start "
                      >
                        <div className=" transition-all flex text-[#737373] w-full text-base font-bold leading-[150%] items-center justify-between">
                          <h1>Link#{i + 1}</h1>
                          <p
                            className="text-[#737373] cursor-pointer text-base font-normal leading-[150%]"
                            onClick={() => removeLink(i)}
                          >
                            Remove
                          </p>
                        </div>
                        <div className="w-full mt-[0.75rem]">
                          <h1 className="flex text-[#333] text-[0.75rem] font-normal leading-[150%]">
                            Platform{" "}
                          </h1>

                          <div
                            className="  hover:shadow-purple-2xl relative border cursor-pointer w-full hover:border-[#633CFF] hover:loading-email border-solid bg-[#fff] rounded-[0.5rem] border-[#D9D9D9]  flex items-center justify-between py-[0.75rem] pr-4 pl-[2.5rem] text-[#333] text-base font-normal leading-[150%] "
                            onClick={() => toggleDropDown(i)}
                          >
                            <div className="flex justify-between items-center w-full ">
                              <p className="text-[#333] text-base">
                                {links?.name}
                              </p>

                              {!getBooleanValue(i, i) ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="9"
                                  viewBox="0 0 14 9"
                                  fill="none"
                                >
                                  <path
                                    d="M1 1L7 7L13 1"
                                    stroke="#633CFF"
                                    stroke-width="2"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="9"
                                  viewBox="0 0 14 9"
                                  fill="none"
                                >
                                  <path
                                    d="M13 8L7 2L1 8"
                                    stroke="#633CFF"
                                    stroke-width="2"
                                  />
                                </svg>
                              )}
                            </div>
                            {websites.find(
                              (web) =>
                                web.name.toLowerCase() ===
                                links.name.toLowerCase()
                            )?.image && (
                              <Image
                                className="absolute top-4 left-4"
                                src={
                                  websites.find(
                                    (web) =>
                                      web.name.toLowerCase() ===
                                      links.name.toLowerCase()
                                  )?.image
                                }
                                alt={links?.name}
                                height={16}
                                width={16}
                              />
                            )}
                            {getBooleanValue(i, i) && (
                              <div className="h-[15rem] absolute z-10 right-[0.15rem] top-[4.4rem] w-full rounded-[0.5rem] border border-solid border-[#D9D9D9] bg-white shadow-2xl transition-all whitespace-nowrap overflow-y-auto">
                                {websites.map((website, index) => (
                                  <div
                                    key={index}
                                    onClick={() =>
                                      handleWebsiteSelect(i, website)
                                    }
                                    className="flex gap-[0.75rem] text-[#333] transition-[2s] hover:text-[#633CFF] py-[0.75rem] mx-4 border-b border-solid border-[#D9D9D9]"
                                  >
                                    {website.isCustom ? (
                                      <MoreHorizontal className="w-4 h-4" />
                                    ) : website.image ? (
                                      <Image
                                        src={website.image}
                                        alt={website.name}
                                        width={16}
                                        height={16}
                                      />
                                    ) : (
                                      <MoreHorizontal className="w-4 h-4" />
                                    )}
                                    <h1 className="text-base font-normal leading-[150%]">
                                      {website.name}
                                    </h1>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="w-full mt-[0.75rem]">
                          {/* custom link name */}
                          {customPlatform[i] && (
                            <div className="mb-4">
                              <label className="text-[#333] text-[0.75rem] font-normal leading-[150%]">
                                Platform Name
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={customPlatform[i].name}
                                  onChange={(e) =>
                                    handleCustomPlatformChange(
                                      i,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 w-full  hover:shadow-purple-2xl ring:shadow-purple-2xl hover:border-[#633CFF] cursor-pointer focus:ring-input_focus focus:shadow-lg  outline-none focus:ring-1 focus:ring-[#633CFF] mt-[0.25rem] pr-4 py-3 text-opacity-50 placeholder:text-opacity-50 border border-solid w-full border-[#D9D9D9] rounded-[0.5rem] bg-[#fff] text-[#333] text-base leading-[150%] font-normal placeholder:text-[#333] placeholder:text-base placeholder:leading-[150%] placeholder:font-normal pl-9 hover:shadow-purple-2xl ring:shadow-purple-2xl hover:border-[#633CFF] cursor-pointer focus:ring-input_focus focus:shadow-lg outline-none focus:ring-1 focus:ring-[#633CFF] p-3 border border-[#D9D9D9] rounded-[0.5rem] bg-[#fff] text-[#333] text-base leading-[150%] font-normal"
                                  placeholder="Enter platform name"
                                />
                                <MoreHorizontal className="absolute top-5 left-4 w-4 h-4 text-[#737373]" />
                              </div>
                            </div>
                          )}
                          <h1 className="flex text-[#333] text-[0.75rem] font-normal leading-[150%]">
                            Link{" "}
                          </h1>{" "}
                          <div className="relative">
                            <input
                              type="text"
                              className={`pl-9 ${
                                errors[i]
                                  ? "border-red-500 pr-[8rem] focus:ring-0 focus:ring-red-500 hover:shadow-none hover:border-red-500"
                                  : ""
                              } hover:shadow-purple-2xl ring:shadow-purple-2xl hover:border-[#633CFF] cursor-pointer focus:ring-input_focus focus:shadow-lg  outline-none focus:ring-1 focus:ring-[#633CFF] mt-[0.25rem] pr-4 py-3 text-opacity-50 placeholder:text-opacity-50 border border-solid w-full border-[#D9D9D9] rounded-[0.5rem] bg-[#fff] text-[#333] text-base leading-[150%] font-normal placeholder:text-[#333] placeholder:text-base placeholder:leading-[150%] placeholder:font-normal`}
                              onChange={(e) =>
                                handleLinkChange(i, e.target.value)
                              }
                              value={links.link}
                            />
                            <Image
                              className="absolute top-5 left-4"
                              src={linkimage}
                              alt="link"
                              height={16}
                              width={16}
                            />

                            {errors[i] && (
                              <p className="absolute top-5 text-[0.75rem] font-normal leading-[150%] right-4 text-red-500">
                                {links?.link === ""
                                  ? "cant be empty"
                                  : "please check the url"}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {linkAdd.length === 0 && (
              <div className="flex-grow">
                <EmptyLink />
              </div>
            )}
            <hr className="bg-[#D9D9D9] mt-[2rem] sm:mt-[2.5rem]" />
            <div className="flex justify-end items-end">
              {/* {allLinksMatch && ( */}
              <button
                onClick={() => handleSave(0)}
                className={` ${
                  saveLoading && "bg-[#BEADFF] loading-email"
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

export default CustomizeLinkSkeleton;
