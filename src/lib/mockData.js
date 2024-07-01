export const mockRaffles = [
  {
    id: 1,
    title: 'Fine Art Mfers',
    creator: 'Marlon Pruz',
    imageUrl: 'https://i.seadn.io/s/raw/files/239ff4f84cbb4956b83053bfe168be26.png?auto=format&dpr=1&w=1000',
    startTime: 1704110400, // 2024-01-01T12:00:00Z in seconds
    endTime: 1719859600,   // Corrected Unix time for 8 PM MST
    contractAddress: '0x1234567890123456789012345678901234567890',
    website: 'https://rafflecast.com',
    reward: 'Hand Drawn Fine Art',
  },
  {
    id: 2,
    title: '456 Musician',
    creator: '456 Collectors Club',
    imageUrl: 'https://i.seadn.io/s/raw/files/aae262a6603b96fdc56632bf6ea4aedf.jpg?auto=format&dpr=1&w=1000',
    startTime: 1704110400, // 2024-01-01T12:00:00Z in seconds
    endTime: 1719777600,   // Corrected Unix time for 8 PM MST
    contractAddress: '0x1234567890123456789012345678901234567890',
    website: 'https://rafflecast.com',
    reward: '10 MATIC',
  }
];

const unixTime = Math.floor(new Date('2024-06-30T20:00:00Z').getTime() / 1000);
console.log(unixTime); 