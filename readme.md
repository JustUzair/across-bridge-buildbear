# Explanation & Steps

In this repo you can:

- Setup Across Bridge on BuildBear Sandbox
- Call the API route to get the deposit pool address & fees dynamically
- Use the spoke pool (deposit pool) address and other params to initiate a cross-chain deposit
- Track the status of asset bridging on the destination chain

# Installation & Executing the script

Clone the repository, install the required dependencie, and run the script

```bash
git clone https://github.com/JustUzair/across-bridge-buildbear.git
npm i
npm start
```

# Sample Output

```bash
===========Suggested Fees===========
{
  estimatedFillTimeSec: 10,
  capitalFeePct: '95313207088108',
  capitalFeeTotal: '10721118321356',
  relayGasFeePct: '4724256651654',
  relayGasFeeTotal: '531398702133',
  relayFeePct: '100037463739762',
  relayFeeTotal: '11252517023489',
  lpFeePct: '0',
  timestamp: '1741144079',
  isAmountTooLow: false,
  quoteBlock: '21977900',
  exclusiveRelayer: '0xB96b74874126A787720a464EAb3FBD2F35a5D14e',
  exclusivityDeadline: 1741144325,
  spokePoolAddress: '0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5',
  destinationSpokePoolAddress: '0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64',
  totalRelayFee: { pct: '100037463739762', total: '11252517023489' },
  relayerCapitalFee: { pct: '95313207088108', total: '10721118321356' },
  relayerGasFee: { pct: '4724256651654', total: '531398702133' },
  lpFee: { pct: '0', total: '0' },
  limits: {
    minDeposit: '229232666571917',
    maxDeposit: '1013936183218258295723',
    maxDepositInstant: '180701577849658105483',
    maxDepositShortDelay: '1013936183218258295723',
    recommendedDepositInstant: '180701577849658105483'
  },
  fillDeadline: '1741156015'
}
====================================
inputAmount 0.112483029885315943
bridgeQuote.totalRelayFee.total 0.000011252517023489
outputAmount 0.112471777368292454
====================================
Transaction sent! Tx Hash: 0x6465f35e56cdec1cb65172528ab4aa9864372dfede5077b4b57d8e47b9946dbe
Deposit completed!
Deposit ID: 2347472
Fill Status : filled
```
