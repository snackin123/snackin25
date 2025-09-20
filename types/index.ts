export interface CartItem {
  id: string;
  name: string;
  price: number;
  offerPrice?: number;
  quantity: number;
  image?: string;
  // Add other cart item properties as needed
}

export interface CartContextType {
  items: CartItem[];
  total: number;
  discount: number;
  shipping: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, quantity: number) => void;
  clearCart: () => void;
}
