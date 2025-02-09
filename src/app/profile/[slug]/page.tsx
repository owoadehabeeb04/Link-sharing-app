"use client";
import { useStateContext } from "@/components/context/stateContext";
import Navbar from "@/components/Header";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import CustomizeProfileDetails from "@/components/profileDetailsComponents/customizeSkeletonprofile";
import { ProtectedRoute } from "@/components/specialRoutes/protectedRoute";

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
    <ProtectedRoute>

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
    </ProtectedRoute>
  );
};

export default Profile;
