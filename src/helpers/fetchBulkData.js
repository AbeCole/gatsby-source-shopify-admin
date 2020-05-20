const parseShopifyType = id => id.split("/")[3];

const parseBulkData = (data, childAttributes = {}) => {
  const ret = [];
  data
    .split("\n")
    .filter(l => l)
    .forEach(l => {
      const obj = JSON.parse(l);
      if (!obj.__parentId) {
        const children = {};
        Object.values(childAttributes).forEach(k => (children[k] = []));
        ret.push({
          ...obj,
          ...children
        });
        return;
      }

      const parent = ret.find(o => o.id === obj.__parentId);
      if (parent) {
        const type = parseShopifyType(obj.id);
        if (childAttributes[type]) {
          parent[childAttributes[type]].push(obj);
          return;
        }

        // todo: probably needs error handling here, we only get here if a
        // matching parent is found, but the Shopify object type isn't matched
        // essentially at the moment this node is ignored without any notification
        console.error(
          `Matched a parent but no matching childAttributes assignment for type ${type}, consider adding this to the childAttributes mapping`
        );
        return;
      }

      console.error(
        "Parent/child match not found in parseBulkData, we should be handling this error better, id, __parentId",
        id,
        __parentId
      );
    });

  return ret;
};

// childAttributes should be passed in as an object with key/value pairs, where
// the key represents the matching Shopify object type, and the value represents
// the GraphQL attribute
//
// For example 'collections' have a 'products' attribute. Fetching these over
// the bulk API will separate them out, so we need to stich back together.
// The products have an ID similar to 'gid:\/\/shopify\/Product\/XXXXX', so
// the Shopify object type is 'Product'. We want those products to be
// returned when we querying 'products' on the 'collections'. Therefore we would
// use 'fetchBulkData("http://...", { 'Product': 'products' })'

const fetchBulkData = async (url, childAttributes) => {
  const bulkData = await fetch(url).then(r => r.text());

  return parseBulkData(bulkData, childAttributes);
};

export default fetchBulkData;
