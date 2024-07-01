/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { init, fetchQuery } from "@airstack/node";
import { neynar } from "frog/middlewares";
import { pinata } from 'frog/hubs'
import { Box, Heading, Text, VStack, HStack, vars, Image, Spacer } from '../../../ui/frogUI';


import { getRaffleById, enterRaffle, getRaffleEntriesForUser, getRaffleEntries, updateRaffleWinner} from "../../../../db/connection";
init("1a29aa5deb12c41078eaf8598d27e6239");


const neynarMiddleware = neynar({
  apiKey: 'NEYNAR_FROG_FM',
  features: ['interactor', 'cast'],
})
const app = new Frog({
  assetsPath: "/",
  basePath: "/api/frame",
  ui: { vars },
  hub: pinata()
});


const getQueryString = (fid, contractAddress, blockchain) => {
  return `
  query GetNFTsOwnedByFcName {
    TokenBalances(
      input: {filter: {owner: {_eq: "fc_fid:${fid}"}, tokenAddress: {_eq: "${contractAddress}"}}, blockchain: ${blockchain}, limit: 50}
    ) {
      TokenBalance {
        tokenId
        formattedAmount
      }
      pageInfo {
        nextCursor
        prevCursor
      }
    }
  }
`};

async function sendDirectCast(raffleId, winnerFid, winnerUsername) {
  const apiKey = process.env.FARCASTER_API_KEY
  if (!apiKey) {
    throw new Error("No API key found! Please set FARCASTER_API_KEY in environment variables.");
  }
  const url = 'https://api.warpcast.com/v2/ext-send-direct-cast';
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  }

  const body = {
    recipientFid: winnerFid,
    message: `Hi ${winnerUsername}, you just won a raffle! You can find your raffle searching for the raffleId: ${raffleId}`,
    idempotencyKey: uuidv4(),
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`\n\n\n[!] Error sending DM: ${errorData.error}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending direct cast:', error);
    throw error;
  }
}


app.frame("/", neynarMiddleware, async (c) => {
  const { buttonValue, inputText, frameData } = c;
  if (c.frameData && !c.verified) {
    throw new Error("Verification failed");
  }

  let status = "initial";
  let frame = "initial";
  let frameCallerNfts = [];
  let error = "";
  const frameCallerFid = frameData?.fid;

  let searchRaffleId;

  // This is meant to give additional ways to send a user directly to a raffle although not sure if fully worked out yet
  if (!isNaN(parseInt(inputText))) {
    searchRaffleId = inputText;
  } else if (buttonValue?.split("/")[1]) {
    searchRaffleId = buttonValue?.split("/")[1];
  }
  // THIS IS GOOD BUT NEED TO ADD ADDITIONAL CHECK LATER FOR IF (frame === initial && searchRaffleId)
  // else if(new URLSearchParams(c.req.url.split("?")[1]).get('raffleId')) {
  //   searchRaffleId = new URLSearchParams(c.req.url.split("?")[1]).get('raffleId')
  // }

  const searchedRaffleInfo = searchRaffleId ? (await getRaffleById(searchRaffleId)) : null;
  const contractAddress = searchedRaffleInfo?.contract;
  const blockchain = searchedRaffleInfo?.blockchain;

  if (buttonValue && (buttonValue.startsWith("CheckNFT") || buttonValue.startsWith("SearchRaffle"))) {
    const query = getQueryString(frameCallerFid, contractAddress, blockchain);
    try {
      const { data, error: queryError } = await fetchQuery(query, {});
      if (queryError) {
        throw new Error(queryError.message);
      }
      frameCallerNfts = data?.TokenBalances?.TokenBalance || [];
      status = "response";
      if (buttonValue.startsWith("SearchRaffle")) {
        frame = "about";
      } else {
        frame = "results";
      }
    } catch (err) {
      console.error("Error fetching NFT data:", err);
      status = "error";
      error = err.message;
      frame = "placeholderFrame";
    }
  } else if (buttonValue && buttonValue.startsWith("EnterRaffle")) {
    const query = getQueryString(frameCallerFid, contractAddress, blockchain);
    try {
      const { data, error: queryError } = await fetchQuery(query, {});
      if (queryError) {
        throw new Error(queryError.message);
      }

      frameCallerNfts = data?.TokenBalances?.TokenBalance || [];
      const entryResults = await enterRaffle(searchedRaffleInfo.id, frameCallerFid, c.var.interactor.username, frameCallerNfts,);
      if (entryResults === "No tokens to enter raffle") {
        console.log("[x] No tokens to enter raffle");
        status = "error";
        error = entryResults;
        frame = "results";
      } else if (entryResults === "Raffle has already ended") {
        console.log("[x] Raffle has already ended");
        status = "error";
        error = entryResults;
        frame = "results";
      } else {
        console.log("[!x!] Raffle entry successful");
        frame = "raffle";
        status = "response";
        error = "";
      }
    } catch (err) {
      console.error("Error entering raffle:", err);
      status = "error";
      error = "An error occurred while entering the raffle.";
      frame = "results";
    }
  }

  if (frame === "initial" && !searchRaffleId) {

    const initialResponse = c.res({
      image: (
        <Box
          grow
          alignVertical="center"
          backgroundImage={vars.colors.gradient}
          padding="4"
          flex={1}
        >
          <VStack
            gap="2"
            alignVertical="center"
            align="center"
            alignItems="center"
            grow
          >
            <Box
              width="100%"
              flexDirection="row"
              display="flex"
              padding={4}
              borderRadius={6}
              justifyContent="space-between"
            >
              <Box backgroundColor="Text" borderRadius="6" padding="2" width="40%">
                <Image src="https://rafflecast.xyz/AppIcon_RaffleCastSmall.png" width={192} height={192} border="5px" borderColor="red" borderRadius={6} />
              </Box>
              <Box borderRadius="6" padding="10" minWidth="65%" justifyContent="center" alignItems="center">
                <Heading align="center" size="48">RaffleCast</Heading>
              </Box>


            </Box>


            <Box
              width="100%"
              flexDirection="column"
              display="flex"
              padding="16"
              borderRadius={6}
              borderColor="red"
              border="5px"
              backgroundColor="background300"
            >
              <Text color="text200" weight="600" align="center" size="24">Create a Raffle @ rafflecast.xyz</Text>
              <Text color="text200" align="center" padding="10" size="30">Search for a Raffle by Entering a Raffle ID</Text>

            </Box>

          </VStack>

        </Box>
      ),
      intents: [
        <TextInput key="raffleId" name="raffleId" placeholder="Enter a Raffle ID" />,
        <Button key="CheckNFT" value="SearchRaffle">Search</Button>,
        <Button.Link key="CheckNFT" href="https://rafflecast.xyz/create">Create</Button.Link>,
        <Button.Link key="CheckNFT" href="https://rafflecast.xyz/discover">Raffles</Button.Link>,
      ],
      input: [
        <input key="fname" type="text" name="fname" placeholder="Enter your FID" />,
      ]
    });

    return initialResponse;
  } else if (frame === "about" /*|| (frame === "initial" && searchRaffleId)*/) {
    const raffleEntries = await getRaffleEntriesForUser(searchedRaffleInfo.id, frameCallerFid);
    const totalEntries = await getRaffleEntries(searchedRaffleInfo.id);
    const nowDate = new Date().getTime();
    const raffleEnded = nowDate > searchedRaffleInfo.endTime;
    let winnerFid = searchedRaffleInfo.winnerFid;
    let winnerUsername = searchedRaffleInfo.winnerUsername;


    if (raffleEnded && !winnerUsername) {
      const raffleEntries = await getRaffleEntries(searchedRaffleInfo.id);
      const winnerIndex = Math.floor(Math.random() * raffleEntries.length);
      winnerFid = raffleEntries.length ? raffleEntries[winnerIndex].fid : 0;
      winnerUsername = raffleEntries.length ? raffleEntries[winnerIndex].username : "No one entered the raffle";
      await updateRaffleWinner(searchedRaffleInfo.id, winnerFid, winnerUsername);
      if (winnerUsername !== "No one entered the raffle") {
        sendDirectCast(searchedRaffleInfo.id, winnerFid, winnerUsername);
      }
    }

    let seconds = Math.floor((searchedRaffleInfo.endTime - (nowDate)) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    hours = hours - (days * 24);
    minutes = minutes - (days * 24 * 60) - (hours * 60);
    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
    let remainingTime = " "
    if (days > 0) {
      remainingTime += days + "d ";
    }
    if (hours > 0) {
      remainingTime += hours + "h ";
    }
    if (minutes > 0) {
      remainingTime += minutes + "m ";
    }
    remainingTime += seconds + "s";

    const aboutResponse = c.res({
      image: (
        <Box
          grow
          alignVertical="center"
          backgroundImage={vars.colors.gradient}
          padding="4"
          flex={1}
        >
          {status === "response" ? (
            <VStack
              gap="1"
              alignVertical="center"
              align="center"
              alignItems="center"
              grow
            >
              <Box
                width="100%"
                flexDirection="row"
                display="flex"
                padding={4}
                borderRadius={6}
                justifyContent="space-between"
                border="5px"
                backgroundColor="background200"
              >
                <Box padding="10" minWidth="65%" justifyContent="center" >
                  <Text weight="600" size="26" color="AccentText">Raffle ID: {searchedRaffleInfo.id}</Text>
                  <Text weight="600" wrap="balance" size="24">{searchedRaffleInfo.title}</Text>
                  <Text weight="600" wrap="balance" size="18">Creator: {searchedRaffleInfo.creator}</Text>
                  <Text size="36" >Current Entries: {totalEntries.length.toString()}</Text>
                </Box>

                <Box backgroundColor="Text" borderRadius="6" padding="2" width="40%">
                  <Image src={searchedRaffleInfo.imageUrl} width={192} height={192} border="5px" borderColor="red" borderRadius={6} />
                </Box>
              </Box>


              <Box
                width="100%"
                flexDirection="column"
                display="flex"
                padding="10"
                borderRadius={6}

                border="5px"
                backgroundColor="background300"
              >
                <Text color="text200" align="center" size="24">Reward: {searchedRaffleInfo.reward}</Text>
                <Text align="center" size="30">{raffleEnded ? (winnerUsername === "No one entered the raffle" ? "No one entered the raffle" : `${winnerUsername} has won the raffle!`) : `Time Remaining: ${remainingTime}`}</Text>
                {/* <Text  size="24">Time Remaining: {remainingTime}</Text> */}
              </Box>

            </VStack>
          ) : status === "error" ? (
            <VStack gap="4" grow>
              <Text color="pink900" size="20">
                Error: {error}
              </Text>
            </VStack>
          ) : (
            <VStack gap="4" backgroundColor="red">
              <Text color="text200" size="20">
                Unknown Error Occurred.
              </Text>
            </VStack>
          )}
        </Box>
      ),
      intents: [
        // <TextInput key="raffleId" name="raffleId" placeholder="Seach a RaffleId" />,
        !raffleEnded && <Button key="CheckNFT" value={`CheckNFT/${searchedRaffleInfo.id}`}>Am I Eligible?</Button>,
        // <Button key="CheckNFT" value={`CheckNFT/${searchedRaffleInfo.id}`}>Am I Eligible?</Button>,
        <Button key="reset" value="reset">Home</Button>,
      ],
      input: [
        <input key="fname" type="text" name="fname" placeholder="Enter your FID" />,
      ]
    });
    return aboutResponse;

  } else if (frame === "results") {

    // not sure how some of this following code got here, need to clean it up from the extra raffle sellection
    const raffleEntries = await getRaffleEntriesForUser(searchedRaffleInfo.id, frameCallerFid);
    const nowDate = new Date().getTime();
    const raffleEnded = nowDate > searchedRaffleInfo.endTime;



    let winner = searchedRaffleInfo.winner;
    if (raffleEnded && !searchedRaffleInfo.winner) {
      // get all raffle entries of raffleId and pick random winner from raffleEntries
      const raffleEntries = await getRaffleEntries(searchedRaffleInfo.id);
      const winnerIndex = Math.floor(Math.random() * raffleEntries.length);
      winner = raffleEntries.length ? raffleEntries[winnerIndex].username : "No one entered the raffle";
      console.log("\n\n[!] New winner selected 1: ", winner);
      await updateRaffleWinner(searchedRaffleInfo.id, winner);
      console.log("\n[.] DMing winner");
      if (winner !== "No one entered the raffle") {
        sendDirectCast(searchedRaffleInfo.id, winner);
      }
    }
    let seconds = Math.floor((searchedRaffleInfo.endTime - (nowDate)) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    hours = hours - (days * 24);
    minutes = minutes - (days * 24 * 60) - (hours * 60);
    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
    let remainingTime = " "
    if (days > 0) {
      remainingTime += days + "d ";
    }
    if (hours > 0) {
      remainingTime += hours + "h ";
    }
    if (minutes > 0) {
      remainingTime += minutes + "m ";
    }
    remainingTime += seconds + "s";


    const resultsResponse = c.res({
      image: (raffleEnded ?
        <Box
          grow
          alignVertical="center"
          backgroundImage={vars.colors.gradient}
          padding="4"
          flex={1}
        >
          {status === "response" ? (
            <VStack
              gap="2"
              alignVertical="center"
              align="center"
              alignItems="center"
              grow
            >
              <Box
                width="100%"
                flexDirection="row"
                display="flex"
                padding={4}
                borderRadius={6}
                justifyContent="space-between"
                border="5px"
                backgroundColor="background200"
              >
                <Box borderRadius="6" padding="10" minWidth="65%" justifyContent="center" alignItems="center">
                  <Heading align="center" size="48">Raffle Ended 🎉</Heading>
                </Box>

                <Box backgroundColor="Text" borderRadius="6" padding="2" width="40%">
                  <Image src="https://rafflecast.xyz/AppIcon_RaffleCastSmall.png" width={192} height={192} border="5px" borderColor="red" borderRadius={6} />
                </Box>
              </Box>
              <Box
                width="100%"
                flexDirection="column"
                display="flex"
                padding="16"
                borderRadius={6}
                borderColor="red"
                border="5px"
                backgroundColor="background300"
              >
                <Text color="text200" align="center" padding="10" size="30">This raffle has ended</Text>
                <Text color="text200" align="center" size="20">Go back or discover more raffles</Text>
              </Box>

            </VStack>

          ) : status === "error" ? (
            <VStack gap="4" grow>
              <Text color="pink900" size="20">
                Error: {error}
              </Text>
            </VStack>
          ) : (
            <VStack gap="4" backgroundColor="red">
              <Text color="text200" size="20">
                Unknown Error Occurred.
              </Text>
            </VStack>
          )}
        </Box>
        :
        <Box
          grow
          alignVertical="center"
          backgroundImage={vars.colors.gradient}
          padding="4"
          flex={1}
          height="100%"
        >
          {status === "response" ? (

            <VStack
              gap="1"
              alignVertical="center"
              align="center"
              alignItems="center"
              grow
            >
              <Box
                width="100%"
                flexDirection="row"
                display="flex"
                padding={4}
                borderRadius={6}
                justifyContent="space-between"
                border="5px"
                backgroundColor="background200"
              >
                <Box borderRadius="6" padding="10" minWidth="65%" justifyContent="center" alignItems="center">
                  <Text align="center" size="20">Hey {c.var.interactor.displayName ? c.var.interactor.displayName : frameCallerFid} !</Text>
                  <Text align="center" size="40">Available Entries:</Text>
                  <Text align="center" size="60">{frameCallerNfts.length.toString()}</Text>

                </Box>

                <Box backgroundColor="Text" borderRadius="6" padding="2" width="40%">
                  <Image src={searchedRaffleInfo.imageUrl} width={192} height={192} border="5px" borderColor="red" borderRadius={6} />
                </Box>
              </Box>


              <Box
                width="100%"
                flexDirection="column"
                display="flex"
                padding="10"
                borderRadius={6}

                border="5px"
                backgroundColor="background300"
              >
                <Text weight="600" align="center" size="24">You Have Submitted:</Text>
                <Text align="center" size="40">{raffleEntries.length.toString()} {raffleEntries.length === 1 ? 'Entry' : 'Entries'}</Text>
              </Box>

            </VStack>

          ) : status === "error" ? (

            <Box
              grow
              alignVertical="center"
              backgroundImage={vars.colors.gradient}
              padding="4"
              flex={1}
              height="100%"
            >
              <VStack
                gap="1"
                alignVertical="center"
                align="center"
                alignItems="center"
                grow
              >
                <Box
                  width="100%"
                  flexDirection="row"
                  display="flex"
                  padding={4}
                  borderRadius={6}
                  justifyContent="space-between"
                  border="5px"
                  backgroundColor="background200"
                >
                  <Box borderRadius="6" padding="10" minWidth="100%" justifyContent="center" alignItems="center" height="50%">
                    <Text align="center" size="20">You have already entered!</Text>
                    <Text align="center" size="34">No Remaining Entries to Submit</Text>
                  </Box>
                </Box>


                <Box
                  width="100%"
                  flexDirection="column"
                  display="flex"
                  padding="10"
                  borderRadius={6}

                  border="5px"
                  backgroundColor="background300"
                >
                  <Text color="text200" align="center" padding="10" size="30">Visit External Site</Text>
                  <Text color="text200" align="center" size="20">to collect eligible assets</Text>
                </Box>

              </VStack>
            </Box>
          ) : null
          }
        </Box>

      ),
      intents: [
        !raffleEnded && frameCallerNfts.length > 0 && status != "error" && <Button value={`EnterRaffle/${searchedRaffleInfo.id}`}>Submit Entries</Button>,
        <Button key="reset" value={`SearchRaffle/${searchedRaffleInfo.id}`}>Back</Button>,
        raffleEnded && <Button.Link href="https://rafflecast.xyz">Discover Raffles</Button.Link>,
        // status === "error" && <Button.Link value={`EnterRaffle/${searchedRaffleInfo.id}`}>External Site</Button.Link>
        status === "error" && <Button.Link key="externalPage" href={searchedRaffleInfo.website}>External Page</Button.Link>
      ],
    });
    return resultsResponse;

  } else if (frame === "raffle") {
    const raffleResponse = c.res({
      image: (

        <Box
          grow
          alignVertical="center"
          backgroundImage={vars.colors.gradient}
          padding="4"
          flex={1}
          height="100%"
        >

          {status === "response" ? (

            <VStack
              gap="1"
              alignVertical="center"
              align="center"
              alignItems="center"
              grow
            >
              <Box
                width="100%"
                flexDirection="row"
                display="flex"
                padding={4}
                borderRadius={6}
                justifyContent="space-between"
                border="5px"
                backgroundColor="background200"
              >
                <Box borderRadius="6" padding="10" minWidth="65%" justifyContent="center" alignItems="center">
                  <Text align="center" size="30">You have entered the </Text>
                  <Text align="center" size="60">Raffle!</Text>
                </Box>

                <Box backgroundColor="Text" borderRadius="6" padding="2" width="40%">
                  <Image src={searchedRaffleInfo.imageUrl} width={192} height={192} border="5px" borderColor="red" borderRadius={6} />
                </Box>
              </Box>


              <Box
                width="100%"
                flexDirection="column"
                display="flex"
                padding="10"
                borderRadius={6}

                border="5px"
                backgroundColor="background300"
              >
                <Text align="center" size="20">Entries Submitted</Text>
                <Text align="center" size="40">{frameCallerNfts.length}</Text>
                <Text align="center" size="20">The Winner will be announced when the raffle ends!</Text>
              </Box>

            </VStack>


          ) : status === "error" ? (
            <span>Error: {error}</span>
          ) : (
            <span>Unknown error occurred.</span>
          )}
        </Box>
      ),
      intents: [
        status === "response" ? (
          <Button value="SubmitRaffle">Home</Button>
        ) : (
          <Button value="Reset">Reset</Button>
        ),
      ],
    });
    return raffleResponse;
  }
  else if (frame === "placeholderFrame") {
    const placeholderFrame = c.res({
      image: (
        <div
          style={{
            alignItems: "center",
            background: "black",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: 60,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              marginTop: 30,
              padding: "0 0px",
              whiteSpace: "pre-wrap",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ color: "#ff0000", fontSize: "40px", textWrap: "wrap" }}>Error {error}</span>
            <span>You&lsquo;re not supposed to be here</span>
          </div>
        </div>
      ),
      intents: [<Button key="Back" value="Back">Home</Button>],
    });
    return placeholderFrame;
  } else {
    console.log("\n\n\n\nno matches found");
  }

  return initialResponse;
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);