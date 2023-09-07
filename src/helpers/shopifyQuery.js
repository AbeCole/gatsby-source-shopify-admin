const shopifyQuery = (client, query) =>
  client.rawRequest(query).catch((error) => {
    // todo: handle error here
    console.log('shopifyQuery Error: ', error, ' - Query: ', query)
  })

export default shopifyQuery
