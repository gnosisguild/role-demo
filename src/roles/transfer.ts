import { allow } from "zodiac-roles-sdk/kit"
import { TargetPermission, c } from "zodiac-roles-sdk"
import { formatBytes32String } from "ethers/lib/utils"

const allowedTransferAddresses = ["0x485E60C486671E932fd9C53d4110cdEab1E7F0eb"]

// this role should be able to transfer any token on our allowedToken list to any address on our allowedTransferAddresses list
export const transferRole = async () => {
  const swapRoleKey = formatBytes32String("transfer")
  const nativeTransferPermissions = allowedTransferAddresses.map((address) => {
    return { targetAddress: address, send: true } as TargetPermission
  })

  const tokenTransferPermissions = [
    allow.mainnet.usdc.transfer(c.eq(allowedTransferAddresses)),
    allow.mainnet.dai.transfer(c.eq(allowedTransferAddresses)),
  ]

  const transferMembers = [
    process.env.TRANSFER_ROLE_WALLET_ADDRESS as `0x${string}`,
  ]

  return {
    key: swapRoleKey,
    members: transferMembers,
    permissions: [...nativeTransferPermissions, ...tokenTransferPermissions],
  }
}
