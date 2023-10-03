import downloadImageNode from '../helpers/downloadImageNode'
import parseImageMetafields from '../helpers/parseImageMetafields'
import parseRelatedCollectionMetafields from '../helpers/parseRelatedCollectionMetafields'

const products = async (data, helpers, collections) => {
  const createProductNode = helpers.createNodeFactory('PRODUCT')

  const createImageNode = helpers.createNodeFactory('IMAGE')
  const createImageNodes = (nodeId, node) => {
    const n = createImageNode(node)
    helpers.createNode({
      ...n,
      id: nodeId
    })
    return nodeId
  }
  const createVariantNode = helpers.createNodeFactory('PRODUCTVARIANT')
  const createVariantNodes = (nodeId, node) => {
    const n = createVariantNode(node)
    helpers.createNode({
      ...n,
      id: nodeId
    })
    return nodeId
  }

  const transformData = async (nodeId, node) => {
    node.collections = collections
      .filter((c) => c.products.find((p) => p.id === node.id))
      .map((c) => ({
        id: c.id,
        handle: c.handle,
        title: c.title
      }))

    if (node.images) {
      await Promise.all(
        node.images.map(async (i) => {
          const imageNodeId = helpers.createNodeId(i.id)
          const imageNode = await downloadImageNode({
            id: i.id,
            parentNodeId: imageNodeId,
            url: i.originalSrc,
            prefix: helpers.TYPE_PREFIX,
            ...helpers
          })
          if (imageNode) {
            i.localFile = {
              id: imageNode.id
            }
          }
          return createImageNodes(imageNodeId, i)
        })
      )
    }

    if (node.variants) {
      await Promise.all(
        node.variants
          .filter((v) => v.image && v.image.originalSrc)
          .map(async (variant) => {
            const variantImageNodeId = helpers.createNodeId(variant.image.id)
            const imageNode = await downloadImageNode({
              id: variant.image.id,
              parentNodeId: variantImageNodeId,
              url: variant.image.originalSrc,
              prefix: helpers.TYPE_PREFIX,
              ...helpers
            })
            variant.image.localFile = {
              id: imageNode.id
            }
            return createImageNodes(variantImageNodeId, variant.image)
            // const variantNodeId = helpers.createNodeId(variant.id)
            // return createVariantNodes(variantNodeId, variant)
          })
      )
    }

    if (node.metafields) {
      if (helpers.imageMetafields && helpers.imageMetafields.product) {
        await Promise.all(
          parseImageMetafields(node, helpers.imageMetafields.product, helpers)
        )
      }

      if (helpers.relatedCollectionMetafields) {
        parseRelatedCollectionMetafields(
          node,
          helpers.relatedCollectionMetafields,
          helpers,
          collections
        )
      }
    }

    // Storefront & Admin APIs return differnet price formats
    // For some reason the Admin API outputs prices as 'cents' (i.e. multipled by 100)
    // so we need to correc this to match what we expect in the Storefront API
    // as that will be more commonly used on the client side
    if (node.priceRange) {
      node.priceRange.minVariantPrice.amount =
        node.priceRange.minVariantPrice.amount / 100
      node.priceRange.maxVariantPrice.amount =
        node.priceRange.maxVariantPrice.amount / 100
    }

    return node
  }

  return Promise.all(
    data.map(async (d) => {
      const id = helpers.createNodeId(`PRODUCT${d.id}`)
      const transformedData = await transformData(id, d)
      const node = await createProductNode(transformedData)

      return helpers.createNode({
        ...node,
        id
      })
    })
  )
}

export default products
