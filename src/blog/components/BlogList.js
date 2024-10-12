import React from "react";

import BlogItem from "./BlogItem";
import Card from "../../shared/components/UIElements/Card";
import "./BlogsList.css";

const BlogList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No blogs found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="blogs-list">
      {props.items.map((blog) => (
        <BlogItem
          key={blog.id}
          id={blog.id}
          image={blog.img}
          name={blog.title}
          // postCount={blog.posts.length}
        />
      ))}
    </ul>
  );
};

export default BlogList;
