const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const aiService = {
  responses: {
    create: async ({ model, input }) => {
      const maxAttempts = 3;
      const delays = [5000, 10000];

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const response = await ai.models.generateContent({
           model: "gemini-3.5-flash-lite",
            contents: input,
          });

          return {
            output_text: response.text,
          };
        } catch (error) {
          const message = String(error?.message || "").toLowerCase();

          const is503 =
            error?.status === 503 ||
            error?.code === 503 ||
            message.includes("service unavailable") ||
            message.includes("high demand") ||
            message.includes("unavailable");

          const is429 =
            error?.status === 429 ||
            error?.code === 429 ||
            message.includes("quota") ||
            message.includes("resource exhausted");

          if (is429) {
            error.status = 429;
            throw error;
          }

          if (is503 && attempt < maxAttempts) {
            console.log(
              `Gemini 503 - retrying in ${delays[attempt - 1] / 1000}s...`
            );

            await new Promise((resolve) =>
              setTimeout(resolve, delays[attempt - 1])
            );

            continue;
          }

          throw error;
        }
      }
    },
  },
};

module.exports = aiService;