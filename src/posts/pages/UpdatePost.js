import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import "./NewPost.css";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

function UpdatePost() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { bid, pid } = useParams(); // Use both bid and pid from URL parameters
  const [loadedPost, setLoadedPost] = useState();
  const [formState, inputHandler, setFormData] = useForm({
    title: {
      value: "",
      isValid: false,
    },
    category: {
      value: "",
      isValid: false,
    },
    description: {
      value: "",
      isValid: false,
    },
  });

  const navigate = useNavigate();
  const [fbText, setFbText] = useState("");
  const [translation, setTranslation] = useState("");
  // const [dynamicImageSrc, setDynamicImageSrc] = useState("");

  const [wordCount, setWordCount] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState(null);
  // const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const responseData = await sendRequest(
          `http://localhost:8080/api/posts/${bid}/${pid}`
        );
        setLoadedPost(responseData.post);
        setFormData(
          {
            title: {
              value: responseData.post.title,
              isValid: true,
            },
            description: {
              value: responseData.post.post,
              isValid: true,
            },
          },
          true
        );
        setFbText(responseData.post.post_ua);
        setTranslation(responseData.post.post_en);
        // setDynamicImageSrc(responseData.post.img); // Set the image URL from the database
        setWordCount(responseData.post.post.split(" ").length);
      } catch (err) {}
    }
    fetchPost();
  }, [sendRequest, bid, pid, setFormData]);

  const descriptionChangeHandler = useCallback(
    (id, value, isValid) => {
      inputHandler(id, value, isValid);
      const words = value.trim().split(/\s+/);
      setWordCount(words.filter((word) => word.length > 0).length);
    },
    [inputHandler]
  );

  const translateHandler = async () => {
    const descriptionText = formState.inputs.description.value;
    setIsTranslating(true);
    setTranslateError(null);

    try {
      const response = await fetch("http://localhost:8080/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formState.inputs.title.value,
          pre_prompt: descriptionText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch FB post from the GPT model");
      }
      const data = await response.json();
      console.log(data);
      const predictionContent = data.predictions[0].content;
      setFbText(predictionContent);
    } catch (err) {
      setTranslateError(err.message);
      console.error(err.message);
    }
  };

  useEffect(() => {
    const translateText = async () => {
      if (fbText === "") return; // Skip if fbText is empty

      try {
        // Call the translation API endpoint
        const response = await fetch("http://localhost:8080/api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: fbText,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch translation from the API");
        }

        const data = await response.json();
        console.log(data);
        const translatedText = data.translations[0];

        setTranslation(translatedText);
      } catch (err) {
        setTranslateError(err.message);
        console.error(err.message);
      } finally {
        setIsTranslating(false);
        // setDynamicImageSrc("https://picsum.photos/id/478/1024/1024");
      }
    };

    translateText();
  }, [fbText]);

  // function loadPhotoHandler(event) {
  //   event.preventDefault();
  //   if (!formState.isValid) return;

  //   const fileInput = document.createElement("input");
  //   fileInput.type = "file";
  //   fileInput.accept = "image/*";
  //   fileInput.multiple = false;

  //   fileInput.onchange = (event) => {
  //     const file = event.target.files[0];
  //     if (file && file.type.startsWith("image/")) {
  //       const img = new Image();
  //       img.src = URL.createObjectURL(file);

  //       img.onload = () => {
  //         const canvas = document.createElement("canvas");
  //         const ctx = canvas.getContext("2d");

  //         // Зменшення зображення
  //         const scale = Math.max(1024 / img.width, 1024 / img.height);
  //         const scaledWidth = img.width * scale;
  //         const scaledHeight = img.height * scale;

  //         canvas.width = scaledWidth;
  //         canvas.height = scaledHeight;
  //         ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

  //         // Обрізання зображення
  //         const cropCanvas = document.createElement("canvas");
  //         const cropCtx = cropCanvas.getContext("2d");
  //         cropCanvas.width = 1024;
  //         cropCanvas.height = 1024;

  //         const startX = 0;
  //         const startY = scaledHeight - 1024;

  //         cropCtx.drawImage(
  //           canvas,
  //           startX,
  //           startY,
  //           1024,
  //           1024,
  //           0,
  //           0,
  //           1024,
  //           1024
  //         );

  //         cropCanvas.toBlob((blob) => {
  //           setSelectedImage(blob);
  //         }, "image/jpeg");
  //       };
  //     }
  //   };

  //   fileInput.click();
  // }

  // async function genImageHandler(event) {
  //   event.preventDefault();
  //   if (!formState.isValid) return;
  //   setIsTranslating(true); // Додаємо спінер перед початком генерації
  //   try {
  //     const response = await fetch("http://localhost:8080/api/generate-image", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         // prompt: fbText,
  //         prompt: translation,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to generate image from the model");
  //     }
  //     const data = await response.json();
  //     setDynamicImageSrc(`data:image/png;base64,${data.imageBase64}`);
  //   } catch (err) {
  //     console.error(err.message);
  //   } finally {
  //     setIsTranslating(false);
  //   }
  // }

  async function postUpdateSubmitHandler(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", formState.inputs.title.value);
    formData.append("post", formState.inputs.description.value);
    formData.append("post_ua", fbText);
    formData.append("post_en", translation);
    formData.append("bid", bid);

    // if (selectedImage) {
    //   formData.append("image", selectedImage, `${bid}_${pid}.jpg`);
    // }

    try {
      await sendRequest(
        `http://localhost:8080/api/posts/${bid}/${pid}`,
        "PATCH",
        formData
      );
      navigate(`/${bid}/posts`);
    } catch (err) {
      console.log(err);
    }
  }

  if (!loadedPost && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Post was not found.</h2>
        </Card>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <ErrorModal
        error={error || translateError}
        onClear={() => {
          clearError();
          setTranslateError(null);
        }}
      />
      <form className="post-form" onSubmit={postUpdateSubmitHandler}>
        {isLoading || isTranslating ? <LoadingSpinner asOverlay /> : null}
        <div className="title-selector-container">
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter something"
            onInput={inputHandler}
            initialValue={formState.inputs.title.value}
            initialValid={formState.inputs.title.isValid}
          />
        </div>
        <Input
          id="description"
          element="textarea"
          label={`Description (${wordCount} words)`}
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter something (min 5)"
          onInput={descriptionChangeHandler}
          initialValue={formState.inputs.description.value}
          initialValid={formState.inputs.description.isValid}
        />
        <Button
          type="button"
          onClick={translateHandler}
          disabled={!formState.isValid || isTranslating}
        >
          Generate
        </Button>
        {/* <Button
          type="button"
          disabled={!formState.isValid}
          onClick={loadPhotoHandler}
        >
          Load Photo
        </Button>
        <Button
          type="button"
          disabled={!formState.isValid || isTranslating}
          onClick={genImageHandler}
        >
          ImeGen
        </Button> */}
        <div className="text-container">
          <textarea
            id="fb_text"
            placeholder="FB text"
            value={fbText}
            onChange={(e) => setFbText(e.target.value)}
          ></textarea>
          <textarea
            id="translation"
            placeholder="Translation"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
          ></textarea>
        </div>
        <div className="button-container">
          {/* <img
            id="dynamicImage"
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : dynamicImageSrc
            }
            style={{ width: "80vw", height: "auto" }}
            alt="Dynamic"
          /> */}
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE POST
          </Button>
        </div>
      </form>
    </>
  );
}

export default UpdatePost;
