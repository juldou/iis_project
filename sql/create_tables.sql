CREATE TABLE "user"
(
    id              serial PRIMARY KEY,
    email           text UNIQUE NOT NULL,
    role            text        NOT NULL,
    hashed_password bytea       NOT NULL,
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
    number      integer,
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
    created_at    TIMESTAMP NOT NULL,
    updated_at    TIMESTAMP NOT NULL,
    deleted_at    TIMESTAMP
);

ALTER TABLE food
    OWNER TO postgres_iis;


CREATE TABLE "order"
(
    id            serial PRIMARY KEY,
    ordered_at    timestamp NOT NULL,
    delivered_at  timestamp,
    address_id    integer   NOT NULL,
    restaurant_id integer   NOT NULL,
    created_at    TIMESTAMP NOT NULL,
    updated_at    TIMESTAMP NOT NULL,
    deleted_at    TIMESTAMP
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

CREATE TABLE restaurant
(
    id          serial PRIMARY KEY,
    category    character varying(100),
    name        text UNIQUE NOT NULL,
    description text,
    picture_url character varying(100),
    created_at  TIMESTAMP   NOT NULL,
    updated_at  TIMESTAMP   NOT NULL,
    deleted_at  TIMESTAMP
);

ALTER TABLE restaurant
    OWNER TO postgres_iis;


CREATE TABLE menu
(
    id            serial PRIMARY KEY,
    name          text      NOT NULL,
    restaurant_id integer   NOT NULL,
    food_id       integer   NOT NULL,
    created_at    TIMESTAMP NOT NULL,
    updated_at    TIMESTAMP NOT NULL,
    deleted_at    TIMESTAMP
);

ALTER TABLE menu
    OWNER TO postgres_iis;


ALTER TABLE ONLY food
    ADD CONSTRAINT food_belongs_to_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurant (id) ON DELETE CASCADE;

ALTER TABLE ONLY "order"
    ADD CONSTRAINT order_has_address FOREIGN KEY (address_id) REFERENCES address (id) ON DELETE CASCADE;

ALTER TABLE ONLY "order"
    ADD CONSTRAINT order_belongs_to_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurant (id) ON DELETE CASCADE;

ALTER TABLE ONLY order_food
    ADD CONSTRAINT food_belongs_to_order FOREIGN KEY (order_id) REFERENCES "order" (id) ON DELETE CASCADE;

ALTER TABLE ONLY order_food
    ADD CONSTRAINT order_has_food FOREIGN KEY (food_id) REFERENCES food (id) ON DELETE CASCADE;

ALTER TABLE ONLY "menu"
    ADD CONSTRAINT menu_belongs_to_restaurant FOREIGN KEY (food_id) REFERENCES restaurant (id) ON DELETE CASCADE;

ALTER TABLE ONLY "menu"
    ADD CONSTRAINT menu_has_food FOREIGN KEY (food_id) REFERENCES food (id) ON DELETE CASCADE;

insert into restaurant(category, name, description, picture_url, created_at, updated_at)
values ('vegan',
        'forkys',
        'vegan restaurant',
        'fake_link',
        current_timestamp,
        current_timestamp);

insert into restaurant(category, name, description, picture_url, created_at, updated_at)
values ('ceska',
        'Na purkynce',
        'ceska kuchyna',
        'fake_link',
        current_timestamp,
        current_timestamp);

insert into restaurant(category, name, description, picture_url, created_at, updated_at)
values ('ceska',
        'U 3 opic',
        'ceske menu kazdy den',
        'fake_link',
        current_timestamp,
        current_timestamp);

insert into restaurant(category, name, description, picture_url, created_at, updated_at)
values ('vietnam',
        'Pho Ha Noi',
        'kazdy den vase oblibene bunbonambo',
        'fake_link',
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

insert into food(category, name, price, description, picture_url, restaurant_id, created_at, updated_at)
values ('vegetarianske',
        'Tofu',
        30,
        'Tofu s jednoduchou polevou',
        'fake_link',
        1,
        current_timestamp,
        current_timestamp);

insert into food(category, name, price, description, picture_url, restaurant_id, created_at, updated_at)
values ('vegetarianske',
        'Tofu',
        30,
        'Tofu s jednoduchou polevou',
        'fake_link',
        2,
        current_timestamp,
        current_timestamp);

insert into food(category, name, price, description, picture_url, restaurant_id, created_at, updated_at)
values ('veganske',
        'Salat',
        20,
        'Zdravy salat bez omacky',
        'fake_link',
        2,
        current_timestamp,
        current_timestamp);

insert into food(category, name, price, description, picture_url, restaurant_id, created_at, updated_at)
values ('bezlepkove',
        'Ryza',
        10,
        'Ryza s paprikou',
        'fake_link',
        2,
        current_timestamp,
        current_timestamp);


insert into menu(name, restaurant_id, food_id, created_at, updated_at)
values ('daily',
        1,
        1,
        current_timestamp,
        current_timestamp);

insert into menu(name, restaurant_id, food_id, created_at, updated_at)
values ('daily',
        1,
        2,
        current_timestamp,
        current_timestamp);

insert into menu(name, restaurant_id, food_id, created_at, updated_at)
values ('permanent',
        1,
        3,
        current_timestamp,
        current_timestamp);

insert into menu(name, restaurant_id, food_id, created_at, updated_at)
values ('daily',
        2,
        2,
        current_timestamp,
        current_timestamp);
