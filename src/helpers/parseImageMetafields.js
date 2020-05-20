import downloadImageNode from './downloadImageNode';

const parseImageMetafields = (node, fields, helpers) =>
  fields
    .map(async metafieldKey => {
      const metafield = node.metafields.find(m => m.key === metafieldKey);
      // this is very basic 'URL validation', something better should be done here
      // this was added because if you passed a non-valid URL to 'downloadImageAndCreateFileNode'
      // it would throw an error and stop the build process
      if (!metafield || !metafield.value.startsWith("http")) return null;

      const fileNodeId = await downloadImageNode({
        id: metafield.id,
        url: metafield.value,
        prefix: helpers.TYPE_PREFIX,
        ...helpers
      });
      if (fileNodeId) {
        node[metafieldKey] = {
          id: metafield.id,
          originalSrc: metafield.value,
          localFile___NODE: fileNodeId
        };
      }

      return null;
    })
    .filter(m => m);

export default parseImageMetafields;
