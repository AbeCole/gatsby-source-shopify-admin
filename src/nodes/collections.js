import downloadImageNode from '../helpers/downloadImageNode'
import parseImageMetafields from '../helpers/parseImageMetafields'

const collections = async (data, helpers) => {
  const CollectionNode = helpers.createNodeFactory('COLLECTION')
  const transformData = async (nodeId, node) => {
    if (node.image) {
      const imageNode = await downloadImageNode({
        id: node.image.id,
        url: node.image.src,
        parentNodeId: nodeId,
        prefix: helpers.TYPE_PREFIX,
        ...helpers
      })
      node.image.localFile = {
        id: imageNode.id
      }
    }

    if (
      node.metafields &&
      helpers.imageMetafields &&
      helpers.imageMetafields.collection
    ) {
      await Promise.all(
        parseImageMetafields(node, helpers.imageMetafields.collection, helpers)
      )
    }

    return node
  }

  return Promise.all(
    data.map(async (d) => {
      if (d.products) {
        d.products = d.products.map((p) =>
          helpers.createNodeId(`PRODUCT${p.id}`)
        )
      }

      const id = helpers.createNodeId(`COLLECTION${d.id}`)
      const transformedData = await transformData(id, d)
      const node = await CollectionNode(transformedData)
      return helpers.createNode({
        ...node,
        id
      })
    })
  )
}

export default collections
