import fs from "fs"
import { setUpRolesMod } from "zodiac-roles-sdk"
import dotenv from "dotenv"
import { getRolesConfig } from "./roles"
import { createExportToSafeTransactionBuilder } from "./export"

dotenv.config()

const main = async () => {
  if (!process.env.SAFE_ADDRESS) return

  const safeAddress = process.env.SAFE_ADDRESS as `0x${string}`

  try {
    const txArray = setUpRolesMod({
      avatar: safeAddress,
      roles: await getRolesConfig(),
    }) as { to: `0x${string}`; data: `0x${string}`; value: "0" }[]
    const exporter = createExportToSafeTransactionBuilder(100)
    const safeTx = await exporter(txArray, {
      name: "Create roles mod with permissions",
    })

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
