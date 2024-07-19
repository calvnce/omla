'use server'

import { z } from 'zod';
import { baseurl } from './utils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const ProductFormSchema = z.object({
    name: z.string({
      required_error: 'Product name is required.',
    }),
    description: z.string({
      required_error: 'Product description is required.',
    }),
    category: z.string({
      required_error: 'Product category is required.',
    }),
    price: z.number({
      invalid_type_error: 'Price must be a number.',
    }).positive({
      message: 'Price must be greater than zero.',
    }),
    discount: z.number().optional().default(0),
    artisan_id: z.string({
      required_error: 'Artisan ID is required.',
    }),
    images: z.array(z.instanceof(File), {
      required_error: 'At least one product image is required.',
    }),
});

export type State = {
    errors?: {
      name?: string[];
      description?: string[];
      category?: string[];
      price?: string[];
      discount?: string[];
      artisan_id?: string[];
      images?: string[];
    };
    message?: string | null;
};
  
export type ProductFormData = z.infer<typeof ProductFormSchema>;

export async function createProduct(prevState:State, formData:FormData) {
    // Validate form data against the ProductFormSchema
    const validation = ProductFormSchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      price: formData.get('price'),
      discount: formData.get('discount') ? formData.get('discount') : 0,
      artisan_id: formData.get('artisan_id'),
      images: formData.getAll('images'),
    });
    
    console.log(formData);

    if (!validation.success) {
      console.error('Validation failed:', validation.error.issues);
      return {
        errors: validation.error.flatten().fieldErrors,
        message: 'Validation failed. Please check the input data.',
      };
    }
    
    const url = `${baseurl}product/add`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,  // formData includes all fields and files
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
      console.error('Error creating product:', error);
      return {
        erro: error,
      }
  }
}

export async function updateProduct(id:string, prevState:State, formData:FormData) {
    // Validate form data against the ProductFormSchema
    const validation = ProductFormSchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      price: Number(formData.get('price')),
      discount: formData.get('discount') ? Number(formData.get('discount')) : 0,
      artisan_id: formData.get('artisan_id'),
      images: formData.getAll('images'),
    });
  
    if (!validation.success) {
      console.error('Validation failed:', validation.error.issues);
      return {
        errors: validation.error.flatten().fieldErrors,
        message: 'Validation failed. Please check the input data.',
      };
    }
  
    const url = `${baseurl}product/update/<int:id>`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: formData,  // formData includes all fields and files
      });
  
      if (!response.ok) {
        return {
            erro: `HTTP error! status: ${response.status}`,
            message: response.statusText
        }
      }
      revalidatePath('/dashboard/orders');
      redirect('/dashboard/orders');
    } catch (error) {
      console.error('Error creating product:', error);
      return { erro: error,}
    }
}

export async function fetchProducts() {
    const url=`${baseurl}products`;
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };
    try {
      const response = await fetch(url,options);
      if(!response.ok){
        return {
          errors: `HTTP response code: ${response.status}`,
          message: response.statusText,
        };
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return {
        errors: error,
      };
  }
}

export async function fetchArtisanProducts(artisan_id:string | undefined) {
    const url=`${baseurl}products/${artisan_id}`;
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };
    try {
      const response = await fetch(url,options);
      if(!response.ok){
        return {
          errors: `HTTP response code: ${response.status}`,
          message: response.statusText,
        };
      }
      return await response.json();
    } catch (error) {
      console.log(error);
      return {
        errors: error,
      };
    }
}

export async function deleteProduct(id:number) {
  const url=`${baseurl}product/delete/${id}`;
  const options = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };
  try {
    const response = await fetch(url,options);
    if(!response.ok){
      return {
        errors: `HTTP response code: ${response.status}`,
        message: response.statusText,
      };
    }
    revalidatePath('/dashboard/products');
  } catch (error) {
    console.log(error);
    return {
      errors: error,
    };
  }
}