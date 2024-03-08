import {
  Interface,
  Result,
  hexlify,
  isBytes,
  isBytesLike,
  FunctionFragment,
} from "ethers/lib/utils"
import { JsonFragment, JsonFragmentType } from "@ethersproject/abi"
import { ChainId, posterAbi, rolesAbi } from "zodiac-roles-sdk"
import { BigNumber, ethers } from "ethers"
import { whatsabi } from "@shazow/whatsabi"

// There is a lot of complexity in this file, but it is mostly just to get the ABI of the contracts
// and decode the transactions. This makes the transaction in the Safe Transaction Builder
// app more human readable and easier to understand.

// EIP-3722 Poster contract
export const POSTER_ADDRESS = "0x000000000000cd17345801aa8147b8D3950260FF"

export const createExportToSafeTransactionBuilder = (chainId: ChainId) => {
  /**
   * Exports calls as a JSON object that can be imported into the Safe Transaction Builder app.
   * @param transactions The transactions to export
   * @param meta Meta info to set on the JSON file
   * @returns The Safe Transaction Builder compatible JSON object
   */
  return async function exportToSafeTransactionBuilder(
    transactions: {
      to: `0x${string}`
      data: `0x${string}`
      value: "0"
    }[],
    meta?: {
      name?: string
      description?: string
    }
  ) {
    const abis = await getAbis(transactions)
    const decodedTransactions = await Promise.all(
      transactions.map((tx) => decode(tx, abis))
    )
    return {
      version: "1.0",
      chainId: chainId.toString(10),
      createdAt: Date.now(),
      meta: {
        name: meta?.name || "Update role permissions",
        description: meta?.description || "",
        txBuilderVersion: "1.16.2",
      },
      transactions: decodedTransactions,
    } as const
  }
}

const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.gnosischain.com/"
)

const getAbis = async (
  transactions: {
    to: `0x${string}`
    data: `0x${string}`
    value: "0"
  }[]
): Promise<{ [address: string]: readonly JsonFragment[] }> => {
  const addresses = transactions.map((tx) => tx.to)
  const uniqueAddresses = Array.from(new Set(addresses))
  const result = await Promise.all(
    uniqueAddresses.map(async (address) => {
      let abi: readonly JsonFragment[] = []
      const res = await whatsabi.autoload(address, {
        provider,
        ...whatsabi.loaders.defaultsWithEnv({
          SOURCIFY_CHAIN_ID: 100,
          ETHERSCAN_BASE_URL: "https://api.gnosisscan.io/api",
        }),
      })

      if (res.abi.length > 0) {
        abi = res.abi

        if (res.followProxies) {
          const proxyAbi = await res.followProxies()
          if (proxyAbi.abi.length > 0) {
            abi = proxyAbi.abi
          }
        }
      } else {
        // Fallback to rolesAbi if no ABI is found
        abi = rolesAbi
      }
      return [address, abi] as const
    })
  )
  return Object.fromEntries(result)
}

const decode = async (
  transaction: {
    to: `0x${string}`
    data: `0x${string}`
    value: "0"
  },
  allAbis: { [address: string]: readonly JsonFragment[] }
) => {
  let abi: readonly JsonFragment[] = []
  if (allAbis[transaction.to]) {
    abi = allAbis[transaction.to]
  } else {
    throw new Error(`No ABI found for address ${transaction.to}`)
  }
  const iface = new Interface(abi)

  const selector = transaction.data.slice(0, 10)
  let functionFragment: FunctionFragment
  try {
    functionFragment = iface.getFunction(selector)
  } catch (e) {
    console.log("transaction", transaction.to, selector, abi)
    throw new Error(`FUNCTION FRAGMENT ERROR: ${selector}`)
  }
  if (!functionFragment) {
    console.log("transaction", transaction.to, selector)
    throw new Error(`Could not find a function with selector ${selector}`)
  }

  const contractMethod = abi.find(
    (fragment) =>
      fragment.type === "function" && fragment.name === functionFragment.name
  )
  if (!contractMethod) {
    throw new Error(
      `Could not find an ABI function fragment with name ${functionFragment.name}`
    )
  }

  const contractInputsValues = asTxBuilderInputValues(
    iface.decodeFunctionData(functionFragment, transaction.data)
  )

  return {
    to: transaction.to,
    value: transaction.value,
    contractMethod: {
      inputs: mapInputs(contractMethod.inputs) || [],
      name: contractMethod.name || "",
      payable: !!contractMethod.payable,
    },
    contractInputsValues,
  }
}

const mapInputs = (
  inputs: readonly JsonFragmentType[] | undefined
): ContractInput[] | undefined => {
  return inputs?.map((input) => ({
    internalType: input.internalType || "",
    name: input.name || "",
    type: input.type || "",
    components: mapInputs(input.components),
  }))
}

const asTxBuilderInputValues = (result: Result) => {
  const object: Record<string, string> = {}
  for (const key of Object.keys(result)) {
    // skip numeric keys (array indices)
    if (isNaN(Number(key))) {
      const value = result[key]
      let serialized = value
      if (typeof value === "string") {
        serialized = value
      } else if (BigNumber.isBigNumber(value)) {
        serialized = value.toString()
      } else if (isBytesLike(value)) {
        serialized = hexlify(value)
      } else {
        serialized = JSON.stringify(value)
      }

      object[key] = serialized
    }
  }
  return object
}

export interface ContractInput {
  internalType: string
  name: string
  type: string
  components?: ContractInput[]
}
