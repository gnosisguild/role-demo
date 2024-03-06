import { allow as allowEth } from "defi-kit/eth"
import { allow as allowGno } from "defi-kit/gno"
import { formatBytes32String } from "ethers/lib/utils"

const allowedTransferAddresses = ["0x485E60C486671E932fd9C53d4110cdEab1E7F0eb"]

const allowedTokens = {
  mainnet: {
    dai: "0x6b175474e89094c44da98b954eedeac495271d0f",
    usdc: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    gno: "0x6810e776880c02933d47db1b9fc05908e5386b96",
    weth: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  } as { [key: string]: `0x${string}` },
  gnosis: {
    dai: "0x6b175474e89094c44da98b954eedeac495271d0f",
    usdc: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    gno: "0x6810e776880c02933d47db1b9fc05908e5386b96",
    weth: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  } as { [key: string]: `0x${string}` },
}

// this role should be able to swap any token for any other token on our allowedToken list
export const swapperRole = async () => {
  const swapRoleKey = formatBytes32String("swapper")
  const cowswapPermission = await allowEth.cowswap.swap({
    sell: Object.keys(allowedTokens.mainnet).map(
      (k) => allowedTokens.mainnet[k]
    ),
    buy: Object.keys(allowedTokens.mainnet).map(
      (k) => allowedTokens.mainnet[k]
    ),
  })

  const bigSwapperMembers = [
    process.env.SWAP_ROLE_WALLET_ADDRESS as `0x${string}`,
  ]

  return {
    key: swapRoleKey,
    members: bigSwapperMembers,
    permissions: cowswapPermission,
  }
}
