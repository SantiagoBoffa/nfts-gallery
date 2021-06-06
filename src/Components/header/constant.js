import { BeaconWallet } from "@taquito/beacon-wallet"
import { TezosToolkit } from "@taquito/taquito"
const Tezos = new TezosToolkit("https://mainnet.smartpy.io")

const wallet = new BeaconWallet({
  name: "Santi",
  preferredNetwork: "mainnet",
})

const CLOUDFLARE = "https://cloudflare-ipfs.com/ipfs/"
const query_creations = `
query creatorGallery($address: String!) {
  hic_et_nunc_token(where: {creator: {address: {_eq: $address}}, supply: {_gt: 0}}, order_by: {id: desc}) {
    id
    artifact_uri
    display_uri
    thumbnail_uri
    timestamp
    mime
    title
    description
    supply
    token_tags {
      tag {
        tag
      }
    }
  }
}
`
export { Tezos, wallet, CLOUDFLARE, query_creations }
