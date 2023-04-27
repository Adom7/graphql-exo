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
        editors: editors    
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
        stores: stores
        games: games
    }
    
    type Query {
        readGames: [games]
        readEditors : [editors]
        readStores : [stores]
        readStock : [stock]
    }
    input createEditorsArgs{
        nameEditors: String
    }
    input updateEditorsArgs{
        id: Int
        nameEditors: String
    }

    input deleteGamesArgs{
        id : Int
    }

    type Mutation {
    #SECTION Editors
        createEditors(value: createEditorsArgs): [editors]
        deleteEditor(id: Int): [editors]
        updateEditor(value: updateEditorsArgs): [editors]
    #!SECTION
    #SECTION - Games
        deleteGames (value : deleteGamesArgs) : [games]
    #!SECTION        
    #SECTION - Stores

    #!SECTION
    #SECTION - Stocks
    
    #!SECTION
    }
`)

let root = {
    //SECTION - Mutations Create
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
    //!SECTION



    //SECTION -  Query Read
    readGames: async () => {
        return prisma.games.findMany({
            include: {
                editors: true
            }
        })
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
    deleteEditor: async ({ id }) => {
        const games = await prisma.games.findMany({
            where: {
                idEditors: id,
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
