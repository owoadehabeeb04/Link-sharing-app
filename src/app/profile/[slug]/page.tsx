"use client";
import { useStateContext } from "@/components/context/stateContext";
import Navbar from "@/components/Header";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import CustomizeProfileDetails from "@/components/profileDetailsComponents/customizeSkeletonprofile";

const Profile = () => {
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
    setActivePage("profileDetails");
    setLoading(false);
  }, [setActivePage]);

  return (
    <div>
      {loading ? (
        <div className="w-full flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="bg-[#fffafa]">
          <Navbar />
          <CustomizeProfileDetails />
        </div>
      )}
    </div>
  );
};

export default Profile;
