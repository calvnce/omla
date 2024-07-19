// lib/defs.ts
export interface ProductImage {
    id: number;
    image: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    images: ProductImage[];
    price: number;
    discount: number;
    artisan_id: number;
    created_at: string;
    updated_at: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Cart {
    [key: number]: CartItem;
}

export interface OrderLine {
    id: number;
    product_id: number;
    name:string;
    quantity: number;
    image:string;
    total_price: number;
    status: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface Order {
    id: string;
    customer_id: number;
    status: string;
    order_total: number;
    ordered_at: string;
    updated_at: string;
    order_lines: OrderLine[];
  }
  
  export interface OrderListResponse {
    orders: Order[];
    total: number;
    page: number;
    page_size: number;
  }
  
  export interface ProductListResponse {
    products: Product[];
    total: number;
    page: number;
    page_size: number;
  }
  