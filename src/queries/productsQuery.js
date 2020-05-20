import fetchShopifyData from "../helpers/fetchShopifyData";

const productsQuery = props =>
  fetchShopifyData(
    "products",
    props,
    `{
      products {
        edges {
          node {
            id
            storefrontId
            handle
            title
            description
            descriptionHtml
            tags
            productType
            vendor
            createdAt
            images {
              edges {
                node {
                  id
                  altText
                  originalSrc
                }
              }
            }
            options {
              id
              name
              values
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            metafields {
              edges {
                node {
                  id
                  namespace
                  key
                  value
                  valueType
                  description
                }
              }
            }
            variants {
              edges {
                node {
                  id
                  title
                  sku
                  price
                  compareAtPrice
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                  weight
                  weightUnit
                  image {
                    altText
                    id
                    originalSrc
                  }
                  metafields {
                    edges {
                      node {
                        namespace
                        key
                        value
                        valueType
                        description
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`,
    {
      ProductVariant: 'variants',
      ProductImage: 'images',
      Metafield: 'metafields'
    }
  );

export default productsQuery;
