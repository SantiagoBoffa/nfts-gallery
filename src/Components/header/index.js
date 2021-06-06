/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react"
import { Tezos, wallet, CLOUDFLARE, query_creations } from "./constant"

const axios = require("axios")

export const Header = ({ setImg }) => {
  const [walletInfo, setwalletInfo] = useState({})
  const [user, setuser] = useState({})

  const fetchCreationsGraphQL = async (
    operationsDoc,
    operationName,
    variables
  ) => {
    const result = await fetch("https://api.hicdex.com/v1/graphql", {
      method: "POST",
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName,
      }),
    })
    return await result.json()
  }

  const fetchCreations = async () => {
    const { errors, data } = await fetchCreationsGraphQL(
      query_creations,
      "creatorGallery",
      { address: "tz1ZqRFCTgEt2n1bYPJfKwSiRGD6a1AEDQMs" }
    )
    if (errors) {
      console.error(errors)
    }
    const result = data.hic_et_nunc_token
    let url = data.hic_et_nunc_token[0].artifact_uri
    var i = url.lastIndexOf("/")
    url = CLOUDFLARE + url.substring(i + 1, url.length)
    const formatData = data.hic_et_nunc_token.map((e) => {
      return { url, description: e.description }
    })
    setImg(formatData)
    return result
  }

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
        <button onClick={fetchCreations}>
          <p>Get info User</p>
        </button>
        <button onClick={getBalance}>
          <p>Get Balance</p>
        </button>
      </header>
    </>
  )
}
