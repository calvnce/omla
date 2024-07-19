'use server'

import { z } from 'zod';
import { baseurl } from './utils';


export async function getLatestOrders() {
    try {
        const url = new URL(`${baseurl}orders`);
        url.searchParams.append('sort_by', 'ordered_at');
        url.searchParams.append('order', 'desc');
        url.searchParams.append('page_size', '5');

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return {
                erro: `HTTP error! status: ${response.status}`,
                message: response.statusText
            };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            erro: error
        };
    }
}

export async function getLatestArtisanOrders(artisanId:string, options:any) {
    try {
        const url = new URL(`${baseurl}orders/artisan/${artisanId}`);
        
        // Append optional query parameters if they exist
        if (options.status) {
            url.searchParams.append('status', options.status);
        }
        if (options.sort_by) {
            url.searchParams.append('sort_by', options.sort_by);
        }
        if (options.order) {
            url.searchParams.append('order', options.order);
        }
        if (options.page) {
            url.searchParams.append('page', options.page);
        }
        if (options.page_size) {
            url.searchParams.append('page_size', options.page_size);
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return {
                erro: `HTTP error! status: ${response.status}`,
                message: response.statusText
            }
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching artisan orders:', error);
        return {
            erro: error
        };
    }
}


export async function getProducts(artisanId:string, options:any) {
    try {
        const url = new URL(`${baseurl}products/${artisanId}`);
        
        // Append optional query parameters if they exist
        if (options.status) {
            url.searchParams.append('category', options.status);
        }
        if (options.sort_by) {
            url.searchParams.append('sort_by', options.sort_by);
        }
        if (options.order) {
            url.searchParams.append('order', options.order);
        }
        if (options.page) {
            url.searchParams.append('page', options.page);
        }
        if (options.page_size) {
            url.searchParams.append('page_size', options.page_size);
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return {
                erro: `HTTP error! status: ${response.status}`,
                message: response.statusText
            };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching artisan orders:', error);
        return {
            erro: error
        };
    }
}


  