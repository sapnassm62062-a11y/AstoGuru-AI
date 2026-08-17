const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Groq = require("groq-sdk");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());


// =====================================================
// DEMO USERS
// MongoDB temporarily removed
// =====================================================

const users = [];


// =====================================================
// GROQ SETUP
// =====================================================

console.log(
  "Groq Key Status:",
  process.env.GROQ_API_KEY
    ? "Available ✅"
    : "Missing ❌"
);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AstroGuru AI Server Running 🌙",
  });
});


// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    server: "online",
    groq: process.env.GROQ_API_KEY
      ? "connected"
      : "missing",
  });
});


// =====================================================
// SIGNUP API
// =====================================================

app.post("/api/auth/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const cleanEmail = email
      .trim()
      .toLowerCase();

    // Check existing user
    const existingUser = users.find(
      (user) => user.email === cleanEmail
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = {
      id: Date.now().toString(),
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
    };

    users.push(user);

    console.log(
      "New user created:",
      user.email
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(
      "Signup Error ❌",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Signup error",
    });
  }
});


// =====================================================
// LOGIN API
// =====================================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const cleanEmail = email
      .trim()
      .toLowerCase();

    const user = users.find(
      (item) => item.email === cleanEmail
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "User not found. Please create an account first.",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET ||
        "astroguru_secret",
      {
        expiresIn: "7d",
      }
    );

    console.log(
      "User logged in:",
      user.email
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(
      "Login Error ❌",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Login error",
    });
  }
});


// =====================================================
// AI CHAT API
// =====================================================

app.post("/api/chat", async (req, res) => {
  try {
    const {
      question,
      name,
      birthDate,
      birthTime,
      birthPlace,
    } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // Birth details optional for demo
    const prompt = `
You are AstroGuru AI 🌙, a friendly AI astrology guidance assistant.

User Name:
${name || "Explorer"}

Birth Date:
${birthDate || "Not provided"}

Birth Time:
${birthTime || "Not provided"}

Birth Place:
${birthPlace || "Not provided"}

User Question:
${question}

Give a helpful, friendly and simple astrology-style response.

If birth details are available, you may use them as context.

Include useful guidance about:
- Career
- Love and relationships
- Personal growth
when relevant to the question.

Do not make guaranteed predictions.
Do not claim supernatural certainty.
Clearly present the response as AI-based astrology guidance.

Keep the answer easy to understand and supportive.
`;

    console.log(
      "AI Question:",
      question
    );

    const response =
      await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "system",
            content:
              "You are AstroGuru AI assistant. Give friendly, safe, AI-based astrology guidance.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const reply =
      response?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        success: false,
        message:
          "AI did not return a response",
      });
    }

    console.log(
      "AI Response Generated ✅"
    );

    return res.json({
      success: true,
      reply,
    });

  } catch (error) {
    console.error(
      "AI ERROR ❌",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "AI response failed",
    });
  }
});


// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});


// =====================================================
// SERVER
// =====================================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `AstroGuru AI Server Running on port ${PORT} 🚀`
  );
});