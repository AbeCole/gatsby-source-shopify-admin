import fetchShopifyData from "../helpers/fetchShopifyData";
import shopifyQuery from "../helpers/shopifyQuery";

const collectionsQuery = async (props, restrictedQuery = false) => {
  const lastRun = await props.cache.get(`lastRun`);
  // todo: we should store the last run date and then only fetch products updated since that date
  // then we can compare the diff i.e. add/remove/update, rather than completely fresh data
  // console.log('Collections fetching', lastRun, lastRun ? `(query: "updated_at:>${lastRun}")` : '')
  const query = `{
    collections(query: "updated_at:>'2020-04-04 00:00:00'"${restrictedQuery ? ", first: 1" : ""}) {
      edges {
        node {
          id
          handle
          title
          description
          descriptionHtml
          publishedOnCurrentPublication
          image {
            id
            altText
            src
          }
          products(first: 100) {
            edges {
              node {
                id
              }
            }
          }
          metafields(first: 100) {
            edges {
              node {
                id
                namespace
                key
                value
                type
                description
              }
            }
          }
        }
      }
    }
  }`;

  if (restrictedQuery) {
    return shopifyQuery(props.client, query).then((resp) =>
      resp.data.collections.edges.map((c) => ({
        ...c.node,
        products: c.node.products
          ? c.node.products.edges.map((v) => v.node)
          : null,
        metafields: c.node.metafields
          ? c.node.metafields.edges.map((v) => v.node)
          : null,
      }))
    );
  }

  return fetchShopifyData("collections", props, query, {
    Product: "products",
    Metafield: "metafields",
  });
};

export default collectionsQuery;
