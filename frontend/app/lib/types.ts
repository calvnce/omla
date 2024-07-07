/**
 * This file contains the type definitions of the data consumed by the application.
 * It describes the shape of the data, and what data type each property should accept.
 * 
 * There are two different definitions of Artisan and Product data models because the data sent from the
 * client to the server is different from what the server responds with, specifically the image
 * types which are processed by the server and served back to the client as base64 encoded
 * strings.
 * 
 * Also, there are other additional properties such as creation date that is processed by the
 * server and returned to the client as part of the model data. This design, however, has not taken
 * into consideration the latter.
 */

// User data type definition
export type User = {
    id: number;
    username: string;
    email: string;
    password: string;
};

// Customer data type definition
export type Customer = {
    id: number;
    name: string;
    address: string;
    phone: string;
};

// Artisan data type definition (server response)
export type Artisan = {
    id: number;
    bio: string;
    firstname: string;
    lastname: string;
    address: string;
    phone: string;
    avatar: string; // base64 encoded string
};

// Artisan data type definition (client upload)
export type ArtisanUpload = {
    id: number;
    bio: string;
    firstname: string;
    lastname: string;
    address: string;
    phone: string;
    avatar: File | null; // File object for upload
};

// Product data type definition (server response)
export type Product = {
    id: number;
    name: string;
    category: string;
    description: string;
    price: number;
    discount: number;
    images: ProductImage[];
};

// ProductImage data type definition (server response)
export type ProductImage = {
    id: number;
    image: string; // base64 encoded string
};

// Product data type definition (client upload)
export type ProductUpload = {
    id: number;
    name: string;
    category: string;
    description: string;
    price: number;
    discount: number;
    images: File[] | null; // Array of File objects for upload
};

// Order data type definition
export type Order = {
    id: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    customer_id: number;
    order_total: number;
    order_items: OrderItem[];
    ordered_at: string; // ISO 8601 date string
};

// OrderItem data type definition
export type OrderItem = {
    id: string;
    status: 'active' | 'cancelled';
    product_id: number;
    total_amount: number;
};

// Cart data type definition
export type Cart = {
    id: string;
    customer_id: number;
    items: CartItem[];
    total_amount: number;
};

// CartItem data type definition
export type CartItem = {
    id: string;
    product_id: number;
    quantity: number;
    price: number;
};