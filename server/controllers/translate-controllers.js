const { Translate } = require("@google-cloud/translate").v2;
const HttpError = require("../model/http-error");

// Creates a client
const translate = new Translate();

async function translateText(req, res, next) {
  const { text } = req.body;
  const target = "en";

  try {
    // Translates the text into the target language
    let [translations] = await translate.translate(text, target);
    translations = Array.isArray(translations) ? translations : [translations];

    res.json({ translations });
  } catch (error) {
    console.error("Error during translation API request:", error);
    const err = new HttpError("Failed to fetch data from Translation API", 500);
    return next(err);
  }
}

exports.translateText = translateText;
