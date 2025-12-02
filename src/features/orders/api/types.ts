export type ApiCartProduct = {
  productId: number;
  quantity: number;
};

export type ApiCart = {
  id: number;
  userId: number;
  date: string;
  products: ApiCartProduct[];
};

export type Order = {
  id: number;
  userId: number;
  date: string;
  itemsCount: number; // تعداد آیتم‌ها (چند محصول مختلف)
  totalQuantity: number; // مجموع تعداد (جمع quantityها)
};
