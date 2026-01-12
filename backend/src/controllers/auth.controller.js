import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prismaClient.js";

export const registerUser = async (req, res) => 
{
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields (name, email, password) are required",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Database connection issue. User not saved yet.",
    });
  }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
  
    try {
      /**
       * TEMPORARY MOCK USER
       * (until DB connection is stable)
       */
      const mockUser = {
        id: 1,
        name: "Naila",
        email: "naila@test.com",
        password: await bcrypt.hash("123456", 10),
        role: "USER",
      };
  
      // Check email
      if (email !== mockUser.email) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }
  
      // Compare password
      const isPasswordValid = await bcrypt.compare(
        password,
        mockUser.password
      );
  
      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }
  
      // Generate JWT
      const token = jwt.sign(
        {
          id: mockUser.id,
          role: mockUser.role,
        },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "1h" }
      );
  
      return res.status(200).json({
        message: "Login successful",
        token,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Login failed",
      });
    }
  };
  