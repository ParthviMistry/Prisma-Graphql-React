import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// getAllUsers(skip: Int, take: Int): [Users]

const schema = buildSchema(`
  type Query {
    getAllUsers(skip: Int, take: Int, cursor: Int): [Users]
    getUser(id: Int, name: String): Users
    getUserCount: Users
  }

  type Mutation {
      createUser(name: String, email: String!, password: String!) : Users
      loginUser(email: String!, password: String!): Users
      deleteUser(id: Int, email: String): Users
      updateUser(id: Int, data: UpdateData): Users

      createHobby(name: String, userId: Int) : Hobby
  }

  input UpdateData{
      name: String
      email: String
  }

  input HobbyData{
    id: Int,
    name: String,
    userId: Int
  }

  type Users {
      id: Int,
      name: String
      email: String
      password: String
  }

  type Feed {
    users: [Users]
    count: Int
  }

  type Hobby{
    id: Int,
    name: String,
    userId: Int
  }
`);

const rootResolvers = {
  getAllUsers: async (args, req) => {
    const Tcount = await prisma.user.count();
    console.log("count-----", Tcount);
    const data = await prisma.user.findMany({
      skip: args.skip,
      take: args.take,
      cursor: args.currentPage,
      orderBy: {
        id: "asc",
      },
    });
    console.log('========',{data, Tcount});
    return data;
  },
  getUserCount: async (args, req) => {
    return await prisma.user.count();
  },
  getUser: async (args, req) => {
    console.log("args--", args);
    return await prisma.user.findFirst({
      where: {
        id: args.id,
        name: args.name,
      },
      include: {
        hobby: true,
      },
    });
  },
  createUser: async (args, req) => {
    const { name, email, password } = args;
    console.log("args-------", args);
    return await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    });
  },
  deleteUser: async (args, req) => {
    return await prisma.user.delete({
      where: {
        id: args.id,
        // email: args.email,
      },
    });
  },
  updateUser: async (args, req) => {
    const update = await prisma.user.update({
      where: {
        id: args.id,
      },
      data: {
        name: args.data.name,
        email: args.data.email,
      },
    });
    return update;
  },

  createHobby: async (args, req) => {
    const { name, userId } = args;
    console.log("name, userId", name, userId);
    return await prisma.hobby.create({
      data: {
        name: name,
        userId: userId,
      },
    });
  },
};

export const graphql = graphqlHTTP({
  schema,
  rootValue: rootResolvers,
  graphiql: true, // this creates the interactive GraphQL API explorer with documentation.
});

// module.exports = graphql;

// query userData{
//   getAllUsers{
//     name
//     email
//     id
//   }
//   getUser(id: 23){
//     id
//     name
//     email
//   }
// }

// mutation Test($name: String, $email: String!, $password: String!)	{
//   # createUser(name: "test9",email: "test9@gmail.com",password: "123"){
//   #   name
//   #   email
//   #  	password
//   # }

//   createUser(name: $name, email: $email, password: $password){
//     name
//     email
//    	password
//   }

//   # deleteUser(id: 17){
//   #   email
//   # }

//   # updateUser(id:3, data:{name: "update", email: "update@gmail.com"}){
//   #   name
//   #   email
//   # }

//   updateUser(id:28, data:{name: $name, email: $email}){
//     name
//     email
//   }
//   # createHobby(name: "hobby2", userId: 23){
//   #   name
//   #   userId
//   # }
// }
