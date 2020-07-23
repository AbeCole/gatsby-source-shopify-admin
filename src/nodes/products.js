import downloadImageNode from "../helpers/downloadImageNode";
import parseImageMetafields from "../helpers/parseImageMetafields";
import parseRelatedCollectionMetafields from "../helpers/parseRelatedCollectionMetafields";

const products = async (data, helpers, collections) => {
  const ProductNode = helpers.createNodeFactory("PRODUCT", async (node) => {
    if (node.images) {
      await Promise.all(
        node.images.map(async (i) => {
          const file = await downloadImageNode({
            id: i.id,
            url: i.originalSrc,
            prefix: helpers.TYPE_PREFIX,
            ...helpers,
          });
          i.localFile___NODE = file;
        })
      );
    }

    if (node.metafields) {
      if (helpers.imageMetafields && helpers.imageMetafields.product) {
        await Promise.all(
          parseImageMetafields(node, helpers.imageMetafields.product, helpers)
        );
      }

      if (helpers.relatedCollectionMetafields) {
        parseRelatedCollectionMetafields(
          node,
          helpers.relatedCollectionMetafields,
          helpers,
          collections
        );
      }
    }

    // Storefront & Admin APIs return differnet price formats
    // For some reason the Admin API outputs prices as 'cents' (i.e. multipled by 100)
    // so we need to correc this to match what we expect in the Storefront API
    // as that will be more commonly used on the client side
    if (node.priceRange) {
      node.priceRange.minVariantPrice.amount =
        node.priceRange.minVariantPrice.amount / 100;
      node.priceRange.maxVariantPrice.amount =
        node.priceRange.maxVariantPrice.amount / 100;
    }

    return node;
  });

  return Promise.all(
    data.map(async (d) => {
      const node = await ProductNode(d);
      return helpers.createNode(node);
    })
  );
};

export default products;
