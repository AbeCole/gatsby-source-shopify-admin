import fetch from "node-fetch";
import bulkCreationQuery from "../queries/bulkCreationQuery";
import bulkPollQuery from "../queries/bulkPollQuery";
import fetchBulkData from "./fetchBulkData";

const fetchShopifyData = async (objectType, helpers, query, parseAttrs) => {
  const { verbose, format, client } = helpers;

  if (verbose) console.log(format(`-- attempting to start bulk ${objectType} query`));

  const queryStatus = await bulkCreationQuery(client, query);
  const { bulkOperation } = queryStatus;
  if (!bulkOperation || bulkOperation.status !== "CREATED") {
    // todo: better error handling (needs to be based on context)
    // for example below is an error we get when trying to start the app twice at same timeout
    // (i.e. production & Preview both deploying at same time)
    // bulk collections query failed [ { field: null, message: 'A bulk operation for this app and shop is already in progress: gid://shopify/BulkOperation/25094455338.' } ]
    // console.log('outputing more details of queryStatus for debug: ', queryStatus);
    // console.log('outputing more details of bulkOperation for debug: ', bulkOperation);
    if (bulkOperation) console.log('bulkOperation.status:', bulkOperation.status);
    console.error(format(`bulk ${objectType} query failed`), queryStatus.userErrors.map(e => e.message).join('\n'));
    return null;
  }

  if (verbose) console.log(format(`-- bulk ${objectType} query response status "${bulkOperation.status}"`));

  if (verbose) console.log(format(`-- starting ${objectType} poll`));

  const pollStatus = await bulkPollQuery(helpers);

  if (!pollStatus || pollStatus.status !== "COMPLETED") {
    // todo: better error handling (needs to be based on context)
    console.error(`${objectType} poll failed`, pollStatus);
    return null;
  }

  if (verbose) console.log(format(`-- ${objectType} poll response status "${pollStatus.status}"`));

  if (verbose)
    console.log(format(`-- starting to fetch bulk file "${pollStatus.url}"`));

  const data = await fetchBulkData(pollStatus.url, parseAttrs);

  if (verbose)
    console.log(format(`-- finished fetching bulk file`));

  return data;
}

export default fetchShopifyData;
