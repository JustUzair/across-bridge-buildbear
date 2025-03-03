// ### Type Definitions ###
type BridgeParams = {
  inputToken: `0x${string}`;
  outputToken: `0x${string}`;
  originChainId: number;
  destinationChainId: number;
  amount: bigint;
  recipient?: `0x${string}`;
  message?: `string`;
  relayer?: `0x${string}`;
  timestamp?: number;
};

type DepositStatusData = {
  fillStatus: string;
  fillTxHash: `0x${string}`;
  destinationChainId: number;
};

type RelayQuoteData = {
  estimatedFillTimeSec: number;
  capitalFeePct: string;
  capitalFeeTotal: string;
  relayGasFeePct: string;
  relayGasFeeTotal: string;
  relayFeePct: string;
  relayFeeTotal: string;
  lpFeePct: string;
  timestamp: string;
  isAmountTooLow: boolean;
  quoteBlock: string;
  exclusiveRelayer: string;
  exclusivityDeadline: number;
  spokePoolAddress: string;
  destinationSpokePoolAddress: string;
  totalRelayFee: { pct: string; total: bigint };
  relayerCapitalFee: { pct: string; total: bigint };
  relayerGasFee: { pct: string; total: bigint };
  lpFee: { pct: string; total: bigint };
  limits: {
    minDeposit: string;
    maxDeposit: string;
    maxDepositInstant: string;
    maxDepositShortDelay: string;
    recommendedDepositInstant: string;
  };
  fillDeadline: string;
};

export { BridgeParams, RelayQuoteData, DepositStatusData };
