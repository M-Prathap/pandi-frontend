import { useCallback, useEffect, useState } from 'react';
import api, { unwrap } from '../../services/api';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Flash from '../../components/admin/Flash';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', slug: '', order: 0 });
  const [editingId, setEditingId] = useState(null);
  const [flash, setFlash] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = useCallback(async () => {
    const res = await api.get('/categories');
    setCategories(unwrap(res) || []);
  }, []);

  useEffect(() => {
    load().catch(() => setCategories([]));
  }, [load]);

  const reset = () => {
    setForm({ name: '', slug: '', order: 0 });
    setEditingId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
      order: Number(form.order) || 0,
    };
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, payload);
        setFlash('Category updated');
      } else {
        await api.post('/categories', payload);
        setFlash('Category created');
      }
      reset();
      await load();
    } catch (err) {
      setFlash(err.response?.data?.message || 'Save failed');
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ name: cat.name, slug: cat.slug, order: cat.order ?? 0 });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await api.delete(`/categories/${pendingDelete._id}`);
      setFlash('Category deleted');
      setPendingDelete(null);
      await load();
    } catch (err) {
      setFlash(err.response?.data?.message || 'Delete failed');
      setPendingDelete(null);
    }
  };

  return (
    <>
      <div className="topbar">
        <h1>Categories</h1>
      </div>
      <div className="main">
        <Flash message={flash} onClear={() => setFlash('')} />
        <form className="form-grid two" onSubmit={onSubmit} style={{ marginBottom: '1.5rem' }}>
          <label className="field">
            Name
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>
          <label className="field">
            Slug
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            />
          </label>
          <label className="field">
            Order
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
            />
          </label>
          <div className="btn-row" style={{ alignItems: 'end' }}>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update' : 'Add category'}
            </button>
            {editingId && (
              <button type="button" className="btn" onClick={reset}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Order</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td>{cat.name}</td>
                  <td>{cat.slug}</td>
                  <td>{cat.order}</td>
                  <td>
                    <div className="actions">
                      <button type="button" className="btn" onClick={() => startEdit(cat)}>
                        Edit
                      </button>
                      <button type="button" className="btn btn-danger" onClick={() => setPendingDelete(cat)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete category?"
        message={`Delete “${pendingDelete?.name}”?`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
