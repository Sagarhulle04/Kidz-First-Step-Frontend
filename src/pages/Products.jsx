import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../services/axiosConfig";
import { allProducts } from "../store/productSlice";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";

const categories = [
  { value: "soft-toys", label: "Soft Toys" },
  { value: "musical-toys", label: "Musical Toys" },
  { value: "best-seller", label: "Best Seller" },
  { value: "new-arrival", label: "New Arrival" },
  { value: "learning-toys", label: "Learning Toys" },
];

const brands = [
  { value: "satishsea", label: "Satish Sea" },
  { value: "snehalsea", label: "Snehal Sea" },
  { value: "rushsea", label: "Rush Sea" },
  { value: "anikitasea", label: "Anikita Sea" },
  { value: "purnavsea", label: "Purnav Sea" },
];

const Products = () => {
  const dispatch = useDispatch();
  const rawProducts = useSelector((store) => store.product.allProducts) || [];
  const user = useSelector((store) => store.user);
  const isAdmin = user?.role === "admin";

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // Modal State for Add Product
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryPrice, setCategoryPrice] = useState("");
  const [brandPrice, setBrandPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Modal State for Edit Product
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState("");
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const [editCategoryPrice, setEditCategoryPrice] = useState("");
  const [editBrandPrice, setEditBrandPrice] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [editSubmitLoading, setEditSubmitLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/allProducts");
      dispatch(allProducts(res.data.products));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !category || !brand || !categoryPrice || !brandPrice || !quantity || !imageFile) {
      return toast.error("All fields are required");
    }

    try {
      setSubmitLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("brand", brand);
      formData.append("categoryPrice", categoryPrice);
      formData.append("brandPrice", brandPrice);
      formData.append("quantity", quantity);
      formData.append("file", imageFile);

      await axios.post("/addProduct", formData);
      toast.success("Product Added Successfully!");
      setIsModalOpen(false);
      // Reset form
      setName("");
      setCategory("");
      setBrand("");
      setCategoryPrice("");
      setBrandPrice("");
      setQuantity("");
      setImageFile(null);
      // Refresh list
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`/deleteProduct/${productId}`);
      toast.success("Product Deleted Successfully");
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const handleOpenEditModal = (product) => {
    setEditProductId(product._id);
    setEditName(product.name);
    setEditCategory(product.category);
    setEditBrand(product.brand);
    setEditCategoryPrice(product.categoryPrice);
    setEditBrandPrice(product.brandPrice);
    setEditQuantity(product.quantity);
    setEditImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editName || !editCategory || !editBrand || !editCategoryPrice || !editBrandPrice || editQuantity === "") {
      return toast.error("All fields except image are required");
    }

    try {
      setEditSubmitLoading(true);
      const formData = new FormData();
      formData.append("name", editName);
      formData.append("category", editCategory);
      formData.append("brand", editBrand);
      formData.append("categoryPrice", editCategoryPrice);
      formData.append("brandPrice", editBrandPrice);
      formData.append("quantity", editQuantity);
      if (editImageFile) {
        formData.append("file", editImageFile);
      }

      await axios.put(`/updateProduct/${editProductId}`, formData);
      toast.success("Product Updated Successfully!");
      setIsEditModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setEditSubmitLoading(false);
    }
  };

  // Filter & Sort logic
  const filteredProducts = rawProducts
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;
      return matchesSearch && matchesCategory && matchesBrand;
    })
    .sort((a, b) => {
      if (sortOrder === "price-asc") {
        return Number(a.categoryPrice) - Number(b.categoryPrice);
      }
      if (sortOrder === "price-desc") {
        return Number(b.categoryPrice) - Number(a.categoryPrice);
      }
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Our Toys Catalogue</h1>
          <p className="text-gray-500 mt-1">Explore all premium toys curated for kids' first steps</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition cursor-pointer flex items-center gap-2"
          >
            + Add New Product
          </button>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-xs font-semibold text-gray-400 uppercase mb-1">Search</label>
          <input
            id="search"
            type="text"
            placeholder="Search toy by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="filter-category" className="block text-xs font-semibold text-gray-400 uppercase mb-1">Category</label>
          <select
            id="filter-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-brand" className="block text-xs font-semibold text-gray-400 uppercase mb-1">Brand</label>
          <select
            id="filter-brand"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-sort" className="block text-xs font-semibold text-gray-400 uppercase mb-1">Sort By Price</label>
          <select
            id="filter-sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-lg font-medium">No toys found matching your filters.</p>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isAdmin={isAdmin}
              user={user}
              onDelete={handleDeleteProduct}
              onEdit={handleOpenEditModal}
            />
          ))}
        </div>
      )}

      {/* Add Product Modal (Admin only) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-5">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label htmlFor="modal-name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  id="modal-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter toy name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="modal-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    id="modal-category"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="" disabled>Select</option>
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="modal-brand" className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <select
                    id="modal-brand"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="" disabled>Select</option>
                    {brands.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="modal-catprice" className="block text-sm font-medium text-gray-700 mb-1">Category Price (₹)</label>
                  <input
                    id="modal-catprice"
                    type="number"
                    required
                    value={categoryPrice}
                    onChange={(e) => setCategoryPrice(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 599"
                  />
                </div>

                <div>
                  <label htmlFor="modal-brandprice" className="block text-sm font-medium text-gray-700 mb-1">Brand Price (₹)</label>
                  <input
                    id="modal-brandprice"
                    type="number"
                    required
                    value={brandPrice}
                    onChange={(e) => setBrandPrice(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 799"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="modal-qty" className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    id="modal-qty"
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 50"
                  />
                </div>

                <div>
                  <label htmlFor="modal-image" className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <input
                    id="modal-image"
                    type="file"
                    required
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition cursor-pointer"
                  disabled={submitLoading}
                >
                  {submitLoading ? "Uploading..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Product Modal (Admin only) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-5">Edit Product</h2>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label htmlFor="edit-modal-name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  id="edit-modal-name"
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter toy name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-modal-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    id="edit-modal-category"
                    required
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="" disabled>Select</option>
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-modal-brand" className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <select
                    id="edit-modal-brand"
                    required
                    value={editBrand}
                    onChange={(e) => setEditBrand(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="" disabled>Select</option>
                    {brands.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-modal-catprice" className="block text-sm font-medium text-gray-700 mb-1">Category Price (₹)</label>
                  <input
                    id="edit-modal-catprice"
                    type="number"
                    required
                    value={editCategoryPrice}
                    onChange={(e) => setEditCategoryPrice(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 599"
                  />
                </div>

                <div>
                  <label htmlFor="edit-modal-brandprice" className="block text-sm font-medium text-gray-700 mb-1">Brand Price (₹)</label>
                  <input
                    id="edit-modal-brandprice"
                    type="number"
                    required
                    value={editBrandPrice}
                    onChange={(e) => setEditBrandPrice(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 799"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-modal-qty" className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    id="edit-modal-qty"
                    type="number"
                    required
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 50"
                  />
                </div>

                <div>
                  <label htmlFor="edit-modal-image" className="block text-sm font-medium text-gray-700 mb-1">Product Image (optional)</label>
                  <input
                    id="edit-modal-image"
                    type="file"
                    onChange={(e) => setEditImageFile(e.target.files[0])}
                    className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  disabled={editSubmitLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition cursor-pointer"
                  disabled={editSubmitLoading}
                >
                  {editSubmitLoading ? "Updating..." : "Update Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
