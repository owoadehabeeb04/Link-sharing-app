"use client";
import { useStateContext } from "@/components/context/stateContext";
import Navbar from "@/components/Header";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import CustomizeLinkSkeleton from "@/components/addLinksComponents/customizeLinkSkeleton";

const Addlink = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    setActivePage,
    setCurrentUserIdData,
    currentUserIdData,
    setUserDetails,
  } = useStateContext();
  useEffect(() => {
    setLoading(true);
    console.log({ loading });
    setActivePage("Links");
    setLoading(false);
  }, [setActivePage]);

  return (
    <div>
      {loading ? (
        <div className="w-full flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="bg-[#D9D9D9]">
          <Navbar />
          <CustomizeLinkSkeleton />
        </div>
      )}
    </div>
  );
};

export default Addlink;
