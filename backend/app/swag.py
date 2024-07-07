register_artisan_docs = {
    "tags": ["Artisan"],
    "summary": "Register a new artisan",
    'consumes': ['multipart/form-data'],
    "description": "This endpoint registers a new artisan.",
    "parameters": [
        {
            "name": "username",
            "in": "formData",
            "description": "Username of the artisan",
            "required": True,
            "type": "string"
        },
        {
            "name": "email",
            "in": "formData",
            "description": "Email of the artisan",
            "required": True,
            "type": "string"
        },
        {
            "name": "password",
            "in": "formData",
            "description": "Password of the artisan",
            "required": True,
            "type": "string"
        },
        {
            "name": "role",
            "in": "formData",
            "description": "Role of the artisan",
            "required": False,
            "type": "string",
            "default": "artisan"
        },
        {
            "name": "bio",
            "in": "formData",
            "description": "Bio of the artisan",
            "required": False,
            "type": "string"
        },
        {
            "name": "address",
            "in": "formData",
            "description": "Address of the artisan",
            "required": False,
            "type": "string"
        },
        {
            "name": "firstname",
            "in": "formData",
            "description": "First name of the artisan",
            "required": False,
            "type": "string"
        },
        {
            "name": "lastname",
            "in": "formData",
            "description": "Last name of the artisan",
            "required": False,
            "type": "string"
        },
        {
            "name": "phone",
            "in": "formData",
            "description": "Phone number of the artisan",
            "required": False,
            "type": "string"
        },
        {
            "name": "avatar",
            "in": "formData",
            "description": "Avatar image of the artisan",
            "required": False,
            "type": "file"
        }
    ],
    "responses": {
        "201": {
            "description": "Artisan registered successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "user": {
                        "type": "object",
                        "properties": {
                            "username": {"type": "string"},
                            "email": {"type": "string"},
                            "password": {"type": "string"},
                            "role": {"type": "string"},
                            "bio": {"type": "string"},
                            "lastname": {"type": "string"},
                            "firstname": {"type": "string"},
                            "phone": {"type": "string"},
                            "address": {"type": "string"}
                        }
                    }
                }
            }
        },
        "400": {"description": "Invalid input or user already exists"},
        "500": {"description": "Internal server error"}
    }
}

update_avatar_docs = {
    "tags": ["Artisan"],
    "summary": "Update user avatar",
    "description": "This endpoint updates the user's avatar image.",
    "parameters": [
        {
            "name": "id",
            "in": "path",
            "description": "ID of the user",
            "required": True,
            "type": "integer"
        },
        {
            "name": "avatar",
            "in": "formData",
            "description": "New avatar image",
            "required": True,
            "type": "file"
        }
    ],
    "responses": {
        "200": {
            "description": "Avatar updated successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "message": {"type": "string"},
                    "avatar_url": {"type": "string"}
                }
            }
        },
        "400": {"description": "Invalid input or file type"},
        "404": {"description": "User not found"},
        "500": {"description": "Internal server error"}
    }
}


login_docs = {
    "tags": ["Auth"],
    "summary": "User login",
    "description": "This endpoint allows a user to log in by providing a username and password.",
    "parameters": [
        {
            "name": "body",
            "in": "body",
            "description": "JSON object containing username and password",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "username": {"type": "string"},
                    "password": {"type": "string"}
                }
            }
        }
    ],
    "responses": {
        "200": {
            "description": "Login successful",
            "schema": {
                "type": "object",
                "properties": {
                    "id": {"type": "integer"},
                    "username": {"type": "string"}
                }
            }
        },
        "400": {"description": "Invalid input or login failed"},
        "500": {"description": "Internal server error"}
    }
}

update_bio_docs = {
    "tags": ["Artisan"],
    "summary": "Update artisan bio",
    "description": "This endpoint updates the bio of an artisan.",
    "parameters": [
        {
            "name": "id",
            "in": "path",
            "description": "ID of the artisan",
            "required": True,
            "type": "integer"
        },
        {
            "name": "body",
            "in": "body",
            "description": "JSON object containing the new bio",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "bio": {"type": "string"}
                }
            }
        }
    ],
    "responses": {
        "200": {
            "description": "Artisan bio updated successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "message": {"type": "string"}
                }
            }
        },
        "404": {"description": "Artisan not found"},
        "500": {"description": "Internal server error"}
    }
}

add_product_docs = {
    "tags": ["Product"],
    "summary": "Add a new product",
    "description": "This endpoint adds a new product along with its images.",
    'consumes': ['multipart/form-data'],
    "parameters": [
        {
            "name": "name",
            "in": "formData",
            "description": "Name of the product",
            "required": True,
            "type": "string"
        },
        {
            "name": "description",
            "in": "formData",
            "description": "Description of the product",
            "required": True,
            "type": "string"
        },
        {
            "name": "category",
            "in": "formData",
            "description": "Category of the product",
            "required": True,
            "type": "string"
        },
        {
            "name": "price",
            "in": "formData",
            "description": "Price of the product",
            "required": True,
            "type": "number"
        },
        {
            "name": "discount",
            "in": "formData",
            "description": "Discount on the product",
            "required": False,
            "type": "number",
            "default": 0.0
        },
        {
            "name": "artisan_id",
            "in": "formData",
            "description": "ID of the artisan",
            "required": True,
            "type": "integer"
        },
        {
            "name": "images",
            "in": "formData",
            "description": "Images of the product",
            "required": True,
            "type": "array",
            "items": {
                "type": "file"
            },
            "collectionFormat": "multi"
        }
    ],
    "responses": {
        "201": {
            "description": "Product created successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "product": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "integer"},
                            "name": {"type": "string"},
                            "description": {"type": "string"},
                            "category": {"type": "string"},
                            "images": {
                                "type": "array",
                                "items": {"type": "string"}
                            },
                            "price": {"type": "number"},
                            "discount": {"type": "number"},
                            "artisan_id": {"type": "integer"},
                            "created_at": {"type": "string", "format": "date-time"},
                            "updated_at": {"type": "string", "format": "date-time"}
                        }
                    }
                }
            }
        },
        "400": {"description": "Invalid input"},
        "500": {"description": "Internal server error"}
    }
}




update_product_images_docs = {
    "tags": ["Product"],
    "summary": "Update product images",
    "description": "This endpoint updates the images of a product.",
    "parameters": [
        {
            "name": "id",
            "in": "path",
            "description": "ID of the product to update",
            "required": True,
            "type": "integer"
        },
        {
            "name": "ids",
            "in": "formData",
            "description": "JSON array of image IDs",
            "required": True,
            "type": "string"
        },
        {
            "name": "images",
            "in": "formData",
            "description": "New images to upload",
            "required": True,
            "type": "file",
            "collectionFormat": "multi"
        }
    ],
    "responses": {
        "200": {
            "description": "Product images updated successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "product": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "integer"},
                            "name": {"type": "string"},
                            "description": {"type": "string"},
                            "images": {
                                "type": "array",
                                "items": {"type": "string"}
                            },
                            "price": {"type": "number"},
                            "discount": {"type": "number"},
                            "artisan_id": {"type": "integer"},
                            "created_at": {"type": "string", "format": "date-time"},
                            "updated_at": {"type": "string", "format": "date-time"}
                        }
                    }
                }
            }
        },
        "400": {"description": "Invalid input"},
        "500": {"description": "Internal server error"}
    }
}

delete_product_images_docs = {
    "tags": ["Product"],
    "summary": "Delete product images",
    "description": "This endpoint deletes specified images of a product.",
    "parameters": [
        {
            "name": "id",
            "in": "path",
            "description": "ID of the product",
            "required": True,
            "type": "integer"
        },
        {
            "name": "image_ids",
            "in": "body",
            "description": "List of image IDs to delete",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "image_ids": {
                        "type": "array",
                        "items": {"type": "integer"}
                    }
                }
            }
        }
    ],
    "responses": {
        "200": {
            "description": "Images deleted successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "message": {"type": "string"}
                }
            }
        },
        "400": {"description": "Invalid input"},
        "404": {"description": "Image not found"},
        "500": {"description": "Internal server error"}
    }
}

get_products_docs = {
    "tags": ["Product"],
    "summary": "Retrieve all products with filtering, sorting, and pagination",
    "description": "Endpoint for retrieving all products with optional filtering, sorting, and pagination",
    "parameters": [
        {
            "name": "category",
            "in": "query",
            "description": "Filter products by category",
            "required": False,
            "type": "string"
        },
        {
            "name": "artisan_id",
            "in": "query",
            "description": "Filter products by artisan ID",
            "required": False,
            "type": "integer"
        },
        {
            "name": "sort_by",
            "in": "query",
            "description": "Sort products by a specific field",
            "required": False,
            "type": "string",
            "enum": ["id", "name", "price", "created_at", "updated_at"]
        },
        {
            "name": "order",
            "in": "query",
            "description": "Sort order (asc or desc)",
            "required": False,
            "type": "string",
            "enum": ["asc", "desc"]
        },
        {
            "name": "page",
            "in": "query",
            "description": "Page number for pagination",
            "required": False,
            "type": "integer",
            "default": 1
        },
        {
            "name": "page_size",
            "in": "query",
            "description": "Number of products per page",
            "required": False,
            "type": "integer",
            "default": 10
        }
    ],
    "responses": {
        "200": {
            "description": "Products retrieved successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "products": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "integer"},
                                "name": {"type": "string"},
                                "description": {"type": "string"},
                                "category": {"type": "string"},
                                "images": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "id": {"type": "integer"},
                                            "image": {"type": "string", "format": "byte"}
                                        }
                                    }
                                },
                                "price": {"type": "number"},
                                "discount": {"type": "number"},
                                "artisan_id": {"type": "integer"},
                                "created_at": {"type": "string", "format": "date-time"},
                                "updated_at": {"type": "string", "format": "date-time"}
                            }
                        }
                    },
                    "total": {"type": "integer"},
                    "page": {"type": "integer"},
                    "page_size": {"type": "integer"}
                }
            }
        },
        "500": {
            "description": "Internal server error"
        }
    }
}


update_name_description_docs = {
    "tags": ["Product"],
    "summary": "Update product name and description",
    "description": "This endpoint updates the name and description of a product.",
    "parameters": [
        {
            "name": "id",
            "in": "path",
            "description": "ID of the product",
            "required": True,
            "type": "integer"
        },
        {
            "name": "body",
            "in": "body",
            "description": "JSON object containing the new name and description",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "description": {"type": "string"}
                }
            }
        }
    ],
    "responses": {
        "200": {
            "description": "Product name and description updated successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "product": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "integer"},
                            "name": {"type": "string"},
                            "description": {"type": "string"},
                            "category": {"type": "string"},
                            "images": {
                                "type": "array",
                                "items": {"type": "string"}
                            },
                            "price": {"type": "number"},
                            "discount": {"type": "number"},
                            "artisan_id": {"type": "integer"},
                            "created_at": {"type": "string", "format": "date-time"},
                            "updated_at": {"type": "string", "format": "date-time"}
                        }
                    }
                }
            }
        },
        "404": {"description": "Product not found"},
        "500": {"description": "Internal server error"}
    }
}


update_product_discount_docs = {
    "tags": ["Product"],
    "summary": "Update product discount",
    "description": "This endpoint updates the discount of a product.",
    "parameters": [
        {
            "name": "id",
            "in": "path",
            "description": "ID of the product",
            "required": True,
            "type": "integer"
        },
        {
            "name": "discount",
            "in": "path",
            "description": "New discount value",
            "required": True,
            "type": "number"
        }
    ],
    "responses": {
        "200": {
            "description": "Product discount updated successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "message": {"type": "string"}
                }
            }
        },
        "404": {"description": "Product not found"},
        "500": {"description": "Internal server error"}
    }
}

delete_product_docs = {
    'tags': ['Product'],
    'description': 'Delete a product by Id',
    'parameters': [
        {
            'name': 'id',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'ID of the product to delete'
        }
    ],
    'responses': {
        '200': {
            'description': 'Product deleted successfully',
            'examples': {
                'application/json': {
                    'message': 'Product deleted successfully'
                }
            }
        },
        '404': {
            'description': 'Product not found',
            'examples': {
                'application/json': {
                    'error': 'Product not found'
                }
            }
        },
        '500': {
            'description': 'Internal server error',
            'examples': {
                'application/json': {
                    'error': 'Error message'
                }
            }
        }
    }
}

update_product_price_docs = {
    "tags": ["Product"],
    "summary": "Update product price",
    "description": "This endpoint updates the price of a product.",
    "parameters": [
        {
            "name": "id",
            "in": "path",
            "description": "ID of the product",
            "required": True,
            "type": "integer"
        },
        {
            "name": "price",
            "in": "body",
            "description": "New price of the product",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "price": {
                        "type": "number",
                        "example": 19.99
                    }
                }
            }
        }
    ],
    "responses": {
        "200": {
            "description": "Product price updated successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "message": {"type": "string"},
                    "product": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "integer"},
                            "price": {"type": "number"}
                        }
                    }
                }
            }
        },
        "400": {"description": "Invalid input"},
        "404": {"description": "Product not found"},
        "500": {"description": "Internal server error"}
    }
}


create_order_docs = {
    "tags": ["Order"],
    "summary": "Create an order with order lines",
    "description": "Endpoint for creating a new order and its associated order lines",
    "parameters": [
        {
            "in": "body",
            "name": "order_details",
            "description": "Details of the new order and order lines",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "customer_id": {
                        "type": "integer",
                        "description": "The ID of the customer placing the order"
                    },
                     "order_total": {
                        "type": "float",
                        "description": "The total order amount"
                    },
                    "order_lines": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "product_id": {
                                    "type": "integer",
                                    "description": "The ID of the product in the order line"
                                },
                                "quantity": {
                                    "type": "integer",
                                    "description": "The quantity of the product in the order line"
                                },
                                "total_price": {
                                    "type": "number",
                                    "description": "The total price of the order line calculated by the client"
                                }
                            },
                            "required": ["product_id", "quantity", "total_price"]
                        }
                    }
                },
                "required": ["customer_id", "order_lines","order_total"]
            }
        }
    ],
    "responses": {
        "201": {
            "description": "Order created successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "description": "Confirmation message"
                    },
                    "order_id": {
                        "type": "integer",
                        "description": "The ID of the newly created order"
                    }
                }
            }
        },
        "400": {
            "description": "Invalid input"
        },
        "500": {
            "description": "Internal server error"
        }
    }
}

update_order_status_docs = {
    "tags": ["Order"],
    "summary": "Update the status of an order",
    "description": "Endpoint for updating the status of an existing order",
    "parameters": [
        {
            "name": "id",
            "in": "path",
            "description": "The ID of the order to update",
            "required": True,
            "type": "integer"
        },
        {
            "in": "body",
            "name": "order_status",
            "description": "Details of the order status update",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "status": {
                        "type": "string",
                        "description": "The new status of the order"
                    }
                },
                "required": ["status"]
            }
        }
    ],
    "responses": {
        "200": {
            "description": "Order status updated successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "description": "Confirmation message"
                    }
                }
            }
        },
        "400": {
            "description": "Invalid input"
        },
        "404": {
            "description": "Order not found"
        },
        "500": {
            "description": "Internal server error"
        }
    }
}


cancel_order_line_docs = {
    "tags": ["Order"],
    "summary": "Cancel an order line",
    "description": "Endpoint for canceling an order line within an existing order",
    "parameters": [
        {
            "name": "order_id",
            "in": "path",
            "description": "The ID of the order",
            "required": True,
            "type": "integer"
        },
        {
            "name": "orderline_id",
            "in": "path",
            "description": "The ID of the order line to cancel",
            "required": True,
            "type": "integer"
        }
    ],
    "responses": {
        "200": {
            "description": "Order line status updated successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "description": "Confirmation message"
                    }
                }
            }
        },
        "400": {
            "description": "Invalid input or order status does not allow cancellation"
        },
        "404": {
            "description": "Order or order line not found"
        },
        "500": {
            "description": "Internal server error"
        }
    }
}


get_order_docs = {
    "tags": ["Order"],
    "summary": "Retrieve an order by Id",
    "description": "Endpoint for retrieving the details of an existing order by its ID",
    "parameters": [
        {
            "name": "id",
            "in": "path",
            "description": "The ID of the order to retrieve",
            "required": True,
            "type": "integer"
        }
    ],
    "responses": {
        "200": {
            "description": "Order retrieved successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "order": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "integer"},
                            "customer_id": {"type": "integer"},
                            "status": {"type": "string"},
                            "ordered_at": {"type": "string", "format": "date-time"},
                            "updated_at": {"type": "string", "format": "date-time"},
                            "order_lines": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "id": {"type": "integer"},
                                        "product_id": {"type": "integer"},
                                        "quantity": {"type": "integer"},
                                        "total_price": {"type": "number"},
                                        "status": {"type": "string"},
                                        "created_at": {"type": "string", "format": "date-time"},
                                        "updated_at": {"type": "string", "format": "date-time"}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "404": {
            "description": "Order not found"
        },
        "500": {
            "description": "Internal server error"
        }
    }
}

get_orders_docs = {
    "tags": ["Order"],
    "summary": "Retrieve orders with filtering, sorting, and pagination",
    "description": "Endpoint for retrieving orders with optional filtering, sorting, and pagination",
    "parameters": [
        {
            "name": "status",
            "in": "query",
            "description": "Filter orders by status",
            "required": False,
            "type": "string"
        },
        {
            "name": "customer_id",
            "in": "query",
            "description": "Filter orders by customer ID",
            "required": False,
            "type": "integer"
        },
        {
            "name": "sort_by",
            "in": "query",
            "description": "Sort orders by a specific field",
            "required": False,
            "type": "string",
            "enum": ["id", "status", "ordered_at", "updated_at"]
        },
        {
            "name": "order",
            "in": "query",
            "description": "Sort order (asc or desc)",
            "required": False,
            "type": "string",
            "enum": ["asc", "desc"]
        },
        {
            "name": "page",
            "in": "query",
            "description": "Page number for pagination",
            "required": False,
            "type": "integer",
            "default": 1
        },
        {
            "name": "page_size",
            "in": "query",
            "description": "Number of orders per page",
            "required": False,
            "type": "integer",
            "default": 10
        }
    ],
    "responses": {
        "200": {
            "description": "Orders retrieved successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "orders": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "integer"},
                                "customer_id": {"type": "integer"},
                                "status": {"type": "string"},
                                "ordered_at": {"type": "string", "format": "date-time"},
                                "updated_at": {"type": "string", "format": "date-time"},
                                "order_lines": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "id": {"type": "integer"},
                                            "product_id": {"type": "integer"},
                                            "quantity": {"type": "integer"},
                                            "total_price": {"type": "number"},
                                            "status": {"type": "string"},
                                            "created_at": {"type": "string", "format": "date-time"},
                                            "updated_at": {"type": "string", "format": "date-time"}
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "total": {"type": "integer"},
                    "page": {"type": "integer"},
                    "page_size": {"type": "integer"}
                }
            }
        },
        "400": {
            "description": "Invalid input"
        },
        "500": {
            "description": "Internal server error"
        }
    }
}

customer_register_docs = {
    "tags": ["Customer"],
    "summary": "Register a new customer",
    "description": "Endpoint for registering a new customer",
    "parameters": [
        {
            "in": "body",
            "name": "customer",
            "description": "Customer registration details",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "username": {"type": "string"},
                    "password": {"type": "string"},
                    "email": {"type": "string"},
                    "name": {"type": "string"},
                    "address": {"type": "string"},
                    "phone": {"type": "string"}
                },
                "required": ["username", "password", "email","name","address","phone"]
            }
        }
    ],
    "responses": {
        "201": {
            "description": "Customer registered successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "message": {"type": "string"},
                    "customer_id": {"type": "integer"}
                }
            }
        },
        "400": {
            "description": "Invalid input"
        },
        "500": {
            "description": "Internal server error"
        }
    }
}
