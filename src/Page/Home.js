import React, { useState, useEffect } from "react"
import { Grid, Box, Image, AspectRatio } from "@chakra-ui/react"
import { Header } from "../Components/header"

const CLOUDFLARE = "https://cloudflare-ipfs.com/ipfs/"
const IPFS = "https://ipfs.io/ipfs/"
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

const Home = () => {
  const [img, setImg] = useState([])

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

    console.log(data)

    const formatData = data.hic_et_nunc_token.map((e) => {
      let url = ""
      let component = <div></div>
      url = e.artifact_uri
      var i = url.lastIndexOf("/")
      if (e.mime === "image/gif" || e.mime === "image/jpeg") {
        component = (
          <Image
            boxSize="460px"
            objectFit="cover"
            src={CLOUDFLARE + url.substring(i + 1, url.length)}
            alt={e.description}
          />
        )
      } else if (e.mime === "video/mp4") {
        component = (
          <AspectRatio maxW="460px" ratio={1}>
            <iframe
              title={e.description}
              src={IPFS + url.substring(i + 1, url.length)}
              allowFullScreen
            />
          </AspectRatio>
        )
      } else {
        console.log(e)
      }
      return { component, description: e.description }
    })
    setImg(formatData)
  }

  useEffect(() => {
    fetchCreations()
  }, [])

  return (
    <div>
      <Header setImg={setImg} />
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {img.length > 0 &&
          img.map((e) => (
            <Box w="100%" h="100%">
              {e.component}
            </Box>
          ))}
      </Grid>
    </div>
  )
}

export default Home
