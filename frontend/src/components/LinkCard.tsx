import { useState } from 'react';
import type { Link as LinkType } from '../types';
import { linkService } from '../services/api';
import { ExternalLink, Star, Edit2, Trash2, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

interface LinkCardProps {
  link: LinkType;
  onUpdate: () => void;
  onEdit: (link: LinkType) => void;
}

export function LinkCard({ link, onUpdate, onEdit }: LinkCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = async () => {
    await linkService.incrementClicks(link.id);
    window.open(link.url, '_blank');
    onUpdate();
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await linkService.toggleFavorite(link.id);
      onUpdate();
      toast.success(link.isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch {
      toast.error('Failed to update favorite');
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this link?')) return;

    setIsDeleting(true);
    try {
      await linkService.delete(link.id);
      onUpdate();
      toast.success('Link deleted');
    } catch {
      toast.error('Failed to delete link');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
      <div className="card-body p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0" onClick={handleClick}>
            <h3 className="card-title text-base truncate">{link.title}</h3>
            <p className="text-sm text-base-content/60 truncate">{link.url}</p>
            {link.description && (
              <p className="text-sm mt-1 line-clamp-2">{link.description}</p>
            )}
          </div>
          <button
            onClick={handleFavorite}
            className={`btn btn-ghost btn-sm btn-circle ${link.isFavorite ? 'text-warning' : ''}`}
          >
            <Star className={`w-4 h-4 ${link.isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-base-200">
          <div className="flex items-center gap-2">
            {link.category && (
              <span
                className="badge badge-sm"
                style={{ backgroundColor: link.category.color, color: 'white' }}
              >
                {link.category.name}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-base-content/60">
              <BarChart3 className="w-3 h-3" />
              {link.clicks} clicks
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={handleClick}
              className="btn btn-ghost btn-xs btn-circle"
              title="Open link"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(link);
              }}
              className="btn btn-ghost btn-xs btn-circle"
              title="Edit"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn btn-ghost btn-xs btn-circle text-error"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
