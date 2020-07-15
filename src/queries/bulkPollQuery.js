import shopifyQuery from "../helpers/shopifyQuery";

const pollQuery = client => {
  const query = `
    query {
      currentBulkOperation {
        id
        status
        errorCode
        createdAt
        completedAt
        objectCount
        fileSize
        url
        partialDataUrl
      }
    }
  `;

  return shopifyQuery(client, query).then(
    resp => resp.data.currentBulkOperation
  );
};

const bulkPollQuery = ({ client, pollInterval, format, verbose }) =>
  new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      const resp = await pollQuery(client);

      if (verbose) console.log(format(`--- poll query response status: "${resp.status}"`))

      if (resp.status === "COMPLETED") {
        resolve(resp);
        clearInterval(interval);
      } else if (resp.status === "CREATED") {
        // this should be fine, it means the bulk query was probbly created by another source
        // i.e. another build started at similar time
        // only issue would be is if the query running is not the same query we want,
        // but not sure if shopify API allows us to check that
      } else if (resp.status !== "RUNNING") {
        // todo: we may need to handle this if there is an error and use reject()
        console.log("Poll inteval response: ", resp);
        clearInterval(interval);
        reject("Error with poll query")
      }
    }, pollInterval);
  });

export default bulkPollQuery;
