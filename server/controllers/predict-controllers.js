// Initialize the gcloud CLI
// gcloud init

// Authenticate and set up ADC
// gcloud auth application-default login

// Setting Environment Variable in Windows
// set PROJECT_ID=your-project-id

const { PredictionServiceClient } = require("@google-cloud/aiplatform").v1;
const { helpers } = require("@google-cloud/aiplatform");
const HttpError = require("../model/http-error");
const { GoogleAuth } = require("google-auth-library");

const PROJECT_ID = "rm-gcp-bsa-dev";
const LOCATION = "us-central1";
const PUBLISHER = "google";

const clientOptions = {
  apiEndpoint: "us-central1-aiplatform.googleapis.com",
};
const auth = new GoogleAuth({
  keyFile: "rm-gcp-bsa-dev-7fd4fb996dae.json",
  scopes: "https://www.googleapis.com/auth/cloud-platform",
});

async function predict(req, res, next) {
  const { title, pre_prompt } = req.body;

  const task = `Відредагуй даний текст, щоб він був більш придатним для публікації на Facebook, результат буде копіюватись в текстове поле при формуванні нового посту в Facebook. Виправ можливі помилки зберігаюч смисл речення, не добавляй ніякого нового тексту окрім виправлення можливих помилок, допустиме тільки редагування зі збереженням смислу. Добав емодзі після кожного абзацу відповідно до смислу цього абзацу. Додавання емодзі run заборонено. Емодзі не повинні повторюватись. В тексті два однакових емодзі недопустимо. Форматування: заголовок ${title} не виділяй його ніякими додатковими символами, зроби його великим буквами. Текст розбий на параграфи які зручно читат в Facebook. Ось текст: `;
  const prompt = `${task} ${pre_prompt}`;
  const modelId = "text-bison@002";
  try {
    const client = new PredictionServiceClient({
      ...clientOptions,
      auth,
    });
    const endpoint = `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/${PUBLISHER}/models/${modelId}`;
    const instanceValue = helpers.toValue({ prompt });
    const instances = [instanceValue];
    const parameters = helpers.toValue({
      temperature: 0.5,
      maxOutputTokens: 2000,
      topK: 40,
      topP: 0.95,
    });

    const request = {
      endpoint,
      instances,
      parameters,
    };

    const [response] = await client.predict(request);

    const predictions = response.predictions.map((prediction) => ({
      content: prediction.structValue.fields.content.stringValue,
      citationMetadata: prediction.structValue.fields.citationMetadata || {
        citations: [],
      },
      safetyAttributes: prediction.structValue.fields.safetyAttributes || {
        categories: [],
        blocked: false,
        scores: [],
        safetyRatings: [],
      },
    }));

    const metadata = response.metadata.structValue.fields || {
      tokenMetadata: {
        inputTokenCount: {
          totalTokens: 0,
          totalBillableCharacters: 0,
        },
        outputTokenCount: {
          totalTokens: 0,
          totalBillableCharacters: 0,
        },
      },
    };

    res.json({ predictions, metadata });
  } catch (error) {
    console.error("Error during Vertex AI API request:", error);
    const err = new HttpError("Failed to fetch data from Vertex AI API", 500);
    return next(err);
  }
}

exports.predict = predict;
