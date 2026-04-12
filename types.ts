export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export interface ProductData {
  title: string;
  price: string;
  originalPrice: string;
  tags: string[];
  imageUrl: string; // Base64 or URL
  shopName: string;
  saleLabel: string;
}

// Interface for the tool arguments returned by Gemini
export interface ProductToolArgs {
  productName: string;
  imagePrompt: string;
  price: number;
  originalPrice: number;
  shopName: string;
  saleTag: string;
  tags: string[];
}
