import downloadImageNode from "../helpers/downloadImageNode";
import parseImageMetafields from "../helpers/parseImageMetafields";

const collections = async (data, helpers) => {
  const CollectionNode = helpers.createNodeFactory(
    "COLLECTION",
    async (node) => {
      if (node.image)
        node.image.localFile___NODE = await downloadImageNode({
          id: node.image.id,
          url: node.image.src,
          prefix: helpers.TYPE_PREFIX,
          ...helpers,
        });

      if (
        node.metafields &&
        helpers.imageMetafields &&
        helpers.imageMetafields.collection
      ) {
        await Promise.all(
          parseImageMetafields(
            node,
            helpers.imageMetafields.collection,
            helpers
          )
        );
      }

      return node;
    }
  );

  return Promise.all(
    data.map(async (d) => {
      if (d.products) {
        d.products___NODE = d.products.map((p) =>
          helpers.generateNodeId("PRODUCT", p.id)
        );
        d.products = null;
      }

      const node = await CollectionNode(d);
      return helpers.createNode(node);
    })
  );
};

export default collections;
