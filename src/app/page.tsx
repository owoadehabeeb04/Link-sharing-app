import dynamic from "next/dynamic";
import { FC } from "react";

const MyLazyLoadedComponent = dynamic(() => import("./login/page"));

export default function Home() {
  return (
    <main className="min-h-screen flex-col items-center justify-between ">
      <MyLazyLoadedComponent />
    </main>
  );
}
