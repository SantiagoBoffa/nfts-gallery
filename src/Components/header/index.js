/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { TezosToolkit } from "@taquito/taquito"

const axios = require("axios")

const Tezos = new TezosToolkit("https://mainnet.smartpy.io")

const wallet = new BeaconWallet({
  name: "Santi",
  preferredNetwork: "mainnet",
})

export const Header = ({ setImg }) => {
  const [walletInfo, setwalletInfo] = useState({})
  const [user, setuser] = useState({})

  const conect = async () => {
    const network = {
      type: "mainnet",
      rpcUrl: "https://mainnet.smartpy.io",
    }
    const activeAccount = await wallet.client.getActiveAccount()

    if (activeAccount === undefined) {
      console.log("permissions")
      await wallet.requestPermissions({ network })
    }

    setwalletInfo({
      Tezos: Tezos,
      address: await wallet.getPKH(),
      acc: await wallet.client.getActiveAccount(),
      wallet,
    })
  }

  const disconnect = async () => {
    console.log("disconnect wallet")
    await wallet.client.clearActiveAccount()
    setwalletInfo({
      address: undefined,
      acc: undefined,
    })
  }

  const getBalance = () => {
    axios
      .get(
        `https://api.tzkt.io/v1/accounts/${walletInfo.address}/balance_history`,
        {
          params: {
            address: walletInfo.address,
          },
        }
      )
      .then((res) => {
        console.log(
          "balance",
          parseFloat(res.data[res.data.length - 1].balance / 1000000)
        )
        setuser((prev) => {
          return {
            prev,
            balance: parseFloat(
              res.data[res.data.length - 1].balance / 1000000
            ),
          }
        })
      })
      .catch((e) => console.log("balance error", e))
  }

  return (
    <>
      <header>
        <button onClick={conect}>
          <p>Conect</p>
        </button>
        <button onClick={disconnect}>
          <p>Disconect</p>
        </button>
        <button onClick={getBalance}>
          <p>Get Balance</p>
        </button>
      </header>
    </>
  )
}
