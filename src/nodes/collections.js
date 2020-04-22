
// external libs

import { forEach, map } from 'p-iteration'
import { get } from 'lodash/fp'

// internal libs

import { queryAll, queryOnce } from "../lib";
import { downloadImageAndCreateFileNode } from './file'
import { queryMetafields } from "./metafields";

export const createCollectionNodes = async ({ clients, nodeHelpers, imageHelpers, debugHelpers }) => {

    const CollectionNode = nodeHelpers.createNodeFactory("COLLECTION", async node => {
        if (node.image)
            node.image.localFile___NODE = await downloadImageAndCreateFileNode({
                id: node.image.id,
                url: node.image.src,
                prefix: nodeHelpers.TYPE_PREFIX,
                ...imageHelpers
            })

        return node;
    });

    await forEach(
        await queryAll(clients.storefront, ['shop', 'collections'], queryCollections),
        async collection => {
            const { data } = await queryOnce({
                client: clients.admin,
                query: queryCollectionMetafields,
                args: { first: 1, query: `handle:'${collection.handle}'` },
                attempts: 15
            });
            const collectionData = get(["collections", "edges"], data)[0];

            let metafields = get(["node", "metafields", "edges"], collectionData);
            if (metafields)
                collection.metafields = metafields.map(edge => edge.node);

            if (collection.products)
                collection.products___NODE = collection.products.edges.map(edge =>
                    nodeHelpers.generateNodeId("PRODUCT", edge.node.id),
                )

            const node = await CollectionNode(collection)
            nodeHelpers.createNode(node)
        },
    )
}

const queryCollectionMetafields = queryMetafields({
  queryRoot: "collections",
  args: {
    first: "Int!",
    query: "String"
  },
  // query: `
  //       edges {
  //           node {
  //               metafields(first: 10) {
  //                   edges {
  //                       node {
  //                           namespace
  //                           key
  //                           value
  //                           valueType
  //                           description
  //                       }
  //                   }
  //               }
  //           }
  //       }
  //   `
});

const queryCollections = `
query($first: Int!, $after: String) {
    shop {
        collections(first: $first, after: $after) {
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
                    image {
                        id
                        altText
                        src
                    }
                    products(first: 50) {
                        edges {
                            node {
                                id
                            }
                        }
                    }
                }
            }
        }
    }
}
`;
