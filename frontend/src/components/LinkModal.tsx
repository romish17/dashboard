import { useState, useEffect } from 'react';
import type { Link, Category } from '../types';
import { linkService, categoryService } from '../services/api';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  link?: Link | null;
}

export function LinkModal({ isOpen, onClose, onSuccess, link }: LinkModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      if (link) {
        setTitle(link.title);
        setUrl(link.url);
        setDescription(link.description || '');
        setCategoryId(link.categoryId || '');
      } else {
        resetForm();
      }
    }
  }, [isOpen, link]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch {
      console.error('Failed to load categories');
    }
  };

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setDescription('');
    setCategoryId('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        title,
        url,
        description: description || undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
      };

      if (link) {
        await linkService.update(link.id, data);
        toast.success('Link updated');
      } else {
        await linkService.create(data);
        toast.success('Link created');
      }

      onSuccess();
      onClose();
    } catch {
      toast.error('Failed to save link');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          <X className="w-4 h-4" />
        </button>
        <h3 className="font-bold text-lg mb-4">
          {link ? 'Edit Link' : 'Add New Link'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered"
              placeholder="My awesome link"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">URL</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input input-bordered"
              placeholder="https://example.com"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered"
              placeholder="Optional description"
              rows={2}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
              className="select select-bordered"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn btn-primary">
              {isLoading && <span className="loading loading-spinner loading-sm"></span>}
              {link ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
