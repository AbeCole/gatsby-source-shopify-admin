import shopifyQuery from "../helpers/shopifyQuery";

const bulkCreationQuery = (client, query) => {
  const creationQuery = `
    mutation {
      bulkOperationRunQuery(
       query: """
        ${query}
        """
      ) {
        bulkOperation {
          id
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  return shopifyQuery(client, creationQuery).then(
    resp => resp.data.bulkOperationRunQuery
  );
};

export default bulkCreationQuery;
