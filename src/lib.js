import prettyjson from "prettyjson";
import rateLimiter from "./limiter";

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

const limiter = rateLimiter();

export const queryOnce = async allArgs =>
  new Promise((resolve, reject) => limiter(allArgs, { resolve, reject }));
