import fs from "fs"
import { ChainId, setUpRolesMod } from "zodiac-roles-sdk"
import dotenv from "dotenv"
import { getRolesConfig } from "./roles"
import { exportToSafeTransactionBuilder } from "defi-kit/gno"

dotenv.config()

const main = async () => {
  if (!process.env.SAFE_ADDRESS) return

  const safeAddress = process.env.SAFE_ADDRESS as `0x${string}`

  try {
    const multisendTx = setUpRolesMod({
      avatar: safeAddress,
      roles: await getRolesConfig(),
    }) as { to: `0x${string}`; data: `0x${string}`; value: "0" }

    const safeTx = exportToSafeTransactionBuilder([multisendTx])

    const dir = "./output"
    if (!fs.existsSync(dir)) {
      fs.mkdirSync("./output")
    }
    const timestamp = new Date().toISOString().replace(/\s/g, "-")
    fs.writeFileSync(`output/tx-${timestamp}.json`, JSON.stringify(safeTx))
    console.log("Transaction JSON saved to output/tx.json")
  } catch (e) {
    console.error(e)
  }
}

main().then(() => console.log("done"))
