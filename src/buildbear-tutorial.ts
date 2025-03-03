// SCRIPT

import axios from "axios";
import {
  ethers,
  parseEther,
  BigNumberish,
  AbiCoder,
  formatUnits,
} from "ethers";

import {
  BridgeParams,
  RelayQuoteData,
  DepositStatusData,
} from "../utils/type-def";
import SpokePoolABI from "../utils/abi/SpokePoolAbi.json";
import dotenv from "dotenv";
import { parseAbi } from "viem";
dotenv.config(); // Load environment variables from .env file

// ### RPC URL ###
let BASE_URL = `https://api.buildbear.io/{sandbox-id}/plugin/across`;

// ### API Endpoints ###
let GET_SUGGESTED_FEES = `/suggested-fees`;
let BRIDGE_STATUS = `/deposit/status`;

// ### Constants ###

let bridgeParams: BridgeParams = {
  inputToken: `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`, // WETH
  outputToken: `0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619`, // WETH
  originChainId: 1,
  destinationChainId: 137,
  amount: parseEther("0.00001"),
};

async function getSuggestedFees(): Promise<RelayQuoteData | undefined> {
  try {
    let res = await axios.get(`${BASE_URL}${GET_SUGGESTED_FEES}`, {
      params: {
        inputToken: bridgeParams.inputToken,
        outputToken: bridgeParams.outputToken,
        originChainId: bridgeParams.originChainId,
        destinationChainId: bridgeParams.destinationChainId,
        amount: bridgeParams.amount,
        recipient: bridgeParams.recipient,
        message: bridgeParams.message,
        relayer: bridgeParams.relayer,
        timestamp: bridgeParams.timestamp,
      },
    });
    let data: RelayQuoteData = res.data;
    console.log("===========Suggested Fees===========");
    console.log(data);
    console.log("====================================");
    return data;
  } catch (err) {
    // @ts-ignore
    console.error(err);
    return undefined;
  }
}

async function getDepositStatus(
  depositId: number
): Promise<DepositStatusData | undefined> {
  try {
    let res = await axios.get(`${BASE_URL}${BRIDGE_STATUS}`, {
      params: {
        originChainId: bridgeParams.originChainId,
        depositId,
      },
    });
    let data: DepositStatusData = res.data;
    return data;
  } catch (err) {
    // @ts-ignore
    console.error(err);
    return undefined;
  }
}

async function depositToSpokePool(bridgeQuote: RelayQuoteData) {
  // 🔹 Setup provider & signer using private key
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  const provider = new ethers.JsonRpcProvider(
    "https://rpc.buildbear.io/{SANDBOX-ID}"
  );

  if (process.env.PRIVATE_KEY == undefined) {
    console.error(
      "🔴 Please provide a private key in the environment variable PRIVATE_KEY"
    );
    return;
  }
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider); // Create wallet instance from private key

  console.log("====================================");
  console.log(
    `Address: ${await wallet.getAddress()}\nBalance: ${await provider.getBalance(
      await wallet.getAddress()
    )}`
  );
  console.log("====================================");

  // 🔹 Define SpokePool contract
  const spokePool = new ethers.Contract(
    bridgeQuote.spokePoolAddress,
    parseAbi([
      "function depositV3( address depositor, address recipient, address inputToken, address outputToken, uint256 inputAmount, uint256 outputAmount, uint256 destinationChainId, address exclusiveRelayer, uint32 quoteTimestamp, uint32 fillDeadline, uint32 exclusivityDeadline, bytes calldata message ) external",
    ]),
    wallet
  );
  // await spokePool?.runner?.sendTransaction({

  // });

  // 🔹 Define deposit parameters

  // Bridge to the same address on the destination chain.
  // Note: If the depositor is not an EOA then the depositor's address
  // might not be valid on the destination chain
  const depositor = await wallet.getAddress(); // Get the address associated with the private key
  const recipient = await wallet.getAddress(); // Change if sending to another wallet

  const inputToken = bridgeParams.inputToken; // ERC20 token being deposited
  // The 0 address is resolved automatically to the equivalent supported
  // token on the the destination chain. Any other input/output token
  // combination should be advertised by the Across API available-routes
  // endpoint.
  const outputToken = bridgeParams.outputToken; // Token received after bridging
  const inputAmount = bridgeParams.amount; // Adjust decimals
  // The outputAmount is set as the inputAmount - relay fees.
  // totalRelayFee.total is returned by the Across API suggested-fees
  // endpoint.
  const outputAmount =
    BigInt(inputAmount) - BigInt(bridgeQuote.totalRelayFee.total);

  console.log("====================================");
  console.log(`inputAmount`, formatUnits(bridgeParams.amount, 18));
  console.log(
    `bridgeQuote.totalRelayFee.total`,
    formatUnits(bridgeQuote.totalRelayFee.total, 18)
  );
  console.log(`outputAmount`, formatUnits(outputAmount, 18));
  console.log("====================================");
  const destinationChainId = bridgeParams.destinationChainId; // Polygon as an example
  const quoteTimestamp = bridgeQuote.timestamp;
  // fillDeadline: A fill deadline of 5 hours. Can be up to
  // SpokePool.getCurrentTime() + SpokePool.fillDeadlineBuffer() seconds.
  const fillDeadlineBuffer = 18000;
  const fillDeadline = Math.round(Date.now() / 1000) + fillDeadlineBuffer;
  // Exclusive relayer and exclusivity deadline should be taken from the
  // Across API suggested-fees response.
  const exclusivityDeadline = bridgeQuote.exclusivityDeadline;
  const exclusiveRelayer = bridgeQuote.exclusiveRelayer;

  // No message will be executed post-fill on the destination chain.
  // See `Across+ Integration` for more information.
  const message = "0x";

  // 🔹 Execute deposit transaction
  try {
    const tx = await spokePool.depositV3(
      depositor, // Sender
      recipient, // Receiver
      inputToken, // Token to deposit
      outputToken, // Token received on the other chain
      inputAmount, // Amount sent
      outputAmount, // Amount expected
      destinationChainId, // Chain ID
      exclusiveRelayer, // No exclusive relayer
      quoteTimestamp, // Timestamp for the quote
      fillDeadline, // Deadline to fill
      exclusivityDeadline, // Exclusive deadline
      message, // Optional message,
      { value: inputAmount }
    );
    console.log("Transaction sent! Tx Hash:", tx.hash);
    await tx.wait();
    console.log("Deposit completed!");
    const receipt = await provider.getTransactionReceipt(tx.hash);

    const depositIdHex = receipt?.logs[1].topics[2];
    if (!depositIdHex) {
      return;
    }
    const depositId = BigInt(depositIdHex).toString();

    console.log(`Deposit ID: ${depositId}`);

    // Now, use depositId to get the deposit status
    await getDepositStatus(+depositId);
  } catch (error) {
    console.error("Deposit failed:", error);
  }
}

// 🔹 Main function
let bridgeQuote = await getSuggestedFees();
if (bridgeQuote) {
  depositToSpokePool(bridgeQuote);
}
