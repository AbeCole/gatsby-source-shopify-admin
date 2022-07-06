const shippingRates = async (data, helpers) => {
  const ShippingRateNode = helpers.createNodeFactory('SHIPPINGRATE')
  const transformData = async (node) => {
    return node
  }

  if (data.length && Array.isArray(data)) {
    data.forEach(async (d) => {
      d.id = d.handle
      const transformedData = transformData(d)
      const node = await ShippingRateNode(transformedData)
      helpers.createNode(node)
    })
  }

  return true
}

export default shippingRates
