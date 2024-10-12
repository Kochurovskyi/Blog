import React, { useEffect, useState, useContext } from "react";

import BlogList from "../components/BlogList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { BlogContext } from "../../shared/contex/blog-context";
import { blogs as staticBlogs } from "../../shared/static/staticData";

function Blogs() {
  const { isLoading, error, clearError } = useHttpClient();
  const [loadedBlogs, setLoadedBlogs] = useState();

  const { setBlogs } = useContext(BlogContext);

  useEffect(() => {
    setLoadedBlogs(staticBlogs);
    setBlogs(staticBlogs); // Store blogs in context
  }, [setBlogs]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedBlogs && <BlogList items={loadedBlogs} />};
    </>
  );
}

export default Blogs;
