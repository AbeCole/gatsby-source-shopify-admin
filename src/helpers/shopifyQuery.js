const shopifyQuery = (client, query) =>
  client.rawRequest(query).catch(error => {
    // todo: handle error here
    console.log("shopifyQuery error: ", error);
  });

export default shopifyQuery;
