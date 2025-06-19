CREATE TABLE cuisines (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_restaurant
        FOREIGN KEY (restaurant_id)
        REFERENCES restaurants(id)
        ON DELETE CASCADE
);


CREATE TABLE combo_offers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(100),
    cuisine_id INTEGER NOT NULL,
    restaurant_id INTEGER NOT NULL,
    description TEXT,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cuisine
        FOREIGN KEY (cuisine_id)
        REFERENCES cuisines(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_restaurant
        FOREIGN KEY (restaurant_id)
        REFERENCES restaurants(id)
        ON DELETE CASCADE
);


CREATE TABLE special_offers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(100),
    cuisine_id INTEGER NOT NULL,
    restaurant_id INTEGER NOT NULL,
    description TEXT,
    discount NUMERIC(5, 2),
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cuisine
        FOREIGN KEY (cuisine_id)
        REFERENCES cuisines(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_restaurant
        FOREIGN KEY (restaurant_id)
        REFERENCES restaurants(id)
        ON DELETE CASCADE
);


CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo VARCHAR(255),
    address VARCHAR(200),
    district VARCHAR(100),
    user_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(clerk_id)
        ON DELETE CASCADE
);

CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    image VARCHAR(255),
    discount NUMERIC(5, 2), 
    restaurant_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_restaurant
        FOREIGN KEY (restaurant_id)
        REFERENCES restaurants(id)
        ON DELETE CASCADE
);


CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    offer_id INTEGER,
    image VARCHAR(255),
    restaurant_id INTEGER NOT NULL,
    cuisine_id INTEGER NOT NULL,
    specialities TEXT,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    is_popular BOOLEAN DEFAULT FALSE,
    is_bengali BOOLEAN DEFAULT FALSE,
    is_special BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_offer
        FOREIGN KEY (offer_id)
        REFERENCES offers(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_restaurant
        FOREIGN KEY (restaurant_id)
        REFERENCES restaurants(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cuisine
        FOREIGN KEY (cuisine_id)
        REFERENCES cuisines(id)
        ON DELETE CASCADE
);


CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    number INTEGER NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    student_id INTEGER NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    restaurant_name VARCHAR(150) NOT NULL,
    cuisine_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_clerk
        FOREIGN KEY (user_id)
        REFERENCES users(clerk_id)
        ON DELETE CASCADE
);


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    clerk_id VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20),
    is_admin BOOLEAN DEFAULT FALSE,
    is_owner BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
