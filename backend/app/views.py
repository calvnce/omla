from flask import Blueprint, request, jsonify, session, url_for,send_from_directory, current_app
from flask_sqlalchemy.query import Query
from werkzeug.datastructures.file_storage import FileStorage
from app.models import db, User, Artisan, Customer, Product, ProductImage, Review, Order, OrderLine
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flasgger import swag_from
from app.swag import *
from app import config
import os
import base64
import datetime
import json

bp = Blueprint('main', __name__)

def allowed_file(filename:str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in config.ALLOWED_EXTENSIONS

def to_base64(path: str) -> str:
    # Convert the image into base64 for sharing over the internet
    with open(path, "rb") as image_file:
        encoded_string: str = base64.b64encode(image_file.read()).decode('utf-8')
    extension: str = get_file_extension(path)[1:]
    return f"data:image/{extension};base64,{encoded_string}"

def get_file_extension(filename: str) -> str:
    """
    Get the file extension from a given filename.

    Args:
        filename (str): The input filename.

    Returns:
        str: The file extension (including the dot).
    """
    return os.path.splitext(filename)[1].lower() 

def save_to_disk(file: FileStorage) -> str:
    formatted_datetime = datetime.datetime.now().strftime('%Y%m%d%H%M%S%f')
    filename: str = secure_filename(f'{formatted_datetime}{get_file_extension(file.filename)}')
    file_path: str = os.path.join(config.UPLOAD_FOLDER, filename)
    file.save(file_path)
    return file_path


@bp.route('/artisan/register', methods=['POST'])
@swag_from(register_artisan_docs)
def register_artisan():
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    role = request.form.get('role', 'ARTISAN')
    bio = request.form.get('bio')
    address = request.form.get('address')
    firstname = request.form.get('firstname')
    lastname = request.form.get('lastname')
    phone = request.form.get('phone')

    # Handle photo uploads
    file_path: str = None
    if 'avatar' in request.files:
        file: FileStorage = request.files.get('avatar')
        if file and allowed_file(file.filename):
            file_path = save_to_disk(file)
        else:
            return jsonify({'error': 'Invalid file type'}), 400
    else:
        # Use default avatar if no avatar is uploaded
        default_avatar_path = os.path.join(config.UPLOAD_FOLDER, 'dummy-avatar.png')
        with open(default_avatar_path, 'rb') as fp:
            file = FileStorage(stream=fp, filename='dummy-avatar.png')
            file_path = save_to_disk(file)

    if not username or not password or not email:
        return jsonify({'error': 'Username, email, and password are required'}), 400
    try:
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 400
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already exists'}), 400

        # Hash the password
        password_hash = generate_password_hash(password)

        # Create Artisan object
        artisan = Artisan(
            username=username,
            email=email,
            password=password_hash,
            role=role,
            bio=bio,
            lastname=lastname,
            firstname=firstname,
            phone=phone,
            address=address,
            avatar=file_path
        )

        # Persist data to the database
        db.session.add(artisan)
        db.session.commit()

        current_app.logger.info(f'New artisan registered: {str(artisan)}')

        res = {
            'id':artisan.id,
            'username': artisan.username,
            'email': artisan.email,
            'password': password_hash,
            'role': artisan.role,
            'bio': artisan.bio,
            'lastname': artisan.lastname,
            'firstname': artisan.firstname,
            'phone': artisan.phone,
            'address': artisan.address,
            'avatar': to_base64(artisan.avatar)
        }
        return jsonify({'user': res}), 201
    except Exception as ex:
        db.session.rollback()
        current_app.logger.error(f'{str(ex)}')
        return jsonify({'error': 'unexpected error occurred'}), 500



@bp.route('/artisan/bio/update/<int:id>', methods=['PUT'])
@swag_from(update_bio_docs)
def update_bio(id):
    req_data = request.get_json()
    bio = req_data.get('bio')

    # Fetch the artisan from the database
    artisan:Artisan = Artisan.query.get_or_404(id)

    try:
        # Update the bio
        artisan.bio = bio

        # Persist data to the database
        db.session.commit()
        current_app.logger.info(f'{str(artisan)} bio is updated')
        return jsonify({'message': 'Artisan bio updated successfully'}), 200
    except Exception as ex:
        current_app.logger.error(f'{str(ex)}')
        return jsonify({'error': 'unexpected error occurred'}), 500


@bp.route('/artisan/update/avatar/<int:id>', methods=['PUT'])
@swag_from(update_avatar_docs)
def update_avatar(id):
    if 'avatar' not in request.files:
        return jsonify({'error': 'Avatar image is required'}), 400

    file: FileStorage = request.files.get('avatar')
    if not file or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400

    try:
        user:Artisan = Artisan.query.get_or_404(id)

        # Save the new avatar image
        file_path = save_to_disk(file)

        if os.path.exists(user.avatar):
            os.remove(user.avatar)
            current_app.logger.info(f'Old file {user.avatar} deleted')
        # Update the user's avatar path
        user.avatar = file_path
        db.session.commit()
        
        current_app.logger.info(f'User {id} updated their avatar')

        return jsonify({'avatar': to_base64(user.avatar)}), 200
    except Exception as ex:
        db.session.rollback()
        current_app.logger.error(f'Error: {str(ex)}')
        return jsonify({'error': 'Internal server error'}), 500



@bp.route('/customer/register', methods=['POST'])
@swag_from(customer_register_docs)
def register_customer():
    try:
        req_data = request.get_json()
        username = req_data.get('username')
        password = req_data.get('password')
        email = req_data.get('email')
        name = req_data.get('name')
        address = req_data.get('address')
        phone = req_data.get('phone')
        role = request.form.get('role', 'CUSTOMER')

        if not username or not password or not email:
            return jsonify({'error': 'Invalid input'}), 400

        hashed_password = generate_password_hash(password)

        new_customer = Customer(
            username=username,
            password=hashed_password,
            email=email,
            name=name,
            role=role,
            address=address,
            phone=phone
        )

        db.session.add(new_customer)
        db.session.commit()

        current_app.logger.info(f'New customer registered: {str(new_customer)}')

        res = {
                    'id':new_customer.id,
                    'username': new_customer.username,
                    'email': new_customer.email,
                    'role': new_customer.role,
                    'name': new_customer.name,
                    'phone': new_customer.phone,
                    'address': new_customer.address,
                }
        return jsonify(res), 201
    except Exception as ex:
        current_app.logger.error(f"Error: {str(ex)}")
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500



@bp.route('/login', methods=['POST'])
@swag_from(login_docs)
def login():
    req_data = request.get_json()
    username = req_data.get('username')
    password = req_data.get('password')

    if username is None or password is None:
        return jsonify({'error': 'Username or password are required'}), 400

    try:
        user: User  = User.query.filter_by(username=username).first()
        res = {}
        if user and check_password_hash(pwhash=user.password, password=password):
            if user.role=='ARTISAN':
                session['artisan_id'] = user.id
                artisan:Artisan = Artisan.query.get_or_404(user.id)

                res = {
                    'id':artisan.id,
                    'username': artisan.username,
                    'email': artisan.email,
                    'role': artisan.role,
                    'bio': artisan.bio,
                    'lastname': artisan.lastname,
                    'firstname': artisan.firstname,
                    'phone': artisan.phone,
                    'address': artisan.address,
                    'avatar': to_base64(artisan.avatar)
                }
                current_app.logger.info(f"User login attempt success: {str(artisan)}")
            elif user.role == 'CUSTOMER':
                session['customer_id'] = user.id
                customer:Customer = Customer.query.get_or_404(user.id)

                res = {
                    'id':customer.id,
                    'username': customer.username,
                    'email': customer.email,
                    'role': customer.role,
                    'name': customer.name,
                    'phone': customer.phone,
                    'address': customer.address,
                }
                current_app.logger.info(f"User login attempt success: {str(customer)}")
            return jsonify(res), 200
        # could not login
        return jsonify({'error': 'Invalid username or password'}), 400
    except Exception as ex:
        current_app.logger.error(f"{str(ex)}")
        return jsonify({'error': 'unexpected error occurred'}), 500



@bp.route('/product/add', methods=['POST'])
@swag_from(add_product_docs)
def add_product():
    name = request.form.get('name')
    description = request.form.get('description')
    category = request.form.get('category')
    price = request.form.get('price')
    discount = request.form.get('discount', 0.0)
    artisan_id = request.form.get('artisan_id')

    if not name or not description or not category or not price or not artisan_id:
        current_app.logger.warning('Some important fields missing')
        return jsonify({'error': 'Name, description, category, price, and artisan_id are required'}), 400

    # Handle photo uploads
    if 'images' not in request.files:
        return jsonify({'error': 'Product Image(s) are required'}), 400

    files: list[FileStorage] = request.files.getlist('images')
    if not files:
        current_app.logger.error('Product images required, but not provided')
        return jsonify({'error': 'No selected files'}), 400
    try:
        # Start a transaction
        new_product = Product(
            name=name,
            description=description,
            category=category,
            price=price,
            discount=discount,
            artisan_id=artisan_id
        )
        db.session.add(new_product)
        db.session.flush()  # Ensure new_product.id is available

        images = []
        for file in files:
            if file and allowed_file(file.filename):
                file_path: str = save_to_disk(file)
                # Save the photo information in the ProductImage table
                new_image = ProductImage(
                    product_id=new_product.id,
                    file_path=file_path
                )
                db.session.add(new_image)
                images.append(to_base64(file_path))
            else:
                db.session.rollback()
                return jsonify({'error': 'Invalid file type'}), 400

        db.session.commit()

        saved_product = {
            'product': {
                'id': new_product.id,
                'name': new_product.name,
                'description': new_product.description,
                'category': new_product.category,
                'images': images,
                'price': new_product.price,
                'discount': new_product.discount,
                'artisan_id': new_product.artisan_id,
                'created_at': new_product.created_at,
                'updated_at': new_product.updated_at
            }
        }
        current_app.logger.info(f'Saved: {str(new_product)}')
        return jsonify(saved_product), 201
    except Exception as ex:
        db.session.rollback()
        current_app.logger.error(f'add_product(): {str(ex)}')
        return jsonify({'error': 'unexpected error occurred'}), 500


@bp.route('/products', methods=['GET'])
@swag_from(get_products_docs)
def get_products():
    category = request.args.get('category')
    artisan_id = request.args.get('artisan_id')
    sort_by = request.args.get('sort_by', 'id')
    order = request.args.get('order', 'asc')
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 20))

    query: Query = Product.query

    try:
        if category:
            query = query.filter_by(category=category)
        if artisan_id:
            query = query.filter_by(artisan_id=artisan_id)

        if order == 'desc':
            query = query.order_by(db.desc(getattr(Product, sort_by)))
        else:
            query = query.order_by(getattr(Product, sort_by))

        total = query.count()
        products:list[Product] = query.paginate(page=page, per_page=page_size, error_out=False,count=False).items

        products_list = []
        for product in products:
            images = []
            for image in product.product_images:
                images.append({'id': image.id, 'image': to_base64(image.file_path)})

            product_data = {
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'category': product.category,
                'images': images,
                'price': round(product.price, 2),
                'discount': round(product.discount, 2),
                'artisan_id': product.artisan_id,
                'created_at': product.created_at.isoformat(),
                'updated_at': product.updated_at.isoformat()
            }
            products_list.append(product_data)

        current_app.logger.info(f'get_products() {page_size} items fetched')
        return jsonify({
            "products": products_list,
            "total": total,
            "page": page,
            "page_size": page_size
        }), 200
        
    except Exception as ex:
        current_app.logger.error(f'{str(ex)}')
        return jsonify({'error': 'Internal server error'}), 500



@bp.route('/product/update/discount/<int:id>/<float:discount>', methods=['PUT'])
@swag_from(update_product_discount_docs)
def update_product_discount(id, discount):
    try:
        product: Product = Product.query.get_or_404(id)
        product.discount = discount
        db.session.commit()

        current_app.logger.info(f'The discount of the product {product.name} is updated to {discount}')
        return jsonify({'message': 'Product discount updated'}), 200
    except Exception as e:
        current_app.logger.error(f'{str(e)}')
        return jsonify({'error': 'unexpected error occurred'}), 500


@bp.route('/product/update/description/<int:id>', methods=['PUT'])
@swag_from(update_name_description_docs)
def update_name_description(id):
    req_data = request.get_json()
    new_name = req_data.get('name')
    new_description = req_data.get('description')

    try:
        product: Product = Product.query.get_or_404(1)

        if new_name:
            product.name = new_name
        if new_description:
            product.description = new_description

        db.session.commit()
        current_app.logger.info(f"Product name and description updated: {str(product)}")

        images = []
        for image in product.product_images:
            images.append(to_base64(image.file_path))

        updated_product = {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'category': product.category,
            'images': images,
            'price': round(product.price,2),
            'discount': round(product.discount,2),
            'artisan_id': product.artisan_id,
            'created_at': product.created_at,
            'updated_at': product.updated_at
        }

        return jsonify({'product': updated_product}), 200
    except Exception as ex:
        current_app.logger.error(f'{str(ex)}')
        return jsonify({'error': 'unexpected error occurred'}), 500


@bp.route('/product/update/images/<int:id>', methods=['PUT'])
@swag_from(update_product_images_docs)
def update_product_images(id):
    try:
        # Parse the image IDs from the form data
        image_ids = request.form.get('ids')
        if not image_ids:
            return jsonify({'error': 'Image IDs are required'}), 400
        image_ids = json.loads(image_ids)

        # Handle photo uploads
        if 'images' not in request.files:
            return jsonify({'error': 'Photos are required'}), 400

        files: list[FileStorage] = request.files.getlist('images')
        if not files:
            return jsonify({'error': 'No selected files'}), 400

        new_file_paths = []
        for i, file in enumerate(files):
            if file and allowed_file(file.filename):
                file_path = save_to_disk(file)
                current_app.logger.info(f"File saved to {file_path}")
                new_file_paths.append((image_ids[i], file_path))
            else:
                return jsonify({'error': 'Invalid file type'}), 400

        for path in new_file_paths:
            old_image: ProductImage | None = ProductImage.query.get_or_404(path[0])
            # Delete old photos
            if os.path.exists(old_image.file_path):
                os.remove(old_image.file_path)
                current_app.logger.info(f'Old file {old_image.file_path} deleted')
            # Update the product image with the new file
            old_image.file_path = path[1]
        
        db.session.commit()
        
        # Get the product details from database, otherwise return 404
        product: Product = Product.query.get_or_404(id)
        images = []
        for image in product.product_images:
            images.append(to_base64(image.file_path))

        updated_product = {
            'product': {
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'images': images,
                'price': product.price,
                'discount': product.discount,
                'artisan_id': product.artisan_id,
                'created_at': product.created_at,
                'updated_at': product.updated_at
            }
        }
        current_app.logger.info(f"{product.name} image(s) are updated")
        return jsonify(updated_product), 200
    except Exception as ex:
        current_app.logger.error(str(ex))
        return jsonify({'error': 'internal server error'}), 500


@swag_from(delete_product_images_docs)
@bp.route('/product/delete/images/<int:id>', methods=['DELETE'])
def delete_product_images(id):
    req_data = request.get_json()
    image_ids = req_data.get('image_ids')

    if not image_ids or not isinstance(image_ids, list):
        current_app.logger.warn("A list of image IDs is required")
        return jsonify({'error': 'A list of image IDs is required'}), 400

    try:
        product:Product = Product.query.get_or_404(id)

        for image_id in image_ids:
            image:ProductImage | None = ProductImage.query.get(image_id)

            if image and image.product_id == product.id:
                # Delete the image file from the disk
                if os.path.exists(image.file_path):
                    os.remove(image.file_path)
                # Delete the image record from the database
                db.session.delete(image)
            else:
                current_app.logger.warn(f'Image with ID {image_id} not found for this product')
                return jsonify({'error': f'Image with ID {image_id} not found for this product'}), 404

        db.session.commit()

        current_app.logger.info('Images deleted successfully')
        return jsonify({'message': 'Images deleted successfully'}), 200
    except Exception as ex:
        current_app.logger.error(str(ex))
        return jsonify({'error': 'internal server error'}), 500


@bp.route('/product/delete/<int:id>', methods=['DELETE'])
@swag_from(delete_product_docs)
def delete_product(id):
    try:
        product:Product = Product.query.get_or_404(id)
        # Delete the image file from the disk
        for image in product.product_images:
            if os.path.exists(image.file_path):
                os.remove(image.file_path)
        # Delete the product
        db.session.delete(product)
        db.session.commit()
        current_app.logger.info(f'deleted: {str(product)}')
        return jsonify({'message': 'Product and associated images deleted successfully'}), 200
    except Exception as ex:
        return jsonify({'error': str(ex)}), 500


@bp.route('/product/update/price/<int:id>', methods=['PUT'])
@swag_from(update_product_price_docs)
def update_product_price(id):
    req_data = request.get_json()
    new_price = req_data.get('price')
    if new_price is None:
        return jsonify({'error': 'Price is required'}), 400

    try:
        product = Product.query.get_or_404(id)

        product.price = new_price
        db.session.commit()

        current_app.logger.info(f'Product {id} price updated to {new_price}')

        return jsonify({'message': 'Product price updated successfully', 'product': {'id': product.id, 'price': product.price}}), 200
    except Exception as ex:
        db.session.rollback()
        current_app.logger.error(f'Error: {str(ex)}')
        return jsonify({'error': 'Internal server error'}), 500



@bp.route('/order/create', methods=['POST'])
@swag_from(create_order_docs)
def create_order():
    req_data = request.get_json()
    customer_id = req_data.get('customer_id')
    order_lines = req_data.get('order_lines')
    order_total = req_data.get('order_total')
    
    if not customer_id or not order_lines or not order_total:
        return jsonify({'error': 'Invalid input'}), 400

    try:
        # Create the order
        new_order = Order(customer_id=customer_id, order_total=order_total, status='Pending')
        db.session.add(new_order)
        db.session.flush()

        # Create order lines
        for line in order_lines:
            product_id = line.get('product_id')
            quantity = line.get('quantity')
            total_price = line.get('total_price')

            if not product_id or not quantity or not total_price:
                current_app.logger.warning(f'Some order lines fields are missing')
                return jsonify({'error': 'Invalid input'}), 400

            new_order_line = OrderLine(order_id=new_order.id, product_id=product_id, quantity=quantity, total_price=total_price)
            db.session.add(new_order_line)

        db.session.commit()

        res = {
            'id':new_order.id,
            'customer_id':new_order.customer_id,
            'order_total':new_order.order_total,
            'created_at':new_order.ordered_at,
            'status': new_order.status,
            'order_lines': [
                    {
                    'product_id': line.product_id,
                    'quantity':line.quantity,
                    'status': line.status,
                    'total_price':line.total_price,
                    'id':line.id,
                    'created_at':line.created_at
                } for line in new_order.order_lines
            ] 
        }
        current_app.logger.info(f'Created: {str(new_order)}')
        return jsonify(res), 201
    except Exception as ex:
        db.session.rollback()
        current_app.logger.error(f'{str(ex)}')
        return jsonify({'error': 'Internal server error'}), 500


@bp.route('/order/update/status/<int:id>', methods=['PUT'])
@swag_from(update_order_status_docs)
def update_order_status(id):
    req_data = request.get_json()
    status = req_data.get('status')

    try:
        order:Order = Order.query.get_or_404(id)

        order.status = status
        order.updated_at = datetime.datetime.now()
        db.session.commit()

        current_app.logger.info(f'Order status updated: {str(order)}')
        return jsonify({'message': 'Order status updated successfully'}), 200
    except Exception as ex:
        db.session.rollback()
        current_app.logger.error(f'{str(ex)}')
        return jsonify({'error': 'Internal server error'}), 500


@bp.route('/order/update/cancel/orderline/<int:order_id>/<int:orderline_id>', methods=['PUT'])
@swag_from(cancel_order_line_docs)
def cancel_order_line(order_id, orderline_id):
    try:
        order:Order = Order.query.get_or_404(order_id)
        if order.status not in ['CANCELLED', 'COMPLETE']:
            order_line:OrderLine = OrderLine.query.get_or_404(orderline_id)
            order_line.status = 'CANCELLED'
            order.order_total -= order_line.total_price
            if order.order_total == 0.0:
                order.status = 'CANCELLED'
            order_line.updated_at = datetime.datetime.now()
            order.updated_at = datetime.datetime.now()
        else:
            return jsonify({'message': f'Orderline item status is {order.status}'}), 400

        db.session.commit()
        current_app.logger.info(f'Order line cancelled: {str(order)}')
        return jsonify({'message': 'Order line status updated successfully'}), 200
    except Exception as ex:
        db.session.rollback()
        current_app.logger.error(f'{str(ex)}')
        return jsonify({'error': 'Internal server error'}), 500


@bp.route('/order/<int:id>', methods=['GET'])
@swag_from(get_order_docs)
def get_order(id):
    try:
        order:Order = Order.query.get_or_404(id)

        order_data = {
            "id": order.id,
            "customer_id": order.customer_id,
            "status": order.status,
            "order_total":  round(order.order_total, 2),
            "ordered_at": order.ordered_at.isoformat(),
            "updated_at": order.updated_at.isoformat(),
            "order_lines": [
                {
                    "id": line.id,
                    "product_id": line.product_id,
                    "quantity": line.quantity,
                    "total_price":  round(line.total_price, 2),
                    "status": line.status,
                    "created_at": line.created_at.isoformat(),
                    "updated_at": line.updated_at.isoformat()
                } for line in order.order_lines
            ]
        }

        return jsonify({"order": order_data}), 200
    except Exception as ex:
        current_app.logger.error(f'{str(ex)}')
        return jsonify({'error': 'Internal server error'}), 500


@bp.route('/orders', methods=['GET'])
@swag_from(get_orders_docs)
def get_orders():
    status = request.args.get('status')
    customer_id = request.args.get('customer_id')
    sort_by = request.args.get('sort_by', 'id')
    order = request.args.get('order', 'asc')
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 10))

    query: Query = Order.query

    try:
        if status:
            query = query.filter_by(status=status)
        if customer_id:
            query = query.filter_by(customer_id=customer_id)

        if order == 'desc':
            query = query.order_by(db.desc(getattr(Order, sort_by)))
        else:
            query = query.order_by(getattr(Order, sort_by))

        total: int = query.count()
        orders:list[Order] = query.paginate(page=page, per_page=page_size, error_out=False,count=False)

        order_list = []
        for order in orders:
            order_data = {
                "id": order.id,
                "customer_id": order.customer_id,
                "status": order.status,
                "order_total": round(order.order_total, 2),
                "ordered_at": order.ordered_at.isoformat(),
                "updated_at": order.updated_at.isoformat(),
                "order_lines": [
                    {
                        "id": line.id,
                        "product_id": line.product_id,
                        "quantity": line.quantity,
                        "total_price": round(line.total_price, 2),
                        "status": line.status,
                        "created_at": line.created_at.isoformat(),
                        "updated_at": line.updated_at.isoformat()
                    } for line in order.order_lines
                ]
            }
            order_list.append(order_data)

        return jsonify({
            "orders": order_list,
            "total": total,
            "page": page,
            "page_size": page_size
        }), 200
    except Exception as ex:
        current_app.logger.error(f'{str(ex)}')
        return jsonify({'error': 'Internal server error'}), 500