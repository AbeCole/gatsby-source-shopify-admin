import fetchShopifyData from "../helpers/fetchShopifyData";
import shopifyQuery from "../helpers/shopifyQuery";

const productsQuery = async (props, restrictedQuery = false) => {
  const query = `{
    products${restrictedQuery ? "(first: 1)" : ""} {
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
          images${restrictedQuery ? "(first: 20)" : ""} {
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
          metafields${restrictedQuery ? "(first: 40)" : ""} {
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
          variants${restrictedQuery ? "(first: 30)" : ""} {
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
                metafields${restrictedQuery ? "(first: 20)" : ""} {
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

  if (restrictedQuery) {
    return shopifyQuery(props.client, query).then((resp) =>
      resp.data.products.edges.map((c) => ({
        ...c.node,
        images: c.node.images ? c.node.images.edges.map((v) => v.node) : null,
        metafields: c.node.metafields
          ? c.node.metafields.edges.map((m) => m.node)
          : null,
        variants: c.node.variants
          ? c.node.variants.edges.map((v) => ({
              ...v.node,
              metafields: v.node.metafields
                ? v.node.metafields.edges.map((m) => m.node)
                : null,
            }))
          : null,
      }))
    );
  }

  return fetchShopifyData("products", props, query, {
    ProductVariant: "variants",
    ProductImage: "images",
    Metafield: "metafields",
  });
};

export default productsQuery;
