import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { usePrivy } from '@privy-io/react-auth';

interface TopbarProps {
  appName: string;
}

const Topbar = ({ appName }: TopbarProps) => {
  const router = useRouter();
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown menu

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const userProfileImage = user?.farcaster?.pfp || '/images/avatar.png';

  if (!ready) {
    return null; // You can return a loading indicator here if desired
  }

  // Simulating fetching data from an API or external source
  const menuItems = [
    // { name: 'Home', href: '/' },
    { name: 'All Raffles', href: '/discover' },
    { name: 'Create Raffle', href: '/create' },
    // Add more menu items as needed
  ];

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuItemClick = (href: string) => {
    router.push(href);
    setIsDropdownOpen(false); // Close dropdown after clicking on a menu item
    setIsMobileMenuOpen(false); // Also close mobile menu if it's open
  };

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between border-b w-full border-[#ffffff20] p-4">
          <div className="">
            <h2 className='text-white text-4xl'>Create token-gated raffles for Web3 communities!</h2>
          </div>
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex items-center">
              {authenticated && user ? (
                <div className="relative ml-3">
                  <div className="flex rounded-full items-center hover:ring-[#ffffff20] hover:ring hover:ring-offset-2 hover:ring-offset-gray-800 hover:outline-none hover:cursor-pointer">
                    <button
                      onClick={handleDropdownToggle}
                      className="flex rounded-full text-3x ml-8 gap-8"
                    >
                      <div className="ProfileName flex flex-col justify-center text-white text-right">
                        <h1 className="text-3xl">@{user?.farcaster?.username}</h1>
                        <h2 className="text-2xl">{user?.farcaster?.fid}</h2>
                      </div>
                      <div className="h-20 w-20 rounded-full">
                        <Image
                          className="h-20 w-20 rounded-full"
                          src={userProfileImage}
                          alt="user Avatar"
                          height="80"
                          width="80"
                        />
                      </div>
                    </button>
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-50">
                      <button
                        onClick={handleSignOut}
                        className="block w-full px-4 py-2 text-left text-gray-700 text-3xl hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between w-full p-4">
                  <button
                    onClick={login}
                    className="px-8 py-2 text-white text-2xl bg-[--RaffleCast-ActiveColor] rounded"
                  >
                    Sign In with Farcaster
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              <span className="sr-only">Open main menu</span>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="flex flex-col items-center mt-2 text-3xl text-white">
            <div className="p-5 flex flex-col gap-8 w-full text-left">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleMenuItemClick(item.href)}
                  className="block px-4 py-8 hover:bg-[--RaffleCast-TextHover] hover:text-white w-full text-left"
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div className="p-5 w-full">
              <button
                onClick={handleSignOut}
                className="block px-4 py-4 bg-[--RaffleCast-ActiveColor] hover:bg-gray-100 hover:text-black w-full text-3xl text-left"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;