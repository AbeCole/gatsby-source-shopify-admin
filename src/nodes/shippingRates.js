const shippingRates = async (data, helpers) => {
  const ShippingRateNode = helpers.createNodeFactory("SHIPPINGRATE", async node => {
    return node;
  });

  if (data.length && Array.isArray(data)) {
    data.forEach(async d => {
      d.id = d.handle;
      const node = await ShippingRateNode(d);
      helpers.createNode(node);
    });
  }

  return true;
};

export default shippingRates;
