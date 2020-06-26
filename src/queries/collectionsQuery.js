import fetchShopifyData from "../helpers/fetchShopifyData";

const collectionsQuery = async props => {
  const lastRun = await props.cache.get(`lastRun`);
  // console.log('collections fetching', lastRun, Date.parse(lastRun), lastRun ? `(query: "updated_at:>${lastRun}")` : '')

  return fetchShopifyData(
    "collections",
    props,
    `{
      collections(query: "updated_at:>'2020-04-04 00:00:00'") {
        edges {
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
            products {
              edges {
                node {
                  id
                }
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
          }
        }
      }
    }`,
    {
      Product: "products",
      Metafield: "metafields"
    }
  );
};

export default collectionsQuery;
