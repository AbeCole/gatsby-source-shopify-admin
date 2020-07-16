/* ========================================================
    sourceNodes
======================================================== */

import { GraphQLClient } from "graphql-request";
import axios from "axios";
import chalk from "chalk";
import createNodeHelpers from "gatsby-node-helpers";
import collectionsQuery from "./queries/collectionsQuery";
import productsQuery from "./queries/productsQuery";
import createCollectionNodes from "./nodes/collections";
import createProductNodes from "./nodes/products";
import createShippingRateNodes from "./nodes/shippingRates";

const TYPE_PREFIX = "shopify";

exports.sourceNodes = async (
  {
    // boundActionCreators: { createNode, touchNode },
    store,
    cache,
    createNodeId,
    actions,
  },
  {
    storeName,
    apiKey,
    storefrontApiKey,
    verbose = false,
    onlyPublished = false,
    imageMetafields = null,
    pollInterval = 1000 * 10,
  }
) => {
  const { createNode, touchNode } = actions;

  return new Promise(async (resolve, reject) => {
    const format = (msg) =>
      chalk`{blue gatsby-source-shopify-admin/${storeName}} ${msg}`;

    if (verbose)
      console.log(format("starting: shopify queries > node creation"));

    const client = new GraphQLClient(
      `https://${storeName}.myshopify.com/admin/api/2020-04/graphql.json`,
      {
        headers: {
          "X-Shopify-Access-Token": apiKey,
        },
      }
    );

    let createNodeFactory, generateNodeId;
    let nodeHelpers = ({
      createNodeFactory,
      generateNodeId,
    } = createNodeHelpers({
      typePrefix: TYPE_PREFIX,
    }));
    nodeHelpers = {
      createNode,
      createNodeId,
      touchNode,
      TYPE_PREFIX,
      ...nodeHelpers,
    };
    let imageHelpers = { ...nodeHelpers, store, cache, imageMetafields };

    const helpers = {
      store,
      cache,
      createNodeFactory,
      createNode,
      createNodeId,
      touchNode,
      generateNodeId,
      TYPE_PREFIX,
      client,
      imageMetafields,
      verbose,
      pollInterval,
      format,
    };

    // todo: try use the same GraphQLClient as above so we dont need axios
    // todo: add storefont access token to config
    // todo: add address to the config, this could be the main option to enable feature and allows user to override default address
    // todo: move this to after the other queries then use the id of any product variant we have
    // todo: possibly move this all to a separate helper
    const shippingRates = await axios
      .post(
        `https://${storeName}.myshopify.com/api/2020-07/graphql`,
        `mutation {
          checkoutCreate(input: {
            lineItems: [{ variantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTQ1MjE3MzAwODkzOA==", quantity: 1 }],
            allowPartialAddresses: true,
            shippingAddress: {address1: "1337 Pawnee Street", city: "Jeffersonville", province: "IN", country: "United States"}
          }) {
            checkout {
              availableShippingRates {
                ready
                shippingRates {
                  handle
                  title
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
            checkoutUserErrors {
              code
              field
              message
            }
          }
        }`,
        {
          headers: {
            "X-Shopify-Storefront-Access-Token": storefrontApiKey,
            "Content-Type": "application/graphql",
            Accept: "application/json",
          },
        }
      )
      .then((resp) => {
        if (resp.data) {
          // todo: maybe add operational chaining here
          if (
            resp.data.data &&
            resp.data.data.checkoutCreate &&
            resp.data.data.checkoutCreate.checkout &&
            resp.data.data.checkoutCreate.checkout.availableShippingRates.ready
          ) {
            return resp.data.data.checkoutCreate.checkout.availableShippingRates
              .shippingRates;
          }
          // todo: better error handling when response doesn't match this structure
          console.log(
            "error in response of checkout for shipping rates",
            resp.data,
            resp.data.data.checkoutCreate.checkoutUserErrors
          );
        }
      })
      .catch((err) => {
        console.error("error requesting checkout for shipping rates", err);
      });

    createShippingRateNodes(shippingRates, helpers);

    if (verbose) {
      console.time(format("finished"));
    }

    if (verbose) {
      console.log(format("- starting collections query"));
      console.time(format("collections query"));
    }

    const collections = await collectionsQuery(helpers);

    if (verbose) {
      console.timeEnd(format("collections query"));

      console.log(format("- starting products query"));
      console.time(format("products query"));
    }

    const products = await productsQuery(helpers);

    if (verbose) console.timeEnd(format("products query"));

    if (products) {
      if (verbose) {
        console.log(format("- creating products nodes"));
        console.time(format("products nodes"));
      }

      await createProductNodes(
        onlyPublished
          ? products.filter((p) => p.publishedOnCurrentPublication)
          : products,
        helpers
      );

      if (verbose) console.timeEnd(format("products nodes"));
    }

    if (collections) {
      if (verbose) {
        console.log(format("- creating collections nodes"));
        console.time(format("collections nodes"));
      }

      await createCollectionNodes(collections, helpers);

      if (verbose) console.timeEnd(format("collections nodes"));
    }

    if (verbose) console.time(format("finished type definitions"));

    // Gatsby tries to infer all the type definitions
    // However this doesn't work if fields are set for some products
    // i.e. if compareAtPrice is only set on 1 out of 100 products, it is
    // unlikely that Gatsby will pick it up as a field
    const { createTypes } = actions;
    let typeDefs = `
      type ShopifyProductVariants implements Node {
        compareAtPrice: String
        storefrontId: String
      }
    `;
    if (imageMetafields) {
      typeDefs += `
        type ShopifyImage implements Node @infer {
          id: String
          altText: String
          originalSrc: String
          localFile: File
        }
      `;
      if (imageMetafields.collection) {
        typeDefs += `
          type ShopifyCollection implements Node {
            ${imageMetafields.collection
              .map((m) => `${m}: ShopifyImage`)
              .join("\n")}
          }
        `;
      }
    }
    typeDefs += `
      type ShopifyProductMetafield implements Node {
        key: String
        value: String
      }
      type ShopifyCollectionProducts implements Node {
        metafields: [ShopifyProductMetafield]
      }
      type ShopifyProduct implements Node {
        ${
          imageMetafields.product
            ? imageMetafields.product
                .map((m) => `${m}: ShopifyImage`)
                .join("\n")
            : ""
        }
        handle: String
      }
    `;
    createTypes(typeDefs);

    if (verbose) {
      console.timeEnd(format("finished type definitions"));

      console.timeEnd(format("finished"));
    }

    resolve(true);
  });
};

exports.onPostBootstrap = async ({ cache }) => {
  const date = new Date();
  await cache.set(`lastRun`, date.toISOString());
};
