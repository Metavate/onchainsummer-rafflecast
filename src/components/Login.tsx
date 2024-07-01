"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/discover");
    }
  }, [ready, authenticated, router]);

  return (
    <div className="flex items-center justify-center ">
      <button onClick={login} className="px-8 py-8 text-white text-3xl bg-blue-500 rounded">
        Login with Privy
      </button>
    </div>
  );
};

export default Login;
