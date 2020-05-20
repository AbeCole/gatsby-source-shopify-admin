import downloadImageNode from "../helpers/downloadImageNode";
import parseImageMetafields from "../helpers/parseImageMetafields";

const collections = async (data, helpers) => {
  const CollectionNode = helpers.createNodeFactory(
    "COLLECTION",
    async node => {
      if (node.image)
        node.image.localFile___NODE = await downloadImageNode({
          id: node.image.id,
          url: node.image.src,
          prefix: helpers.TYPE_PREFIX,
          ...helpers
        });

      if (
        node.metafields &&
        helpers.imageMetafields &&
        helpers.imageMetafields.product
      ) {
        await Promise.all(
          parseImageMetafields(node, helpers.imageMetafields.product, helpers)
        );
      }

      return node;
    }
  );

  data.forEach(async d => {
    if (d.products) {
      d.products___NODE = d.products.map(p =>
        helpers.generateNodeId("PRODUCT", p.id)
      );
      d.products = null;
    }

    const node = await CollectionNode(d);
    helpers.createNode(node);
  });

  return true;
};

export default collections;
