
/* ========================================================
    sourceNodes
======================================================== */

import { createCollectionNodes, createProductNodes, createPolicyNodes } from './nodes';
import { GraphQLClient } from 'graphql-request'
import chalk from 'chalk'
import createNodeHelpers from 'gatsby-node-helpers'

const TYPE_PREFIX = "shopify"

exports.sourceNodes = async (
    { boundActionCreators: { createNode, touchNode }, store, cache, createNodeId, actions },
    { storeName, apiKey, adminApiKey, verbose = false, imageMetafields = null }) => {

        // Gatsby tries to infer all the type definitions
        // However this doesn't work if fields are set for some products
        // i.e. if compareAtPrice is only set on 1 out of 100 products, it is
        // unlikely that Gatsby will pick it up as a field
        const { createTypes } = actions
        let typeDefs = `
          type ShopifyImage implements Node @infer {
            id: String
            altText: String
            originalSrc: String
            localFile: File
          }
          type ShopifyProductVariants implements Node {
            compareAtPrice: String
          }
        `
        if (imageMetafields.product) {
          typeDefs += `type ShopifyProduct implements Node {
            ${imageMetafields.product.map(m => `${m}: ShopifyImage`).join('\n')}
          }`
        }
        createTypes(typeDefs)

        const format = msg => chalk`{blue gatsby-source-shopify-admin/${storeName}} ${msg}`

        if (verbose) console.log(format("starting data fetch"));

        const storefront = new GraphQLClient(`https://${storeName}.myshopify.com/api/graphql`, {
            headers: {
                'X-Shopify-Storefront-Access-Token': apiKey
            }
        });

        const admin = new GraphQLClient(`https://${storeName}.myshopify.com/admin/api/graphql.json`, {
            headers: {
                'X-Shopify-Access-Token': adminApiKey
            }
        });

        let createNodeFactory, generateNodeId
        let nodeHelpers = { createNodeFactory, generateNodeId } = createNodeHelpers({ typePrefix: TYPE_PREFIX })

        let clients = {admin, storefront};
        nodeHelpers = {
            createNode,
            createNodeId,
            touchNode,
            TYPE_PREFIX,
            ...nodeHelpers
        };
        let imageHelpers = {...nodeHelpers, store, cache};
        let debugHelpers = {format, verbose}

        let timerLabel = format("finished data fetch")
        if (verbose) console.time(timerLabel)

        await Promise.all([
            createProductNodes({ clients, nodeHelpers, imageHelpers, debugHelpers, imageMetafields: imageMetafields.product }),
            createCollectionNodes({ clients, nodeHelpers, imageHelpers, debugHelpers, imageMetafields: imageMetafields.collection }),
            //createPolicyNodes({ storefrontClient })
        ])

        if (verbose) console.timeEnd(timerLabel)
    }
