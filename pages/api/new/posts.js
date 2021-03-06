import { connectToDatabase } from "../../../util/mongodb";
import bcrypt from "bcryptjs";
import fs from "fs";
import xml2js from "xml2js";
import path from "path";
import axios from "axios";
import getConfig from "next/config";
export default async (req, res) => {
  if (req.method == "POST") {
    const { db } = await connectToDatabase();
    const posts = await db
      .collection("posts")
      .insertOne({
        title: req.body.title,
        username: req.body.username,
        tags: req.body.tags,
        blog: req.body.blog,
        image: req.body.image,
        imageDescription: req.body.imageDescription,
        imageDescriptions: [req.body.imageDescription],
        images: [req.body.image],
        dateCreated: new Date(),
        dateUpdated: new Date(),
        bookmarks: [],
        views: [],
        conditions: req.body.conditions,
        computerProgramme: req.body.computerProgramme,
        likes: [],
      })
      .then(async (e) => {
        await db
          .collection("userData")
          .update(
            { username: req.body.username },
            { $push: { posts: e.ops[0]._id } }
          );
        return e;
      })
      .then((e) => {
        res.status(200).send(`/article/${e.ops[0]._id}`);
      });
  } else {
    res.status(404).send("error");
  }
};
