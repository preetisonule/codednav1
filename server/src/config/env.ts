import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralized, typed access to environment configuration.
 * Nothing outside this file should read from `process.env` directly —
 * that keeps configuration drift out of controllers/services.
 */
export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',

  github: {
    token: process.env.GITHUB_TOKEN || '',
    baseUrl: 'https://api.github.com',
  },

  ai: {
    provider: (process.env.AI_PROVIDER || 'mock') as 'mock' | 'openai' | 'gemini' | 'claude',
    openaiKey: process.env.OPENAI_API_KEY || '',
    geminiKey: process.env.GEMINI_API_KEY || '',
    anthropicKey: process.env.ANTHROPIC_API_KEY || '',
  },

  isProduction: process.env.NODE_ENV === 'production',
};
