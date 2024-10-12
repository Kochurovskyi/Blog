import PostItem from "./PostItem";
import Card from "../../shared/components/UIElements/Card";
import "./PostList.css";
import Button from "../../shared/components/FormElements/Button";

function PostList({ posts, onDeletePost }) {
  if (posts.length === 0) {
    return (
      <div className="post-list center">
        <Card>
          <h2>No posts found</h2>
          <Button to="/posts/new">Share a post</Button>
        </Card>
      </div>
    );
  } else {
    return (
      <ul className="post-list">
        {posts
          .slice()
          .reverse()
          .map((post) => (
            <PostItem
              key={post.postID} // Use postID as the key
              id={post.postID} // Pass postID as id
              image={post.img}
              title={post.title}
              description={post.post_ua}
              tag={post.tag}
              blogID={post.blogID} // Pass blogID
              onDelete={onDeletePost} // Pass the onDeletePost prop
            />
          ))}
      </ul>
    );
  }
}

export default PostList;
