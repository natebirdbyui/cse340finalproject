CREATE SCHEMA IF NOT EXISTS cse340finalproject;

CREATE TABLE IF NOT EXISTS cse340finalproject.menu_item (
    menu_item_id SERIAL PRIMARY KEY,
    category VARCHAR(60) NOT NULL,
    name VARCHAR(120) NOT NULL,
    servings_per_tray INTEGER NOT NULL CHECK (servings_per_tray > 0),
    price_per_serving NUMERIC(10, 2) NOT NULL CHECK (price_per_serving >= 0),
    description TEXT,
    image VARCHAR(255) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cse340finalproject.user (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cse340finalproject.booking (
    booking_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES cse340finalproject.user(user_id) ON DELETE SET NULL,
    customer_name VARCHAR(120) NOT NULL,
    customer_email VARCHAR(160) NOT NULL,
    customer_phone VARCHAR(40),
    event_date DATE NOT NULL,
    guest_count INTEGER NOT NULL CHECK (guest_count > 0),
    notes TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cse340finalproject.booking_item (
    booking_item_id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES cse340finalproject.booking(booking_id) ON DELETE CASCADE,
    menu_item_id INTEGER NOT NULL REFERENCES cse340finalproject.menu_item(menu_item_id) ON DELETE RESTRICT,
    trays INTEGER NOT NULL CHECK (trays > 0),
    servings_per_tray INTEGER NOT NULL,
    price_per_serving NUMERIC(10, 2) NOT NULL
);

INSERT INTO cse340finalproject.menu_item
    (category, name, servings_per_tray, price_per_serving, description, image)
VALUES
    ('BBQ', 'Grilled Chicken', 8, 2.50, 'Juicy grilled chicken grilled to perfection with our special BBQ sauce, served with cilantro and lime.', '/images/food/bbq-2823726_640.jpg'),
    ('BBQ', 'BBQ Ribs Complete Meal', 20, 4.00, 'Tender BBQ ribs smoked to perfection glazed with our special BBQ sauce, served with baked potatoes, garlic bread, and pit style beans. A delicious meal!', '/images/food/rsz_complete_bbq.jpg'),
    ('BBQ', 'Bacon Wrapped Pork Tenderloin', 10, 5.00, 'Juicy pork tenderloin wrapped smoked in crispy bacon and glazed with our special BBQ sauce.', '/images/food/rsz_bacon_wrap_pork.jpg'),
    ('BBQ', 'Hamburger & Hotdog Meal', 12, 2.50, 'A delicious meal of our signature smoked hamburgers and hotdogs served with fries, and mushrooms.', '/images/food/rsz_bbq_hamburger_hotdog.jpg'),
    ('Baking', 'Wedding Cake', 75, 5.00, 'A delicious wedding cake with layers of vanilla and chocolate cake, filled with our special buttercream frosting.', '/images/food/wedding-cake-639516_640.jpg'),
    ('Baking', 'Boston Market Sweet Potato Casserole', 20, 2.00, 'A delicious sweet potato casserole with a buttery, cinnamon-sugar topping, perfect for any holiday meal.', '/images/food/rsz_1sweet_potato_casserole.jpg'),
    ('Cooking', 'Tacos del camarón', 12, 3.50, 'Delicious shrimp tacos with salsa roja, grilled onions, mexican crema, fire roasted peppers and corn, along with cilantro and lime.', '/images/food/tacos-4495602_640.jpg'),
    ('Cooking', 'Chicken Enchiladas', 15, 3.00, 'Tender chicken enchiladas filled with seasoned chicken, cheese, and green chilies, served with rice and beans.', '/images/food/rsz_chicken_enchiladas.jpg'),
    ('Cooking', 'Tacos al Pastor', 12, 3.50, 'Perfected pork tacos marinated in a blend of spices and pineapple, white onion, cilantro, and lime. Our owner''s favorite taco when he served his mission in Mexico! He knows the flavor, and he perfected it like a real taquero!', '/images/food/rsz_tacos_alpastor.jpg'),
    ('Refreshments', 'Lemonade', 12, 1.50, 'Refreshing hand-squeezed lemonade, our owner has perfected this recipe from his time working for Chick-fil-A.', '/images/drinks/lemonade.jpg'),
    ('Refreshments', 'Soda', 12, 1.50, 'Delicious homemade soda, perfect for any occasion.', '/images/drinks/sodas.jpg'),
    ('Refreshments', 'Horchata', 12, 1.50, 'Delicious homemade horchata, a traditional Mexican rice drink flavored with cinnamon and vanilla. Nathan has mastered this recipe from his time living in Mexico.', '/images/drinks/horchata.jpg'),
    ('Sides', 'Macaroni Salad', 12, 2.00, 'Creamy and delicious macaroni salad made from the heart. From our kitchen to your table!', '/images/food/macaroni_salad.jpg'),
    ('Sides', 'Potato Salad', 12, 2.00, 'Creamy and delicious potato salad, this potato salad has many great seasonings to make your taste buds dance.', '/images/food/potato_salad.jpg'),
    ('Sides', 'Chef Salad', 12, 2.50, 'Crisp and refreshing chef salad, a perfect side dish for any meal.', '/images/food/chef_salad.jpg'),
    ('Sides', 'Pit Style Baked Beans', 20, 2.00, 'Delicious pit style baked beans, you don''t like beans, this will change your mind!', '/images/food/rsz_pit_style_beans.jpg'),
    ('Sides', 'Texas Twinkie', 12, 1.50, 'Delicious Texas Twinkie, this is a great side dish that will make a meal of itself. We know you can''t have just one bite.', '/images/food/rsz_1texas_twinkie.jpg'),
    ('Entree', 'Steak and Potatoes', 8, 6.00, 'Juicy steak served with perfectly smoked-baked potatoes, a hearty entree to make the party right.', '/images/food/rsz_steak_and_tators.jpg'),
    ('Entree', 'Tri-Tip Steak and Potatoes', 12, 8.50, 'Juicy tri-tip steak served with perfectly smoked-baked potatoes, a hearty entree that will make your guests talk about it for years.', '/images/food/rsz_steak_n_potatoes.jpg'),
    ('Entree', 'Smoked Bacon Wrapped Chicken Bombs', 8, 7.00, 'Smoked bacon wrapped chicken bombs, a flavorful and indulgent entree option. These bombs are made with tender chicken breasts stuffed with a savory filling, wrapped in crispy bacon, and smoked to perfection. The result is a deliciously smoky and juicy dish that will satisfy any meat lover''s cravings.', '/images/food/rsz_chicken_bombs.jpg')
ON CONFLICT DO NOTHING;