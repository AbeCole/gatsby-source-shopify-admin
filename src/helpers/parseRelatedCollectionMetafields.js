import camelcase from './camelcase'

const parseRelatedCollectionMetafields = (
  node,
  fieldNames,
  helpers,
  collections
) =>
  fieldNames.forEach((fieldName) => {
    const metafield = node.metafields.find((m) => m.key === fieldName)
    if (!metafield || !metafield.value) return null

    const matchingCollection = collections.find(
      (c) => c.handle === metafield.value
    )
    if (matchingCollection) {
      node[`${camelcase(fieldName)}___NODE`] = helpers.createNodeId(
        `COLLECTION__${matchingCollection.id}`
      )
    }
  })

export default parseRelatedCollectionMetafields
