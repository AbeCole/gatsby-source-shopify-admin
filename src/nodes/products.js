// external libs

import prettyjson from "prettyjson";
import { forEach, map } from "p-iteration";
import { get } from "lodash/fp";

// internal libs

import { queryAll, queryOnce } from "../lib";
import { downloadImageAndCreateFileNode } from "./file";
import { queryMetafields } from "./metafields";

export const createProductNodes = async ({
  clients,
  nodeHelpers,
  imageHelpers,
  debugHelpers,
  imageMetafields
}) => {
  const ProductNode = nodeHelpers.createNodeFactory("PRODUCT", async node => {
    if (node.images && node.images.edges)
        node.images = await map(node.images.edges, async edge => {
            edge.node.localFile___NODE = await downloadImageAndCreateFileNode({
                id: edge.node.id,
                url: edge.node.originalSrc,
                prefix: nodeHelpers.TYPE_PREFIX,
                ...imageHelpers
            });
            return edge.node
        });

    if (node.metafields && imageMetafields) {
        await Promise.all(
            imageMetafields.map(async metafieldKey => {
                const metafield = node.metafields.find(m => m.key === metafieldKey)
                // this is very basic 'URL validation', something better should be done here
                // this was added because if you passed a non-valid URL to 'downloadImageAndCreateFileNode'
                // it would throw an error and stop the build process
                if (!metafield || !metafield.value.startsWith('http')) {
                    node[metafieldKey] = 'test';
                } else {
                    node[metafieldKey] = {
                        id: metafield.value,
                        originalSrc: metafield.value,
                        localFile___NODE: await downloadImageAndCreateFileNode({
                            id: metafield.value,
                            url: metafield.value,
                            prefix: nodeHelpers.TYPE_PREFIX,
                            ...imageHelpers
                        }),
                    };
                }
            })
        );
    }

    return node;
  });

  await forEach(
    await queryAll(clients.storefront, ["shop", "products"], queryProducts),
    async product => {
      const { data } = await queryOnce({
        client: clients.admin,
        query: queryProductMetafields,
        args: { first: 1, query: `handle:'${product.handle}'` },
        attempts: 15
      });
      const productData = get(["products", "edges"], data)[0];

      // set the metafields and variants

      let metafields = get(["node", "metafields", "edges"], productData);
      if (metafields) {
        product.metafields = metafields.map(edge => edge.node);
      }

      let variants = get(["node", "variants", "edges"], productData);
      if (variants) {
        product.variants = variants.map(edge => {
          edge.node.metafields = get(["node", "metafields", "edges"], edge).map(
            edge => edge.node
          );
          return edge.node;
        });
      }

      const node = await ProductNode(product);
      nodeHelpers.createNode(node);
    }
  );
};

const queryProductMetafields = queryMetafields({
  queryRoot: "products",
  args: {
    first: "Int!",
    query: "String"
  },
  query: `
        edges {
            node {
                metafields(first: 30) {
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
                variants(first:10){
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
                            image {
                                src: originalSrc
                            }
                            metafields(first: 30) {
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
    `
});

const queryProducts = `
query($first: Int!, $after: String) {
    shop {
        products(first: $first, after: $after) {
            pageInfo {
                hasNextPage
            }
            edges {
                cursor
                node {
                    id
                    handle
                    title
                    description
                    descriptionHtml
                    tags
                    productType
                    vendor
                    createdAt
                    images(first: 250) {
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
                    variants(first: 250) {
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
                            }
                        }
                    }
                }
            }
        }
    }
}
`;
