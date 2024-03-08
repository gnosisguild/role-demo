## Permissioned Smart Account

Using a Safe is the smart and secure way to custody your assets... right? But it's so tedious to sign with multiple accounts for actions that are so quick with a hot wallet.

What if both worlds could be combined? This demo shows how to retain multisig security, while allowing the ease of a hot wallet for trusted token swaps and transfers to contacts you trust. Of course, this permitted transaction set demoed here can be extended or customized to any type of transaction, so you can give your designated hot wallets and particular permissions you want. Secure granular permissions are key to everyday, casual, ubiquitous account usage. Smart restrictions offloaded into customizable presets allow for frictionless onchain activity.

This demo makes use of the Zodiac Roles Mod, which is a fine grained permission system that can be used with [Safes](https://safe.global/) or any smart account that complies with the [Zodiac Modular Account standard](https://eips.ethereum.org/EIPS/eip-5005). While the Roles mod tooling is currently used for managing large organizational treasuries (> $700,000,000 of volume has passed through the Zodiac Roles Mod to date), the toolset is flexible enough to be used with any smart account at any scale. Although the current tooling feels a bit like doing a grocery run in a gundam, as more Roles mod patterns develop, permissioned, easy to use smart accounts will become the norm.

### About this demo

The permissioned smart account pattern in this demo has three parts — a Safe, a Roles mod, and a hot wallet.

- The Safe is the core of the account, and holds all the assets; the address of the Safe should be thought of as the account's address.
- The Roles mod enforces the permissions defined when you setup the account. Permissions are assigned to Roles. In this demo there are two Roles: `swapper` and `transfer`, I will explain the abilities of each role later in this post. Permissions can only be created or updated by the Safe's multisig process.
- The hot wallet is assigned the roles `swapper` and `transfer`, which allow it to execute the transactions permitted by each one of the roles, without going through the Safe's multisig process.

#### `Swapper` Role

This role allows the hot wallet to swap any token defined in [the config token list](./eth-sdk/config.ts), for any other token on that list. The swaps must happen through Cowswap's contracts. This is a very basic version of a Role, this swapper role could be extended in many useful ways: allowing other dexes, setting limits on how much can be swapped per token, etc

#### `Transfer` Role

This role allows the hot wallet to transfer any token defined in [the config token list](./eth-sdk/config.ts) as well as the native token (xDai). The receipient of these transfers must be an address defined in the comma separated `ALLOWED_TRANSFER_RECIPIENT_ADDRESSES` environment variable. Useful extensions of this role could be using an onchain trusted contacts list, or setting limits on transfer amounts. The Roles mod also comes with built in spending limit tools if you want to set up transfer limits that reset.

#### What you need to do this demo

ALl you need is a Safe deployed on a network where the Roles mod is deployed, and a hot wallet that you trust with the `swapper` and `transfer` roles. I used my Metamask wallet address on my browser for my hot wallet.

### Set up your account

1. Clone this repo to your local machine

   `git clone git@github.com:gnosisguild/role-demo.git && cd ./role-demo`

2. Install dependencies

   `yarn`

3. Customize your permissions

   - Copy the `.env.example` file to a new file `.env` and fill in the values with your info.
   - Modify [the config token list](./eth-sdk/config.ts) to include the tokens you are ok with being used by the `swapper` and `transfer` roles. If you modify the list, make sure to [update the transfer permissions here (line 35-ish)](./src/roles/transfer.ts)

4. Run the transaction generation script
   `yarn eth/sdk && yarn start`

5. Upload the generate json file to the Safe's transaction builder
   <img width="1254" alt="Screenshot 2024-03-08 at 10 59 57 AM" src="https://github.com/gnosisguild/role-demo/assets/6718506/267d27b1-a851-421b-953c-7e06e22722a3">
   Here's what mine looks like uploaded. Depending on how many permissions you've added your transaction batch will have a different number of steps — mine has 21.

6. Execute the transaction with the Safe's multisig process.

### Using your Permissioned Smart Account

Now that you've got your account set up, and a Roles mod deployed with the permissions you want, it's time to start using your hot wallet to swap and transfer some tokens. In order to use the roles given to it, an account must send the transactions to the Roles mod contract its permissions come from. This is the mechanism that allows you to bypass the multisig process.

But what's the Roles mod address? How do I send arbitrary transaction data to a contract? Don't worry about any of that, [meet Zodiac Pilot](https://pilot.gnosisguild.org). Pilot is an extension that will route your transactions through whatever series of mods connect your account with the Safe you want to control. It also helps you build and simulate transaction batches, saving you gas.
