"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { LatestProductActivity, ProductForm, ProductList, type Product } from "~/app/_components/product";

export default function Home() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const utils = api.useUtils();

  // Queries
  const { data: products, isLoading: loadingFeed } = api.product.getAll.useQuery();
  const { data: latestProduct, isLoading: loadingLatest } = api.product.getLatest.useQuery();

  // Helper to refresh all layout data paths
  const refreshData = async () => {
    await utils.product.getAll.invalidate();
    await utils.product.getLatest.invalidate();
    setEditingProduct(null);
    setTitle("");
    setDetails("");
    setPrice("");
    setImages("");
  };

  // Mutations
  const createProduct = api.product.create.useMutation({ onSuccess: refreshData });
  const deleteProduct = api.product.delete.useMutation({ onSuccess: refreshData });
  
  // PUT Mutation
  const updatePut = api.product.updatePut.useMutation({ onSuccess: refreshData });
  
  // PATCH Mutation
  const updatePatch = api.product.updatePatch.useMutation({ onSuccess: refreshData });

  const handleCreateOrPutSubmit = async (e: React.FormEvent, files: File[]) => {
    e.preventDefault();
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert("Please enter a valid price!");
      return;
    }

    setIsUploading(true);
    let finalImages = images;

    try {
      // 1. Handle file upload if files are selected
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file);
        });

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Failed to upload local image files");
        }

        const data = (await res.json()) as { urls: string[] };
        if (data.urls && data.urls.length > 0) {
          const uploadedUrls = data.urls.join(",");
          finalImages = finalImages ? `${finalImages},${uploadedUrls}` : uploadedUrls;
        }
      }

      // 2. Perform tRPC mutation
      if (editingProduct) {
        // PUT requires passing all complete fields
        updatePut.mutate({
          id: editingProduct.id,
          title,
          details,
          price: parsedPrice,
          images: finalImages,
        });
      } else {
        createProduct.mutate({
          title,
          details,
          price: parsedPrice,
          images: finalImages,
        });
      }
    } catch (err) {
      console.error("🔴 Product listing submission failed:", err);
      alert("An error occurred while uploading images. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePatchTitleOnly = (id: number) => {
    const newTitle = prompt("Enter new product title:");
    if (!newTitle) return;
    // PATCH allows sending just the title field; other fields remain untouched
    updatePatch.mutate({ id, title: newTitle });
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setDetails(product.details);
    setPrice(product.price.toString());
    setImages(product.images);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setTitle("");
    setDetails("");
    setPrice("");
    setImages("");
  };

  return (
    <main className="p-8 max-w-4xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          🏪 Product Management Catalog
        </h1>
        <p className="text-sm text-slate-500">
          A secure dashboard demonstrating PUT and PATCH endpoints bound to a Neon PostgreSQL database.
        </p>
      </div>

      {/* LATEST PRODUCT BANNER */}
      <LatestProductActivity latestProduct={latestProduct} isLoading={loadingLatest} />

      {/* PRODUCT FORM */}
      <ProductForm
        title={title}
        setTitle={setTitle}
        details={details}
        setDetails={setDetails}
        price={price}
        setPrice={setPrice}
        images={images}
        setImages={setImages}
        editingProduct={editingProduct}
        onSubmit={handleCreateOrPutSubmit}
        onCancel={handleCancelEdit}
        isPending={createProduct.isPending || updatePut.isPending || isUploading}
      />

      {/* PRODUCT LIST GRID */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Current Inventory Catalog</h2>
        <ProductList
          products={products}
          isLoading={loadingFeed}
          onEdit={startEdit}
          onPatch={handlePatchTitleOnly}
          onDelete={(id) => deleteProduct.mutate({ id })}
        />
      </div>
    </main>
  );
}
