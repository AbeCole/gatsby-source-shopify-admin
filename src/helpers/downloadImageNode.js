import { createRemoteFileNode } from 'gatsby-source-filesystem'

const downloadImageNode = async ({
  id,
  url,
  createNode,
  createNodeId,
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
    fileNodeID = cacheMediaData.fileNodeID
    const node = getNode(fileNodeID)
    touchNode(node)

    return node
  }

  // fileNode = await createRemoteFileNode({
  //   url: node.source_url,
  //   parentNodeId: node.id,
  //   getCache,
  //   createNode,
  //   createNodeId,
  //   auth: _auth,
  // })

  try {
    const fileNode = await createRemoteFileNode({
      url,
      store,
      cache,
      createNode,
      createNodeId,
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
