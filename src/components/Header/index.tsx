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
interface navProps {
  item: string;
  active: string;
  route: string;
  image: any;
}
const Navbar = () => {
  const { activePage } = useStateContext();
  const navItems: navProps[] = [
    {
      item: "Links",
      active: "Links",
      route: `/addLink/id`,
      image: activePage === "Links" ? coloredLInks : plainColoredLinks,
    },
    {
      item: "Profile Details",
      active: "profileDetails",
      route: `/profileDetails/id`,
      image:
        activePage === "profileDetails"
          ? coloredProfileDeatils
          : plainProfileDetails,
    },
  ];

  return (
    <div className=" mx-[1.5rem] translate-y-4   rounded-[0.75rem] bg-[#fff]">
      <div className="flex sm:px-2 md:px-[1.5rem]  sm:py-4 md:py-6 justify-between  transition-all items-center">
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

        <div className="flex items-center gap-1 md:gap-4">
          {navItems.map((navs, i) => (
            <div
              key={i}
              className={`flex py-[0.6875rem] hover:text-[#633CFF] cursor-pointer px-[1.6875rem] text-base font-semibold leading-[150%]  items-center gap-2 rounded-[0.5rem] border-none ${
                activePage === navs?.active
                  ? "text-[#633CFF] bg-[#EFEBFF]"
                  : "text-[#737373] bg-transparent"
              }`}
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

        <div>
          <button className="flex py-[0.6875rem] transition-all hover:bg-[#EFEBFF] px-[1.6875rem] gap-2 rounded-[0.5rem] border border-solid border-[#633CFF] text-base font-semibold   items-start  ">
            <Image
              className="sm:hidden block"
              src={eye}
              width={18}
              height={18}
              alt="eye"
            />
            <span className="sm:block hidden">Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
