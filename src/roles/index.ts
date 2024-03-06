import { swapperRole } from "./swapper"
import { transferRole } from "./transfer"

export const getRolesConfig = async () => {
  return [await swapperRole(), await transferRole()]
}
