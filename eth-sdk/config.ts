import { defineConfig } from "@dethcrypto/eth-sdk"

export default defineConfig({
  contracts: {
    mainnet: {
      dai: "0x6b175474e89094c44da98b954eedeac495271d0f",
      usdc: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      gno: "0x6810e776880c02933d47db1b9fc05908e5386b96",
    },
  },
})
