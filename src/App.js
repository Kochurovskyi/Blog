import { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Blogs from "./blog/pages/Blogs";
import NewPost from "./posts/pages/NewPost";
import BlogPosts from "./posts/pages/BlogPosts";
import UpdatePost from "./posts/pages/UpdatePost";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Auth from "./blog/pages/Auth";
import { AuthContext } from "./shared/contex/auth-context";
import { BlogProvider } from "./shared/contex/blog-context";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);
  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <>
        <Route path="/" element={<Blogs />} />;
        <Route path="/:blogId/posts" element={<BlogPosts />} />
        <Route path="/posts/new" element={<NewPost />} />
        <Route path="/posts/:bid/:pid" element={<UpdatePost />}></Route>
        <Route path="*" element={<Navigate to="/" />} />
      </>
    );
  } else {
    routes = (
      <>
        <Route path="/" element={<Blogs />} />
        <Route path="/:blogId/posts" element={<BlogPosts />} />
        <Route path="/auth" element={<Auth />}></Route>
        <Route path="*" element={<Navigate to="/auth" />} />
      </>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      <BlogProvider>
        <Router>
          <MainNavigation />
          <main>
            <Routes>{routes}</Routes>
          </main>
        </Router>
      </BlogProvider>
    </AuthContext.Provider>
  );
}

export default App;
