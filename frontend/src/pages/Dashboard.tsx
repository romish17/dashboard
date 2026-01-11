import { useState, useEffect } from 'react';
import type { Link as LinkType, Category } from '../types';
import { linkService, categoryService } from '../services/api';
import { LinkCard } from '../components/LinkCard';
import { LinkModal } from '../components/LinkModal';
import { Plus, Search, Star, FolderOpen } from 'lucide-react';

export function Dashboard() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkType | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadLinks();
  }, [selectedCategory, showFavorites, search]);

  const loadData = async () => {
    try {
      const [linksData, categoriesData] = await Promise.all([
        linkService.getAll(),
        categoryService.getAll(),
      ]);
      setLinks(linksData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLinks = async () => {
    try {
      const params: { categoryId?: number; favorite?: boolean; search?: string } = {};
      if (selectedCategory) params.categoryId = Number(selectedCategory);
      if (showFavorites) params.favorite = true;
      if (search) params.search = search;

      const data = await linkService.getAll(params);
      setLinks(data);
    } catch (error) {
      console.error('Failed to load links:', error);
    }
  };

  const handleEdit = (link: LinkType) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingLink(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">My Links</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="input input-bordered flex items-center gap-2">
            <Search className="w-4 h-4 opacity-70" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search links..."
              className="grow"
            />
          </label>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : '')}
          className="select select-bordered w-full md:w-48"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={`btn ${showFavorites ? 'btn-warning' : 'btn-outline'}`}
        >
          <Star className={`w-4 h-4 ${showFavorites ? 'fill-current' : ''}`} />
          Favorites
        </button>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-semibold mb-2">No links found</h3>
          <p className="text-base-content/60 mb-4">
            {search || selectedCategory || showFavorites
              ? 'Try adjusting your filters'
              : 'Start by adding your first link'}
          </p>
          {!search && !selectedCategory && !showFavorites && (
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Add your first link
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onUpdate={loadLinks}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      <LinkModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={loadLinks}
        link={editingLink}
      />
    </div>
  );
}
