"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useStateContext } from "@/components/context/stateContext";
import { getShowUser } from "@/app/api/user";
import { auth } from "@/utils/firebaseconfig";
import { userProps, websites } from "@/dataTypes";
import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";
import arrow from "../../../../public/arrow.svg";
import arrowFrontendMentor from "../../../../public/arrowFrontendmentor.svg";
import link from "../../../../public/link.svg";
import Loader from "@/components/loader";
const PreviewPage = () => {
  const router = useRouter();
  const userId = auth.currentUser?.uid;

  const {
    userDetails,
    setUserDetails,
    currentUserIdData,
    setCurrentUserIdData,
  } = useStateContext();
  const { linkAdd, setLinkAdd } = useStateContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
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
          if (currentUserData?.links) setLinkAdd(currentUserData?.links);
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

  function handleClipboardCopy() {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  }

  return (
    <section className="relative min-h-[100dvh] mobile:bg-white">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="h-[25rem] rounded-[0_0_3.2rem_3.2rem] bg-[#633cff] mobile:hidden"></div>
          {userId && (
            <header className="absolute top-[2.4rem] left-[-1%] mx-[2.4rem] flex w-[97%] items-center justify-between rounded-[1.2rem] bg-white px-[1rem] py-[1rem] mobile:static mobile:mx-0">
              <Link
                href={`/addLink/${userId}`}
                className="rounded-[0.8rem] border border-[#633cff] text-[#633cff] px-[2.7rem] py-[1.1rem] text-[1rem] font-semibold leading-[150%]  mobile:px-8"
              >
                Back to Editor
              </Link>
              <button
                className="rounded-[0.8rem] bg-[#633cff] px-[2.7rem] py-[1.1rem] text-[1rem] font-semibold leading-[150%] text-white mobile:px-8"
                onClick={handleClipboardCopy}
              >
                Share Link
              </button>
            </header>
          )}
          <div className="absolute left-1/2 top-[15rem] flex w-[21.8125rem] -translate-x-1/2 flex-col items-center rounded-[2.4rem] bg-white px-[3.6rem] py-[3rem] shadow-dark-sh mobile:static mobile:w-full mobile:translate-x-0 mobile:shadow-none">
            {/* picture */}
            {currentUserIdData?.profileImage ? (
              <Image
                src={currentUserIdData?.profileImage}
                alt="image"
                width={104}
                height={104}
                className="W-[6.5rem] h-[6.5rem] rounded-[10.4rem] border-[4px] border-solid border-[#633cff] object-cover"
              />
            ) : (
              <div className="h-[10.4rem] w-[10.4rem] rounded-[10.4rem] border-[4px] border-solid border-[#633cff] bg-[#eee]"></div>
            )}
            <div className="s pb-[3rem] pt-[2.4rem] text-center">
              {/* name */}
              <h1 className="text-[2rem] font-bold leading-[150%] text-[#333]">
                {currentUserIdData?.firstName} {currentUserIdData?.lastName}
              </h1>
              <h3 className="text-[1rem] leading-[150%] font-normal text-[#737373]">
                {currentUserIdData?.email}
              </h3>
            </div>

            <div className="flex flex-col w-full gap-4">
              {[...Array(5)].map((_, index) => (
                <React.Fragment key={index}>
                  {linkAdd[index] ? (
                    <Link href={linkAdd[index].link} target="blank">
                      <div
                        className="h-[3.2rem]  cursor-pointer justify-between px-4 flex items-center w-full rounded-[0.5rem]"
                        // onClick={() => router.push(linkAdd[index].link)}
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
                          <h1 className="text-[1rem] font-normal leading-[150%]">
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

          {isCopied && (
            <div className="absolute bottom-[3rem] left-1/2 flex w-full max-w-[39.7rem] -translate-x-1/2 items-center gap-[0.8rem] rounded-[1.2rem] bg-[#333] px-[2.4rem] py-[1.6rem]">
              {/* <HiOutlineLink size={"2rem"} color={"#737373"} /> */}
              <Image src={link} width={16} height={16} alt="copy" />
              <p className="text-[1.6rem] font-semibold leading-[2.4rem] text-[#fafafa]">
                The link has been copied to your clipboard!
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default PreviewPage;
