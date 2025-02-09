"use client";
import { useStateContext } from "@/components/context/stateContext";
import Navbar from "@/components/Header";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import CustomizeLinkSkeleton from "@/components/addLinksComponents/customizeLinkSkeleton";
import { ProtectedRoute } from "@/components/specialRoutes/protectedRoute";

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
    setActivePage("Links");
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
          <CustomizeLinkSkeleton />
        </div>
      )}

    </div>
    </ProtectedRoute>

  );
};

export default Addlink;
