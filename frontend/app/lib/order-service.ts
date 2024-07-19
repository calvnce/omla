'use server';
 
import { z } from 'zod';
import {sql} from '@vercel/postgres'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { baseurl } from './utils';
import { CartItem } from './defs';

const CustomerFormSchema = z.object({
    firstname: z.string({
      required_error: 'Customer firstname is required.',
    }),
    lastname: z.string({
      required_error: 'Customer lastname is required.',
    }),
    address: z.string({
      required_error: 'Customer address is required.',
    }),
    phone: z.string({
      required_error: 'Product category is required.',
    }),
});

export type State = {
  errors?: {
    firstname?: string[];
    lastname?: string[];
    address?: string[];
    phone?: string[];
  };
  message?: string | null;
};


export async function createOrder(cart:CartItem[], prevState: State, formData: FormData) {
  let url;
  let customer_id;
  url = `${baseurl}customer/register`;
  // Validate form fields using Zod
  const validatedFields = CustomerFormSchema.safeParse({
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    address: formData.get('address'),
    phone: formData.get('phone'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Order.',
    };
  }
console.log(validatedFields);
  // Save the customer info into the database
  const { firstname, lastname, address, phone } = validatedFields.data;
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        name: `${firstname} ${lastname}`,
        address: address,
        phone: phone,
        email: `${firstname.slice(0, 2)}@artisans.com`,
        username: `${firstname.slice(0, 2)}${lastname}`,
        password: firstname.repeat(2),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      return {
        error: `Error response code:${response.status}`,
        message: response.statusText,
      };
    }
    const customer = await response.json();
    customer_id = customer['id'];
  } catch (error) {
    return {
      error: error,
      message: 'Database Error: Failed to Create Customer.',
    };
  }

  const order_lines = cart.map((cartItem) => ({
    product_id: cartItem.id,
    quantity: cartItem.quantity,
    total_price: cartItem.price * cartItem.quantity,
  }));
  const order_total = order_lines.reduce((total, line) => total + line.total_price, 0);

  // Register customer and create order
  try {
    url = `${baseurl}order/create`;
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        customer_id: customer_id,
        order_lines: order_lines,
        order_total: order_total,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      return {
        error: `Error response code:${res.status}`,
        message: res.statusText,
      };
    }
    const data = await res.json();
    console.log(data);
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Order.',
    };
  }

  revalidatePath('/');
  redirect('/');
}

export async function fetchFilteredOrders(artisan_id:string | undefined, query:string, currentPage:number) {
  const url=`${baseurl}orders/artisan/${artisan_id}`;
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
    console.log(data)
    return data;
  } catch (error) {
    console.log(error);
    return {
      errors: error,
    };
  }
}

export type UpdateOrderState = {
  errors?: {
    status?: string[];
  } | string;
  message?: string | null;
};

const UpdateOrderFormSchema = z.object({
  status: z.string({
    required_error: 'Customer firstname is required.',
  }),
});

export async function updateOrder(id: number, prevState: UpdateOrderState, formData: FormData) {
  const validatedFields = UpdateOrderFormSchema.safeParse({
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update order.',
    };
  }
 
  const { status } = validatedFields.data;
  try {
    const url = `${baseurl}orders/update/status/${id}`;
    const options = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({status:status})
    };
    const response = await fetch(url,options);
    if(!response.ok){
      return {
        errors: `HTTP response code: ${response.status}`,
        message: response.statusText,
      };
    }
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/orders');
  redirect('/dashboard/orders');
}

export async function deleteOrder(id: string) {
  console.log(id);
  try {
    const url = `${baseurl}orders/delete/${id}`;
    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      }
    };
    const response = await fetch(url,options);
    if(!response.ok){
      return {
        errors: `HTTP response code: ${response.status}`,
        message: response.statusText,
      };
    }
    revalidatePath('/dashboard/orders');
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
}