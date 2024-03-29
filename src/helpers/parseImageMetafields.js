import camelcase from './camelcase'
import downloadImageNode from './downloadImageNode'

const parseImageMetafields = (node, fields, helpers) =>
  fields
    .map(async (metafieldKey) => {
      const metafield = node.metafields.find((m) => m.key === metafieldKey)
      // this is very basic 'URL validation', something better should be done here
      // this was added because if you passed a non-valid URL to 'downloadImageAndCreateFileNode'
      // it would throw an error and stop the build process
      if (!metafield || !metafield.value.startsWith('http')) return null

      const fileNode = await downloadImageNode({
        id: metafield.id,
        url: metafield.value,
        prefix: helpers.TYPE_PREFIX,
        ...helpers
      })
      if (fileNode) {
        node[camelcase(metafieldKey)] = {
          id: metafield.id,
          originalSrc: metafield.value,
          localFile: {
            id: fileNode.id
          }
        }
      }

      return null
    })
    .filter((m) => m)

export default parseImageMetafields
