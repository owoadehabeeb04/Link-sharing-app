import React from "react";
import { RotatingLines } from "react-loader-spinner";
const Loader = () => {
  return (
    <RotatingLines
      visible={true}
    //   width="106px"
    //   color="#633CFF"
    //   strokeWidth="5"
    //   animationDuration="0.75"
      ariaLabel="rotating-lines-loading"
    //   wrapperStyle={{}}
    //   wrapperClass=""
    />
  );
};

export default Loader;
