CREATE TABLE "user"
(
    id              serial PRIMARY KEY,
    email           text UNIQUE NOT NULL,
    hashed_password bytea       NOT NULL,
    created_at      TIMESTAMP   NOT NULL,
    updated_at      TIMESTAMP   NOT NULL,
    deleted_at      TIMESTAMP
);

ALTER TABLE "user"
    OWNER TO postgres_iis;


CREATE TABLE admin
(
)
    INHERITS ("user");


ALTER TABLE admin
    OWNER TO postgres_iis;


CREATE TABLE courier
(
)
    INHERITS ("user");


ALTER TABLE courier
    OWNER TO postgres_iis;


CREATE TABLE operator
(
)
    INHERITS ("user");


ALTER TABLE operator
    OWNER TO postgres_iis;


CREATE TABLE boarder
(
)
    INHERITS ("user");

ALTER TABLE boarder
    OWNER TO postgres_iis;


CREATE TABLE address
(
    id            serial PRIMARY KEY,
    street        character varying(100),
    city          character varying(100),
    number        integer,
    postal_code   character(5),
    fk_obj_id     integer   NOT NULL,
    fk_boarder_id integer   NOT NULL,
    created_at    TIMESTAMP NOT NULL,
    updated_at    TIMESTAMP NOT NULL,
    deleted_at    TIMESTAMP
);

ALTER TABLE address
    OWNER TO postgres_iis;


CREATE TABLE food
(
    id               serial PRIMARY KEY,
    category             character varying(100),
    name             character varying(100),
    description      text,
    picture_link     character varying(100),
    price            decimal,
    fk_obj_id        integer   NOT NULL,
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


CREATE TABLE restaurant
(
    id             serial PRIMARY KEY,
    category       character varying(100),
    name           character varying(100),
    description    text,
    picture_url    character varying(100),
    price_category character varying(3),
    CONSTRAINT restauracia_cenova_kategoria_check CHECK (((price_category)::text = ANY
                                                          ((ARRAY ['€'::character varying, '€€'::character varying, '€€€'::character varying])::text[]))),
    created_at     TIMESTAMP NOT NULL,
    updated_at     TIMESTAMP NOT NULL,
    deleted_at     TIMESTAMP
);

ALTER TABLE restaurant
    OWNER TO postgres_iis;


ALTER TABLE ONLY address
    ADD CONSTRAINT fk_adr_reference_rest FOREIGN KEY (fk_obj_id) REFERENCES restaurant (id);

ALTER TABLE ONLY food
    ADD CONSTRAINT fk_jed_reference_obj FOREIGN KEY (fk_obj_id) REFERENCES "order" (id) ON DELETE CASCADE;

ALTER TABLE ONLY food
    ADD CONSTRAINT fk_jed_reference_restaurant FOREIGN KEY (fk_restaurant_id) REFERENCES restaurant (id) ON DELETE CASCADE;

ALTER TABLE ONLY "order"
    ADD CONSTRAINT fk_obj_reference_address FOREIGN KEY (fk_address_id) REFERENCES address (id) ON DELETE CASCADE;

ALTER TABLE ONLY "order"
    ADD CONSTRAINT fk_obj_reference_restaurant FOREIGN KEY (fk_restaurant_id) REFERENCES restaurant (id) ON DELETE CASCADE;


insert into restaurant(category, name, description, picture_url, price_category, created_at, updated_at)
values ('ceska',
        'forkys',
        'vegan restaurant',
        'fake_link',
        '€',
        current_timestamp,
        current_timestamp);