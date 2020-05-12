
// external libs

import { createRemoteFileNode } from 'gatsby-source-filesystem'

export const downloadImageAndCreateFileNode = async ({ prefix = "", id, url, createNode, createNodeId, touchNode, store, cache }) => {

    let fileNodeID

    const mediaDataCacheKey = `${prefix}__Media__${url}`
    const cacheMediaData = await cache.get(mediaDataCacheKey)

    if (cacheMediaData) {
        fileNodeID = cacheMediaData.fileNodeID
        touchNode({ nodeId: fileNodeID })

        return fileNodeID
    }

    // try {
    const fileNode = await createRemoteFileNode({ url, store, cache, createNode, createNodeId })

    if (fileNode) {
        fileNodeID = fileNode.id
        await cache.set(mediaDataCacheKey, { fileNodeID })

        return fileNodeID
    }
    // } catch(e) {
    //     console.error('Logging error', e);
    // }

    return undefined
}
