'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/database';
import ProductCard from '@/components/products/ProductCard';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  X, 
  Star, 
  Clock, 
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Heart,
  Eye,
  Grid,
  List,
  LayoutGrid,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import { Range } from "react-range";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  parent_id: string | null;
}

type ViewMode = "grid" | "list" | "masonry";

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [condition, setCondition] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  
  // 3D effect for category header
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-100, 100], [30, -30]);
  const rotateY = useTransform(mouseX, [-100, 100], [-30, 30]);

  // Smooth spring animation for 3D effect
  const springConfig = { damping: 25, stiffness: 700 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchCategory();
  }, [slug]);
  
  useEffect(() => {
    if (category) {
      fetchProducts();
    }
  }, [category, searchQuery, priceRange, condition, sortBy]);
  
  const fetchCategory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (error) throw error;
      setCategory(data);
    } catch (err) {
      console.error('Error fetching category:', err);
      setError('Failed to load category');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchProducts = async () => {
    if (!category) return;

    try {
      setLoading(true);
      let query = supabase
        .from("products")
        .select("*")
        .eq("category_id", category.id);

      // Apply search filter
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Apply price range filter
      query = query.gte("price", priceRange[0]).lte("price", priceRange[1]);

      // Apply condition filter
      if (condition) {
        query = query.eq("condition", condition);
      }

      // Apply color filter
      if (selectedColors.length > 0) {
        query = query.contains("colors", selectedColors);
      }

      // Apply sorting
      switch (sortBy) {
        case "price_asc":
          query = query.order("price", { ascending: true });
          break;
        case "price_desc":
          query = query.order("price", { ascending: false });
          break;
        case "popular":
          query = query.order("views", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            {/* Category Header Skeleton */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              <div>
                <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
            </div>

            {/* Search Bar Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="mt-2 flex items-center space-x-2">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header with 3D Effect */}
      <motion.div
        className="relative bg-white shadow-sm"
        style={{
          perspective: 1000,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          mouseX.set(e.clientX - rect.left - rect.width / 2);
          mouseY.set(e.clientY - rect.top - rect.height / 2);
        }}
        onMouseLeave={() => {
          mouseX.set(0);
          mouseY.set(0);
        }}
      >
        <motion.div
          className="container mx-auto px-4 py-8"
          style={{
            rotateX: springRotateX,
            rotateY: springRotateY,
          }}
        >
          <div className="flex items-center space-x-4">
            {category?.icon_url && (
              <Image
                src={category.icon_url}
                alt={category.name}
                width={48}
                height={48}
                className="rounded-lg"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{category?.name}</h1>
              <p className="text-gray-600">{category?.description}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="container mx-auto px-4 py-6">
        {/* Sort and View Options */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
            <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Showing {products.length} products
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Price Range</h3>
                <Range
                  step={1}
                  min={0}
                  max={1000}
                  values={priceRange}
                  onChange={(values: number[]) => setPriceRange(values)}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="h-1 w-full bg-gray-200 rounded-full"
                    >
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{
                          width: `${((priceRange[1] - priceRange[0]) / 1000) * 100}%`,
                          left: `${(priceRange[0] / 1000) * 100}%`,
                        }}
                      />
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div
                      {...props}
                      className="h-4 w-4 bg-white border-2 border-blue-600 rounded-full shadow-sm"
                    />
                  )}
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Condition</h3>
                <div className="space-y-2">
                  {["new", "like_new", "good", "fair", "poor"].map((c) => (
                    <label key={c} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="condition"
                        value={c}
                        checked={condition === c}
                        onChange={(e) => setCondition(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{c.replace("_", " ")}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {["red", "blue", "green", "yellow", "purple", "pink", "black", "white"].map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColors((prev) =>
                          prev.includes(color)
                            ? prev.filter((c) => c !== color)
                            : [...prev, color]
                        );
                      }}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColors.includes(color)
                          ? "border-blue-600 ring-2 ring-blue-200"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Location</h3>
                <div className="space-y-2">
                  {["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ"].map((location) => (
                    <label key={location} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <span className="text-sm text-gray-700">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Shipping Options */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Shipping Options</h3>
                <div className="space-y-2">
                  {["Fast", "Standard", "Free"].map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                layout
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className={`relative group ${
                      viewMode === "list" ? "flex items-center space-x-4" : ""
                    }`}
                  >
                    <div className={`relative overflow-hidden rounded-lg bg-white shadow-sm ${
                      viewMode === "list" ? "w-48 h-48" : "aspect-square"
                    }`}>
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
                    </div>
                    <div className={`${viewMode === "list" ? "flex-1" : "mt-4"}`}>
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-gray-600 mt-1">{product.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xl font-bold text-blue-600">${product.price}</span>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <Heart size={20} />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <Eye size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {!loading && products.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {[...Array(Math.ceil(products.length / itemsPerPage))].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(products.length / itemsPerPage), p + 1))}
                    disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 