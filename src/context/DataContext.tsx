import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category, Subcategory, Item, UserSettings, User } from '../types';

interface DataContextType {
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  subcategories: Subcategory[];
  setSubcategories: React.Dispatch<React.SetStateAction<Subcategory[]>>;
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  currentUser: { username: string } | null;
  login: (username: string, password?: string) => boolean;
  logout: () => void;
  getSubcategoriesByCategoryId: (catId: string) => Subcategory[];
  getItemsBySubcategoryId: (subcatId: string) => Item[];
  getItemsByCategoryId: (catId: string) => Item[];
}

const DataContext = createContext<DataContextType | null>(null);

const DEFAULT_SETTINGS: UserSettings = {
  companyName: "ZacTEK Corp W.L.L",
  companyArabic: "شركة زاك تك كورب ذ.م.م",
  managerName: "Kumar",
  managerRole: "Marketing Manager",
  phone: "+965 60607922",
  email: "zactekaccouts@gmail.com",
  address: "Abdulla Mutlaq Al Musalim Street, Mubarak Commercial Complex 2, Jleeb Al-Shuyoukh, Kuwait"
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Apparel & Garments", description: "Premium quality clothing, shirts, innerwear, and uniforms.", status: 'Active', productCount: 2, views: 1240 },
  { id: "cat-2", name: "Corporate Services", description: "Connecting solutions and business consulting services.", status: 'Active', productCount: 1, views: 520 },
  { id: "cat-3", name: "Environmental Services", description: "Professional sanitization and environmental solutions.", status: 'Active', productCount: 1, views: 340 }
];

const DEFAULT_SUBCATEGORIES: Subcategory[] = [
  { id: "subcat-1", categoryId: "cat-1", name: "Polo T-Shirts", description: "Premium polo shirts and casual wear.", status: 'Active', productCount: 1 },
  { id: "subcat-2", categoryId: "cat-1", name: "Innerwear & Vests", description: "Combed cotton innerwear, briefs, and vests.", status: 'Active', productCount: 1 },
  { id: "subcat-3", categoryId: "cat-2", name: "General Trading", description: "General wholesale items and trading logistics.", status: 'Active', productCount: 0 },
  { id: "subcat-4", categoryId: "cat-3", name: "Sea Shark Services", description: "Specialized waste management and eco-consultancy.", status: 'Active', productCount: 0 }
];

const DEFAULT_ITEMS: Item[] = [
  {
    id: "item-1",
    name: "ONN Premium Polo T-Shirt",
    brand: "ONN Premiums",
    categoryId: "cat-1",
    subcategoryId: "subcat-1",
    price: "Wholesale (Contact for Quote)",
    sku: "ONN-TS-001",
    stock: 450,
    sizes: ["M", "L", "XL", "XXL"],
    status: 'Active',
    description: "High-quality premium polo neck t-shirt. Soft, breathable knit fabric ideal for casual wear, client meetings, and daily comfort. Expertly manufactured for high durability.",
    imageUrl: "/images/polo_tshirt.jpg"
  },
  {
    id: "item-2",
    name: "ONN Premium Men's Vest (3 PC Pack)",
    brand: "ONN Premiums",
    categoryId: "cat-1",
    subcategoryId: "subcat-2",
    price: "Wholesale (Contact for Quote)",
    sku: "ONN-VT-002",
    stock: 800,
    sizes: ["S", "M", "L"],
    status: 'Active',
    description: "100% Combed Cotton premium men's vest. Standard rib knit structure ensures perfect fit, high stretchability, and long-lasting durability. Pack of 3 pieces with free pen inside.",
    imageUrl: "/images/mens_vest.jpg"
  }
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('zactek_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_SETTINGS, ...parsed };
        }
      }
      return DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('zactek_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return DEFAULT_CATEGORIES;
    } catch (e) {
      return DEFAULT_CATEGORIES;
    }
  });

  const [subcategories, setSubcategories] = useState<Subcategory[]>(() => {
    try {
      const saved = localStorage.getItem('zactek_subcategories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return DEFAULT_SUBCATEGORIES;
    } catch (e) {
      return DEFAULT_SUBCATEGORIES;
    }
  });

  const [items, setItems] = useState<Item[]>(() => {
    try {
      const saved = localStorage.getItem('zactek_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return DEFAULT_ITEMS;
    } catch (e) {
      return DEFAULT_ITEMS;
    }
  });

  const [currentUser, setCurrentUser] = useState<{ username: string } | null>(() => {
    try {
      const saved = localStorage.getItem('zactek_session');
      return saved ? JSON.parse(saved) : { username: 'admin' };
    } catch (e) {
      return { username: 'admin' };
    }
  });

  // Fetch initial data from Express API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCat, resSub, resItems, resSettings] = await Promise.all([
          fetch('/api/categories').then(res => res.ok ? res.json() : null).catch(() => null),
          fetch('/api/subcategories').then(res => res.ok ? res.json() : null).catch(() => null),
          fetch('/api/items').then(res => res.ok ? res.json() : null).catch(() => null),
          fetch('/api/settings').then(res => res.ok ? res.json() : null).catch(() => null)
        ]);

        if (resCat && Array.isArray(resCat)) setCategories(resCat);
        if (resSub && Array.isArray(resSub)) setSubcategories(resSub);
        if (resItems && Array.isArray(resItems)) setItems(resItems);
        if (resSettings && typeof resSettings === 'object') setSettings(resSettings);
      } catch (err) {
        console.log('Backend API offline or unreachable, using local state fallback');
      }
    };
    fetchData();
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    if (settings) localStorage.setItem('zactek_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (categories) localStorage.setItem('zactek_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    if (subcategories) localStorage.setItem('zactek_subcategories', JSON.stringify(subcategories));
  }, [subcategories]);

  useEffect(() => {
    if (items) localStorage.setItem('zactek_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('zactek_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('zactek_session');
    }
  }, [currentUser]);

  // Auth Operations
  const login = (username: string) => {
    setCurrentUser({ username });
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const getSubcategoriesByCategoryId = (catId: string) => {
    return subcategories.filter(sc => sc.categoryId === catId);
  };

  const getItemsBySubcategoryId = (subcatId: string) => {
    return items.filter(item => item.subcategoryId === subcatId);
  };

  const getItemsByCategoryId = (catId: string) => {
    return items.filter(item => item.categoryId === catId);
  };

  return (
    <DataContext.Provider value={{
      settings, setSettings,
      categories, setCategories,
      subcategories, setSubcategories,
      items, setItems,
      currentUser, login, logout,
      getSubcategoriesByCategoryId,
      getItemsBySubcategoryId,
      getItemsByCategoryId
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
