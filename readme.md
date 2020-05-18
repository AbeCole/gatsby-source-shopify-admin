# Gatsby Source Shopify Admin

This is a Gatsby source plugin to pull data from Shopify using both the Storefront and Admin APIs.

This has been developed while working on a client project so while I've aimed to remain project agnostic there may be code specific to our requirements. This should be improved (or removed) when found.

Credit to https://gitlab.com/heartofcode/gatsby-source-shopify-admin for their original work on combining Storefront and Admin API requests.

# Installation

`yarn add gatsby-source-shopify-admin`

# Config

    {
      resolve: 'gatsby-source-shopify-admin',
      options: {
        storeName: ‘YOUR_STORE_NAME',
        apiKey: ‘YOUR_STOREFRONT_API_KEY',
        adminApiKey: ‘YOUR_ADMIN_API_KEY',
        verbose: true,
      },
    },

## Image metafields

This is kind of experimental (not tested on other Shopify Plugins): If you use a custom fields plugin to store additional data on products, such as [AirFields](https://www.airfields.io/), then we can parse the image URLs to return an `ShopifyImage` object with a `localFile` field, that can then be manipluated by `gatsby-image`. The plugin expects the Shopify metafield `key` to match the provided value (i.e. with the config below the `key` would be `preview`), it then takes the metafield's `value` attribute as the `originalSrc`.

    {
      ...yourDefaultConfigOptions,
      imageMetafields: {
        product: ['preview'],
      },
    }

Usage:

    preview {
      localFile {
        childImageSharp {
          fluid(maxWidth: 1800) {
            ...GatsbyImageSharpFluid_withWebp_noBase64
          }
        }
      }
    }
