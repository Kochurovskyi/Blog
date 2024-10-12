import { createContext, useState } from "react";

export const BlogContext = createContext({
  blogs: [],
  setBlogs: () => {},
});

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);

  return (
    <BlogContext.Provider value={{ blogs, setBlogs }}>
      {children}
    </BlogContext.Provider>
  );
};
