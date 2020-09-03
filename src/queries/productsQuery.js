import fetchShopifyData from "../helpers/fetchShopifyData";
import shopifyQuery from "../helpers/shopifyQuery";

const productsQuery = async (props) => {
  const query = `{
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
          publishedOnCurrentPublication
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
                      id
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
  }`;

  return fetchShopifyData("products", props, query, {
    ProductVariant: "variants",
    ProductImage: "images",
    Metafield: "metafields",
  });
};

export default productsQuery;
