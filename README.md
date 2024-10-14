## General Description

This application is a private blog about sports and Turkish culture from a foreigner's perspective. The blog covers a couple topics, and more topics can be added over time. The application provides users with an intuitive interface to interact with various features such as creating, reading, updating, and deleting (CRUD) data. The user interface is designed using React, ensuring a fast and interactive experience.

## MERN Stack

The project is built using the MERN stack, which includes the following technologies:

- **MongoDB**: A NoSQL database for storing data - in AWS replaced on DynamoDB
- **Express.js**: A web framework for Node.js used to build the server-side of the application.
- **React**: A library for building user interfaces.
- **Node.js**: A JavaScript runtime for executing server-side code.

## Artificial Intelligence Integration

This project leverages artificial intelligence to enhance the user experience. We have integrated AI models for nice text edition and translation to english, and using generated english version generate descriptive image. This makes the application more intelligent and fun.

## Deployment on AWS Services

The project is deployed on AWS services to ensure high availability and scalability. We use the following AWS services:

- **Amazon S3**: For storing static files and media content, and for image storage.
- **AWS CloudFront**: For content delivery and caching.
- **Elastic Load Balancing**: For distributing incoming application traffic.
- **AWS Elastic Beanstalk**: For deploying and managing applications.
- **Amazon DynamoDB**: For managing the database.

![AWS Architecture](https://github.com/Kochurovskyi/Blog/misc/AWS_arch.png)
