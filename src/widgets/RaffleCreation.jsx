"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { raffles } from '@/server/db'; // Adjust path as per your setup
import { cn } from '@/lib/utils';

const RaffleCreation = () => {
    const [description, setDescription] = useState('');
    const [reward, setReward] = useState('');
    const [starttime, setStarttime] = useState('');
    const [endtime, setEndtime] = useState('');
    const [contract, setContract] = useState('');
    const [rewardimage, setRewardimage] = useState('');
    const [creator, setCreator] = useState('');
    const [blockchain, setBlockchain] = useState('ethereum'); // Default blockchain
    const [website, setWebsite] = useState('https://fineartmfers.io'); // Default website
    const [postMessage, setPostMessage] = useState('');

    const updatePreview = (imageUrl) => {
        // Your updatePreview logic here
    };

    const createRaffle = async (e) => {
        e.preventDefault();
    
        const startTimeUnix = starttime ? new Date(starttime).getTime() : null;
        const endTimeUnix = endtime ? new Date(endtime).getTime() : null;
    
        try {
          const raffleResult = await raffles.insert({
            description: description,
            creator: creator,
            contract: contract,
            blockchain: blockchain,
            startTime: startTimeUnix,
            endTime: endTimeUnix,
            imageUrl: rewardimage,
            website: website,
            winnerFid: null,
            winnerUsername: null,
            reward: reward,
            title: description,
          });
    
          console.log("Raffle creation result:", raffleResult);
          setPostMessage('Raffle created successfully!');
        } catch (error) {
          console.error('Error creating raffle:', error);
          setPostMessage('Failed to create raffle. Please try again.');
        }
      };


    return (
        <div>
            <Card className={cn('flex flex-col border-0 w-full mx-auto')}>
                <form name="raffle-admin-form" onSubmit={createRaffle}>
                    <CardHeader>
                        <div className="flex w-full justify-between align-top items-start">
                            <div className="flex flex-col">
                                <CardTitle className={cn('text-xl md:text-5xl text-white')}>Create Raffle</CardTitle>
                                <CardDescription className="text-2xl text-white opacity-50">Enter details to create your raffle.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="flex flex-col md:flex-row">
                        <div className="wrapper w-full flex flex-wrap justify-between items-start">
                            {/* DETAIL SECTION */}
                            <div className="section md:w-[50%] px-8 w-full text-white">
                                <div className="flex flex-col items-start space-y-2 text-3xl">
                                    <label htmlFor="description">Raffle Title <span className="text-red-500">*</span></label>
                                    <input type="text" id="description" placeholder="ex: Custom Art Giveaway" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full md:w-auto text-black p-2 rounded-xl" />
                                </div>

                                <div className="flex flex-col items-start space-y-2 mt-4 w-full text-3xl">
                                    <label htmlFor="reward">Raffle Reward <span className="text-red-500">*</span></label>
                                    <input type="text" id="reward" value={reward} onChange={(e) => setReward(e.target.value)} placeholder="ex: Hand drawn sneakers" required className="w-full md:w-auto text-black p-2 rounded-xl" />
                                </div>

                                <div className="flex flex-col items-start space-y-2 mt-4 w-full text-3xl">
                                    <label htmlFor="starttime">Start Date <span className="text-red-500">*</span></label>
                                    <input type="datetime-local" value={starttime} onChange={(e) => setStarttime(e.target.value)} id="starttime" required className="w-full md:w-auto text-black p-2 rounded-xl" />
                                </div>

                                <div className="flex flex-col items-start space-y-2 mt-4 w-full text-3xl">
                                    <label htmlFor="endtime">End Date <span className="text-red-500">*</span></label>
                                    <input type="datetime-local" value={endtime} onChange={(e) => setEndtime(e.target.value)} id="endtime" required className="w-full md:w-auto text-black p-2 rounded-xl" />
                                </div>

                                <div className="flex flex-col items-start space-y-2 mt-4 text-3xl" id="raffle-contracts">
                                    <label htmlFor="contract">Eligible Contract <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        pattern="0x.{40}"
                                        className='text-black p-2 rounded-xl'
                                        value={contract}
                                        onChange={(e) => {
                                            setContract(e.target.value);
                                            e.target.setCustomValidity('');
                                        }}
                                        onInvalid={(e) => e.target.setCustomValidity('Please enter a valid contract address')}
                                        required
                                        placeholder="NFT contract address (0x123...ABC)"
                                    />
                                </div>

                                <div className="flex flex-col items-start space-y-2 mt-4 text-3xl">
                                    <label htmlFor="rewardimage">Raffle Image URL <span className="text-red-500">*</span> <span className="text-white text-[10px]">Image will display if valid</span></label>
                                    <div className="flex w-full gap-4">
                                        <input
                                            type="text"
                                            id="rewardimage"
                                            className='text-black p-2 rounded-xl'
                                            value={rewardimage}
                                            onChange={(e) => {
                                                setRewardimage(e.target.value);
                                                updatePreview(e.target.value);
                                            }}
                                            placeholder="https://example.com/your-image.png"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col items-start space-y-2 mt-4 text-3xl">
                                    <label htmlFor="creator">Creator <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        id="creator"
                                        className='text-black p-2 rounded-xl'
                                        value={creator}
                                        onChange={(e) => setCreator(e.target.value)}
                                        placeholder="Creator name or ID"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col items-start space-y-2 mt-4 text-3xl">
                                    <label htmlFor="blockchain">Blockchain <span className="text-red-500">*</span></label>
                                    <select
                                        id="blockchain"
                                        className='text-black p-2 rounded-xl'
                                        value={blockchain}
                                        onChange={(e) => setBlockchain(e.target.value)}
                                        required
                                    >
                                        <option value="ethereum">Ethereum</option>
                                        <option value="solana">Base</option>
                                        <option value="solana">DEGEN</option>
                                        <option value="solana">Zora</option>
                                        {/* Add more options for other blockchains */}
                                    </select>
                                </div>

                                <div className="flex flex-col items-start space-y-2 mt-4 text-3xl">
                                    <label htmlFor="website">Website <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        id="website"
                                        className='text-black p-2 rounded-xl'
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        placeholder="https://example.com"
                                        required
                                    />
                                </div>

                                <div className="bg-[--RaffleCast-ButtonFill] space-y-2 mt-20 text-3xl justify-start text-white">
                                    <Button type="submit" className={cn('', 'text-3xl p-8', 'md:h-auto md:text-3xl')}>
                                        Create Raffle
                                    </Button>
                                    {postMessage && (
                                        <div className="bg-green-600 rounded-sm justify-center items-center align-middle text-center flex px-8 py-2 text-white" id="postMessage">
                                            {postMessage}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="section md:w-[50%] flex flex-col p-8">
                                <div className="imagePreview flex">
                                    <div className="h-[50rem] w-full flex flex-1 rounded-lg object-contain bg-[#ffffff10] border border-[#ffffff20]">
                                        <div className="h-full w-full flex bg-no-repeat object-contain justify-center items-center align-middle" id="imagePreview">
                                            <img src={rewardimage} alt="Waiting for Image URL..." className="h-full w-full object-contain flex justify-center items-center text-white text-3xl" id="imagePreviewImg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex gap-4 md:flex-col flex-col-reverse">
                        {/* Additional footer content if needed */}
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default RaffleCreation;
