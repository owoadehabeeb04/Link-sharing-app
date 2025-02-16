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
import toast from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { Link2 } from "lucide-react";
type PreviewPageProps = {
  params: {
    slug: string;
  };
};

const PreviewPage = ({ params }: PreviewPageProps) => {
  const router = useRouter();
  const { slug }: { slug: string | undefined } = params;
  console.log({ slug });
  const userId = auth.currentUser?.uid;

  const {
    userDetails,
    setUserDetails,
    currentUserIdData,
    setCurrentUserIdData
  } = useStateContext();
  const { linkAdd, setLinkAdd } = useStateContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const [userBoolean, setUserBoolean] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
      } else {
        setUserBoolean(true);
        console.log("logged out");
      }
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getShowUser();
        setUserDetails(users);

        const currentUserData: any = users.find((user: userProps) => {
          // Create slug from name or email
          const userSlug =
            user.firstName && user.lastName
              ? `${user.firstName.toLowerCase()}-${user.lastName.toLowerCase()}`
              : user.email.split("@")[0].toLowerCase();

          return userSlug === slug;
        });

        if (currentUserData) {
          setCurrentUserIdData(currentUserData);
          if (currentUserData?.links[0].name !== "") {
            setLinkAdd(currentUserData?.links);
          }

          // Check if viewer is owner
          const isOwner = auth.currentUser?.uid === currentUserData.userId;
          setUserBoolean(!isOwner);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [slug]);
  function handleClipboardCopy() {
    // Create share URL with slug
    const shareUrl =
      currentUserIdData?.firstName && currentUserIdData?.lastName
        ? `${
            window.location.origin
          }/preview/${currentUserIdData.firstName.toLowerCase()}-${currentUserIdData.lastName.toLowerCase()}`
        : `${window.location.origin}/preview/${currentUserIdData.email
            .split("@")[0]
            .toLowerCase()}`;

    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  }
  const linkToAddlink = () => {
    if (userBoolean === false) {
      router.push(`/addLink/${userId}`);
    } else
      toast.error(
        "sorry, you cant edit this lnk cos you are not the owner of the account"
      );
  };
  console.log({ currentUserIdData });
  return (
    <section className="relative min-h-[100dvh] mobile:bg-white">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="sm:h-[25rem] relative rounded-[0_0_3.2rem_3.2rem] sm:bg-[#633cff] hidd sm:flex"></div>

          {!userBoolean && ( // Only show if user is owner
            <header className="sm:flex hidden absolute top-[2.4rem] left-[-0.1%] mx-[2.4rem]  w-[100%] items-center justify-between rounded-[1.2rem] bg-white px-[1rem] py-[1rem] mobile:static sm:mx-0">
              <div
                onClick={linkToAddlink}
                className="rounded-[0.8rem] border border-[#633cff] text-[#633cff] px-[2.7rem] py-[1.1rem] text-[1rem] font-semibold leading-[150%]  mobile:px-8"
              >
                Back to Editor
              </div>
              <button
                className="rounded-[0.8rem] bg-[#633cff] px-[2.7rem] py-[1.1rem] text-[1rem] font-semibold leading-[150%] text-white mobile:px-8"
                onClick={handleClipboardCopy}
              >
                Share Link
              </button>
            </header>
          )}
          {!userBoolean && ( // Only show if user is owner
            <header className="flex sm:hidden mx-4 top-[1%] items-center my-4 justify-between gap-4 ">
              <Link
                href={`/addLink/${userId}`}
                className="rounded-[0.8rem] border text-center border-[#633cff] text-[#633cff] px-[1.69rem] sm:px-[2.7rem] py-2 sm:py-[1.1rem] text-[1rem] font-semibold leading-[150%]  mobile:px-8"
              >
                Back to Editor
              </Link>
              <button
                className="rounded-[0.8rem] bg-[#633cff] px-[1.69rem] sm:px-[2.7rem] py-2 sm:py-[1.1rem] text-[1rem] font-semibold leading-[150%] text-white mobile:px-8"
                onClick={handleClipboardCopy}
              >
                Share Link
              </button>
            </header>
          )}
          <div className="absolute left-1/2 top-[5rem] sm:top-[15rem] flex w-3/4 sm:w-[21.8125rem] -translate-x-1/2 flex-col items-center rounded-[2.4rem] bg-white px-4  sm:px-[3.6rem] py-[3rem] shadow-dark-sh mobile:static mobile:w-full mobile:translate-x-0 mobile:shadow-none">
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
              {[...Array(linkAdd.length)].map((_, index) => (
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
                              web.name.toLowerCase() ===
                              linkAdd[index].name.toLowerCase()
                          )?.image ? (
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

          {isCopied && (
            <div className="fixed bottom-[0rem] left-[-50%] right-[-50%]  flex w-full sm:w-fit mx-auto  justify-center  items-center gap-[0.8rem] rounded-[1.2rem] bg-[#333] px-4 sm:px-[1.5rem] py-4 sm:py-[1.5rem]">
              {/* <HiOutlineLink size={"2rem"} color={"#737373"} /> */}
              <Image
                className="flex justify-center items-center"
                src={link}
                width={16}
                height={16}
                alt="copy"
              />
              <p className="text-[0.875rem] sm:text-[1rem] text-center font-semibold leading-[2.4rem] text-[#fafafa]">
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
