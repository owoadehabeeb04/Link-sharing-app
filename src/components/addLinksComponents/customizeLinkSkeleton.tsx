"use client";
import React, { useState } from "react";
import Image from "next/image";
import customize from "../../../public/customize.svg";
import innerCustomize from "../../../public/customize2.svg";
import EmptyLink from "./emptyLink";
import { auth } from "@/utils/firebaseconfig";
import { websites } from "@/dataTypes";
const CustomizeLinkSkeleton = () => {
  const userId = auth.currentUser?.uid;

  const [openDropDown, setOpenDropDown] = useState(false);
  const toggleDropDown = () => {
    setOpenDropDown(!openDropDown);
  };
  return (
    <div className="flex   justify-center grid-cols-2 mt-10 gap-6 mx-6 ">
      <div className="shadow-4xl w-[65rem] max-w-full py-[6rem] border-solid border-2 rounded-[0.75rem] border-[#fff] px-[4rem] flex flex-col bg-[#fff] justify-center items-center">
        <div className="relative w-[304px] max-w-full">
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
            <div className="bg-[#EEE] border-solid border rounded-[50%] border-[#EEE] w-[6rem] h-[6rem] flex justify-center items-center"></div>
            <div className="flex justify-center items-center flex-col">
              <div className="w-[10rem] h-[1rem] bg-[#EEE] rounded-[6.5rem] "></div>
              <div className="w-[4.5rem] mt-2 h-[0.5rem] bg-[#EEE] rounded-[6.5rem] "></div>
            </div>
          </div>
          {/* the links */}
          <div className="flex flex-col absolute top-[17rem] left-[10%] w-[80%] gap-5">
            <div className="h-[2.75rem] w-full rounded-[0.5rem] bg-[#EEE]"></div>
            <div className="h-[2.75rem] w-full rounded-[0.5rem] bg-[#EEE]"></div>
            <div className="h-[2.75rem] w-full rounded-[0.5rem] bg-[#EEE]"></div>
            <div className="h-[2.75rem] w-full rounded-[0.5rem] bg-[#EEE]"></div>
            <div className="h-[2.75rem] w-full rounded-[0.5rem] bg-[#EEE]"></div>
          </div>
        </div>
      </div>
      <div className="bg-[#FFF] w-[100%]  h-full p-[2.5rem] rounded-[0.75rem] ">
        <div>
          <h1 className="text-[#333] text-[2rem] font-bold leading-[150%]">
            Customize your links
          </h1>
          <p className="text-[#737373 text-base font-normal leading-[150%] ">
            Add/edit/remove links below and then share all your profiles with
            the world!
          </p>
          <div className="mt-[2.5rem]">
            <button
              onClick={toggleDropDown}
              className="  text-[#633CFF]  text-base  overflow-x-autohover:bg-[#EFEBFF] transition-all font-semibold leading-[150%] flex justify-center rounded-[0.5rem] w-full bg-[#fff] border border-solid border-[#633CFF] items-center px-[1.6875rem] py-[0.6875rem] gap-[0.5rem]"
            >
              + Add new link
            </button>
            {openDropDown && <div className="h-[12rem] transition-all whitespace-nowrap overflow-y-auto">
                {websites.map((website, index)=> (
                    <div key={index}>
                        
                    </div>
                ))}
                </div>}
          </div>
        </div>
        <div className="flex-grow">
          <EmptyLink />
        </div>
        <hr className="bg-[#D9D9D9] mt-[2.5rem]" />
        <div className="flex justify-end items-end">
          <button className="text-white mt-[1.5rem]  rounded-[0.5rem] opacity-25 cursor-pointer bg-[#633CFF] py-[0.6875rem] px-[1.6875rem]  text-base font-semibold leading-[150%] ">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeLinkSkeleton;
