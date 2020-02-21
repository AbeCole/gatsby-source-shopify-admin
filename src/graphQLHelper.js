
export const buildArgDefinitions = (args) => (
    Object.keys(args).map(arg => {
        return `$${arg}: ${args[arg]}`
    }).join(',')
)

export const buildArgs = (args) => (
    Object.keys(args).map(arg => {
        return `${arg}: $${arg}`
    }).join(',')
)

export const buildQuery = ({ queryRoot, args, query }) => (`
query(${buildArgDefinitions(args)}) {
    ${queryRoot}(${buildArgs(args)}) {
        ${query}
    }
}`)