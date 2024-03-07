import { defineConfig } from "@dethcrypto/eth-sdk"

// These are Gnosis Chain token addresses, and should be changed
// to their mainnet counterparts if you are deploying on mainnet
export const allowedTokenContracts = {
  weth: "0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1",
  eure: "0xcB444e90D8198415266c6a2724b7900fb12FC56E",
  cow: "0x177127622c4A00F3d409B75571e12cB3c8973d3c",
} as { [key: string]: `0x${string}` }

export default defineConfig({
  networkIds: {
    gnosis: 100,
  },
  etherscanURLs: {
    gnosis: "https://api.gnosisscan.io/api",
  },
  rpc: {
    gnosis: "https://rpc.gnosischain.com",
  },
  contracts: {
    gnosis: allowedTokenContracts,
  },
})

// ethereum mainnet config doesn not require custom networkIds, etherscanURLs, or rpc

// export default defineConfig({
//   contracts: {
//     gnosis: allowedTokenContracts,
//   },
// })
