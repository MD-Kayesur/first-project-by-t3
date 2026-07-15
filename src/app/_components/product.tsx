/* eslint-disable @next/next/no-img-element */
"use client";

import { type FormEvent, useState, useEffect } from "react";

export type Product = {
  id: number;
  title: string;
  details: string;
  price: number;
  images: string;
};

// Helper to format currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

// Helper to parse image URLs (comma-separated)
const getFirstImage = (imagesStr: string) => {
  if (!imagesStr) return null;
  const urls = imagesStr.split(",").map((url) => url.trim()).filter(Boolean);
  return urls[0] ?? null;
};

// 1. Latest Activity Component
interface LatestProductActivityProps {
  latestProduct: Product | null | undefined;
  isLoading: boolean;
}

export function LatestProductActivity({ latestProduct, isLoading }: LatestProductActivityProps) {
  const imageUrl = latestProduct ? getFirstImage(latestProduct.images) : null;

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform border border-indigo-500/20">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
          Newly Featured Product
        </h2>
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
        </span>
      </div>
      {isLoading ? (
        <p className="mt-3 text-sm text-indigo-200 animate-pulse">Scanning inventory...</p>
      ) : latestProduct ? (
        <div className="mt-4 flex gap-4 items-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={latestProduct.title}
              className="w-16 h-16 rounded-xl object-cover border border-slate-700 bg-slate-800 flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
              📦
            </div>
          )}
          <div className="space-y-1 flex-1 min-w-0">
            <h3 className="text-lg font-bold tracking-tight truncate">{latestProduct.title}</h3>
            <p className="text-indigo-200 text-xs leading-relaxed line-clamp-1 opacity-90">{latestProduct.details}</p>
            <p className="text-emerald-400 font-bold text-sm">{formatPrice(latestProduct.price)}</p>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-indigo-300 italic opacity-85">No recent products listed yet.</p>
      )}
    </div>
  );
}

// 2. Product Form Component
interface ProductFormProps {
  title: string;
  setTitle: (val: string) => void;
  details: string;
  setDetails: (val: string) => void;
  price: string;
  setPrice: (val: string) => void;
  images: string;
  setImages: (val: string) => void;
  editingProduct: Product | null;
  onSubmit: (e: FormEvent, files: File[]) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function ProductForm({
  title,
  setTitle,
  details,
  setDetails,
  price,
  setPrice,
  images,
  setImages,
  editingProduct,
  onSubmit,
  onCancel,
  isPending,
}: ProductFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    setSelectedFiles([]);
    previews.forEach((url) => URL.revokeObjectURL(url));
    setPreviews([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProduct]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]!);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(e, selectedFiles);
    // Clear files locally after submitting
    setSelectedFiles([]);
    setPreviews([]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          {editingProduct ? "✏️ Edit Product Details" : "🛍️ Add New Product"}
        </h2>
        {editingProduct && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            PUT (Replace Mode)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Name</label>
          <input
            type="text"
            placeholder="e.g. Wireless Headset v2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm transition-all text-slate-900 placeholder-slate-400 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price (USD)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="e.g. 99.99"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm transition-all text-slate-900 placeholder-slate-400 focus:outline-none"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Manual Image URLs (comma-separated)</label>
          <input
            type="text"
            placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
            value={images}
            onChange={(e) => setImages(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm transition-all text-slate-900 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5 flex flex-col justify-end">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Or Upload Local Files</label>
          <div className="flex gap-3 items-center">
            <label htmlFor="product-file-upload" className="cursor-pointer border border-dashed border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/20 rounded-xl px-4 py-2.5 bg-slate-50 flex items-center gap-2 transition-all flex-shrink-0">
              <span className="text-sm">📷</span>
              <span className="text-xs font-bold text-slate-600">Select Images</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="product-file-upload"
            />
            
            {/* Previews timeline */}
            <div className="flex gap-1.5 overflow-x-auto py-0.5 flex-1 min-w-0">
              {previews.map((src, idx) => (
                <div key={idx} className="relative w-10 h-10 border border-slate-200 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-0.5 right-0.5 bg-rose-500 hover:bg-rose-600 text-white w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {previews.length === 0 && (
                <span className="text-xs text-slate-400 italic">No files selected</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Description</label>
        <textarea
          placeholder="Describe your product's key specs, warranty, and features..."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm min-h-[100px] transition-all text-slate-900 placeholder-slate-400 focus:outline-none"
          required
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200"
        >
          {isPending ? "Applying modifications..." : editingProduct ? "Save Product Settings" : "List Product"}
        </button>
        {editingProduct && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-sm transition-all border border-slate-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// 3. Product List Component
interface ProductListProps {
  products: Product[] | undefined;
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onPatch: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ProductList({ products, isLoading, onEdit, onPatch, onDelete }: ProductListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm animate-pulse space-y-4">
            <div className="h-32 bg-slate-100 rounded-xl w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            <div className="h-3 bg-slate-150 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center p-12 bg-white border border-dashed border-slate-200 rounded-2xl">
        <span className="text-4xl block mb-2">🏷️</span>
        <p className="text-slate-400 text-sm">No products listed. Add your first inventory item above!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {products.map((product) => {
        const imageUrl = getFirstImage(product.images);

        return (
          <div
            key={product.id}
            className="flex flex-col bg-white border border-slate-150 hover:border-indigo-150 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden"
          >
            {/* Image section */}
            <div className="relative h-44 bg-slate-900 overflow-hidden flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="text-5xl">📦</div>
              )}
              {/* Price Badge */}
              <div className="absolute top-3 right-3 bg-emerald-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-md">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Info section */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors duration-200 line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-slate-600 text-xs mt-1.5 leading-relaxed line-clamp-3">
                  {product.details}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onEdit(product)}
                  className="text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-all"
                >
                  Edit (PUT)
                </button>
                <button
                  onClick={() => onPatch(product.id)}
                  className="text-[11px] font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg transition-all"
                >
                  Rename (PATCH)
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="text-[11px] font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg ml-auto transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
