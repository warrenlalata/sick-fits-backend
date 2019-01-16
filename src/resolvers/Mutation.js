const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
    },

    updateItem(parent, args, ctx, info) {
        // copy the args
        const updates = { ...args }
        // remove the ID because we do not want to update the 
        // id of the item!
        delete updates.id
        // run the update method
        return ctx.db.mutation.updateItem({
            data: updates,
            where: {
                id: args.id
            },
        }, info)
    },

    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.id }
        // find the item
        const item = await ctx.db.query.item({ where }, `{ id title }`) // manually request `{id title}`
        // check if they own the item or has permission
        // delete it
        return ctx.db.mutation.deleteItem({ where }, info)
    },

    async signup(parent, args, ctx, info) {
        // lowercase their email
        args.email = args.email.toLowerCase()
        // hash password
        const password = await bcrypt.hash(args.password, 10)
        
        const user = await ctx.db.mutation.createUser({
            data: { 
                ...args,
                password,
                permissions: { set: ['USER'] } // user set because Permission is enum type!
            }
        }, info)

        // create a JWT 
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
        // set cookie on response
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
        })
        // finally, return newly created user
        return user

    }
}   

module.exports = Mutations