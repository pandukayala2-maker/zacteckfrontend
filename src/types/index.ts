export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  status: 'Active' | 'Inactive';
  productCount?: number;
  views?: number;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  productCount?: number;
  status: 'Active' | 'Inactive';
}

export interface Item {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  subcategoryId: string;
  price: string;
  sku: string;
  stock: number;
  sizes: string[];
  status: 'Active' | 'Inactive';
  description: string;
  imageUrl: string;
}

export interface UserSettings {
  companyName: string;
  companyArabic: string;
  phone: string;
  email: string;
  address: string;
  managerName: string;
  managerRole: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  designation: string;
  role: 'Administrator' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive';
  avatarColor?: string;
  password?: string;
}

export interface DataContextType {
  categories: Category[];
  subcategories: Subcategory[];
  items: Item[];
  settings: UserSettings;
  users: User[];
  currentUser: User | null;
  addCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updated: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addSubcategory: (subcategory: Omit<Subcategory, 'id'>) => Subcategory;
  updateSubcategory: (id: string, updated: Partial<Subcategory>) => void;
  deleteSubcategory: (id: string) => void;
  addItem: (item: Omit<Item, 'id'>) => Item;
  updateItem: (id: string, updated: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  addUser: (user: Omit<User, 'id'>) => User;
  updateUser: (id: string, updated: Partial<User>) => void;
  deleteUser: (id: string) => void;
  login: (username: string) => boolean;
  logout: () => void;
}
