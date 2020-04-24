import prettyjson from "prettyjson";
import rateLimiter from "./limiter";
import { get, last } from "lodash/fp";

/**
 * Print an error from a GraphQL client
 * @author Angelo Ashmore
 */

export const printGraphQLError = e => {
  const prettyjsonOptions = { keysColor: "red", dashColor: "red" };

  if (e.response && e.response.errors)
    console.error(prettyjson.render(e.response.errors, prettyjsonOptions));

  if (e.request) console.error(prettyjson.render(e.request, prettyjsonOptions));
};

// /**
//  * Request a query from a client.
//  * @author Angelo Ashmore
//  */
//
// function sleep (time) {
//     return new Promise((resolve) => setTimeout(resolve, time));
// }

const limiter = rateLimiter();

export const queryOnce = async allArgs =>
  new Promise((resolve, reject) => limiter(allArgs, { resolve, reject }));

// export const queryOnce = async ({ client, query, args = {first: 250}, attempts = 2 }) => {
//     requestCount += 1;
//     console.log("Query Once, attempts " + attempts, requestCount, resolveCount);
//     return new Promise((resolve, reject) => {
//         client.rawRequest(query, args)
//             .then(response => {
//                 resolveCount += 1;
//                 console.log("resolved", requestCount, resolveCount);
//                 resolve(response)
//             })
//             .catch( async (error) => {
//                 let { errors, extensions } = error.response
//
//                 if (errors && extensions) {
//
//                     // The mechanism below is a very basic attempt to avoid the Shopify rate limits
//                     // it doesn't work probably because if you have a large number of requests they
//                     // all get hit and slept at the same time. Meaning the next time they are tried
//                     // one or two will be successful but the rest will still fail.
//                     //
//                     // An improvement would be to use a 'queuing' mechanism, where when one requested
//                     // has been 'throttled' it is then added to a queue, and further requests are also
//                     // added into that queue and only process after the relevant amount of time has been
//                     // waited so the 'rate limit bucket' can refill
//
//                     let queryCost = extensions.cost.requestedQueryCost
//                     let { currentlyAvailable: available, restoreRate } = extensions.cost.throttleStatus
//
//                     // second argument of '5' seems obsolete, possibly a left over from a copy&paste
//                     await sleep(Math.max((queryCost - available)/restoreRate) * 1000, 5)
//
//                     if (attempts === 1) return reject(error) // base case
//                     queryOnce({ client, query, args, attempts: attempts - 1 })
//                         .then(response => {
//                           resolve(response)
//                           console.log("resolved inside", requestCount, resolveCount);
//                         })
//                         .catch(reject)
//
//                 } else {
//                     reject(error)
//                 }
//             })
//     })
// }

/**
 * Get all paginated data from a query. Will execute multiple requests as
 * needed.
 * @author Angelo Ashmore
 */

export const queryAll = async (
  client,
  path,
  query,
  args = { first: 250 },
  aggregatedResponse
) => {
  const { data, errors, extensions, headers, status } = await queryOnce({
    client,
    query,
    args
  });

  const edges = get([...path, "edges"], data);
  const nodes = edges.map(edge => edge.node);

  aggregatedResponse
    ? (aggregatedResponse = aggregatedResponse.concat(nodes))
    : (aggregatedResponse = nodes);

  // if (get([...path, "pageInfo", "hasNextPage"], false, data)) {
  //   args.after = last(edges).cursor;
  //   return queryAll(client, path, query, args, aggregatedResponse);
  // }

  return aggregatedResponse;
};
