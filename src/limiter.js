// Author: Abe Cole (me@abecole.com)
//
// Improvements:
//  - We currently implement a 'queue' mechanism, so the next request is not made until
//    the current request finishes. This may not be optimal as it unneccesarily blocks
//    lower cost requests that could be processed in parellel. For example if we have 3
//    queued requests costing 800, 200 & 50, with a bucket limit of 1000 currently at 700
//    (refresh of 50/sec), after 2 seconds the 800 request can start processing, if that
//    request takes 4 seconds to process there is actually another 200 units available,
//    however the 200 cost request in the queue is not sent until the 800 cost request
//    finishes.
//
//    To improve this we could look at calculating and estimating when a request might be
//    successful and send it for processing regardless of whether the current request has
//    finished. This is likely to get more 'wasted' requests but would be overall quicker.
//
//  - The cost calculations are currently using attributes specific to our test environment
//    (currently Shopify), it should be made more ambigious for public use. I.e. cost.expense,
//    cost.refreshRate, cost.available

const queue = [];
let available = 1000;
let queueTimer = null;

const request = (allArgs, promise, calledByTimeout = false) => {
  const { client, query, args = { first: 250 } } = allArgs;
  const { resolve, reject } = promise;
  return client
    .rawRequest(query, args)
    .then(response => {
      resolve(response);

      if (response.extensions)
        available = response.extensions.cost.throttleStatus.currentlyAvailable;

      if (calledByTimeout) queueTimer = null;

      processQueue();
    })
    .catch(async error => {
      if (!error.response) {
        console.error('This is a big issue as we currently always expect a "response" attribute on the error');
        console.log('The error:', error);
        return reject('This is a big issue as we currently always expect a "response" attribute on the error');
      }

      let { errors, extensions } = error.response;

      if (calledByTimeout) queueTimer = null;

      if (errors && extensions && errors[0].message === "Throttled") {
        queue.push({
          args: allArgs,
          promise
        });
        createQueueTimeout(extensions.cost);
      } else {
        reject(error);
      }
    });
};

const processQueue = (calledByTimeout = false) => {
  if (queue.length === 0) return null;

  const current = queue.shift();
  request(current.args, current.promise, calledByTimeout);
};

const createQueueTimeout = cost => {
  available = cost.throttleStatus.currentlyAvailable;

  if (queueTimer) return "Waiting to process next item in queue";

  if (queue.length === 0) return "No items in queue";

  queueTimer = setTimeout(() => {
    processQueue(true);
  }, Math.max((cost.requestedQueryCost - available) / cost.throttleStatus.restoreRate) * 1000);

  return "Item queued";
};

const limiter = () => {

  return (args, promise) => {
    if (queue.length === 0) return request(args, promise);

    queue.push({
      args,
      promise
    });
    // return createQueueTimeout();
  };
};

export default limiter;
