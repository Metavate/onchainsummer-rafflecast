"use client"; 

import React, { useState } from 'react';
import RaffleModal from './RaffleModal'; // Adjust import path as needed
import { Button } from '@/components/ui/button'; // Import Button component

const RaffleTile = ({ title, creator, imageUrl, startTime, endTime, contractAddress, reward }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const start = new Date(Number(startTime)).toLocaleString();
  const end = new Date(Number(endTime)).toLocaleString();
  const splicedContractAddress = `${contractAddress.slice(0, 4)}...${contractAddress.slice(-4)}`;

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="w-full md:w-[calc(100%-1rem)] bg-[--RaffleCast-Glass] text-[--Text] rounded-xl overflow-hidden shadow-lg">
      <img src={imageUrl} alt={title} className="rounded-t-xl w-full h-64 object-cover" />
      <div className="p-4">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-lg">Created By: <span className="text-[--RaffleCast-SecondaryText]">{creator}</span></p>
        <p className="text-lg">Collection: <span className="text-[--RaffleCast-SecondaryText]">{splicedContractAddress}</span></p>
        <p className="text-lg">Ends: <span className="text-[--RaffleCast-SecondaryText]">{end}</span></p>
        <p className="text-lg">Reward: <span className="text-[--RaffleCast-SecondaryText]">{reward}</span></p>
      </div>
      <Button className="w-full px-4 py-10 bg-[--RaffleCast-ActiveColor] hover:bg-[--RaffleCast-ButtonCancel] text-white text-3xl" onClick={toggleModal}>View Raffle</Button>
      {isModalOpen && (
        <div className="modal-overlay">
          <RaffleModal isOpen={isModalOpen} onClose={toggleModal} raffleData={{ title, creator, contractAddress, startTime, endTime, reward, imageUrl }} />
        </div>
      )}
    </div>
  );
};

export default RaffleTile;
