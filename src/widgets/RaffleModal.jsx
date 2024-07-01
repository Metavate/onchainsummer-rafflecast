import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';

const RaffleModal = ({ isOpen, onClose, raffleData }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (raffleData.endTime) {
      const endTime = raffleData.endTime * 1000; // Convert to milliseconds

      const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance < 0) {
          return 'Raffle Ended';
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
      };

      const interval = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      setTimeLeft(calculateTimeLeft());

      return () => clearInterval(interval);
    }
  }, [raffleData.endTime]);

  const formatUnixTime = (unixTime) => {
    const date = new Date(unixTime * 1000); // Convert to milliseconds
    const options = {
      timeZone: 'America/Denver',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const formatContractAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className={`modal ${isOpen ? 'block' : 'hidden'} fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-95 flex justify-center items-center`}>
      <div className="modal-content bg-black/80 w-1/2 rounded-3xl shadow-lg relative p-20">
        <span className="close absolute top-2 right-4 m-4 text-gray-500 cursor-pointer text-6xl" onClick={onClose}>&times;</span>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 modal-body">
          {/* Render raffle details here */}
          <div className="w-full">
            <img src={raffleData.imageUrl} alt={raffleData.title} className="rounded-3xl" />
            <h2 className="text-5xl text-center mt-10 font-bold">{raffleData.title}</h2>
            <h3 className="text-5xl text-center text-white font-bold">Raffle ID: {raffleData.id}</h3>
          </div>
          <div className="w-full flex flex-col justify-between text-center p-10">
            <div className="text-center">
              <h2 className="text-4xl font-bold mt-4">Time Remaining</h2>
              <h2 className="text-7xl font-bold my-10">{timeLeft}</h2>
              <p className="text-2xl mb-2">{formatUnixTime(raffleData.endTime)}</p>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-4xl font-bold mt-4">Raffle Details</h2>
       
            <p className="text-2xl mb-2">Created By: {raffleData.creator}</p>
              <p className="text-2xl mb-2">Contract Address: {formatContractAddress(raffleData.contractAddress)}</p>
              <p className="text-2xl mb-2">Reward: {raffleData.reward}</p>
              <p className="text-2xl mb-2">Website: {raffleData.website}</p>
            </div>
            <div className="Enter flex flex-row gap-8">
              <Button className=" text-3xl bg-[--RaffleCast-ActiveColor] p-12 w-2/4 text-white rounded-xl">Enter Raffle</Button> 
              <Button className=" text-3xl bg-[--RaffleCast-TextHover]  py-12 w-2/4 text-white rounded-xl"><img className='p-4 h-24' src='https://github.com/vrypan/farcaster-brand/blob/main/icons/icon-transparent/transparent-white.png?raw=true'/>Share</Button> 
            </div>
          
          
          </div>
          {/* Add more details as needed */}
        </div>
      </div>
    </div>
  );
};

export default RaffleModal;
