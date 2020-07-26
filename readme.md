# Gatsby Source Shopify Admin

This is a Gatsby source plugin to pull data from Shopify using the Admin APIs.

This plugin was recently (Q1 2020) re-written to utilize the [Shopify Bulk API](https://shopify.dev/tutorials/perform-bulk-operations-with-admin-api#operation-restrictions).

It is highly likely to run into bugs or un-handled errors. This plugin was written to fill a void while trying to complete a client's project, since then I've tried to improve it to be project-agnostic and work better for others to use. If you find any error/issue please let me know so we can try to improve this plugin to a point where it can be used by anyone.

# Installation

`yarn add gatsby-source-shopify-admin`

# Config

Configuration is relatively limited at the moment, if you come across a good use case for a new config option (that other people may actually use) please let me know so we can add it. For example, not everyone will need 'metafields' for products, we could add an option that would allow us to ignore metafields when querying Shopify, thus making a slightly lighter (and hopefully quicker) request to Shopify.

    {
      resolve: 'gatsby-source-shopify-admin',
      options: {
        storeName: ‘YOUR_STORE_NAME',
        apiKey: ‘YOUR_ADMIN_API_KEY',
        storefrontApiKey: null,
        onlyPublished: false, // only show products that are currently published on the 'publication' aka the private app
        pollInterval: 1000 * 10,
        imagesMetafields: {
          product: null,
          collection: null
        },
        relatedCollectionMetafields: null,
        verbose: false,
        restrictQueries: false, // restrict collection & products queries to 1 item, if you have issues with development taking ages to start because you have to download alot of images this may help, be warned this may create issues with data parity to Shopify (i.e. relatedCollectionMetafields would not have data if the selected collection isn't the 1 collection already returned)
      },
    },

## Image metafields

Experimental (not tested on other Shopify Plugins): If you use a custom fields plugin to store additional data on products/collections, such as [AirFields](https://www.airfields.io/), then we can parse the image URLs to return a `ShopifyImage` object with a `localFile` field, that can then be manipluated by `gatsby-image`. The plugin expects the Shopify metafield `key` to match the provided value (i.e. with the config below the `key` would be `'preview'`), it then takes the metafield's `value` attribute as the `originalSrc`. The field name will be camelCased when assigned to the object `hover_img` becomes `hoverImg` when in use.

    {
      ...yourDefaultConfigOptions,
      imageMetafields: {
        product: ['preview'],
        collection: ['hover_img'],
      },
    }

Usage:

    shopifyProduct {
      preview {
        localFile {
          childImageSharp {
            fluid(maxWidth: 1800) {
              ...GatsbyImageSharpFluid_withWebp_noBase64
            }
          }
        }
      }
    }

    shopifyCollection {
      hoverImg {
        localFile {
          childImageSharp {
            fluid(maxWidth: 1800) {
              ...GatsbyImageSharpFluid_withWebp_noBase64
            }
          }
        }
      }
    }

## Related collections metafields

Similar to Image metafield, you can pass an array of metafield keys that will be look up against a Product's metafields. If a match is found we will use the return 'collection handle' to connected to the Collection object. This is currently built with Airfield's Relationship field as the standard output.

    {
      ...yourDefaultConfigOptions,
      relatedCollectionMetafields: ['similar', 'might_like'],
    }

Usage:

    shopifyProduct {
      similar {
        title
        handle
        products {
          id
          handle
        }
      }
    }

## Shipping rates

We have added the ability to fetch shipping rates, this works using the Storefront API to create a checkout using the given address and the first product returned from the other queries. It will then fetch shipping rates available to that address

    {
      ...yourDefaultConfigOptions,
      storefrontApiKey: 'XXXXXXXXXXXXXXXXXXXXXXX',
      shippingRatesAddress: {
        address1: '1337 Pawnee Street',
        city: 'Jeffersonville',
        province: 'IN',
        country: 'United States',
      },
    }

# Timeout issues

We've had issues when trying to download any substantial amount of images from Shopify. If you run into connection issues or timeouts there are two things to try:

- By default `gatsby-source-filesystem` will try to download 200 files concurrently, you can change this by adjusting the `GATSBY_CONCURRENT_DOWNLOAD` environment variable:

      GATSBY_CONCURRENT_DOWNLOAD=25 gatsby develop

- There is currently no way to modify the timeout of 30 seconds in `gatsby-source-filesystem`, if you want to test locally you can manually override this by modifying your `./node_modules/gatsby-source-filesystem/create-remote-file-node.js` file:

      //const CONNECTION_TIMEOUT = 30000;
      const CONNECTION_TIMEOUT = 120000;
