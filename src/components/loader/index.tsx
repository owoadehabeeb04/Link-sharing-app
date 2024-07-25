import React from "react";
import { RotatingLines } from "react-loader-spinner";
const Loader = () => {
  return (
    // <RotatingLines
    //   visible={true}
    // //   width="106px"
    // //   color="#633CFF"
    // //   strokeWidth="5"
    // //   animationDuration="0.75"
    //   ariaLabel="rotating-lines-loading"
    // //   wrapperStyle={{}}
    // //   wrapperClass=""
    // />
    
        <div className="absolute top-0 z-[999] flex h-full w-full items-center justify-center bg-[#EFEBFF] bg-opacity-70">
          <div className="main-loader"></div>
        </div>
   
    
  );
};

export default Loader;
