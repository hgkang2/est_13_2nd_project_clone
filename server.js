import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai"; // 👈 Gemini 라이브러리 도입

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Gemini에 라운즈 페르소나와 질문 전달
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `너는 초고속 답변을 주는 '라운즈 AI 상담원'이야. 안경 가상 피팅, 배송, 도수 렌즈 등에 대해 친절하고 간결하게 답변해줘. 사용자의 질문: ${message}`,
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 에러가 발생했습니다." });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
