"use client"

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';

const Sidebar = () => {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const router = useRouter();
  const [activeButton, setActiveButton] = useState('');
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Simulating fetching data from an API or external source
    const fetchedMenuItems = [
      { name: 'Home', href: '/' },
      { name: 'All Raffles', href: '/discover' },
      { name: 'Create Raffle', href: '/create' },
      // Add more menu items as needed
    ];
    setMenuItems(fetchedMenuItems);
  }, []);

  useEffect(() => {
    // Set active button based on pathname when component mounts or pathname changes
    const pathname = router.pathname;
    const foundItem = menuItems.find(item => item.href === pathname);
    if (foundItem) {
      setActiveButton(foundItem.name);
    }
  }, [router.pathname, menuItems]);

  const handleMenuClick = (buttonName) => {
    setActiveButton(buttonName);
  };


  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="h-full w-[15rem] sm:w-[20rem] hidden sm:flex flex-col justify-between px-4 pb-4 border-r border-[--RaffleCast-Border]">
      <div className="mainMenu flex flex-col justify-between text-white h-full max-h-[40rem] ">
        <div className="Header">
          <div className="ProfileArea flex gap-8 justify-between align-middle items-center border-b border-[--RaffleCast-Border] py-5">
          <div className="w-64">
                <img src="/Logo.png" alt="logo" className="" />
              </div>
          </div>
          <ul>
            {menuItems.map(item => (
              <li key={item.name} className={` ${activeButton === item.name ? 'active' : ''}`}>
                <Link href={item.href}>
                  <button onClick={() => handleMenuClick(item.name)} className="text-start rounded-xl px-5 py-2 my-2 text-2xl w-full hover:bg-[--RaffleCast-TextHover] block">{item.name}</button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* <div className="Buttons flex flex-col gap-4 border-b border-[--RaffleCast-Border] pb-10">
          <Link href="/create">
            <Button className="w-full p-8 bg-[--RaffleCast-ButtonFill] hover:bg-[--RaffleCast-ButtonCancel] text-white text-3xl">Create a Raffle</Button>
          </Link>
        </div> */}
      </div>
      <div className="footer text-white text-2xl">
        <div className="metavate mb-2">Powered By Metavate</div>
        <div className="copyright opacity-15">Copyright © 2024 - 2024 Metavate. All rights reserved.</div>
      </div>
    </div>
  );
}

export default Sidebar;
