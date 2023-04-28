import express from "express"
import { graphqlHTTP } from "express-graphql"
import { buildSchema } from "graphql"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

let schema = buildSchema(`
    type editors {
        idEditors: ID!
        nameEditors: String!
        games: [games]
    }
    
    type games {
        idGames: ID!
        nameGames: String!
        idEditors: Int
        editors: [editors]    
        stock: [stock]
    }
    type stores {
        idStores: ID!
        nameStores: String!
        stock: [stock]
    }
    
    type stock {
        idStock : ID!
        idGames: Int
        idStores: Int
        units: Int
        prices: Float
        stores: [stores]
        games: [games]
    }
    
    type Query {
        readGames: [games]
        readEditors : [editors]
        readStores : [stores]
        readStock : [stock]
    }
#SECTION - GamesArgs
    input createGamesArgs {
        nameGames : String
    }

    input updateGamesArgs {
        id : Int

    }

    input deleteGamesArgs{
        id : Int
    }
#!SECTION

#SECTION - EditorsArgs
    input createEditorsArgs{
        nameEditors: String
    }

    input updateEditorsArgs{
        id: Int
        nameEditors: String
    }

    input deleteEditorsArgs{
        id : Int
    }
#!SECTION

#SECTION - StoresArgs
    input createStoresArgs{
        nameStores: String
    }

    input updateStoresArgs{
        id: Int
    }

    input deleteStoresArgs{
        id : Int
    }
#!SECTION

#SECTION - StockArgs
    input createStockArgs{
        idStock: String
    }
    
    input updateStockArgs{
        id: Int
    }

    input deleteStockArgs{
        id : Int
    }
#!SECTION

    type Mutation {
        createGames (value : createGamesArgs) : [games]
        updateGames (value : updateGamesArgs) : [games]
        deleteGames (value : deleteGamesArgs) : [games]

        createEditors(value: createEditorsArgs): [editors]
        updateEditor (value: updateEditorsArgs): [editors]
        deleteEditor (value: deleteEditorsArgs): [editors]

        createStores (value: createStoresArgs): [stores]
        updateStores (value: updateStoresArgs): [stores]
        deleteStores (value: deleteStoresArgs): [stores]

        createStock (value: createStockArgs): [stock]
        updateStock (value: updateStockArgs): [stock]
        deleteStock (value: deleteStockArgs): [stock]
    }
`)

let root = {
    //SECTION - Mutations Create
    createGames: async ({ value }) => {
        await prisma.games.create({
            data: value
        })
        return await prisma.games.findMany({
            include: {
                editors: true,
                stock: true
            }
        })
    },
    createEditors: async ({ value }) => {
        await prisma.editors.create({
            data: value
        })
        return await prisma.editors.findMany({
            include: {
                games: true
            }
        })
    },
    createStores: async ({ value }) => {
        await prisma.stores.create({
            data: value
        })
        return await prisma.stores.findMany({
            include: {
                stock: true
            }
        })
    },
    createStock: async ({ value }) => {
        await prisma.stock.create({
            data: value
        })
        return await prisma.stock.findMany({
            include: {
                stores: true,
                games: true
            }
        })
    },

    //!SECTION



    //SECTION -  Query Read
    readGames: async () => {
        const games = await prisma.games.findMany({
            include: {
                editors: true
            }

        })
        console.log(games);
        return games
    },
    readEditors: async () => {
        return await prisma.editors.findMany({
            include: {
                games: true
            }
        })
    },
    readStores: async () => {
        return await prisma.stores.findMany({
        })
    },
    readStock: async () => {
        return await prisma.stock.findMany({
            // include: {
            //     stores: true
            // }
        })
    },
    //!SECTION

    //SECTION - Mutations Update 
    updateEditor: async ({ value }) => {
        console.log(value.id, value.nameEditors)
        const editor = await prisma.editors.update({
            where: {
                idEditors: value.id,
            },
            data: {
                nameEditors: value.nameEditors,
            },
        })
        return prisma.editors.findMany()
    },
    //!SECTION

    //SECTION - Mutation Delete
    deleteEditor: async ({ value }) => {
        const games = await prisma.games.findMany({
            where: {
                idEditors: value.id,
            },
        })
        games.forEach(async (game) => {
            await prisma.stock.deleteMany({
                where: {
                    idGames: game.id,
                },
            })
        })
        const deleteGames = await prisma.games.deleteMany({
            where: {
                idEditors: id,
            },
        })

        const editorsDelete = await prisma.editors.deleteMany({
            where: {
                idEditors: id,
            },
        });
        const editors = await prisma.editors.findMany({})
        return editors;
    }
    //!SECTION
}

app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

const API_PORT = 4000

app.listen(API_PORT, () => {
    console.log(`Listenning ${API_PORT}`)
})
