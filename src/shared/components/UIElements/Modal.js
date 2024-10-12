import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { useEffect } from "react";
import PropTypes from "prop-types";

import Backdrop from "./Backdrop";
import "./Modal.css";

function ModalOverlay(props) {
  const content = (
    <div
      className={`modal ${props.className}`}
      style={props.style}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-header"
      tabIndex="-1" // Make the modal focusable
    >
      <header
        className={`modal__header ${props.headerClass}`}
        id="modal-header"
      >
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
}

ModalOverlay.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  headerClass: PropTypes.string,
  header: PropTypes.string.isRequired,
  contentClass: PropTypes.string,
  children: PropTypes.node,
  footerClass: PropTypes.string,
  footer: PropTypes.node,
  onSubmit: PropTypes.func,
};

function Modal(props) {
  useEffect(() => {
    const closeOnEscapeKey = (e) => e.key === "Escape" && props.onCancel();
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [props]);

  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames={"modal"}
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </>
  );
}

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Modal;
