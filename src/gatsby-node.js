/* ========================================================
    sourceNodes
======================================================== */

import { GraphQLClient } from 'graphql-request'
// import { createNodeHelpers } from 'gatsby-node-helpers'
const { createNodeHelpers } = require('gatsby-node-helpers')
import collectionsQuery from './queries/collectionsQuery'
import productsQuery from './queries/productsQuery'
import shippingRatesQuery from './queries/shippingRatesQuery'
import createCollectionNodes from './nodes/collections'
import createProductNodes from './nodes/products'
import createShippingRateNodes from './nodes/shippingRates'

const TYPE_PREFIX = 'shopify'

exports.sourceNodes = async (
  {
    store,
    cache,
    createNodeId,
    createContentDigest,
    actions,
    getNode,
    getCache
  },
  {
    storeName,
    apiKey,
    storefrontApiKey,
    verbose = false,
    onlyPublished = false,
    imageMetafields = null,
    relatedCollectionMetafields = null,
    shippingRatesAddress = null,
    pollInterval = 1000 * 10,
    restrictQueries = false
  }
) => {
  const { createNode, touchNode } = actions

  return new Promise(async (resolve) => {
    const format = (msg) =>
      `-- gatsby-source-shopify-admin/${storeName} -- ${msg}`

    if (verbose)
      console.log(format('starting: shopify queries > node creation'))

    const client = new GraphQLClient(
      `https://${storeName}.myshopify.com/admin/api/2023-07/graphql.json`,
      {
        headers: {
          'X-Shopify-Access-Token': apiKey
        }
      }
    )

    let nodeHelpers = createNodeHelpers({
      typePrefix: TYPE_PREFIX,
      createNodeId,
      createContentDigest
    })
    const createNodeFactory = nodeHelpers.createNodeFactory
    nodeHelpers = {
      createNode,
      createNodeId,
      touchNode,
      TYPE_PREFIX,
      ...nodeHelpers
    }

    const helpers = {
      store,
      cache,
      createNodeFactory,
      createNode,
      createNodeId,
      getCache,
      getNode,
      touchNode,
      TYPE_PREFIX,
      client,
      relatedCollectionMetafields,
      imageMetafields,
      verbose,
      pollInterval,
      format
    }

    if (verbose) {
      console.time(format('finished'))
    }

    if (verbose) {
      console.log(format('- starting collections query'))
      console.time(format('collections query'))
    }

    let collections = await collectionsQuery(helpers, restrictQueries)
    // note: if we can't get any collections we throw an Error to stop other stop happening
    // this may not be the desired behaviour, as you may want to develop without this data?
    // todo: this is normally because another build proces is running an improvement
    // might be to retry again after 60 seconds (could be conifg option)
    // and for maximum of 3 attempts (could be config option)
    if (!collections) throw new Error('There was an issue fetching collections')

    if (onlyPublished)
      collections = collections.filter((p) => p.publishedOnCurrentPublication)

    if (collections.length === 0)
      throw new Error(
        'No collections were returned, check your config ' +
          (onlyPublished && restrictQueries
            ? "(onlyPublished && restrictQueries don't work well together)"
            : '')
      )

    if (verbose) {
      console.timeEnd(format('collections query'))

      console.log(format('- starting products query'))
      console.time(format('products query'))
    }

    let products = await productsQuery(helpers)

    // note: if we can't get any products we throw an Error to stop other stop happening
    // this may not be the desired behaviour, as you may want to develop without this data?
    if (!products) throw new Error('There was an issue fetching products')

    if (restrictQueries) {
      // we retrieve all products then we filter to ones in the single collection retrieved above
      const restrictedProductIds = collections[0].products.map((p) => p.id)
      products = products.filter((p) => restrictedProductIds.includes(p.id))
    }

    if (verbose) console.timeEnd(format('products query'))

    if (shippingRatesAddress && storefrontApiKey) {
      const firstAvailableProduct =
        products && products.length
          ? products.find(
              (p) => p.publishedOnCurrentPublication && p.variants.length
            )
          : null
      if (!firstAvailableProduct) {
        throw new Error(
          'No applicable products available, cannot run shipping rates query'
        )
      }

      if (verbose) {
        console.log(
          format(
            "- starting shipping rates query, using Product Variant ID '" +
              firstAvailableProduct.variants[0].id +
              "'"
          )
        )
        console.time(format('shipping rates query'))
      }

      const shippingRates = await shippingRatesQuery(
        storeName,
        shippingRatesAddress,
        storefrontApiKey,
        firstAvailableProduct.variants[0].id
      )

      if (verbose) {
        console.timeEnd(format('shipping rates query'))

        console.log(format('- creating shipping rates nodes'))
        console.time(format('shipping rates nodes'))
      }

      createShippingRateNodes(shippingRates, helpers)

      if (verbose) console.timeEnd(format('shipping rates nodes'))
    }

    if (products) {
      if (verbose) {
        console.log(format('- creating products nodes'))
        console.time(format('products nodes'))
      }

      await createProductNodes(
        onlyPublished
          ? products.filter((p) => p.publishedOnCurrentPublication)
          : products,
        helpers,
        collections
      )

      if (verbose) console.timeEnd(format('products nodes'))
    }

    if (collections) {
      if (verbose) {
        console.log(format('- creating collections nodes'))
        console.time(format('collections nodes'))
      }

      await createCollectionNodes(collections, helpers)

      if (verbose) console.timeEnd(format('collections nodes'))
    }

    resolve(true)
  })
}

exports.onPostBootstrap = async ({ cache }) => {
  const date = new Date()
  await cache.set(`lastRun`, date.toISOString())
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Gatsby tries to infer all the type definitions
  // However this doesn't work if fields are set for some products
  // i.e. if compareAtPrice is only set on 1 out of 100 products, it is
  // unlikely that Gatsby will pick it up as a field
  let typeDefs = `
    type ShopifyProductVariants implements Node {
      compareAtPrice: String
      storefrontId: String
      image: ShopifyImage
    }
    type ShopifyImage implements Node {
      localFile: File @link(from: "localFile.id")
    }
    type ShopifyProduct implements Node {
      images: [ShopifyImage]
      variants: [ShopifyProductVariants]
      relatedPr: ShopifyCollection
    }
    type ShopifyProductVariantsImage implements Node {
      localFile: File
    }
    type ShopifyCollection implements Node {
      image: ShopifyImage
      products: [ShopifyProduct] @link(by: "id")
    }
    `

  // if (imageMetafields) {
  // typeDefs += `
  //   type ShopifyImage implements Node @infer {
  //     id: String
  //     altText: String
  //     originalSrc: String
  //     localFile: File
  //   }
  // `
  // if (imageMetafields.collection) {
  //   typeDefs += `
  //     type ShopifyCollection implements Node {
  //       ${imageMetafields.collection
  //         .map((m) => `${camelcase(m)}: ShopifyImage`)
  //         .join('\n')}
  //     }
  //   `
  // }
  // }

  // typeDefs += `
  //   type ShopifyProductMetafield implements Node {
  //     key: String
  //     value: String
  //   }
  //   type ShopifyCollectionProducts implements Node {
  //     metafields: [ShopifyProductMetafield]
  //   }
  //   type ShopifyProduct implements Node {
  //     ${
  //       imageMetafields && imageMetafields.product
  //         ? imageMetafields.product
  //             .map((m) => `${camelcase(m)}: ShopifyImage`)
  //             .join('\n')
  //         : ''
  //     }
  //       ${
  //         relatedCollectionMetafields
  //           ? relatedCollectionMetafields
  //               .map((m) => `${camelcase(m)}: ShopifyCollection`)
  //               .join('\n')
  //           : ''
  //       }
  //     handle: String
  //   }
  // `

  createTypes(typeDefs)
}
