import fs from "fs"
import { setUpRolesMod } from "zodiac-roles-sdk"
import dotenv from "dotenv"
import { getRolesConfig } from "./roles"

dotenv.config()

const main = async () => {
  if (!process.env.SAFE_ADDRESS) return

  const safeAddress = process.env.SAFE_ADDRESS as `0x${string}`

  try {
    const tx = setUpRolesMod({
      avatar: safeAddress,
      roles: await getRolesConfig(),
    })

    const dir = "./output"
    if (!fs.existsSync(dir)) {
      fs.mkdirSync("./output")
    }
    const timestamp = new Date().toISOString().replace(/\s/g, "-")
    fs.writeFileSync(`output/tx-${timestamp}.json`, JSON.stringify(tx))
    console.log("Transaction JSON saved to output/tx.json")
  } catch (e) {
    console.error(e)
  }
}

main().then(() => console.log("done"))
