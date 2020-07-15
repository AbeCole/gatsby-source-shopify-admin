import downloadImageNode from "../helpers/downloadImageNode";
import parseImageMetafields from "../helpers/parseImageMetafields";

const products = async (data, helpers) => {
  const ProductNode = helpers.createNodeFactory("PRODUCT", async node => {
    if (node.images) {
      await Promise.all(
        node.images.map(async i => {
          const file = await downloadImageNode({
            id: i.id,
            url: i.originalSrc,
            prefix: helpers.TYPE_PREFIX,
            ...helpers
          });
          i.localFile___NODE = file;
        })
      );
      // node.images = node.images.map(async i => {
      //   i.localFile___NODE = await downloadImageNode({
      //     id: i.id,
      //     url: i.originalSrc,
      //     prefix: helpers.TYPE_PREFIX,
      //     ...imageHelpers
      //   });
      //   return i;
      // });
    }

    if (
      node.metafields &&
      helpers.imageMetafields &&
      helpers.imageMetafields.product
    ) {
      await Promise.all(
        parseImageMetafields(node, helpers.imageMetafields.product, helpers)
      );
    }

    // Storefront & Admin APIs return differnet price formats
    // For some reason the Admin API outputs prices as 'cents' (i.e. multipled by 100)
    // so we need to correc this to match what we expect in the Storefront API
    // as that will be more commonly used on the client side
    if (node.priceRange) {
      node.priceRange.minVariantPrice.amount = node.priceRange.minVariantPrice.amount / 100;
      node.priceRange.maxVariantPrice.amount = node.priceRange.maxVariantPrice.amount / 100;
    }

    console.log('product', node)

    return node;
  });

  data.forEach(async d => {
    const node = await ProductNode(d);
    helpers.createNode(node);
  });

  return true;
};

export default products;
