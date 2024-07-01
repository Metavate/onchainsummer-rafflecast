// "use client";

import { getFrameMetadata } from "../lib/utils/frog-next";
import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";
import Login from "@/components/Login";
import Link from "next/link";
import TileComponent from "@/widgets/TileComponent";

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${process.env.VERCEL_URL || "http://localhost:3000"}/api`
  );

  const transformedTags = Array.isArray(frameTags)
    ? frameTags.reduce((acc, tag) => {
        if (tag.property) {
          acc[tag.property] = tag.content;
        }
        return acc;
      }, {} as { [key: string]: string })
    : {};

  return {
    other: transformedTags,
  };
}

export default function Home() {
  return (
     <main> 
        <div className="wrapper flex flex-col h-full justify-center align-middle items-center w-full mx-auto gap-8">
          <div className="headline w-full flex mx-auto ">
            <img src="/RaffleCast_CoverPhoto.png" alt="Raffle Cast Logo" className="w-[80rem] h-auto mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[80rem] mx-auto">
          <TileComponent
            title="Create a raffle"
            description="Create a token-gated raffle for your Web3 community."
            buttonText="Create a raffle"
            buttonLink="/create"
            backgroundColor="white"
          />
          <TileComponent
            title="Discover Raffles"
            description="Discover raffles created by Farcaster users."
            buttonText="Discover raffles"
            buttonLink="/discover"
            backgroundColor="white"
          />
          </div>
        </div>
     </main>
  );
}
