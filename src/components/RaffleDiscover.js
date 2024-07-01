// RaffleDiscover.js
import React from 'react';
import RaffleTile from '@/widgets/RaffleTile';
import { mockRaffles } from '@/lib/mockData'; // Ensure this path is correct

const RaffleDiscover = () => {
  return (
    <div className="raffle-discover grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-4">
      {mockRaffles.map(raffle => (
        <RaffleTile 
          key={raffle.id}
          title={raffle.title}
          creator={raffle.creator}
          imageUrl={raffle.imageUrl}
          startTime={raffle.startTime}
          endTime={raffle.endTime}
          contractAddress={raffle.contractAddress}
          reward={raffle.reward}
        />
      ))}
    </div>
  );
}

export default RaffleDiscover;
