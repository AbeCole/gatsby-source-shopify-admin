import fetchShopifyData from "../helpers/fetchShopifyData";

const collectionsQuery = async props => {
  const lastRun = await props.cache.get(`lastRun`);
  console.log('collections fetching', lastRun, Date.parse(lastRun), lastRun ? `(query: "updated_at:>${lastRun}")` : '')

  return fetchShopifyData(
    "collections",
    props,
    `{
      collections${lastRun && Date.parse(lastRun) ? `(query: "updated_at:>${lastRun}")` : ''} {
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
