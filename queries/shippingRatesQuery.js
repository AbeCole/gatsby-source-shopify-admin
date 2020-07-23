// todo: try use the same GraphQLClient as above so we dont need axios
// todo: move this to after the other queries then use the id of any product variant we have
const shippingRatesQuery = (
  storeName,
  shippingRatesAddress,
  storefrontApiKey
) =>
  axios
    .post(
      `https://${storeName}.myshopify.com/api/2020-07/graphql`,
      `mutation {
        checkoutCreate(input: {
          lineItems: [{ variantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTQ1MjE3MzAwODkzOA==", quantity: 1 }],
          allowPartialAddresses: true,
          shippingAddress: ${shippingRatesAddress}
        }) {
          checkout {
            availableShippingRates {
              ready
              shippingRates {
                handle
                title
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
          checkoutUserErrors {
            code
            field
            message
          }
        }
      }`,
      {
        headers: {
          "X-Shopify-Storefront-Access-Token": storefrontApiKey,
          "Content-Type": "application/graphql",
          Accept: "application/json",
        },
      }
    )
    .then((resp) => {
      if (resp.data) {
        // todo: maybe add operational chaining here
        if (
          resp.data.data &&
          resp.data.data.checkoutCreate &&
          resp.data.data.checkoutCreate.checkout &&
          resp.data.data.checkoutCreate.checkout.availableShippingRates.ready
        ) {
          return resp.data.data.checkoutCreate.checkout.availableShippingRates
            .shippingRates;
        }
        // todo: better error handling when response doesn't match this structure
        console.log(
          "error in response of checkout for shipping rates",
          resp.data,
          resp.data.data.checkoutCreate.checkoutUserErrors
        );
      }
    })
    .catch((err) => {
      console.error("error requesting checkout for shipping rates", err);
    });

export default shippingRatesQuery;
