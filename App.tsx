import React, { useState } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { ProductCard } from './components/ProductCard';
import { ProductData } from './types';

const App: React.FC = () => {
  const [generatedProduct, setGeneratedProduct] = useState<ProductData | null>(null);

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start justify-center max-w-7xl mx-auto">
      
      {/* Left Column: Chat */}
      <div className="w-full md:w-[400px] h-[800px] shrink-0">
        <ChatInterface onProductGenerated={setGeneratedProduct} />
      </div>

      {/* Right Column: Result */}
      <div className="flex-1 w-full min-w-[350px] flex justify-center items-start pt-4">
        <ProductCard data={generatedProduct} />
      </div>

    </div>
  );
};

export default App;
