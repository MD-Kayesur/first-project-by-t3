"use client";

import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useState } from "react";

// Helper to format currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

// Helper to parse image URLs
const getImages = (imagesStr: string) => {
  if (!imagesStr) return [];
  return imagesStr.split(",").map((url) => url.trim()).filter(Boolean);
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // tRPC query to fetch specific product
  const { data: product, isLoading, error } = api.product.getById.useQuery(
    { id },
    { enabled: !isNaN(id) } // only run if ID is valid
  );

  if (isLoading) {
    return (
      <main className="p-8 max-w-6xl mx-auto space-y-8 animate-pulse min-h-screen">
        <div className="h-8 bg-slate-200 rounded w-32 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="h-96 bg-slate-200 rounded-3xl w-full"></div>
          <div className="space-y-4">
            <div className="h-10 bg-slate-200 rounded w-3/4"></div>
            <div className="h-6 bg-emerald-100 rounded w-1/4"></div>
            <div className="h-32 bg-slate-100 rounded-xl w-full mt-6"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="p-8 max-w-6xl mx-auto text-center py-32 min-h-screen">
        <div className="text-6xl mb-6">🤷‍♂️</div>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Product Not Found</h1>
        <p className="text-slate-500 mb-8">We couldn&apos;t find the product you&apos;re looking for.</p>
        <button 
          onClick={() => router.back()}
          className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-all"
        >
          Go Back
        </button>
      </main>
    );
  }

  const imagesList = getImages(product.images);

  return (
    <main className="p-4 sm:p-8 max-w-6xl mx-auto min-h-screen">
      {/* Back navigation */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold mb-8 transition-colors group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Catalog
      </button>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Gallery Column */}
          <div className="bg-slate-900 p-6 flex flex-col justify-center gap-4 relative">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-black/20 flex items-center justify-center border border-white/5">
              {imagesList.length > 0 ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={imagesList[activeImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-8xl">📦</div>
              )}
            </div>
            
            {/* Thumbnails */}
            {imagesList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 px-1">
                {imagesList.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? "border-indigo-500 scale-105" : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="p-8 md:p-12 flex flex-col">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold tracking-wider mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                In Stock
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
                {product.title}
              </h1>
              
              <div className="text-3xl font-black text-indigo-600 mb-8">
                {formatPrice(product.price)}
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Product Description
                </h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base">
                  {product.details}
                </p>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all">
                Add to Cart
              </button>
              <p className="text-center text-xs font-semibold text-slate-400">
                Secure transaction powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
