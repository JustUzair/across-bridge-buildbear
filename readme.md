# Installation & Executing the scripts

```bash
npm i
npm start
```

# Sample Output

```bash
===========Suggested Fees===========
{
  estimatedFillTimeSec: 20,
  capitalFeePct: '99958333334000',
  capitalFeeTotal: '99958333334',
  relayGasFeePct: '914895677388000',
  relayGasFeeTotal: '914895677388',
  relayFeePct: '1014854010722000',
  relayFeeTotal: '1014854010722',
  lpFeePct: '0',
  timestamp: '1740990671',
  isAmountTooLow: false,
  quoteBlock: '21965180',
  exclusiveRelayer: '0x41ee28EE05341E7fdDdc8d433BA66054Cd302cA1',
  exclusivityDeadline: 1740990953,
  spokePoolAddress: '0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5',
  destinationSpokePoolAddress: '0x9295ee1d8C5b022Be115A2AD3c30C72E34e7F096',
  totalRelayFee: { pct: '1014854010722000', total: '1014854010722' },
  relayerCapitalFee: { pct: '99958333334000', total: '99958333334' },
  relayerGasFee: { pct: '914895677388000', total: '914895677388' },
  lpFee: { pct: '0', total: '0' },
  limits: {
    minDeposit: '212199790346607',
    maxDeposit: '1485863180865570193790',
    maxDepositInstant: '27598191253298252752',
    maxDepositShortDelay: '1485863180865570193790',
    recommendedDepositInstant: '27598191253298252752'
  },
  fillDeadline: '1741005345'
}
====================================
====================================
Address: 0xA72e562f24515C060F36A2DA07e0442899D39d2c
Balance: 170826311675309300
====================================
====================================
inputAmount 0.001
bridgeQuote.totalRelayFee.total 0.000010227126036176
outputAmount 0.000989772873963824
====================================
Transaction sent! Tx Hash: 0x3f9b35a94eb434278d726a1033cdda0e9f7c87df841974704e50e0186a69f909
Deposit completed!
Deposit ID: 1002201
===========Deposit Status===========
Fill Status : Fulfilled
====================================
```
