CREATE TABLE "user"
(
    id              serial PRIMARY KEY,
    email           text UNIQUE NOT NULL,
    user_type       text NOT NULL,
    hashed_password bytea       NOT NULL,
    created_at      TIMESTAMP   NOT NULL,
    updated_at      TIMESTAMP   NOT NULL,
    deleted_at      TIMESTAMP
);

ALTER TABLE "user"
    OWNER TO postgres_iis;


CREATE TABLE address
(
    id            serial PRIMARY KEY,
    street        character varying(100),
    city          character varying(100),
    number        integer,
    postal_code   character(5),
    created_at    TIMESTAMP NOT NULL,
    updated_at    TIMESTAMP NOT NULL,
    deleted_at    TIMESTAMP
);

ALTER TABLE address
    OWNER TO postgres_iis;


CREATE TABLE food
(
    id               serial PRIMARY KEY,
    category         character varying(100),
    name             character varying(100),
    description      text,
    picture_link     character varying(100),
    price            decimal,
    fk_restaurant_id integer   NOT NULL,
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
    fk_address_id    integer   NOT NULL,
    fk_restaurant_id integer   NOT NULL,
    created_at       TIMESTAMP NOT NULL,
    updated_at       TIMESTAMP NOT NULL,
    deleted_at       TIMESTAMP
);

ALTER TABLE "order"
    OWNER TO postgres_iis;


CREATE TABLE rel_order_contains_food
(
    id               serial PRIMARY KEY,
    fk_order_id      integer NOT NULL,
    fk_food_id       integer NOT NULL,
    created_at       TIMESTAMP NOT NULL,
    updated_at       TIMESTAMP NOT NULL,
    deleted_at       TIMESTAMP
);

ALTER TABLE "rel_order_contains_food"
    OWNER TO postgres_iis;


CREATE TABLE restaurant_category
(
    id              serial PRIMARY KEY,
    name    text,
    created_at       TIMESTAMP NOT NULL,
    updated_at       TIMESTAMP NOT NULL,
    deleted_at       TIMESTAMP
);

CREATE TABLE restaurant
(
    id             serial PRIMARY KEY,
    category       character varying(100),
    name           text UNIQUE NOT NULL,
    description    text,
    picture_url    character varying(100),
    created_at     TIMESTAMP NOT NULL,
    updated_at     TIMESTAMP NOT NULL,
    deleted_at     TIMESTAMP
);

ALTER TABLE restaurant
    OWNER TO postgres_iis;


ALTER TABLE ONLY food
    ADD CONSTRAINT fk_food_reference_restaurant FOREIGN KEY (fk_restaurant_id) REFERENCES restaurant (id) ON DELETE CASCADE;

ALTER TABLE ONLY "order"
    ADD CONSTRAINT fk_order_reference_address FOREIGN KEY (fk_address_id) REFERENCES address (id) ON DELETE CASCADE;

ALTER TABLE ONLY "order"
    ADD CONSTRAINT fk_order_reference_restaurant FOREIGN KEY (fk_restaurant_id) REFERENCES restaurant (id) ON DELETE CASCADE;

ALTER TABLE ONLY "rel_order_contains_food"
    ADD CONSTRAINT fk_rel_order_contains_food_order_id FOREIGN KEY (fk_order_id) REFERENCES restaurant (id) ON DELETE CASCADE;

ALTER TABLE ONLY "rel_order_contains_food"
    ADD CONSTRAINT fk_rel_order_contains_food_food_id FOREIGN KEY (fk_food_id) REFERENCES restaurant (id) ON DELETE CASCADE;

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