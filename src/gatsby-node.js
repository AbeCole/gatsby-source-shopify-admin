
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

        const { createTypes } = actions
        const typeDefs = `
          type ShopifyImage implements Node @infer {
            id: String
            altText: String
            originalSrc: String
            localFile: File
          }
          type ShopifyProduct implements Node @infer {
            preview: ShopifyImage
            preview_h: ShopifyImage
          }
        `
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
