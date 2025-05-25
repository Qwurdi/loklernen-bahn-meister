
import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/admin-store';
import { Category } from '../../types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Save, X, FolderTree } from 'lucide-react';

export const CategoryManager2: React.FC = () => {
  const { categories, loadCategories, execute } = useAdminStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    parent_category: '',
    description: '',
    icon: '',
    color: ''
  });

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const categoriesList = Object.values(categories);

  const handleCreate = async () => {
    await execute({
      type: 'CATEGORY_CREATE',
      payload: {
        ...formData,
        sort_order: categoriesList.length,
        is_active: true,
        requires_auth: false
      }
    });
    
    setShowCreateForm(false);
    setFormData({ name: '', parent_category: '', description: '', icon: '', color: '' });
  };

  const handleUpdate = async (id: string) => {
    await execute({
      type: 'CATEGORY_UPDATE',
      payload: { id, data: formData }
    });
    
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Sind Sie sicher, dass Sie diese Kategorie löschen möchten?')) {
      await execute({
        type: 'CATEGORY_DELETE',
        payload: { id }
      });
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      parent_category: category.parent_category,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kategorien verwalten</h1>
          <p className="text-gray-600">Organisieren Sie Ihre Fragenkategorien</p>
        </div>
        
        <Button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#3F00FF] to-[#0F52BA]"
        >
          <Plus size={16} />
          Neue Kategorie
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Neue Kategorie erstellen</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateForm(false)}
            >
              <X size={16} />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            
            <Input
              placeholder="Übergeordnete Kategorie"
              value={formData.parent_category}
              onChange={(e) => setFormData(prev => ({ ...prev, parent_category: e.target.value }))}
            />
            
            <Input
              placeholder="Icon (z.B. signal)"
              value={formData.icon}
              onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
            />
            
            <Input
              placeholder="Farbe (z.B. #3F00FF)"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
            />
            
            <div className="md:col-span-2">
              <Textarea
                placeholder="Beschreibung"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowCreateForm(false)}
            >
              Abbrechen
            </Button>
            <Button onClick={handleCreate}>
              <Save size={16} className="mr-2" />
              Erstellen
            </Button>
          </div>
        </Card>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesList.map((category) => (
          <Card key={category.id} className="p-6">
            {editingId === category.id ? (
              // Edit Mode
              <div className="space-y-4">
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Name"
                />
                
                <Input
                  value={formData.parent_category}
                  onChange={(e) => setFormData(prev => ({ ...prev, parent_category: e.target.value }))}
                  placeholder="Übergeordnete Kategorie"
                />
                
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Beschreibung"
                  rows={2}
                />
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingId(null)}
                  >
                    <X size={14} />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleUpdate(category.id)}
                  >
                    <Save size={14} />
                  </Button>
                </div>
              </div>
            ) : (
              // View Mode
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {category.icon ? (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#3F00FF] to-[#0F52BA] flex items-center justify-center text-white text-sm">
                        {category.icon.slice(0, 2).toUpperCase()}
                      </div>
                    ) : (
                      <FolderTree size={20} className="text-gray-400" />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.parent_category}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(category)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                
                {category.description && (
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                )}
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className={`px-2 py-1 rounded ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {category.is_active ? 'Aktiv' : 'Inaktiv'}
                  </span>
                  {category.requires_auth && (
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">
                      Login erforderlich
                    </span>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {categoriesList.length === 0 && (
        <div className="text-center py-12">
          <FolderTree size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Kategorien vorhanden</h3>
          <p className="text-gray-500 mb-6">Erstellen Sie Ihre erste Kategorie</p>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-[#3F00FF] to-[#0F52BA]"
          >
            Neue Kategorie erstellen
          </Button>
        </div>
      )}
    </div>
  );
};
