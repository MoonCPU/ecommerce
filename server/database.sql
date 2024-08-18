-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users
(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

CREATE TABLE addresses
(
    address_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    cep VARCHAR(10),
    street VARCHAR(255),
    neighborhood VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    number VARCHAR(10),
    complement VARCHAR(255)
);

CREATE TABLE products
(
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name VARCHAR(255) NOT NULL,
    product_price NUMERIC(10,2) NOT NULL
);

CREATE TABLE shopping_cart
(
    cart_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    product_id UUID REFERENCES products(product_id),
    quantity INTEGER,
    product_size VARCHAR(2),
    total_price NUMERIC(10,2),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE orders
(
    order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    product_id UUID,
    quantity INTEGER,
    product_size VARCHAR(255),
    total_price NUMERIC(10,2),
    address_id UUID,
    purchase_date VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (address_id) REFERENCES addresses(address_id)
);