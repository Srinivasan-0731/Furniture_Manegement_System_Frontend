import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";
import api from "../utils/api";

const emptyForm = { name: "", category: "", price: "", stock: "", description: "", image: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const fetchProducts = (p = 1) => {
    api
      .get(`/products?page=${p}`)
      .then((res) => {
        const data = res.data.data || res.data;
        setProducts(data.items || data);
        setTotalPages(data.totalPages || 1);
        setPage(p);
      })
      .catch(() => setError("Could not load products"));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      category: typeof p.category === "object" && p.category !== null ? p.category.name : p.category,
      price: p.price,
      stock: p.stock,
      description: p.description,
      image: p.image || "",
    });
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
      } else {
        await api.post("/products", form);
      }
      setModalOpen(false);
      fetchProducts(page);
    } catch {
      setError("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    fetchProducts(page);
  };

  return (
    <div className="flex bg-orange-50/30 min-h-screen">
      <Sidebar />
      <main className="flex-1 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <button
            onClick={openCreate}
            className="px-5 py-2 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition"
          >
            + Add Product
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-orange-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-orange-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {typeof p.category === "object" && p.category !== null
                      ? p.category.name
                      : p.category}
                  </td>
                  <td className="px-4 py-3 text-gray-900">₹{p.price}</td>
                  <td className="px-4 py-3 text-gray-500">{p.stock}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(p)} className="text-orange-500 font-medium">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-500 font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-gray-400">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={fetchProducts} />
      </main>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Product" : "Add Product"}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" placeholder="Name" required value={form.name} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <input name="category" placeholder="Category" required value={form.category} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <div className="grid grid-cols-2 gap-3">
            <input name="price" type="number" placeholder="Price" required value={form.price} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            <input name="stock" type="number" placeholder="Stock" required value={form.stock} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <textarea name="description" placeholder="Description" rows="3" value={form.description} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <button type="submit" className="w-full py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition">
            {editingId ? "Update" : "Create"}
          </button>
        </form>
      </Modal>
    </div>
  );
}