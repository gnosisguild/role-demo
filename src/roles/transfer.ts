import { allow } from "zodiac-roles-sdk/kit"
import { TargetPermission, c } from "zodiac-roles-sdk"
import { formatBytes32String, getAddress } from "ethers/lib/utils"

// pulled from https://github.com/karpatkey/defi-kit/blob/main/sdk/src/conditions.ts
// for handling arrays of addresses
export const oneOf = <T>(values: readonly T[]) => {
  if (values.length === 0) {
    throw new Error("`oneOf` values must not be empty")
  }

  return values.length === 1 ? values[0] : c.or(...(values as [T, T, ...T[]]))
}

// get comma separated address from ALLOWED_TRANSFER_RECIPIENT_ADDRESSES env var
const allowedTransferAddresses = process.env
  .ALLOWED_TRANSFER_RECIPIENT_ADDRESSES
  ? process.env.ALLOWED_TRANSFER_RECIPIENT_ADDRESSES.split(",")
  : []

// this role should be able to transfer any token on our allowedToken list to any address on our allowedTransferAddresses list
export const transferRole = async (): Promise<{
  key: string
  members: `0x${string}`[]
  permissions: TargetPermission[]
}> => {
  const checksummedAddresses = allowedTransferAddresses.map((address) =>
    getAddress(address)
  )
  const swapRoleKey = formatBytes32String("transfer")
  const nativeTransferPermissions = allowedTransferAddresses.map((address) => {
    return { targetAddress: address, send: true } as TargetPermission
  })

  const tokenTransferPermissions = [
    allow.gnosis.weth.transfer(oneOf(checksummedAddresses)),
    allow.gnosis.eure.transfer(oneOf(checksummedAddresses)),
    allow.gnosis.cow.transfer(oneOf(checksummedAddresses)),
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
