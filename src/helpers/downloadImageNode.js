import { createRemoteFileNode } from 'gatsby-source-filesystem'

const downloadImageNode = async ({
  url,
  createNode,
  createNodeId,
  parentNodeId,
  getCache,
  getNode,
  touchNode,
  store,
  cache,
  prefix = ''
}) => {
  let fileNodeID

  const mediaDataCacheKey = `${prefix}__Media__${url}`
  const cacheMediaData = await cache.get(mediaDataCacheKey)
  
  if (cacheMediaData) {
    fileNodeID = cacheMediaData.file
    NodeID
    const node = getNode(fileNodeID)
    if (node) {
      node.children = []
      touchNode(node)

      return node
    }
  }

  try {
    const fileNode = await createRemoteFileNode({
      url,
      store,
      cache,
      createNode,
      createNodeId,
      parentNodeId,
      getCache
    })

    if (fileNode) {
      fileNodeID = fileNode.id
      await cache.set(mediaDataCacheKey, { fileNodeID })
      return fileNode
    }
  } catch (e) {
    console.error('downloadImageNode error', e)
  }

  return undefined
}

export default downloadImageNode
