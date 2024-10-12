import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PostList from "../components/PostList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { API_URL } from "../../api";

function BlogPosts() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPosts, setLoadedPosts] = useState([]);

  const blogID = useParams().blogId;

  useEffect(() => {
    async function fetchPosts() {
      try {
        const responseData = await sendRequest(
          `${API_URL}/api/posts/blog/${blogID}`
        );
        setLoadedPosts(responseData.posts);
      } catch (err) {
        console.log(err);
      }
    }
    fetchPosts();
  }, [sendRequest, blogID]);

  const postDeletedHandler = (deletedPostId) => {
    setLoadedPosts((prevPosts) =>
      prevPosts.filter((post) => post.postID !== deletedPostId)
    );
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPosts && (
        <PostList posts={loadedPosts} onDeletePost={postDeletedHandler} />
      )}
    </>
  );
}

export default BlogPosts;
