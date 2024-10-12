const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const multer = require("multer");
const HttpError = require("../model/http-error");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer();
const ddbDocClient = DynamoDBDocumentClient.from(dynamoDBClient);

async function getPostById(req, res, next) {
  const { bid: blogId, pid: postId } = req.params; // Assuming blogID and postID are provided in the request parameters
  let post;
  try {
    const result = await ddbDocClient.send(
      new GetCommand({
        TableName: "BlogPosts",
        Key: { blogID: blogId, postID: postId },
      })
    );
    post = result.Item;
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find a post by id", 500)
    );
  }
  if (!post) {
    return next(
      new HttpError("Could not find a place for the provided POST id", 404)
    );
  }
  res.json({ post });
}

async function getPostsByBlogId(req, res, next) {
  const blogId = req.params.bid;
  let posts;
  try {
    const result = await ddbDocClient.send(
      new QueryCommand({
        TableName: "BlogPosts",
        KeyConditionExpression: "blogID = :blogID",
        ExpressionAttributeValues: { ":blogID": blogId },
      })
    );
    posts = result.Items;
  } catch (err) {
    console.log(err)
    return next(
      new HttpError(
        "Fetching posts by blog id - Some problem with database",
        500
      )
    );
  }
  if (!posts || posts.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided BLOG id", 404)
    );
  }
  res.json({ posts });
}

async function createPost(req, res, next) {
  const { postID, title, tag, post, post_ua, post_en, bid } = req.body;
  let imageUrl = "";
  if (req.file) {
    const fileName = `${bid}_${postID}.jpg`;
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `uploads/${fileName}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    try {
      const uploadResult = await s3Client.send(
        new PutObjectCommand(uploadParams)
      );
      imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${fileName}`;
    } catch (err) {
      console.log(err);
      return next(
        new HttpError("Uploading image failed, please try again", 500)
      );
    }
  }

  const createdPost = {
    postID,
    title,
    tag,
    post,
    post_ua,
    post_en,
    img: imageUrl,
    blogID: bid,
  };

  try {
    await ddbDocClient.send(
      new PutCommand({
        TableName: "BlogPosts",
        Item: createdPost,
      })
    );
  } catch (err) {
    // console.log(err);
    return next(new HttpError("Creating post failed, please try again", 500));
  }
  res.status(201).json({ post: createdPost });
}

// async function updatePostById(req, res, next) {
//   const { title, tag, post, post_ua, post_en, img } = req.body;
//   const { bid: blogId, pid: postId } = req.params;

//   let updateExpression = "set";
//   const expressionAttributeValues = {};

//   if (title !== undefined) {
//     updateExpression += " title = :title,";
//     expressionAttributeValues[":title"] = title;
//   }
//   if (tag !== undefined) {
//     updateExpression += " tag = :tag,";
//     expressionAttributeValues[":tag"] = tag;
//   }
//   if (post !== undefined) {
//     updateExpression += " post = :post,";
//     expressionAttributeValues[":post"] = post;
//   }
//   if (post_ua !== undefined) {
//     updateExpression += " post_ua = :post_ua,";
//     expressionAttributeValues[":post_ua"] = post_ua;
//   }
//   if (post_en !== undefined) {
//     updateExpression += " post_en = :post_en,";
//     expressionAttributeValues[":post_en"] = post_en;
//   }
//   if (img !== undefined) {
//     updateExpression += " img = :img,";
//     expressionAttributeValues[":img"] = img;
//   }

//   // Remove the trailing comma from the update expression
//   updateExpression = updateExpression.slice(0, -1);

//   try {
//     const result = await ddbDocClient.send(
//       new UpdateCommand({
//         TableName: "BlogPosts",
//         Key: { blogID: blogId, postID: postId },
//         UpdateExpression: updateExpression,
//         ExpressionAttributeValues: expressionAttributeValues,
//         ReturnValues: "ALL_NEW",
//       })
//     );
//     // console.log("Update Result:", result);
//   } catch (err) {
//     // console.log("Update Error:", err);
//     return next(
//       new HttpError("Something went wrong, could not update post", 500)
//     );
//   }
//   res.status(200).json({ message: "Post updated successfully" });
// }

async function updatePostById(req, res, next) {
  const { title, post, post_ua, post_en, bid } = req.body;
  const { pid } = req.params;

  let imageUrl;
  if (req.file) {
    const fileName = `${bid}_${pid}.jpg`;
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `uploads/${fileName}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    try {
      const uploadResult = await s3Client.send(
        new PutObjectCommand(uploadParams)
      );
      imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${fileName}`;
    } catch (err) {
      return next(
        new HttpError("Uploading image failed, please try again", 500)
      );
    }
  }

  const updateExpression =
    "set title = :title, post = :post, post_ua = :post_ua, post_en = :post_en" +
    (imageUrl ? ", img = :img" : "");
  const expressionAttributeValues = {
    ":title": title,
    ":post": post,
    ":post_ua": post_ua,
    ":post_en": post_en,
  };
  if (imageUrl) {
    expressionAttributeValues[":img"] = imageUrl;
  }

  try {
    await ddbDocClient.send(
      new UpdateCommand({
        TableName: "BlogPosts",
        Key: { postID: pid, blogID: bid },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );
  } catch (err) {
    return next(new HttpError("Updating post failed, please try again", 500));
  }
  res.status(200).json({ message: "Post updated successfully" });
}

async function deletePostById(req, res, next) {
  const { bid: blogId, pid: postId } = req.params;

  // Fetch the post to get the image URL
  let post;
  try {
    const result = await ddbDocClient.send(
      new GetCommand({
        TableName: "BlogPosts",
        Key: { blogID: blogId, postID: postId },
      })
    );
    post = result.Item;
  } catch (err) {
    return next(new HttpError("Fetching post failed, please try again", 500));
  }

  if (!post) {
    return next(new HttpError("Could not find post for this id.", 404));
  }

  if (!post) {
    return next(new HttpError("Could not find post for this id.", 404));
  }

  // Delete the image from S3 if it exists
  if (post.img) {
    const imagePath = `uploads/${post.img.split("/").pop()}`; // Ensure the path includes 'uploads/'
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: imagePath,
    };

    try {
      await s3Client.send(new DeleteObjectCommand(deleteParams));
    } catch (err) {
      return next(
        new HttpError("Deleting image failed, please try again", 500)
      );
    }
  }

  // Delete the post from the database
  try {
    await ddbDocClient.send(
      new DeleteCommand({
        TableName: "BlogPosts",
        Key: { blogID: blogId, postID: postId },
      })
    );
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete the post", 500)
    );
  }

  res.status(200).json({ message: "Post has been deleted" });
}

exports.getPostById = getPostById;
exports.getPostsByBlogId = getPostsByBlogId;
exports.createPost = createPost;
exports.updatePostById = updatePostById;
exports.deletePostById = deletePostById;
