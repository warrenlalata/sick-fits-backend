const Mutations = {
    async createItem(parent, args, ctx, info) {
        // TODO check if there is logged in user

        // db.mutation is a prisma-binding method, see: https://github.com/prisma/prisma-binding
        // createItem() is referred in 'src/generated/prisma.graphql' inside type Mutation {}
        const item = await ctx.db.mutation.createItem({
            data: {
                ...args, // same as title: args.title, description: args.description...
            }
        }, info) // info is passed as second arg to make sure that the actual item created is returned
        
        return item
    }
}

module.exports = Mutations