export interface Product {
  id: string;
  name: string;
  flavor: string;
  offerPrice?: string;
  category: string;
  color: string;
  image: string;
  hoverImage: string;
  inStock?: boolean;
  rating?: number;
  description?: string;
  originalPrice?: string;
  weight?: string;
  numReviews?: number;
}

export interface CartItem extends Omit<Product, 'offerPrice' | 'originalPrice'> {
  price: number;
  quantity: number;
}

export const products: Product[] = [
  {
    "id": "1",
    "name": "Chocolate Flavoured Raisins (100gm)",
    "flavor": "Chocolate",
    "originalPrice": "₹129",

    "category": "Chocolate",
    "color": "#6D2D1D",
    "image": "Images/Plastic_Pouch_6.avif",
    "hoverImage": "Images/bg-Chocolate Flavoured Raisins.avif"
  },
  {
    "id": "2",
    "name": "Paan Flavoured Raisins (100gm)",
    "flavor": "Paan",
    "originalPrice": "₹129",

    "category": "Paan",
    "color": "#63BF7E",
    "image": "Images/Plastic_Pouch_1.avif",
    "hoverImage": "Images/bg-Paan Flavoured Raisins.avif",
    "inStock": false
  },
  {
    "id": "3",
    "name": "Rose Flavoured Raisins (100gm)",
    "flavor": "Rose",
    "originalPrice": "₹129",

    "category": "Rose",
    "color": "#F081B4",
    "image": "Images/Plastic_Pouch_2.avif",
    "hoverImage": "Images/bg-Rose Flavoured Raisins.avif",
    "inStock": false
  },
  {
    "id": "4",
    "name": "Cranberry Raisins Flavoured (100gm)",
    "flavor": "Cranberry",
    "originalPrice": "₹129",

    "category": "Cranberry",
    "color": "#EA4965",
    "image": "Images/Plastic_Pouch_3.avif",
    "hoverImage": "Images/crannberrybg.avif"
  },
  {
    "id": "5",
    "name": "Chatpata Flavoured Raisins (100gm)",
    "flavor": "Chatpata",
    "originalPrice": "₹129",

    "category": "Chatpata",
    "color": "#C42126",
    "image": "Images/Plastic_Pouch_4.avif",
    "hoverImage": "Images/bg-Chatpata Flavoured Raisins.avif"
  },
  {
    "id": "6",
    "name": "Spicy Chilli Guava Flavoured Raisins (100gm)",
    "flavor": "Chilli Guava",
    "originalPrice": "₹129",

    "category": "Chilli Guava",
    "color": "#8CB03E",
    "image": "Images/Plastic_Pouch_5.avif",
    "hoverImage": "Images/bg-Spicy Chilli Guava Flavoured Raisins.avif"
  }
];

export default products;