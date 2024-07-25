import React from "react";
import getStarted from "../../../public/getstarted.svg";
import Image from "next/image";
const EmptyLink = () => {
  return (
    <div className=" pt-[3rem] lg:pt-[3.4rem] mt-[1.5rem] lg:mt-[2rem] rounded-[0.75rem] bg-[#FAFAFA] flex flex-col justify-center items-center">
      <Image className=" flex  sm:w-full w-1/2 justify-center items-center" src={getStarted} width={248} height={160} alt="getStarted" />
      <h1 className="text-[#333] mt-[2.5rem] text-center text-[1.5rem] sm:text-[2rem] font-bold leading-[150%] ">
        Let’s get you started
      </h1>

      <p className="text-center text-[#737373] mt-6 pb-[3.91rem] text-base leading-[150%] font-normal w-[30rem] max-w-full ">
        Use the “Add new link” button to get started. Once you have more than
        one link, you can reorder and edit them. We’re here to help you share
        your profiles with everyone!
      </p>
    </div>
  );
};

export default EmptyLink;
