CREATE TABLE "user"
(
    id              serial PRIMARY KEY,
    email           text UNIQUE NOT NULL,
    role            text        NOT NULL,
    hashed_password bytea       NOT NULL,
    address_id      int NULL,
    phone           character(13),
    created_at      TIMESTAMP   NOT NULL,
    updated_at      TIMESTAMP   NOT NULL,
    deleted_at      TIMESTAMP
);

ALTER TABLE "user"
    OWNER TO postgres_iis;


CREATE TABLE address
(
    id          serial PRIMARY KEY,
    street      character varying(100),
    city        character varying(100),
    number      character varying(100),
    postal_code character(5),
    created_at  TIMESTAMP NOT NULL,
    updated_at  TIMESTAMP NOT NULL,
    deleted_at  TIMESTAMP
);

ALTER TABLE address
    OWNER TO postgres_iis;


CREATE TABLE food
(
    id            serial PRIMARY KEY,
    category      character varying(100),
    name          character varying(100),
    description   text,
    price         decimal,
    picture_url   character varying(100),
    restaurant_id integer   NOT NULL,
    is_soldout    bool null,
    created_at    TIMESTAMP NOT NULL,
    updated_at    TIMESTAMP NOT NULL,
    deleted_at    TIMESTAMP
);

ALTER TABLE food
    OWNER TO postgres_iis;


CREATE TABLE "order"
(
    id         serial PRIMARY KEY,
    state      text,
    address_id integer   NOT NULL,
    user_id    integer,
    courier_id integer,
    phone      character(13),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP
);

ALTER TABLE "order"
    OWNER TO postgres_iis;


CREATE TABLE order_food
(
    id         serial PRIMARY KEY,
    order_id   integer   NOT NULL,
    food_id    integer   NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP
);

ALTER TABLE order_food
    OWNER TO postgres_iis;


CREATE TABLE restaurant_category
(
    id         serial PRIMARY KEY,
    name       text,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP
);

ALTER TABLE restaurant_category
    OWNER TO postgres_iis;

CREATE TABLE food_category
(
    id         serial PRIMARY KEY,
    name       text,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP
);

ALTER TABLE food_category
    OWNER TO postgres_iis;

CREATE TABLE restaurant
(
    id             serial PRIMARY KEY,
    category       character varying(100),
    name           text UNIQUE NOT NULL,
    description    text,
    picture_url    character varying(100),
    orders_allowed boolean     NOT NULL,
    created_at     TIMESTAMP   NOT NULL,
    updated_at     TIMESTAMP   NOT NULL,
    deleted_at     TIMESTAMP
);

ALTER TABLE restaurant
    OWNER TO postgres_iis;


CREATE TABLE menu
(
    id         serial PRIMARY KEY,
    name       text      NOT NULL,
    food_id    integer   NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP
);

ALTER TABLE menu
    OWNER TO postgres_iis;


ALTER TABLE ONLY food
    ADD CONSTRAINT food_belongs_to_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurant (id) ON DELETE CASCADE;

ALTER TABLE ONLY "order"
    ADD CONSTRAINT order_has_address FOREIGN KEY (address_id) REFERENCES address (id) ON DELETE CASCADE;

-- ALTER TABLE ONLY "order"
--     ADD CONSTRAINT order_has_orderer FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE;

ALTER TABLE ONLY order_food
    ADD CONSTRAINT food_belongs_to_order FOREIGN KEY (order_id) REFERENCES "order" (id) ON DELETE CASCADE;

ALTER TABLE ONLY order_food
    ADD CONSTRAINT order_has_food FOREIGN KEY (food_id) REFERENCES food (id) ON DELETE CASCADE;

ALTER TABLE ONLY "menu"
    ADD CONSTRAINT menu_has_food FOREIGN KEY (food_id) REFERENCES food (id) ON DELETE CASCADE;

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_has_address FOREIGN KEY (address_id) REFERENCES address (id) ON DELETE CASCADE;

insert into restaurant(category, name, description, picture_url, orders_allowed, created_at, updated_at)
values ('vegan',
        'forkys',
        'vegan restaurant',
        'fake_link',
        true,
        current_timestamp,
        current_timestamp);

insert into restaurant(category, name, description, picture_url, orders_allowed, created_at, updated_at)
values ('ceska',
        'Na purkynce',
        'ceska kuchyna',
        'fake_link',
        true,
        current_timestamp,
        current_timestamp);

insert into restaurant(category, name, description, picture_url, orders_allowed, created_at, updated_at)
values ('ceska',
        'U 3 opic',
        'ceske menu kazdy den',
        'fake_link',
        true,
        current_timestamp,
        current_timestamp);

insert into restaurant(category, name, description, picture_url, orders_allowed, created_at, updated_at)
values ('vietnam',
        'Pho Ha Noi',
        'kazdy den vase oblibene bunbonambo',
        'fake_link',
        true,
        current_timestamp,
        current_timestamp);

insert into restaurant_category(name, created_at, updated_at)
values ('vietnam', current_timestamp, current_timestamp);

insert into restaurant_category(name, created_at, updated_at)
values ('india', current_timestamp, current_timestamp);

insert into restaurant_category(name, created_at, updated_at)
values ('ceska', current_timestamp, current_timestamp);

insert into restaurant_category(name, created_at, updated_at)
values ('azia', current_timestamp, current_timestamp);

insert into restaurant_category(name, created_at, updated_at)
values ('pizza', current_timestamp, current_timestamp);

insert into food_category(name, created_at, updated_at)
values ('bezlepkove', current_timestamp, current_timestamp);

insert into food_category(name, created_at, updated_at)
values ('veganske', current_timestamp, current_timestamp);

insert into food_category(name, created_at, updated_at)
values ('vegetarianske', current_timestamp, current_timestamp);

insert into food_category(name, created_at, updated_at)
values ('bezlaktozove', current_timestamp, current_timestamp);

insert into food(category, name, price, description, picture_url, restaurant_id, is_soldout,created_at, updated_at)
values ('vegan',
        'Tofu',
        30,
        'Tofu s jednoduchou polevou',
        '1.png',
        1,
        false,
        current_timestamp,
        current_timestamp);

insert into food(category, name, price, description, picture_url, restaurant_id, is_soldout,created_at, updated_at)
values ('maso',
        'Burger',
        30,
        'Burger se salatem',
        '2.png',
        2,
        false,
        current_timestamp,
        current_timestamp);

insert into food(category, name, price, description, picture_url, restaurant_id, is_soldout,created_at, updated_at)
values ('vegetarianske',
        'Salat',
        20,
        'Zdravy salat bez omacky',
        '3.png',
        2,
        false,
        current_timestamp,
        current_timestamp);

insert into food(category, name, price, description, picture_url, restaurant_id, is_soldout,created_at, updated_at)
values ('bezlepkove',
        'Ryza',
        10,
        'Priloha ryza',
        '4.png',
        2,
        true,
        current_timestamp,
        current_timestamp);


insert into menu(name, food_id,  created_at, updated_at)
values ('daily',
        1,
        current_timestamp,
        current_timestamp);

insert into menu(name, food_id, created_at, updated_at)
values ('daily',
        2,
        current_timestamp,
        current_timestamp);

insert into menu(name, food_id, created_at, updated_at)
values ('permanent',
        3,
        current_timestamp,
        current_timestamp);

insert into menu(name, food_id, created_at, updated_at)
values ('daily',
        4,
        current_timestamp,
        current_timestamp);


insert into address(street, city, number, postal_code, created_at, updated_at)
values ('Uhorka',
        'Uhorske',
        '500',
        '98525',
        current_timestamp,
        current_timestamp);

insert into "order"(state, address_id, user_id, courier_id, created_at, updated_at)
values ('new',
        1,
        1,
        3,
        current_timestamp,
        current_timestamp);

insert into order_food(order_id, food_id, created_at, updated_at)
values (1,
        1,
        current_timestamp,
        current_timestamp);

select * from "user";