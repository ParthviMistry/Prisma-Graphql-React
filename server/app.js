// var express = require("express");
import express from "express";
// import mysql from "mysql";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import CryptoJS from "crypto-js";
import { graphql } from "./prisma/src/graphqlController.js";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const app = express();

// const middlewere = (req, res, next) => {
//   const token = req.headers.authorization.replace("Bearer ", "");
//   const data = jwt.verify(token, process.env.JSON_SECRET);
//   req.loggedUser = data;
//   next();
// };
// app.use(middlewere);

app.use(express.json());
app.use(cors());
app.use("/graphql", graphql);

app.post("/signup", async (req, res) => {
  console.log("names");
  const createUser = await prisma.user({
    // data: {
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: CryptoJS.AES.encrypt(
    //     req.body.password,
    //     process.env.AES_SECRET
    //   ).toString(),
    // },
    where: { id: "636e1658cb4298dd96cb4b82" },
  });
  return res.json({ createUser });
  // createUser.id && res.send("User created successfully");
});

app.get("/getusers", async (req, res) => {
  const users = await prisma.user.findMany();
  console.log({ users });
  res.send(users);
});

app.post("/createuser", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("req--", name, email, password);

  const users = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password,
    },
  });
  res.send(users);
});

app.post("/login", async (req, res) => {
  const findUser = await prisma.user.findFirst({
    where: {
      email: { equals: req.body.email },
    },
  });
  console.log({ findUser });
  if (findUser) {
    const password = CryptoJS.AES.decrypt(
      findUser.password,
      process.env.AES_SECRET
    ).toString(CryptoJS.enc.Utf8);
    if (password === req.body.password) {
      const token = jwt.sign(
        { id: findUser.id, email: req.body.email },
        process.env.JSON_SECRET
      );
      res.send(token);
    } else {
      res.send("Incorrect Password");
    }
  } else {
    res.send("Invalid email or password");
  }
});

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "123",
//   port: "888",
// });

// connection.connect((err) => {
//   if (err) {
//     console.log("error", err);
//   }
// });

app.listen(5000, () => {
  console.log("server running on 5000");
});
