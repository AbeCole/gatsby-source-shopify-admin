
// internal libs

import { buildQuery } from "../graphQLHelper";

export const queryMetafields = ({ 
    queryRoot, 
    args, 
    query = `
        edges {
            node {
                metafields(first: 50) {
                    edges {
                        node {
                            namespace
                            key
                            value
                            valueType
                            description
                        }
                    }
                }
            }
        }`
}) => buildQuery({
    queryRoot,
    args,
    query 
})