import React from "react";
import Image from "next/image";
import devlinks from "../../../public/devlinks.svg";
import devlinkstext from "../../../public/devlinktext.svg";
import coloredLInks from "../../../public/coloredLinks.svg";
import plainColoredLinks from "../../../public/plainLinks.svg";
import coloredProfileDeatils from "../../../public/coloredprofileDetails.svg";
import plainProfileDetails from "../../../public/plainProfile.svg";
import eye from "../../../public/eye.svg";
import { useStateContext } from "../context/stateContext";
import { auth } from "@/utils/firebaseconfig";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiLogOut } from 'react-icons/fi';
interface navProps {
  item: string;
  active: string;
  route: string;
  image: any;
}
const Navbar = () => {
  const { activePage, setActivePage } = useStateContext();
  const router = useRouter();

  const userId = auth?.currentUser?.uid;
  const navItems: navProps[] = [
    {
      item: "Links",
      active: "Links",
      route: `/addLink/${userId}`,
      image: activePage === "Links" ? coloredLInks : plainColoredLinks,
    },
    {
      item: "Profile Details",
      active: "profileDetails",
      route: `/profile/${userId}`,
      image:
        activePage === "profileDetails"
          ? coloredProfileDeatils
          : plainProfileDetails,
    },
  ];
  const signOut = async (e: any) => {
    console.log("Sign out button clicked");
    try {
      console.log(" signingout");
      await auth.signOut();
      router.push("/login");
      toast.success("sign out succesfully");
    } catch (err: any) {
      console.error("Error during sign out:", err);
      toast.error(`Error during sign out: ${err.message}`);
    }
  };

  return (
    <div className=" max-[320px]:mx-3 mx-[1.5rem] translate-y-4   rounded-[0.75rem] bg-[#fff]">
      <div className="flex max-[320px]:px-0 px-2 md:px-[1.5rem] py-4 md:py-6 justify-between  transition-all items-center">
        <div className="flex transition-all items-center gap-2">
          <Image src={devlinks} width="32" height="32" alt="devlinks" />
          <Image
            className="sm:block hidden"
            src={devlinkstext}
            width="108"
            height="18"
            alt="devlinks"
          />
        </div>

        <div className="flex items-center gap-0 md:gap-4">
          {navItems.map((navs, i) => (
            <div
              key={i}
              className={`flex py-[0.6875rem] hover:text-[#633CFF] cursor-pointer max-[320px]:px-4 px-[1.6875rem] text-base font-semibold leading-[150%] items-center gap-2 rounded-[0.5rem] border-none ${
                activePage === navs?.active
                  ? "text-[#633CFF] bg-[#EFEBFF]"
                  : "text-[#737373] bg-transparent"
              }`}
              onClick={() => {
                router.push(navs?.route);
                setActivePage(navs?.active);
              }}
            >
              <Image
                src={navs?.image}
                width={20}
                alt={navs?.item}
                height={20}
              />
              <p className="text-base font-semibold sm:block hidden">
                {navs?.item}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={signOut}
            className="flex items-center py-[0.6875rem] text-red-500 transition-all hover:bg-red-50 px-4 gap-2 rounded-[0.5rem] border border-solid border-red-500 text-base font-semibold"
          >
            <FiLogOut className="w-4 h-4 sm:mr-1" />
            <span className="sm:block hidden">Logout</span>
          </button>

          <Link href={`/preview/${userId}`}>
            <button className="flex items-center py-[0.6875rem] text-[#633CFF] transition-all hover:bg-[#EFEBFF] px-4 gap-2 rounded-[0.5rem] border border-solid border-[#633CFF] text-base font-semibold">
              <Image
                className="sm:hidden block"
                src={eye}
                width={18}
                height={18}
                alt="eye"
              />
              <span className="sm:block hidden">Preview</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
