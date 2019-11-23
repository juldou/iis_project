CREATE TABLE "user"
(
    id              serial PRIMARY KEY,
    email           text UNIQUE NOT NULL,
    user_type       text        NOT NULL,
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
    id               serial PRIMARY KEY,
    category         character varying(100),
    name             character varying(100),
    description      text,
    picture_url     character varying(100),
    restaurant_id integer   NOT NULL,
    created_at       TIMESTAMP NOT NULL,
    updated_at       TIMESTAMP NOT NULL,
    deleted_at       TIMESTAMP
);

ALTER TABLE food
    OWNER TO postgres_iis;


CREATE TABLE "order"
(
    id               serial PRIMARY KEY,
    ordered_at       timestamp NOT NULL,
    delivered_at     timestamp,
    address_id    integer   NOT NULL,
    restaurant_id integer   NOT NULL,
    created_at       TIMESTAMP NOT NULL,
    updated_at       TIMESTAMP NOT NULL,
    deleted_at       TIMESTAMP
);

ALTER TABLE "order"
    OWNER TO postgres_iis;


CREATE TABLE rel_order_contains_food
(
    id          serial PRIMARY KEY,
    order_id integer   NOT NULL,
    food_id  integer   NOT NULL,
    created_at  TIMESTAMP NOT NULL,
    updated_at  TIMESTAMP NOT NULL,
    deleted_at  TIMESTAMP
);

ALTER TABLE "rel_order_contains_food"
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


CREATE TABLE daily_menu
(
    id               serial PRIMARY KEY,
    restaurant_id integer   NOT NULL,
    food_id       integer   NOT NULL,
    price            decimal,
    created_at       TIMESTAMP NOT NULL,
    updated_at       TIMESTAMP NOT NULL,
    deleted_at       TIMESTAMP
);

ALTER TABLE daily_menu
    OWNER TO postgres_iis;


ALTER TABLE ONLY food
    ADD CONSTRAINT food_reference_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurant (id) ON DELETE CASCADE;

ALTER TABLE ONLY "order"
    ADD CONSTRAINT order_reference_address FOREIGN KEY (address_id) REFERENCES address (id) ON DELETE CASCADE;

ALTER TABLE ONLY "order"
    ADD CONSTRAINT order_reference_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurant (id) ON DELETE CASCADE;

ALTER TABLE ONLY "rel_order_contains_food"
    ADD CONSTRAINT rel_order_has_order_id FOREIGN KEY (order_id) REFERENCES restaurant (id) ON DELETE CASCADE;

ALTER TABLE ONLY "rel_order_contains_food"
    ADD CONSTRAINT rel_order_has_food_id FOREIGN KEY (food_id) REFERENCES restaurant (id) ON DELETE CASCADE;

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

insert into food(category, name, description, picture_url, restaurant_id, created_at, updated_at)
values ('vegetarianske',
        'Tofu',
        'Tofu s jednoduchou polevou',
        'fake_link',
        1,
        current_timestamp,
        current_timestamp);

insert into food(category, name, description, picture_url, restaurant_id, created_at, updated_at)
values ('vegetarianske',
        'Tofu',
        'Tofu s jednoduchou polevou',
        'fake_link',
        2,
        current_timestamp,
        current_timestamp);

insert into food(category, name, description, picture_url, restaurant_id, created_at, updated_at)
values ('veganske',
        'Salat',
        'Zdravy salat bez omacky',
        'fake_link',
        2,
        current_timestamp,
        current_timestamp);

insert into food(category, name, description, picture_url, restaurant_id, created_at, updated_at)
values ('bezlepkove',
        'Ryza',
        'Ryza s paprikou',
        'fake_link',
        2,
        current_timestamp,
        current_timestamp);