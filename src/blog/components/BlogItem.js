import { Link } from "react-router-dom";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import "./BlogItem.css";

function BlogItem(props) {
  return (
    <li className="blog-item">
      <Card className="blog-item__content">
        <Link to={`/${props.id}/posts`}>
          <div className="blog-item__image">
            <Avatar image={props.image} alt={props.name} />
          </div>
          <div className="blog-item__info">
            <h2>{props.name}</h2>
            {/* <h3>
              {props.postCount} {props.postCount === 1 ? "Post" : "Posts"}
            </h3> */}
          </div>
        </Link>
      </Card>
    </li>
  );
}

export default BlogItem;
