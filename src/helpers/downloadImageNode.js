import { createRemoteFileNode } from "gatsby-source-filesystem";

const downloadImageNode = async ({
  id,
  url,
  createNode,
  createNodeId,
  touchNode,
  store,
  cache,
  prefix = ""
}) => {
  let fileNodeID;

  const mediaDataCacheKey = `${prefix}__Media__${url}`;
  const cacheMediaData = await cache.get(mediaDataCacheKey);

  if (cacheMediaData) {
    fileNodeID = cacheMediaData.fileNodeID;
    touchNode({ nodeId: fileNodeID });

    return fileNodeID;
  }

  // try {
  const fileNode = await createRemoteFileNode({
    url,
    store,
    cache,
    createNode,
    createNodeId
  });

  if (fileNode) {
    fileNodeID = fileNode.id;
    await cache.set(mediaDataCacheKey, { fileNodeID });

    return fileNodeID;
  }
  // } catch(e) {
  //     console.error('Logging error', e);
  // }

  return undefined;
};

export default downloadImageNode;
