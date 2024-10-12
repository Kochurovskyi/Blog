import { useState, useContext } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/contex/auth-context";
import "./PostItem.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

function PostItem({ id, image, title, description, tag, blogID, onDelete }) {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFullPost, setShowFullPost] = useState(false);

  const paragraphs = description
    .trim()
    .split("\n\n")
    .map((para, index) => (
      <p key={index} className="indented-paragraph">
        {para.trim()}
      </p>
    ));

  let first70Words;
  const words = description.split(" ");
  if (words.length <= 70) {
    first70Words = words.join(" ");
  } else {
    first70Words = words.slice(0, 70).join(" ") + "...";
  }

  const truncatedParagraphs = first70Words.split("\n\n").map((para, index) => (
    <p key={index} className="indented-paragraph">
      {para.trim()}
    </p>
  ));

  function showDeleteWarningHandler() {
    setShowConfirmModal(true);
  }

  function cancelDeleteHandler() {
    setShowConfirmModal(false);
  }

  async function confirmDeleteHandler() {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:8080/api/posts/${blogID}/${id}`,
        "DELETE"
      );
      onDelete(id); // Call the onDelete prop with the post id
    } catch (err) {}
  }

  function toggleShowFullPost() {
    setShowFullPost((prevShowFullPost) => !prevShowFullPost);
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item_modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              Cancel
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>Do you want to delete this post?</p>
      </Modal>
      <li className="post-item">
        <Card className="post-item___content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="post-item___image">
            <img src={image} alt={title} />
          </div>
          <div className="post-item___info">
            <div className="post-item___title">
              <h2>{title}</h2>
              <h3>{tag}</h3>
            </div>
            <div className="post-item__description">
              {showFullPost ? paragraphs : truncatedParagraphs}
            </div>
            <div className="post-item___actions">
              <Button
                inverse
                onClick={toggleShowFullPost}
                disabled={words.length <= 70}
              >
                {showFullPost ? "Hide" : "More..."}
              </Button>
              {auth.isLoggedIn && (
                <Button to={`/posts/${blogID}/${id}`}>EDIT</Button>
              )}
              {auth.isLoggedIn && (
                <Button danger onClick={showDeleteWarningHandler}>
                  DELETE
                </Button>
              )}
            </div>
          </div>
        </Card>
      </li>
    </>
  );
}

export default PostItem;
