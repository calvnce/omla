from sqlalchemy import Integer, String, ForeignKey, Text, Numeric, DateTime, Boolean
from sqlalchemy.orm import relationship, mapped_column, Mapped
from datetime import datetime
from app import db

class User(db.Model):
    __tablename__: str = 'users'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=True)
    password: Mapped[str] = mapped_column(String(128), nullable=True)
    role: Mapped[str] = mapped_column(String(20), nullable=True, default='CUSTOMER')
    registered_at: Mapped[datetime] = mapped_column(DateTime, nullable=True, default=datetime.now)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=True, default=True)
    type: Mapped[str] = mapped_column(String(50))

    __mapper_args__:dict[str, str]= {
        'polymorphic_identity': 'user',
        'polymorphic_on': type
    }

class Artisan(User):
    __tablename__ = 'artisans'
    id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), primary_key=True)
    firstname: Mapped[str] = mapped_column(String(50), nullable=False)
    lastname: Mapped[str] = mapped_column(String(50), nullable=False)
    address: Mapped[str] = mapped_column(Text, nullable=False)
    phone: Mapped[str] = mapped_column(String(50), nullable=False)
    bio: Mapped[str] = mapped_column(Text, nullable=True)
    avatar:Mapped[str] = mapped_column(String(150), nullable=True)
    products: Mapped[list["Product"]] = relationship('Product', backref='artisan', lazy=True)

    __mapper_args__: dict[str, str] = {
        'polymorphic_identity': 'artisan',
    }

    def __repr__(self) -> str:
        return f"<Artisan id={self.id}, name={self.firstname} {self.lastname}, address={self.address},  bio={self.bio},  phone={self.phone}>"

class Customer(User):
    __tablename__ = 'customers'
    id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    address: Mapped[str] = mapped_column(Text, nullable=False)
    phone: Mapped[str] = mapped_column(String(50), nullable=False)
    orders: Mapped[list["Order"]] = relationship('Order', backref='customer', lazy=True)

    __mapper_args__: dict[str, str] = {
        'polymorphic_identity': 'customer',
    }

    def __repr__(self) -> str:
        return f"<Customer id={self.id}, name={self.name}, address={self.address}>"

class Product(db.Model):
    __tablename__: str = 'products'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    category: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    price: Mapped[float] = mapped_column(Numeric, nullable=False)
    discount: Mapped[float] = mapped_column(Numeric, nullable=False, default=0.0)
    artisan_id: Mapped[int] = mapped_column(Integer, ForeignKey('artisans.id'), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=True, default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=True, default=datetime.now)
    order_lines: Mapped[list["OrderLine"]] = relationship('OrderLine', backref='product', lazy=True)
    product_images: Mapped[list["ProductImage"]] = relationship('ProductImage', backref='product', cascade='all, delete-orphan', lazy=True)

    def __repr__(self) -> str:
        return f"<Product id={self.id}, name={self.name}, description={self.description}, category={self.category}, price={self.price}, discount={self.discount}>"

class ProductImage(db.Model):
    __tablename__: str = 'product_images'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey('products.id', ondelete='CASCADE'), nullable=True)
    file_path: Mapped[str] = mapped_column(String(220), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=True, default=datetime.now)

class Review(db.Model):
    __tablename__: str = 'reviews'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_id: Mapped[int] = mapped_column(Integer, ForeignKey('customers.id'), nullable=False)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey('products.id'), nullable=False)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=True, default=datetime.now)

    def __repr__(self) -> str:
        return f"<Review id={self.id}, customer_id={self.customer_id}, product_id={self.product_id}, status={self.rating}>"

class Order(db.Model):
    __tablename__: str = 'orders'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_id: Mapped[int] = mapped_column(Integer, ForeignKey('customers.id'), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='PENDING')
    order_total: Mapped[float] = mapped_column(Numeric, nullable=False)
    ordered_at: Mapped[datetime] = mapped_column(DateTime, nullable=True, default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=True, default=datetime.now)
    order_lines: Mapped[list["OrderLine"]] = relationship('OrderLine', backref='order', cascade='all, delete-orphan', lazy=True)

    def __repr__(self) -> str:
        return f"<Order id={self.id}, customer_id={self.customer_id}, status={self.status}, order_total={self.order_total}>"

class OrderLine(db.Model):
    __tablename__: str = 'order_lines'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    order_id: Mapped[int] = mapped_column(Integer, ForeignKey('orders.id', ondelete='CASCADE'), nullable=False)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey('products.id'), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    total_price: Mapped[float] = mapped_column(Numeric, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='active')
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=True, default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=True, default=datetime.now)

    def __repr__(self) -> str:
        return f"<OrderLine id={self.id}, order_id={self.order_id}, product_id={self.product_id}, quantity={self.quantity}, total_price={self.total_price}>"



