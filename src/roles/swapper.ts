import { allow as allowGno } from "defi-kit/gno"
import { formatBytes32String } from "ethers/lib/utils"
import { allowedTokenContracts } from "../../eth-sdk/config"
import { PermissionSet } from "zodiac-roles-sdk"

// this role should be able to swap any token for any other token on our allowedToken list
export const swapperRole = async (): Promise<{
  key: string
  members: `0x${string}`[]
  permissions: PermissionSet
}> => {
  const swapRoleKey = formatBytes32String("swapper")
  const cowswapPermission = await allowGno.cowswap.swap({
    sell: Object.keys(allowedTokenContracts).map(
      (k) => allowedTokenContracts[k]
    ),
    buy: Object.keys(allowedTokenContracts).map(
      (k) => allowedTokenContracts[k]
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
