import { db } from "@/server/db";
import { raffles, raffle_entries } from "@/server/db/schema";
import { eq, and/*, lt, gte, ne, sql*/ } from 'drizzle-orm';

export async function getRaffleById(id) {
  const raffleResults = await db.select().from(raffles).where(eq(raffles.id, id));
  return raffleResults[0];
}

export async function insertNewRaffle(title, creator, contract, blockchain, endTime, reward, imageUrl, website) {
  const raffleResults = await db.insert(raffles).values({
    title: title,
    creator: creator,
    contract: contract,
    blockchain: blockchain,
    endTime: endTime,
    reward: reward,
    imageUrl: imageUrl,
    website: website,
  }).returning({ insertedId: raffles.id });
  
  return raffleResults;
}

export async function getRaffleEntriesForUser(raffleId, fid) {
  const entryResults = await db.select().from(raffle_entries).where(
    and(
      eq(raffle_entries.raffleId, raffleId)),
      eq(raffle_entries.fid, fid)
    );
    
  return entryResults;
}

export async function getRaffleEntries(raffleId) {
  const entryResults = await db.select().from(raffle_entries).where(eq(raffle_entries.raffleId, raffleId));
  
  return entryResults;
}

export async function enterRaffle(raffleId, fid, username, nfts) {
  // Ensures raffle is still active and rejects NFTs that have already been entered

  const entryTime = new Date().getTime();
  let raffle = (await getRaffleById(raffleId));
  if (entryTime > parseInt(raffle.endTime)) {
    return "Raffle has already ended";
  }
  let existingRaffleEntries = await getRaffleEntriesForUser(raffleId, fid);
  let nftIdEntries = [];
  for (let i = 0; i < nfts.length; i++) {
    const nftId = parseInt(nfts[i].tokenId);
    if (existingRaffleEntries.some((entry) => entry.nftId === nftId)) {
      continue;
    } else {
      nftIdEntries.push(nftId);
    }
  }

  if (nftIdEntries.length === 0) {
    return "No tokens to enter raffle";
  }
  
  const entryResults = await db.insert(raffle_entries).values(
    nftIdEntries.map((nftId) => ({
      entryKey: raffleId + " - " + nftId,
      fid: fid.toString(),
      username: username,
      raffleId: parseInt(raffleId),
      nftId: parseInt(nftId),
      submitTime: entryTime,
    }))
  ).returning();
  
  return entryResults;
}

export async function updateRaffleWinner(raffleId, winnerFid, winnerUsername) {
  const winnerFidUpdateResults = await db.update(raffles).set({
    winnerFid: winnerFid,
    winnerUsername: winnerUsername,
  }).where(eq(raffles.id, raffleId)).returning();

  return winnerFidUpdateResults;
};

