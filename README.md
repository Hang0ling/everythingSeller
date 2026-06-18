# BestieShop AI

BestieShop AI is a chat-based shopping prototype built with React, Vite, and Gemini. The app lets a user describe what they want in a natural conversation, then uses Gemini function calling to turn the conversation into a realistic mobile e-commerce product page.

Original AI Studio project:
https://ai.studio/apps/drive/1J2W7aW9jbpEBRXfkUQEsOIO3bigQ8EmY

## What It Does

- Provides a chat interface styled like a mobile messaging app.
- Guides the user toward a concrete product idea through conversation.
- Calls Gemini with a structured `generate_product_view` tool when the product is clear.
- Generates product metadata such as title, image prompt, price, shop name, tags, and sales copy.
- Uses Gemini image generation to create a product image.
- Renders the result as a phone-sized Chinese e-commerce product detail page.
- Allows the generated product page to be downloaded as an image.

## Tech Stack

- React 19
- TypeScript
- Vite
- `@google/genai`
- Lucide React icons

## Project Structure

- `App.tsx` - Main layout that combines chat and product preview.
- `components/ChatInterface.tsx` - Chat UI and conversation flow.
- `components/ProductCard.tsx` - Mobile product detail page renderer and download behavior.
- `services/geminiService.ts` - Gemini chat, function calling, and image generation logic.
- `types.ts` - Shared TypeScript types for messages and product data.
- `vite.config.ts` - Vite config and Gemini environment variable injection.

## Requirements

- Node.js 18 or newer
- A Gemini API key

Create a `.env.local` file in the project root:

```bash
GEMINI_API_KEY=your_gemini_api_key
```

The Vite config exposes this value as both `process.env.API_KEY` and `process.env.GEMINI_API_KEY` for the browser bundle.

## Run Locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Build

```bash
npm run build
npm run preview
```

## Notes

- Do not commit real API keys.
- Product data is generated for prototype and demo use, not for real commerce checkout.
- Image generation may fail or fall back depending on Gemini API availability and quota.
