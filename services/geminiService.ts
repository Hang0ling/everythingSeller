import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { ProductToolArgs } from "../types";

// Helper to get API key
const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    console.error("API_KEY not found in environment variables");
    throw new Error("API Key is missing");
  }
  return key;
};

// 1. Define the Tool for generating the product view
const generateProductTool: FunctionDeclaration = {
  name: "generate_product_view",
  description: "Call this when the user has decided on a specific product they want to see. This generates the data needed to render a shopping app product page.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      productName: {
        type: Type.STRING,
        description: "The catchy, full title of the product for an e-commerce listing.",
      },
      imagePrompt: {
        type: Type.STRING,
        description: "A detailed visual description of the product to generate an image. Include color, material, lighting, and angle (e.g., 'A pink fur coat on a mannequin, studio lighting').",
      },
      price: {
        type: Type.NUMBER,
        description: "The sale price of the item.",
      },
      originalPrice: {
        type: Type.NUMBER,
        description: "The original price before discount.",
      },
      shopName: {
        type: Type.STRING,
        description: "A creative name for the shop.",
      },
      saleTag: {
        type: Type.STRING,
        description: "A short text for the red banner (e.g., 'Year End Sale', 'Flash Deal').",
      },
      tags: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of 3-4 short selling points (e.g., 'Free Shipping', '7-Day Return').",
      },
    },
    required: ["productName", "imagePrompt", "price", "originalPrice"],
  },
};

// 2. Chat Logic
export const sendMessageToGemini = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  onToolCall: (args: ProductToolArgs) => Promise<void>
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });

  const systemInstruction = `
    You are a user's best female friend ("Bestie" or "Gui Mi" in Chinese).
    - Speak in casual, trendy Chinese (Mainland China style).
    - Use emojis, be enthusiastic, short, and chatty.
    - Your goal is to help the user choose a fashion item, gift, or product.
    - Ask 1-2 clarifying questions about what they want (style, color, budget).
    - Once you have a clear idea of what they want, say something like "Ooh I found the perfect one!" and IMMEDIATELY call the 'generate_product_view' tool.
    - Do not output the product details in text, just call the tool.
  `;

  try {
    // Use gemini-3-pro-preview for better complex reasoning and tool usage stability
    const chat = ai.chats.create({
      model: "gemini-3-pro-preview",
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: [generateProductTool] }],
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: newMessage });
    
    // Check for function calls
    const calls = result.functionCalls;
    if (calls && calls.length > 0) {
      const call = calls[0];
      if (call.name === "generate_product_view") {
        const args = call.args as unknown as ProductToolArgs;
        
        try {
            await onToolCall(args);
            return "我帮你生成出来啦！看看这个怎么样？超适合你！😍";
        } catch (toolError) {
            console.error("Tool execution failed:", toolError);
            return "哎呀，生成图片的时候出了点小插曲，要不我们换个描述试试？😵‍💫";
        }
      }
    }

    return result.text || "哎呀，我刚才走神了，再说一遍？";
  } catch (error) {
    console.error("Chat API Error:", error);
    return "抱歉宝子，网有点卡，等会再试下～ 😭";
  }
};

// 3. Image Generation Logic
export const generateProductImage = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
            aspectRatio: "3:4", 
            // 3:4 mimics standard mobile e-commerce photography
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Image Gen Error:", error);
    // Fallback placeholder if generation fails
    return "https://picsum.photos/600/800"; 
  }
};
