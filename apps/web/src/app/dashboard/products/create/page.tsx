"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/axios";
import { ProductCategory } from "@/types/product";

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [priceIdr, setPriceIdr] = useState<number>(0);
  const [stock, setStock] = useState<number>(10);
  const [categoryId, setCategoryId] = useState("");
  const [sku, setSku] = useState("");
  const [badge, setBadge] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get<ProductCategory[]>("/categories");
        setCategories(res.data);
        if (res.data.length > 0) {
          setCategoryId(res.data[0].id);
        }
      } catch {
        toast.error("Gagal memuat kategori");
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, "-")) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !slug || !description || !categoryId || priceIdr <= 0) {
      toast.error("Harap lengkapi semua field yang wajib");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/products", {
        name,
        slug,
        description,
        priceIdr: Number(priceIdr),
        stock: Number(stock),
        categoryId,
        sku: sku.trim() || undefined,
        badge: badge.trim() || undefined,
        imageUrls: [],
        isActive: true,
      });

      toast.success("Produk baru berhasil ditambahkan! 🎉");
      router.push("/dashboard/products");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal membuat produk";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF6] p-6 sm:p-10 space-y-8">
      {/* Top Header */}
      <div className="max-w-3xl mx-auto flex justify-between items-center pb-6 border-b border-[#EAE5D9]">
        <div>
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link href="/dashboard" className="hover:text-[#0053F1]">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/dashboard/products" className="hover:text-[#0053F1]">
              Produk
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Tambah</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Tambah Produk <span className="text-[#0053F1]">Baru</span>
          </h1>
        </div>
        <Link
          href="/dashboard/products"
          className="text-xs font-semibold text-gray-600 hover:text-gray-900"
        >
          ← Batal
        </Link>
      </div>

      <div className="max-w-3xl mx-auto bg-white border border-[#EAE5D9] rounded-3xl p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
                Nama Produk *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Contoh: Aero Glide Pro 2"
                required
                className="w-full bg-[#FCFBF6] border border-[#EAE5D9] rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0053F1]/30 focus:border-[#0053F1]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
                Slug URL *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="aero-glide-pro-2"
                required
                className="w-full bg-[#FCFBF6] border border-[#EAE5D9] rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0053F1]/30 focus:border-[#0053F1]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
              Deskripsi Produk *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi detail spesifikasi dan keunggulan sepatu..."
              rows={4}
              required
              className="w-full bg-[#FCFBF6] border border-[#EAE5D9] rounded-2xl p-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0053F1]/30 focus:border-[#0053F1]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
                Harga (IDR) *
              </label>
              <input
                type="number"
                value={priceIdr || ""}
                onChange={(e) => setPriceIdr(Math.max(0, parseInt(e.target.value, 10) || 0))}
                placeholder="850000"
                min="1000"
                required
                className="w-full bg-[#FCFBF6] border border-[#EAE5D9] rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0053F1]/30 focus:border-[#0053F1]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
                Jumlah Stok Awal *
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Math.max(0, parseInt(e.target.value, 10) || 0))}
                min="0"
                required
                className="w-full bg-[#FCFBF6] border border-[#EAE5D9] rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0053F1]/30 focus:border-[#0053F1]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
                Kategori *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={loadingCategories}
                className="w-full bg-[#FCFBF6] border border-[#EAE5D9] rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0053F1]/30 focus:border-[#0053F1]"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
                SKU (Opsional)
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Contoh: SNK-AGP-002"
                className="w-full bg-[#FCFBF6] border border-[#EAE5D9] rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0053F1]/30 focus:border-[#0053F1]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block">
                Badge / Tag (Opsional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Contoh: Best Seller / New"
                className="w-full bg-[#FCFBF6] border border-[#EAE5D9] rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0053F1]/30 focus:border-[#0053F1]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#EAE5D9] flex justify-end gap-3">
            <Link
              href="/dashboard/products"
              className="px-6 py-3 rounded-full border border-[#EAE5D9] text-xs font-semibold text-gray-600 hover:bg-[#F6F3EC] transition-all"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 rounded-full bg-[#0053F1] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
            >
              {submitting ? "Menyimpan..." : "Simpan Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

