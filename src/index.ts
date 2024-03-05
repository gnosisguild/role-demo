import { formatBytes32String } from "ethers/lib/utils"
import fs from "fs"
import { setUpRolesMod } from "zodiac-roles-sdk"
import dotenv from "dotenv"
import { allow as allowEth, apply as applyEth } from "defi-kit/eth"
import { allow as allowGno, apply as applyGno } from "defi-kit/gno"

dotenv.config()

const main = async () => {
  if (!process.env.SAFE_ADDRESS) return

  const safeAddress = process.env.SAFE_ADDRESS as `0x${string}`

  const swapRoleKey = formatBytes32String("Big-Swapper")

  const cowswapPermission = await allowEth.cowswap.swap({
    sell: ["0x6b175474e89094c44da98b954eedeac495271d0f"],
    buy: ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"],
  })

  const bigSwapperMembers = [
    process.env.SWAP_ROLE_WALLET_ADDRESS as `0x${string}`,
  ]

  try {
    const tx = setUpRolesMod({
      avatar: safeAddress,
      roles: [
        {
          key: swapRoleKey,
          members: bigSwapperMembers,
          permissions: cowswapPermission,
        },
      ],
    })

    fs.mkdirSync("./output")
    fs.writeFileSync("output/tx.json", JSON.stringify(tx))
    console.log("Transaction JSON saved to output/tx.json")
  } catch (e) {
    console.error(e)
  }
}

main().then(() => console.log("done"))
