--
-- PostgreSQL database dump
--

-- Dumped from database version 17.3
-- Dumped by pg_dump version 17.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO postgres;

--
-- Name: character_gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.character_gender AS ENUM (
    'Male',
    'Female',
    'Unspecified'
);


ALTER TYPE public.character_gender OWNER TO postgres;

--
-- Name: character_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.character_type AS ENUM (
    'Protagonist',
    'Antagonist',
    'Supporting',
    'Minor',
    'Background'
);


ALTER TYPE public.character_type OWNER TO postgres;

--
-- Name: construct_category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.construct_category AS ENUM (
    'AFFLICTIONS',
    'MANIFESTATIONS',
    'ENTITIES',
    'VESTIGES'
);


ALTER TYPE public.construct_category OWNER TO postgres;

--
-- Name: faction_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.faction_type AS ENUM (
    'GUILD',
    'GOVERNMENT',
    'MILITARY',
    'FAMILY'
);


ALTER TYPE public.faction_type OWNER TO postgres;

--
-- Name: galaxy_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.galaxy_type AS ENUM (
    'SPIRAL',
    'BARRED_SPIRAL',
    'ELLIPTICAL',
    'IRREGULAR',
    'LENTICULAR',
    'RING',
    'DWARF'
);


ALTER TYPE public.galaxy_type OWNER TO postgres;

--
-- Name: nature_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.nature_type AS ENUM (
    'PLANT',
    'ANIMAL',
    'MINERAL'
);


ALTER TYPE public.nature_type OWNER TO postgres;

--
-- Name: occurance; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.occurance AS ENUM (
    'EXTANT',
    'EXTINCT',
    'MYTHICAL'
);


ALTER TYPE public.occurance OWNER TO postgres;

--
-- Name: region_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.region_type AS ENUM (
    'CONTINENT',
    'OCEAN',
    'SEA',
    'LAKE',
    'STATE',
    'CITY',
    'MOUNTAIN_RANGE',
    'FOREST',
    'DESERT',
    'ISLAND',
    'VALLEY',
    'RIVER'
);


ALTER TYPE public.region_type OWNER TO postgres;

--
-- Name: relationship_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.relationship_type AS ENUM (
    'SPOUSE',
    'PARENT_OF',
    'SIBLING_OF',
    'REPORTS_TO'
);


ALTER TYPE public.relationship_type OWNER TO postgres;

--
-- Name: spectral_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.spectral_type AS ENUM (
    'HOT_BLUE_STAR',
    'BLUE_WHITE_STAR',
    'WHITE_STAR',
    'YELLOW_WHITE_STAR',
    'YELLOW_STAR',
    'ORANGE_STAR',
    'RED_STAR',
    'LUMINOUS_RED_GIANT',
    'SUPER_GIANT',
    'WHITE_DWARF',
    'NEUTRON_STAR',
    'BLACK_HOLE',
    'UNKNOWN'
);


ALTER TYPE public.spectral_type OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: postgres
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: postgres
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: postgres
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: character_power_access; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.character_power_access (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    character_id uuid NOT NULL,
    power_system_id uuid,
    subsystem_id uuid,
    category_id uuid,
    ability_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.character_power_access OWNER TO postgres;

--
-- Name: character_relationships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.character_relationships (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    universe_id uuid NOT NULL,
    source_character_id uuid NOT NULL,
    target_character_id uuid NOT NULL,
    type public.relationship_type NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    faction_id uuid
);


ALTER TABLE public.character_relationships OWNER TO postgres;

--
-- Name: characters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.characters (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    universe_id uuid NOT NULL,
    race_id uuid,
    ethnic_group_id uuid,
    name text NOT NULL,
    background text,
    type public.character_type,
    gender public.character_gender DEFAULT 'Unspecified'::public.character_gender,
    age integer,
    avatar_url text,
    image_urls text[] DEFAULT '{}'::text[] NOT NULL,
    benched boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.characters OWNER TO postgres;

--
-- Name: constructs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.constructs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    category public.construct_category NOT NULL,
    universe_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    properties jsonb,
    rarity text,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    avatar_url text,
    image_urls text[] DEFAULT '{}'::text[] NOT NULL
);


ALTER TABLE public.constructs OWNER TO postgres;

--
-- Name: ethnic_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ethnic_groups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    race_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    avatar_url text,
    image_urls text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.ethnic_groups OWNER TO postgres;

--
-- Name: factions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.factions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    universe_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    type public.faction_type NOT NULL,
    avatar_url text,
    image_urls text[] DEFAULT '{}'::text[] NOT NULL
);


ALTER TABLE public.factions OWNER TO postgres;

--
-- Name: galaxies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.galaxies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    universe_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    type public.galaxy_type DEFAULT 'SPIRAL'::public.galaxy_type NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    avatar_url text,
    image_urls text[]
);


ALTER TABLE public.galaxies OWNER TO postgres;

--
-- Name: map_svg_mappings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.map_svg_mappings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    map_id uuid NOT NULL,
    svg_element_id text NOT NULL,
    feature_type text NOT NULL,
    region_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    x real,
    y real
);


ALTER TABLE public.map_svg_mappings OWNER TO postgres;

--
-- Name: maps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    universe_id uuid NOT NULL,
    region_id uuid NOT NULL,
    image_url text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.maps OWNER TO postgres;

--
-- Name: nature; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nature (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    universe_id uuid NOT NULL,
    name text NOT NULL,
    type public.nature_type NOT NULL,
    description text,
    avatar_url text,
    image_urls text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    occurance public.occurance DEFAULT 'EXTANT'::public.occurance
);


ALTER TABLE public.nature OWNER TO postgres;

--
-- Name: planets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.planets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    solar_system_id uuid NOT NULL,
    parent_planet_id uuid,
    name text NOT NULL,
    description text,
    is_habitable boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    avatar_url text,
    image_urls text[]
);


ALTER TABLE public.planets OWNER TO postgres;

--
-- Name: power_abilities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.power_abilities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id uuid,
    name text NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    power_system_id uuid,
    subsystem_id uuid
);


ALTER TABLE public.power_abilities OWNER TO postgres;

--
-- Name: power_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.power_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    subsystem_id uuid,
    name text NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    power_system_id uuid
);


ALTER TABLE public.power_categories OWNER TO postgres;

--
-- Name: power_subsystems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.power_subsystems (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    power_system_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.power_subsystems OWNER TO postgres;

--
-- Name: power_systems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.power_systems (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    root_of_power_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.power_systems OWNER TO postgres;

--
-- Name: races; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.races (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    universe_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    lifespan text,
    languages text[],
    avatar_url text,
    image_urls text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.races OWNER TO postgres;

--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    token text NOT NULL,
    user_id uuid NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    is_revoked boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    device_info text,
    ip_address text
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: regions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.regions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    universe_id uuid NOT NULL,
    parent_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    type public.region_type NOT NULL,
    planet_id uuid,
    religion_id uuid,
    avatar_url text,
    image_urls text[] DEFAULT '{}'::text[] NOT NULL
);


ALTER TABLE public.regions OWNER TO postgres;

--
-- Name: religions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.religions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    universe_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    deities text[] DEFAULT '{}'::text[] NOT NULL,
    holy_sites text[] DEFAULT '{}'::text[] NOT NULL,
    avatar_url text,
    image_urls text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.religions OWNER TO postgres;

--
-- Name: roots_of_power; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roots_of_power (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    universe_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.roots_of_power OWNER TO postgres;

--
-- Name: solar_systems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solar_systems (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    galaxy_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    avatar_url text,
    image_urls text[]
);


ALTER TABLE public.solar_systems OWNER TO postgres;

--
-- Name: stars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stars (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    solar_system_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    type public.spectral_type DEFAULT 'YELLOW_STAR'::public.spectral_type NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    avatar_url text,
    image_urls text[]
);


ALTER TABLE public.stars OWNER TO postgres;

--
-- Name: universes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.universes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.universes OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    last_login_at timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: postgres
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	5b92353c3178a5c8e4afe9285c9fed1dd342e80392f1f10a73832fa92ba1713e	1772106445188
2	3545e6718d592c248f1e6ce38c6e4af4943646e27b62b98cb996124c2ff4ed15	1772133822760
3	8e43c5f88b939020b2a0e237cbefe2b0e70cce5bfe2372eb734116a24cde9ea2	1772140471127
4	89101e16aad8a6f4122c124af0c370aa27f978633649fd7eca83245deb374f81	1772229421954
5	7014b0c9f8e49d5b1a4bf7aed33211b1352905128e47cda00b523bc4592669a7	1772229499350
6	04437a19d9a97ad298b4afdc2d0e01cedf3feb6b6b0ff3132b753c8dde3e10cc	1772272181160
7	79ecccd6c30d7b368b0711e8d8eec5c974782de33fcce5549c020b76fe3634b3	1772314028079
8	33e9c8bc31016df0ae3196be4b1d9d7280fa63a9d3b7cf78dc96e4d3d079bd40	1772316655715
9	921ba21c7582467d6c4bdeb3c76c19c37037855d95d969e8cc28ead036eb93ea	1772316923333
10	7753f5956672da3e1bbbb034b5e864c7e0016a89ab8ccf1ccf9e03218a0d3055	1772320608958
11	1d4b47d221e370bb427494df757c1b8bde948be6c697c5a8954a73acbcda7ab4	1772320634189
12	2ccc59e76003a54d7f50b094fcb7dc6a63610dd8f13c6411aadce736987164ef	1772364427272
13	5434222c08458373598a51e56dff68d8858e6a4c3d11bcdd7eda8c40674c20cb	1772365747178
14	2bc13c729c715affd2942809bc499300ea64bdaa65440ee79a94627c4e8734f1	1772454890589
15	1b84b909353287f4e7b43e5cd60bac12c9d73be69a804fd8724d7731df660aa2	1772459680505
16	c6c379d9c928844fbed66c882b55743a2c283e6171b0f19b291088f5754e10a6	1772532465194
17	4937695fc91ec91906a48433b471429c8a3e2af502b589de698c338ae5e097ce	1772533521445
18	f2747405659833df65c946a8c364ec391dd65e6e39abc5f515484fd340d1fd72	1772533664752
19	4fe5986ce20db22f97b4dcda285c7d6540a85761aad38aa11bd04f7afa44d85a	1772556409237
20	fd27eb1987eef5a32d387f5de408ff196ae0cd1757fc6efbd7e9f72f27caf2b9	1772697456857
21	46d03f27644dddbec989e43ad5e8d9fd306307b888c174ea7680989a2d365e1e	1772733489839
22	2849106282f333764530c24b25ec0497844793eeeaddf258c8a151cdaa187924	1772795200205
23	247c192a1957dcc86ea21942c8a759fa5ea41f1d21a0c0453cdbc2b7a56b2987	1772795399474
24	571422cde28774ec4bda80465575e06bdf902f949329d69ea4cee88c7cf4a6ee	1772796320400
25	0f0c7f2766af2f41206879d4feaef38209ab21135e9b91005023a47034c0bd5a	1772912409725
26	090c6bcf2e867a624196b32383850ce68e8110fd7a0ee2f5612b31841c62445b	1772914076705
27	807ace8fafe324db466665a9f3ed1bd95c73f916d3f7a82a39c2ff2cebb12b4d	1772914599065
28	3868db1a52d37b05f39c88298f7edf15f12ece8e3be293dfac415576d7afb1b4	1772925023441
29	8c86761bb0a13fda120142d3019dead10475d3ccd950a39c0302722bf9b5879e	1772925551440
30	047fd79d5f2213c859225a28bf4b8161e47483b6c404a683f0e465384607517d	1772926848233
31	c50fd42f05d6dd66e31ca37a481b63f9dcc7f1d8075e92f3653cb77a069047fc	1772977955639
32	2c3598d28f3d27acbc9717b584af785906e50c621b5b758e7e49bc424c4f7452	1772991840302
\.


--
-- Data for Name: character_power_access; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.character_power_access (id, character_id, power_system_id, subsystem_id, category_id, ability_id, created_at, updated_at) FROM stdin;
bfc44132-ca57-4def-9fc8-06b28a39789b	c855042f-3ff7-4fa8-aa4f-26fca3a3d050	a3a8454b-3caf-4081-982a-5306c005f86f	\N	\N	\N	2025-02-15 14:37:25.41	2025-02-15 14:37:25.41
c9f317de-b0a4-4c22-b9fc-ad35523266ad	c855042f-3ff7-4fa8-aa4f-26fca3a3d050	569404c0-7dea-40c7-8697-37ba79bdbe4b	\N	\N	\N	2025-02-15 14:37:25.41	2025-02-15 14:37:25.41
018a2a3c-bf2b-482a-aa6d-6486786d0cf1	c855042f-3ff7-4fa8-aa4f-26fca3a3d050	a3a8454b-3caf-4081-982a-5306c005f86f	254d7c32-6721-461d-8ffb-9dc4db3b86f8	\N	\N	2025-02-15 14:37:25.413	2025-02-15 14:37:25.413
4033aae2-08f2-4975-95ba-617964fdc0b9	c855042f-3ff7-4fa8-aa4f-26fca3a3d050	a3a8454b-3caf-4081-982a-5306c005f86f	0a76001d-146a-411c-abae-34bdba696be5	\N	\N	2025-02-15 14:37:25.413	2025-02-15 14:37:25.413
0767b81f-e755-4dda-bb51-ffbc25d6d56f	c855042f-3ff7-4fa8-aa4f-26fca3a3d050	569404c0-7dea-40c7-8697-37ba79bdbe4b	7d7b039c-fd26-498e-8708-b974bd101d9a	\N	\N	2025-02-15 14:37:25.413	2025-02-15 14:37:25.413
11626a7f-caf2-4886-9bdf-b18f8a738e6c	c855042f-3ff7-4fa8-aa4f-26fca3a3d050	569404c0-7dea-40c7-8697-37ba79bdbe4b	7af13869-1eb2-4bf3-83c6-16e4e702e439	\N	\N	2025-02-15 14:37:25.413	2025-02-15 14:37:25.413
2434c903-b622-4248-b6de-7f94f27f1550	c855042f-3ff7-4fa8-aa4f-26fca3a3d050	569404c0-7dea-40c7-8697-37ba79bdbe4b	17b96fea-3820-4ce1-9263-912abee74b04	\N	\N	2025-02-15 14:37:25.413	2025-02-15 14:37:25.413
3baae1fc-a4e1-4955-b379-b2824c1d9cbd	c855042f-3ff7-4fa8-aa4f-26fca3a3d050	569404c0-7dea-40c7-8697-37ba79bdbe4b	17b96fea-3820-4ce1-9263-912abee74b04	1fce812e-57dd-4853-8d35-aa5402491536	\N	2025-02-15 14:37:25.414	2025-02-15 14:37:25.414
2ca982c3-0849-4e30-9839-9cdb65d29949	2c915b3b-4d1e-42ca-bdf5-7f7c0be9e373	3dd0f983-4aaf-474b-8d68-a084a1d6714d	7aa3d3c5-953b-484c-a817-f0036178094c	\N	\N	2025-02-15 17:17:17.478	2025-02-16 15:28:36.372
b3675870-f563-4470-a697-d4890f67a05f	2c915b3b-4d1e-42ca-bdf5-7f7c0be9e373	3dd0f983-4aaf-474b-8d68-a084a1d6714d	d3f2f4b8-60e8-4c9c-9b46-966d16e57b47	\N	\N	2025-02-15 17:17:17.478	2025-02-16 15:28:36.372
008c216b-3f6b-4b8f-a1a0-a62cc5bbadb7	2c915b3b-4d1e-42ca-bdf5-7f7c0be9e373	3dd0f983-4aaf-474b-8d68-a084a1d6714d	\N	\N	\N	2025-02-15 17:17:17.477	2025-02-16 15:28:36.372
17525703-6b24-422d-8940-45d5a985ff76	9ee78d05-d52c-4228-abfd-a95242331ea1	569404c0-7dea-40c7-8697-37ba79bdbe4b	\N	\N	\N	2025-02-15 17:52:46.982	2025-02-15 17:52:46.982
123514f5-1aa9-48ac-8be5-245af3d33bc0	ffa831a7-3e07-4acc-9509-f38a045a000e	569404c0-7dea-40c7-8697-37ba79bdbe4b	17b96fea-3820-4ce1-9263-912abee74b04	0630ebdf-4d94-488c-8b16-844a9faaa890	\N	2025-02-08 18:02:18.016	2026-01-26 07:52:46.334
2cdc79d5-71bf-4e39-81a7-e7823c8c16b0	ffa831a7-3e07-4acc-9509-f38a045a000e	569404c0-7dea-40c7-8697-37ba79bdbe4b	17b96fea-3820-4ce1-9263-912abee74b04	\N	\N	2025-02-08 18:02:18.015	2026-01-26 07:52:46.334
ff618ff0-a911-4164-ab93-03b0a8906fb7	ffa831a7-3e07-4acc-9509-f38a045a000e	569404c0-7dea-40c7-8697-37ba79bdbe4b	7d7b039c-fd26-498e-8708-b974bd101d9a	\N	\N	2025-02-08 18:02:18.015	2026-01-26 07:52:46.334
927c1faa-fc85-4670-8f6a-6db1a0cf322b	ffa831a7-3e07-4acc-9509-f38a045a000e	569404c0-7dea-40c7-8697-37ba79bdbe4b	\N	\N	\N	2025-02-08 18:02:18.012	2026-01-26 07:52:46.334
1c6445d8-111f-45ae-a3bd-df38f571994f	ffa831a7-3e07-4acc-9509-f38a045a000e	a3a8454b-3caf-4081-982a-5306c005f86f	0a76001d-146a-411c-abae-34bdba696be5	\N	\N	2025-02-08 18:02:18.015	2026-01-26 07:52:46.334
ae2c2ecb-63c0-40be-aba7-82a2b916a67f	ffa831a7-3e07-4acc-9509-f38a045a000e	a3a8454b-3caf-4081-982a-5306c005f86f	254d7c32-6721-461d-8ffb-9dc4db3b86f8	\N	\N	2025-02-08 18:02:18.015	2026-01-26 07:52:46.334
5455d1c4-0827-46c8-b9bf-f71cd01fc632	ffa831a7-3e07-4acc-9509-f38a045a000e	a3a8454b-3caf-4081-982a-5306c005f86f	\N	\N	\N	2025-02-08 18:02:18.012	2026-01-26 07:52:46.334
42bf4505-9661-4b27-98ef-300d20892c49	4308eb7e-df18-48a5-bad0-e2aaf420d479	a3a8454b-3caf-4081-982a-5306c005f86f	\N	\N	\N	2025-02-15 16:30:42.567	2026-02-08 03:24:28.754
e3e44806-4c50-46bd-ae65-e6fcee50b8cc	4308eb7e-df18-48a5-bad0-e2aaf420d479	569404c0-7dea-40c7-8697-37ba79bdbe4b	\N	\N	\N	2025-02-15 16:30:42.567	2026-02-08 03:24:28.754
9db0a081-555d-4ba8-9c70-12a3ea9cd8b3	4308eb7e-df18-48a5-bad0-e2aaf420d479	a3a8454b-3caf-4081-982a-5306c005f86f	254d7c32-6721-461d-8ffb-9dc4db3b86f8	\N	\N	2025-02-15 16:30:42.569	2026-02-08 03:24:28.754
c53d4cec-f533-4215-bea5-7c45a7e7a8bb	4308eb7e-df18-48a5-bad0-e2aaf420d479	a3a8454b-3caf-4081-982a-5306c005f86f	0a76001d-146a-411c-abae-34bdba696be5	\N	\N	2025-02-15 16:30:42.569	2026-02-08 03:24:28.754
ea445f2c-6b9c-4b12-8301-ba8ba5279aba	4308eb7e-df18-48a5-bad0-e2aaf420d479	569404c0-7dea-40c7-8697-37ba79bdbe4b	17b96fea-3820-4ce1-9263-912abee74b04	\N	\N	2025-02-15 16:30:42.569	2026-02-08 03:24:28.754
91999315-d97b-4a57-9645-5a2252fa943e	4308eb7e-df18-48a5-bad0-e2aaf420d479	569404c0-7dea-40c7-8697-37ba79bdbe4b	7af13869-1eb2-4bf3-83c6-16e4e702e439	\N	\N	2025-02-15 16:30:42.569	2026-02-08 03:24:28.754
55d9b255-c74b-416d-b819-5797c315719a	4308eb7e-df18-48a5-bad0-e2aaf420d479	569404c0-7dea-40c7-8697-37ba79bdbe4b	7d7b039c-fd26-498e-8708-b974bd101d9a	\N	\N	2025-02-15 16:30:42.569	2026-02-08 03:24:28.754
ddbd7040-21d0-4bda-a72c-b4c92bfbf320	4308eb7e-df18-48a5-bad0-e2aaf420d479	569404c0-7dea-40c7-8697-37ba79bdbe4b	17b96fea-3820-4ce1-9263-912abee74b04	1fce812e-57dd-4853-8d35-aa5402491536	\N	2025-02-15 16:30:42.57	2026-02-08 03:24:28.754
19b6d9e3-0eab-49e8-8172-a45f79322561	9ee78d05-d52c-4228-abfd-a95242331ea1	569404c0-7dea-40c7-8697-37ba79bdbe4b	7d7b039c-fd26-498e-8708-b974bd101d9a	\N	\N	2025-02-15 17:52:46.983	2025-02-15 17:52:46.983
2c862e89-9625-4dfc-b587-68138332b008	9ee78d05-d52c-4228-abfd-a95242331ea1	569404c0-7dea-40c7-8697-37ba79bdbe4b	7af13869-1eb2-4bf3-83c6-16e4e702e439	\N	\N	2025-02-15 17:52:46.983	2025-02-15 17:52:46.983
3d155b8f-5b3b-4169-8502-8a3f1ab1cfc1	9ee78d05-d52c-4228-abfd-a95242331ea1	569404c0-7dea-40c7-8697-37ba79bdbe4b	aaf93e7a-919f-4884-80eb-fa27e8a9577a	\N	\N	2025-02-15 17:52:46.983	2025-02-15 17:52:46.983
0de1b5be-eec1-4bec-b301-f767eeb848bc	5df6f2b6-890b-4588-b743-d886370f1396	569404c0-7dea-40c7-8697-37ba79bdbe4b	\N	\N	\N	2025-02-23 03:52:17.65	2025-02-23 03:52:17.65
5067abdd-1fb0-443c-9b69-923b468342fc	5df6f2b6-890b-4588-b743-d886370f1396	569404c0-7dea-40c7-8697-37ba79bdbe4b	17b96fea-3820-4ce1-9263-912abee74b04	\N	\N	2025-02-23 03:52:17.651	2025-02-23 03:52:17.651
0d93e2ae-a26f-42fd-9011-0b0eb459fdf3	5df6f2b6-890b-4588-b743-d886370f1396	569404c0-7dea-40c7-8697-37ba79bdbe4b	17b96fea-3820-4ce1-9263-912abee74b04	ec8f4863-f7f9-4810-9545-f119747050d5	\N	2025-02-23 03:52:17.652	2025-02-23 03:52:17.652
ba918980-b73f-414e-a937-0295b93fd7e0	5df6f2b6-890b-4588-b743-d886370f1396	569404c0-7dea-40c7-8697-37ba79bdbe4b	17b96fea-3820-4ce1-9263-912abee74b04	0630ebdf-4d94-488c-8b16-844a9faaa890	\N	2025-02-23 03:52:17.652	2025-02-23 03:52:17.652
c3166e65-d80b-43ec-932a-06e74605f17a	d50cdfd1-14a0-4576-875d-62da3a7d45d7	569404c0-7dea-40c7-8697-37ba79bdbe4b	\N	\N	\N	2025-02-23 04:36:06.282	2025-02-23 04:36:06.282
10a617bf-deec-49d0-8f05-dbc3dbeaf4db	d50cdfd1-14a0-4576-875d-62da3a7d45d7	569404c0-7dea-40c7-8697-37ba79bdbe4b	17b96fea-3820-4ce1-9263-912abee74b04	\N	\N	2025-02-23 04:36:06.283	2025-02-23 04:36:06.283
2ac13b38-d03c-47b6-b52a-f66a7939e2f5	d50cdfd1-14a0-4576-875d-62da3a7d45d7	569404c0-7dea-40c7-8697-37ba79bdbe4b	17b96fea-3820-4ce1-9263-912abee74b04	1fce812e-57dd-4853-8d35-aa5402491536	\N	2025-02-23 04:36:06.284	2025-02-23 04:36:06.284
886be92f-47d3-41e4-a6aa-0d74e1e2e354	38b6d4ae-36c1-47da-9ce7-4bc98f319b72	c560626e-35c9-4ea0-8c25-c805d5ce043d	\N	\N	\N	2025-03-29 08:04:05.98	2025-03-29 08:04:05.98
4e27f2c5-b095-4b8d-aeee-e41365cca755	da9695ef-d264-4e8a-8e12-34abc40ec5e1	c560626e-35c9-4ea0-8c25-c805d5ce043d	\N	\N	\N	2025-03-29 10:59:35.603	2025-03-29 10:59:35.603
dfb8aaf1-9567-495b-bea2-d737400d3670	be759f25-c8dd-46ba-96c9-fe8ff4942881	569404c0-7dea-40c7-8697-37ba79bdbe4b	\N	\N	\N	2025-05-03 04:27:17.535	2025-05-31 13:00:06.628
6db5074d-3728-4582-aade-0de11c7a3e1c	be759f25-c8dd-46ba-96c9-fe8ff4942881	3dd0f983-4aaf-474b-8d68-a084a1d6714d	\N	\N	\N	2025-05-03 04:27:17.535	2025-05-31 13:00:06.628
b5a8a29f-4e83-403a-880c-34cbc50d6353	be759f25-c8dd-46ba-96c9-fe8ff4942881	569404c0-7dea-40c7-8697-37ba79bdbe4b	7d7b039c-fd26-498e-8708-b974bd101d9a	\N	\N	2025-05-03 04:27:17.535	2025-05-31 13:00:06.628
fa699de1-573f-4a9a-9326-6f2ae1327142	be759f25-c8dd-46ba-96c9-fe8ff4942881	569404c0-7dea-40c7-8697-37ba79bdbe4b	aaf93e7a-919f-4884-80eb-fa27e8a9577a	\N	\N	2025-05-03 04:27:17.535	2025-05-31 13:00:06.628
3bc4a14b-0c63-4729-9055-815766295d32	be759f25-c8dd-46ba-96c9-fe8ff4942881	569404c0-7dea-40c7-8697-37ba79bdbe4b	17b96fea-3820-4ce1-9263-912abee74b04	\N	\N	2025-05-03 04:27:17.535	2025-05-31 13:00:06.628
c5033ad6-8602-4d16-a570-f99a4b846199	ea2e4979-afd9-400a-9ac9-172794e17d03	a3a8454b-3caf-4081-982a-5306c005f86f	254d7c32-6721-461d-8ffb-9dc4db3b86f8	\N	\N	2025-02-23 05:00:08.635	2026-01-26 08:12:28.079
423acf99-c16b-49f7-9e58-d7912b16c633	ea2e4979-afd9-400a-9ac9-172794e17d03	a3a8454b-3caf-4081-982a-5306c005f86f	0a76001d-146a-411c-abae-34bdba696be5	\N	\N	2025-02-23 05:00:08.635	2026-01-26 08:12:28.079
8eaf403f-f0ba-42ee-9f35-11b25e3b947d	ec979fb6-8715-4aea-8eeb-9786dc348c45	c560626e-35c9-4ea0-8c25-c805d5ce043d	\N	\N	\N	2025-05-24 12:06:32.959	2026-02-07 04:19:43.9
d2c29e84-d1e0-4317-b821-e8839be91d3c	ea2e4979-afd9-400a-9ac9-172794e17d03	a3a8454b-3caf-4081-982a-5306c005f86f	\N	\N	\N	2025-02-23 05:00:08.634	2026-01-26 08:12:28.079
30c18278-0d17-497c-900a-391375757b9d	ec979fb6-8715-4aea-8eeb-9786dc348c45	c560626e-35c9-4ea0-8c25-c805d5ce043d	9775863d-295c-4ff6-ae42-f97573c8d42a	\N	\N	2025-05-24 12:06:32.959	2026-02-07 04:19:43.9
87da7dbf-5ba3-433d-99cc-17a23ef0920b	be759f25-c8dd-46ba-96c9-fe8ff4942881	569404c0-7dea-40c7-8697-37ba79bdbe4b	7af13869-1eb2-4bf3-83c6-16e4e702e439	\N	\N	2025-05-03 04:27:17.535	2025-05-31 13:00:06.628
5a6f17e1-5d28-4e62-9153-b4e9b87924a2	be759f25-c8dd-46ba-96c9-fe8ff4942881	3dd0f983-4aaf-474b-8d68-a084a1d6714d	7aa3d3c5-953b-484c-a817-f0036178094c	\N	\N	2025-05-03 04:27:17.535	2025-05-31 13:00:06.628
46605cc2-0955-4958-91c8-c0ddf171e731	be759f25-c8dd-46ba-96c9-fe8ff4942881	569404c0-7dea-40c7-8697-37ba79bdbe4b	17b96fea-3820-4ce1-9263-912abee74b04	b16b6df8-db67-462f-91c7-2a52fad09930	\N	2025-05-03 04:27:17.535	2025-05-31 13:00:06.628
5965b54e-c00e-4893-9f2b-fd2f20ef72c3	be759f25-c8dd-46ba-96c9-fe8ff4942881	569404c0-7dea-40c7-8697-37ba79bdbe4b	17b96fea-3820-4ce1-9263-912abee74b04	1fce812e-57dd-4853-8d35-aa5402491536	\N	2025-05-03 04:27:17.535	2025-05-31 13:00:06.628
82bf427b-cc8f-4fd5-935e-e2c1b69b4346	55479f9a-f273-4592-88a0-81ce5d96031e	a3a8454b-3caf-4081-982a-5306c005f86f	\N	\N	\N	2026-02-07 06:23:32.507	2026-02-08 03:24:47.222
ca7d5a90-21e9-4a77-925c-0b09424247e1	55479f9a-f273-4592-88a0-81ce5d96031e	a3a8454b-3caf-4081-982a-5306c005f86f	254d7c32-6721-461d-8ffb-9dc4db3b86f8	\N	\N	2026-02-07 06:23:32.507	2026-02-08 03:24:47.222
3ab73add-5689-4f9d-80c7-01ba3d8579a1	65c06064-cb07-4a52-883f-cf34b0d64a34	a3a8454b-3caf-4081-982a-5306c005f86f	\N	\N	\N	2025-02-15 17:27:41.578	2025-06-07 11:39:42.661
80c341cb-094b-4bad-bf62-f823a4ee73f8	65c06064-cb07-4a52-883f-cf34b0d64a34	569404c0-7dea-40c7-8697-37ba79bdbe4b	\N	\N	\N	2025-02-15 17:27:41.578	2025-06-07 11:39:42.661
0478fd22-865f-4c95-b883-c970057cf63e	65c06064-cb07-4a52-883f-cf34b0d64a34	a3a8454b-3caf-4081-982a-5306c005f86f	254d7c32-6721-461d-8ffb-9dc4db3b86f8	\N	\N	2025-02-15 17:27:41.579	2025-06-07 11:39:42.661
3249cf73-d077-4a2c-ba44-89b75cc5a7b3	65c06064-cb07-4a52-883f-cf34b0d64a34	a3a8454b-3caf-4081-982a-5306c005f86f	0a76001d-146a-411c-abae-34bdba696be5	\N	\N	2025-02-15 17:27:41.579	2025-06-07 11:39:42.661
3c12f55e-6317-430c-b62c-f0eafc2fd319	65c06064-cb07-4a52-883f-cf34b0d64a34	569404c0-7dea-40c7-8697-37ba79bdbe4b	7d7b039c-fd26-498e-8708-b974bd101d9a	\N	\N	2025-02-15 17:27:41.579	2025-06-07 11:39:42.661
d400296d-50c7-4760-915d-4730c2e7219c	65c06064-cb07-4a52-883f-cf34b0d64a34	569404c0-7dea-40c7-8697-37ba79bdbe4b	aaf93e7a-919f-4884-80eb-fa27e8a9577a	\N	\N	2025-02-15 17:27:41.579	2025-06-07 11:39:42.661
56d6158d-7ccc-44b0-9def-041c1d0cc0b7	65c06064-cb07-4a52-883f-cf34b0d64a34	569404c0-7dea-40c7-8697-37ba79bdbe4b	7af13869-1eb2-4bf3-83c6-16e4e702e439	\N	\N	2025-02-15 17:27:41.579	2025-06-07 11:39:42.661
96caf7b5-18ae-43dd-b1fe-27477ef2874a	65c06064-cb07-4a52-883f-cf34b0d64a34	569404c0-7dea-40c7-8697-37ba79bdbe4b	17b96fea-3820-4ce1-9263-912abee74b04	\N	\N	2025-02-15 17:27:41.579	2025-06-07 11:39:42.661
9b644887-1d24-44f2-be08-79b43ec212f3	65c06064-cb07-4a52-883f-cf34b0d64a34	569404c0-7dea-40c7-8697-37ba79bdbe4b	17b96fea-3820-4ce1-9263-912abee74b04	1fce812e-57dd-4853-8d35-aa5402491536	\N	2025-02-15 17:27:41.58	2025-06-07 11:39:42.661
c4ff6785-f7f2-4a48-aa7b-3112f474f8ae	55479f9a-f273-4592-88a0-81ce5d96031e	a3a8454b-3caf-4081-982a-5306c005f86f	0a76001d-146a-411c-abae-34bdba696be5	\N	\N	2026-02-07 06:23:32.507	2026-02-08 03:24:47.222
300462c7-4529-414e-9d3b-b6dcf741498a	aecf4c59-5e84-4afc-b9b8-04af30659bff	569404c0-7dea-40c7-8697-37ba79bdbe4b	7d7b039c-fd26-498e-8708-b974bd101d9a	\N	\N	2025-02-16 16:11:36.118	2026-02-18 12:38:44.51
0815ba0c-097b-4a4a-ba69-a7d1840a597d	aecf4c59-5e84-4afc-b9b8-04af30659bff	a3a8454b-3caf-4081-982a-5306c005f86f	254d7c32-6721-461d-8ffb-9dc4db3b86f8	\N	\N	2025-02-16 16:11:36.118	2026-02-18 12:38:44.51
33f5682d-11d1-4206-bed5-1515eaf4097a	aecf4c59-5e84-4afc-b9b8-04af30659bff	a3a8454b-3caf-4081-982a-5306c005f86f	0a76001d-146a-411c-abae-34bdba696be5	\N	\N	2025-02-16 16:11:36.118	2026-02-18 12:38:44.51
c3c9c342-426b-49f3-a1ef-649c31185c9d	aecf4c59-5e84-4afc-b9b8-04af30659bff	569404c0-7dea-40c7-8697-37ba79bdbe4b	17b96fea-3820-4ce1-9263-912abee74b04	\N	\N	2025-02-16 16:11:36.118	2026-02-18 12:38:44.51
3da641d0-b71c-4dde-8852-0154d7b28a8d	aecf4c59-5e84-4afc-b9b8-04af30659bff	569404c0-7dea-40c7-8697-37ba79bdbe4b	7af13869-1eb2-4bf3-83c6-16e4e702e439	\N	\N	2025-02-16 16:11:36.118	2026-02-18 12:38:44.51
84adfb77-31fa-42c0-a8df-9b6ae2873680	aecf4c59-5e84-4afc-b9b8-04af30659bff	569404c0-7dea-40c7-8697-37ba79bdbe4b	aaf93e7a-919f-4884-80eb-fa27e8a9577a	\N	\N	2025-02-16 16:11:36.118	2026-02-18 12:38:44.51
d3925ac6-2ccb-4ed5-9edf-bc759bfc4704	aecf4c59-5e84-4afc-b9b8-04af30659bff	569404c0-7dea-40c7-8697-37ba79bdbe4b	17b96fea-3820-4ce1-9263-912abee74b04	b16b6df8-db67-462f-91c7-2a52fad09930	\N	2025-02-16 16:11:36.119	2026-02-18 12:38:44.51
7321c1a8-810d-4f0a-8318-ba787ccb7c7c	aecf4c59-5e84-4afc-b9b8-04af30659bff	a3a8454b-3caf-4081-982a-5306c005f86f	\N	\N	\N	2025-02-16 16:11:36.114	2026-02-18 12:38:44.51
d74b2f0f-b739-4411-974b-81532cc19e5e	aecf4c59-5e84-4afc-b9b8-04af30659bff	569404c0-7dea-40c7-8697-37ba79bdbe4b	\N	\N	\N	2025-02-16 16:11:36.114	2026-02-18 12:38:44.51
0f56b3cf-b985-4526-9da1-fbdc040fdc9d	838c74db-be37-4d19-87ae-2a502a9458f8	c560626e-35c9-4ea0-8c25-c805d5ce043d	eb5c65af-b739-4063-9daf-ba69e74c9716	\N	\N	2026-03-06 17:53:23.276366	2026-03-06 17:53:23.276366
b7a1b38d-2634-4ae5-a1cd-c9f134280796	838c74db-be37-4d19-87ae-2a502a9458f8	c560626e-35c9-4ea0-8c25-c805d5ce043d	\N	\N	\N	2026-03-06 17:53:23.276366	2026-03-06 17:53:23.276366
c06ac8c3-2098-45d9-b4fc-8d60ce2bf5da	838c74db-be37-4d19-87ae-2a502a9458f8	c560626e-35c9-4ea0-8c25-c805d5ce043d	9775863d-295c-4ff6-ae42-f97573c8d42a	\N	\N	2026-03-06 17:53:23.276366	2026-03-06 17:53:23.276366
5d5a9bd7-df4a-43e1-bd78-52295f51db27	1ae5a707-7b41-43d1-8cfe-5ce73048dc93	a3a8454b-3caf-4081-982a-5306c005f86f	\N	\N	\N	2026-03-06 17:53:47.186321	2026-03-06 17:53:47.186321
9a14cd1f-4b2a-46d1-9521-38dbc6b4f1d5	1ae5a707-7b41-43d1-8cfe-5ce73048dc93	a3a8454b-3caf-4081-982a-5306c005f86f	254d7c32-6721-461d-8ffb-9dc4db3b86f8	\N	\N	2026-03-06 17:53:47.186321	2026-03-06 17:53:47.186321
c4c8cc9f-6409-48b4-9d1f-f1783c002193	1ae5a707-7b41-43d1-8cfe-5ce73048dc93	a3a8454b-3caf-4081-982a-5306c005f86f	0a76001d-146a-411c-abae-34bdba696be5	\N	\N	2026-03-06 17:53:47.186321	2026-03-06 17:53:47.186321
6a945d20-f9e1-4acf-a025-5fd00fba02d4	bed15c7a-17a6-48a2-8d0c-f8f1b5746bb2	a3a8454b-3caf-4081-982a-5306c005f86f	\N	\N	\N	2026-03-07 01:59:15.692823	2026-03-07 01:59:15.692823
a18a6c1c-954f-49be-8792-78326f631796	bed15c7a-17a6-48a2-8d0c-f8f1b5746bb2	a3a8454b-3caf-4081-982a-5306c005f86f	254d7c32-6721-461d-8ffb-9dc4db3b86f8	\N	\N	2026-03-07 01:59:15.692823	2026-03-07 01:59:15.692823
f4d20743-8bb4-47e4-a98b-48a70f5d8d3d	bed15c7a-17a6-48a2-8d0c-f8f1b5746bb2	a3a8454b-3caf-4081-982a-5306c005f86f	0a76001d-146a-411c-abae-34bdba696be5	\N	\N	2026-03-07 01:59:15.692823	2026-03-07 01:59:15.692823
\.


--
-- Data for Name: character_relationships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.character_relationships (id, universe_id, source_character_id, target_character_id, type, notes, created_at, updated_at, faction_id) FROM stdin;
e708dc34-4dd1-49a2-8d7d-b2015470aea6	7f251920-f7b9-4861-b738-a1e8a4f53463	a4498511-f87d-4e12-aecd-b22435257b4e	65c06064-cb07-4a52-883f-cf34b0d64a34	PARENT_OF	\N	2026-03-08 05:48:57.569274	2026-03-08 05:48:57.569274	8e33ec1b-485d-4b0c-86c1-29fc3ccf9449
e1d5e787-f9b6-4d67-919d-542188be536f	7f251920-f7b9-4861-b738-a1e8a4f53463	65c06064-cb07-4a52-883f-cf34b0d64a34	1ae5a707-7b41-43d1-8cfe-5ce73048dc93	SPOUSE	\N	2026-03-08 05:49:04.822526	2026-03-08 05:49:04.822526	8e33ec1b-485d-4b0c-86c1-29fc3ccf9449
5de493b3-ae91-4a39-957b-a8b29a5ab33c	7f251920-f7b9-4861-b738-a1e8a4f53463	65c06064-cb07-4a52-883f-cf34b0d64a34	3b733055-b14d-417f-8bef-1d8f22f67159	PARENT_OF	\N	2026-03-08 05:49:24.238737	2026-03-08 05:49:24.238737	8e33ec1b-485d-4b0c-86c1-29fc3ccf9449
e114a954-e249-41de-a5e0-e21acd98625f	7f251920-f7b9-4861-b738-a1e8a4f53463	1ae5a707-7b41-43d1-8cfe-5ce73048dc93	3b733055-b14d-417f-8bef-1d8f22f67159	PARENT_OF	\N	2026-03-08 05:49:24.248282	2026-03-08 05:49:24.248282	8e33ec1b-485d-4b0c-86c1-29fc3ccf9449
a13b3f5e-cd08-4eb7-af31-73c9f6faab09	7f251920-f7b9-4861-b738-a1e8a4f53463	65c06064-cb07-4a52-883f-cf34b0d64a34	8183e7fb-6ade-487f-953e-990808d712b8	PARENT_OF	\N	2026-03-08 05:49:34.171588	2026-03-08 05:49:34.171588	8e33ec1b-485d-4b0c-86c1-29fc3ccf9449
1ca16d5d-c2c8-48fa-b872-5fe3fbe5a356	7f251920-f7b9-4861-b738-a1e8a4f53463	1ae5a707-7b41-43d1-8cfe-5ce73048dc93	8183e7fb-6ade-487f-953e-990808d712b8	PARENT_OF	\N	2026-03-08 05:49:34.187349	2026-03-08 05:49:34.187349	8e33ec1b-485d-4b0c-86c1-29fc3ccf9449
235b5f47-faa2-48b5-b1bb-b68f532733f0	7f251920-f7b9-4861-b738-a1e8a4f53463	8183e7fb-6ade-487f-953e-990808d712b8	20beebba-8dca-464d-b64e-f5796d561e5d	PARENT_OF	\N	2026-03-08 05:50:29.039758	2026-03-08 05:50:29.039758	8e33ec1b-485d-4b0c-86c1-29fc3ccf9449
bb2d655d-0daf-44a0-8d76-d9c32c907553	7f251920-f7b9-4861-b738-a1e8a4f53463	8183e7fb-6ade-487f-953e-990808d712b8	aecf4c59-5e84-4afc-b9b8-04af30659bff	PARENT_OF	\N	2026-03-08 05:50:57.971307	2026-03-08 05:50:57.971307	8e33ec1b-485d-4b0c-86c1-29fc3ccf9449
66bbb8a8-aa62-40dd-9738-aa8197e4f4ab	7f251920-f7b9-4861-b738-a1e8a4f53463	8183e7fb-6ade-487f-953e-990808d712b8	1116ccb6-f8ae-45d8-9d18-5b6adb8e38aa	PARENT_OF	\N	2026-03-08 05:51:03.911285	2026-03-08 05:51:03.911285	8e33ec1b-485d-4b0c-86c1-29fc3ccf9449
7c3febcc-b03d-41e1-bb57-6a489e79c52c	7f251920-f7b9-4861-b738-a1e8a4f53463	a4498511-f87d-4e12-aecd-b22435257b4e	324da5fd-d2ea-4883-bcc2-9e033b85e06d	PARENT_OF	\N	2026-03-08 05:52:47.791899	2026-03-08 05:52:47.791899	8e33ec1b-485d-4b0c-86c1-29fc3ccf9449
c4c37d7d-1446-402b-bcc0-890bc867fec4	7f251920-f7b9-4861-b738-a1e8a4f53463	a4498511-f87d-4e12-aecd-b22435257b4e	803dc902-f025-4c9d-a6b0-d584dfe3121e	SPOUSE	\N	2026-03-08 18:06:20.08741	2026-03-08 18:06:20.08741	8e33ec1b-485d-4b0c-86c1-29fc3ccf9449
\.


--
-- Data for Name: characters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.characters (id, universe_id, race_id, ethnic_group_id, name, background, type, gender, age, avatar_url, image_urls, benched, created_at, updated_at, deleted_at) FROM stdin;
9095c9e8-0419-4a39-9b88-50b1619826b7	7f251920-f7b9-4861-b738-a1e8a4f53463	\N	\N	Lorne		\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.274	2025-02-16 15:11:48.6	\N
cda658d0-e704-42b2-8ee0-03c7d6412647	7f251920-f7b9-4861-b738-a1e8a4f53463	d96cef44-a943-4edd-b61d-9eb4834c79c0	\N	Asafer of Dreiken		Antagonist	Male	\N	http://localhost:3000/uploads/characters/046b0cb1-2d76-430e-a2ae-3824bde02e82.jpg	{http://localhost:3000/uploads/characters/a7026a32-48b7-4e8b-91a3-e09ad396080d.jpg}	f	2025-02-15 12:52:42.275	2026-02-08 03:25:08.502	\N
5953e8b4-52ef-42db-8d0e-24d42820fa89	7f251920-f7b9-4861-b738-a1e8a4f53463	e4522f38-912e-4b3d-9283-db59f2c1e7ed	\N	Nilith, Lord of Order	The Lord of Genesis	\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.275	2025-02-16 15:10:25.727	\N
a0783992-c36e-4e55-aeb2-a720c644ecf2	7f251920-f7b9-4861-b738-a1e8a4f53463	\N	\N	Laviscaris		\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.274	2025-02-16 15:11:48.593	\N
47263f8d-f93e-4635-a6e0-08e80f243193	7f251920-f7b9-4861-b738-a1e8a4f53463	a0a05a6b-5e74-4996-a967-bd90268fafb5	\N	Leraeus	\N	Supporting	Male	\N	http://localhost:3000/uploads/characters/5d9cc29f-8cc4-4611-829b-60def0a26afc.png	{}	f	2025-02-12 16:42:25.781	2025-02-12 16:42:25.781	\N
c855042f-3ff7-4fa8-aa4f-26fca3a3d050	7f251920-f7b9-4861-b738-a1e8a4f53463	5da036a0-d566-4d97-84fb-0dd04cf5aa33	\N	Siegfried of the Crescent Moon		Minor	Male	\N	http://localhost:3000/uploads/characters/c1a74370-857b-40d3-bc69-26dcba40d998.png	{http://localhost:3000/uploads/characters/30dfd695-34b1-4272-8dbe-c44d25aa7f02.png,http://localhost:3000/uploads/characters/50c2c74d-f0ec-4b6c-b10d-d3fed8ec9f23.jpg}	f	2025-02-15 12:52:42.275	2025-02-15 14:37:25.415	\N
10630f09-3dd8-4bf6-bff2-504e060ae29e	7f251920-f7b9-4861-b738-a1e8a4f53463	e4522f38-912e-4b3d-9283-db59f2c1e7ed	\N	Aryan, The Great One		Minor	Male	\N	http://localhost:3000/uploads/characters/2e12e413-de98-4aee-ac07-92bd1c718c95.png	{}	f	2025-02-15 12:52:42.275	2025-02-15 14:43:04.355	\N
8183e7fb-6ade-487f-953e-990808d712b8	7f251920-f7b9-4861-b738-a1e8a4f53463	5da036a0-d566-4d97-84fb-0dd04cf5aa33	\N	Lufus Rayn	Head of the Rayn family and ruler of Braithlait.	Antagonist	Male	\N	http://localhost:3000/uploads/characters/cfc1a9ad-4859-4bbe-8ee6-2a9f10fbddbd.png	{}	f	2025-02-15 12:52:42.275	2025-02-15 16:31:37.389	\N
acd808de-8b0b-4eb9-992b-b0dabf549a12	7f251920-f7b9-4861-b738-a1e8a4f53463	7ff6b318-c6ec-455b-8a39-16999583c8a7	\N	Tobias Reaper	Saxxy Bishop	Minor	Male	\N	http://localhost:3000/uploads/characters/1ae051bd-e4e9-43eb-bd12-2761bbdf0924.jpg	{http://localhost:3000/uploads/characters/45d10c7f-39ef-4136-b793-f8be9842eae4.png,http://localhost:3000/uploads/characters/be5d258a-7504-47c2-b9a8-94773802183a.png,http://localhost:3000/uploads/characters/08b80cc9-7c51-4f74-9efe-fdbcc1248ad0.png,http://localhost:3000/uploads/characters/7cb63949-12fb-4844-8ac5-3daa64ec5648.png}	f	2025-02-15 12:52:42.274	2025-02-15 17:26:33.107	\N
1fef0af2-cd50-4a51-8a96-0d0d2138e846	7f251920-f7b9-4861-b738-a1e8a4f53463	e2f41ff4-c340-45bc-b269-d4827365eec6	\N	Rudrael, the Mosaic		Antagonist	Male	\N	http://localhost:3000/uploads/characters/00538297-474c-416d-84f2-0415e643bbb6.png	{http://localhost:3000/uploads/characters/86cf9675-5a8c-4c20-95ab-523767e2c785.png,http://localhost:3000/uploads/characters/b7760320-1837-44fd-b143-eca97e0e6a03.png,http://localhost:3000/uploads/characters/9cd8c6bd-48e7-4d32-a92e-c86417e90844.png,http://localhost:3000/uploads/characters/71f2cd7a-d292-46c1-8f78-81cbcde063b3.png}	f	2025-02-15 12:52:42.275	2025-02-15 16:54:34.876	\N
951e1239-a1c7-4513-b4cd-9f331f1dfd68	7f251920-f7b9-4861-b738-a1e8a4f53463	e2f41ff4-c340-45bc-b269-d4827365eec6	\N	Grotthuss, the Mosaic		Antagonist	Male	\N	http://localhost:3000/uploads/characters/68ef76e3-4fb3-4ad2-afce-7cc8c66621c9.png	{http://localhost:3000/uploads/characters/e8539634-53cb-49d8-a235-7436eaf57751.png}	f	2025-02-15 12:52:42.274	2026-02-18 05:29:25.13	\N
37cf9d44-718f-4ef5-9204-266e8b5f9d3e	7f251920-f7b9-4861-b738-a1e8a4f53463	5da036a0-d566-4d97-84fb-0dd04cf5aa33	\N	Sieghardt of the Night		Minor	Male	\N	http://localhost:3000/uploads/characters/947c91d2-af6c-4645-b0cc-67b1cea25507.png	{http://localhost:3000/uploads/characters/2380e2d8-a4fd-4da3-ab25-6ce83ad718a3.png}	f	2025-02-15 12:52:42.275	2025-02-16 15:55:07.178	\N
9ee78d05-d52c-4228-abfd-a95242331ea1	7f251920-f7b9-4861-b738-a1e8a4f53463	7ff6b318-c6ec-455b-8a39-16999583c8a7	\N	Grandmaster Insahn Ashhar		Supporting	Male	\N	http://localhost:3000/uploads/characters/535d7477-99b5-4a6a-996c-b19ceed49383.png	{http://localhost:3000/uploads/characters/018873bb-2190-41a4-b07c-5a5d315714eb.png,http://localhost:3000/uploads/characters/d9c34c2b-8202-46c9-aa4a-ca44d92e5375.png}	f	2025-02-15 12:52:42.273	2025-02-15 17:52:46.984	\N
4308eb7e-df18-48a5-bad0-e2aaf420d479	7f251920-f7b9-4861-b738-a1e8a4f53463	5da036a0-d566-4d97-84fb-0dd04cf5aa33	\N	Alistair Heus		Supporting	Male	\N	http://localhost:3000/uploads/characters/08527c5e-1754-4f98-b724-0a59ef23a22e.png	{http://localhost:3000/uploads/characters/a04d7f58-d630-4eb2-9cb8-31fac4a4c637.png,http://localhost:3000/uploads/characters/139751cb-2001-42c5-bca5-6cb420fd9e56.png}	f	2025-02-15 12:52:42.273	2026-02-08 03:24:28.757	\N
440c5318-9e4e-46fa-a197-97461eb77cb8	7f251920-f7b9-4861-b738-a1e8a4f53463	e2f41ff4-c340-45bc-b269-d4827365eec6	\N	Gryffin, blade of Caedric	actually a pretty good guy yaknow, with his allegiances and all	Supporting	Male	\N	http://localhost:3000/uploads/characters/ff34c682-7956-48f4-8ccf-d8a6aa9d7046.png	{http://localhost:3000/uploads/characters/87db97a3-eaa6-4f04-977c-0aa3b40385d7.png,http://localhost:3000/uploads/characters/47ba0710-a6d8-4d03-bb31-876a9b65c0bc.png,http://localhost:3000/uploads/characters/30090f6b-a3ee-4f11-a727-80f949f0b767.png,http://localhost:3000/uploads/characters/d7fd1838-db8f-463e-b5fe-fd7be9d93e49.png}	f	2025-02-15 12:52:42.275	2026-02-17 06:53:46.542	\N
5df6f2b6-890b-4588-b743-d886370f1396	7f251920-f7b9-4861-b738-a1e8a4f53463	e2f41ff4-c340-45bc-b269-d4827365eec6	\N	Caedric, the Mosaic	Caedric is a mosaic prince. it means he is the child of two pure higher mosaics. The King of the Mosaics, Sverevin and his wife, Linfrei of the Southrun Kingdoms.\r\n\r\nCaedric wants to bring back the glory of the Mosaics  , so friscel is really talented, she was a thief and grew up in Varamor. She knows a lot about humans and varamor which cedric plans to overtake as part of conquering one of the five major kingdoms in vera\r\n\r\nCedric is a skilled warrior and tactician, having received extensive training in combat and strategy from a young age.\r\nHe is fiercely proud of his mosaic heritage and sees it as his duty to restore the power and influence of the mosaic race.\r\nCedric's desire for power and control often leads him to make ruthless decisions and alliances, even if it means betraying those closest to him.\r\nHe is a charismatic and persuasive leader, able to inspire loyalty and devotion from his followers.\r\nCedric possesses a strong sense of honor and duty, but his ambitions sometimes cause him to compromise his own principles.\r\nHe has a particular animosity towards humans, whom he sees as inferior and unworthy of sharing the world with the powerful mosaic race.	Antagonist	Male	\N	http://localhost:3000/uploads/characters/1dbe74c9-bd28-45cc-b88e-c89f9ed5eeba.png	{http://localhost:3000/uploads/characters/8a27707f-6177-4f79-b7c2-c383a78ff8f3.png}	f	2025-02-15 12:52:42.274	2025-02-23 03:52:27.059	\N
3301548c-f6b4-462f-99c5-53867ed7659b	7f251920-f7b9-4861-b738-a1e8a4f53463	7ff6b318-c6ec-455b-8a39-16999583c8a7	\N	Whistler	Premordial.\r\n\r\nBlind man that takes one of the characters to a dimension beyond time and space, beyond life and death, beyond morality, beyond entropy. Whister is the voice of reason, he appears in the dreams of many. Thought of being one of the most formidable ever. Beyond morality, he cares not about Vera, or Aaia itself at that.	Supporting	Male	3480	http://localhost:3000/uploads/characters/b3284c80-50ab-4d1b-904f-9e0527b1e183.png	{http://localhost:3000/uploads/characters/9604840b-a96d-4cfd-99cf-0ebcba5f4ff2.png,http://localhost:3000/uploads/characters/821c2c0c-259b-40f8-b23e-52a4b6c11f9b.png,http://localhost:3000/uploads/characters/64812bae-a653-44d9-ab24-e4d05d13012d.png,http://localhost:3000/uploads/characters/c3d3ad79-423c-4d85-837b-b6d8d7a58276.png}	f	2025-02-15 12:52:42.275	2025-02-23 04:15:17.513	\N
d50cdfd1-14a0-4576-875d-62da3a7d45d7	7f251920-f7b9-4861-b738-a1e8a4f53463	7ff6b318-c6ec-455b-8a39-16999583c8a7	\N	Marbles	The trickster. Merry name, disfigured face. Rumor is he'd tricked and pushed off some powerful merc down to the depths so he could steal his belongings off of his dead body of course. What he hadn't realised until much later was that the man had not only escaped the depths, but also became a baron. The great trickster Marbles had had his mouth shut, literally. The baron ordered his lips sewed shut so he could never talk his clever tongue again. Marbles however was much more resourceful when he couldn't use his strongest weapon. He somehow escaped the dungeons he was imprisoned in during the fall of the baron.\r\n\r\n\r\nHe meets leaf, with his hands tied and lips sewed. Leaf agrees to help marbles, unties his hand and rids him of his bindings. He could speak again, marvels ecstatic, thanks leaf and makes a mental note of never hurting or tricking this child in anyway.	Minor	Male	\N	http://localhost:3000/uploads/characters/a60d983a-c70d-4e25-97fc-fba293d9917c.png	{http://localhost:3000/uploads/characters/4fd877e6-a2eb-4a76-b860-87916f8a6038.png,http://localhost:3000/uploads/characters/2d319979-8986-4dd8-a0bb-cfd7e1c15009.png,http://localhost:3000/uploads/characters/7883e5a9-c581-4dbf-a288-f72cc7e95605.png}	f	2025-02-15 12:52:42.275	2025-02-23 13:41:33.675	\N
a06cb884-2cd6-44b1-b801-2cb560fe768b	7f251920-f7b9-4861-b738-a1e8a4f53463	\N	\N	Eisenbur	Eisenbur wants to bring about apocalypse	Antagonist	Male	\N	http://localhost:3000/uploads/characters/958166c2-300d-4502-93f3-c1e2bf639a02.png	{http://localhost:3000/uploads/characters/2ecfbcca-7271-46ab-8b78-49ee7aeafdc3.png,http://localhost:3000/uploads/characters/744cf819-97c4-446d-b92a-5dfcc88c7131.png,http://localhost:3000/uploads/characters/7faee878-0c34-4e66-90dc-c63c1e7d5560.png,http://localhost:3000/uploads/characters/23d674a1-5799-432b-a478-f5f8efc124b6.png}	f	2025-02-15 12:52:42.275	2026-01-26 14:36:13.371	\N
20beebba-8dca-464d-b64e-f5796d561e5d	7f251920-f7b9-4861-b738-a1e8a4f53463	5da036a0-d566-4d97-84fb-0dd04cf5aa33	\N	Lethyr Rayn		Supporting	Male	\N	http://localhost:3000/uploads/characters/20f46b4d-25a3-40e5-b598-1634542bb9e3.jpg	{http://localhost:3000/uploads/characters/91bdd059-5521-407b-8727-ff600219bf55.jpg,http://localhost:3000/uploads/characters/88124f78-dd98-4c8c-8a74-f323b687740f.jpg,http://localhost:3000/uploads/characters/0a85d96b-bfff-47f5-9a53-ff0c2318112e.png,http://localhost:3000/uploads/characters/fed22947-2c47-4453-995a-47641b5ba690.jpg}	f	2025-02-15 12:52:42.275	2026-02-26 08:35:16.029	\N
be759f25-c8dd-46ba-96c9-fe8ff4942881	7f251920-f7b9-4861-b738-a1e8a4f53463	7ff6b318-c6ec-455b-8a39-16999583c8a7	\N	Gin	An outsider in Noor. The only known human in Noor. 	Supporting	Male	\N	http://localhost:3000/uploads/characters/87e2402a-5e9d-44a1-86c0-958f94483004.png	{http://localhost:3000/uploads/characters/81eb32be-b272-4b2d-bbac-87fc47055222.png,http://localhost:3000/uploads/characters/64c76d51-a4e4-4cc3-9b7b-df929804e5e9.png,http://localhost:3000/uploads/characters/787b45a0-9c36-45bc-b735-45263c64dbdf.png,http://localhost:3000/uploads/characters/92f1d1d8-afa9-4061-ba1f-e0a7b2bf721a.png,http://localhost:3000/uploads/characters/ddc6e130-8b75-4e89-92a8-ae9264b98dd5.png}	f	2025-05-03 04:27:17.535	2025-05-31 13:00:06.636	\N
65c06064-cb07-4a52-883f-cf34b0d64a34	7f251920-f7b9-4861-b738-a1e8a4f53463	5da036a0-d566-4d97-84fb-0dd04cf5aa33	\N	Leper Rayn		Supporting	Male	\N	http://localhost:3000/uploads/characters/8d0bd768-3a09-4920-8650-a5bed186cc48.png	{http://localhost:3000/uploads/characters/ae038949-4d1c-4264-80a8-a1824b7a937b.webp,http://localhost:3000/uploads/characters/b04582ee-d2ae-4771-bc96-5a2a39750b97.png,http://localhost:3000/uploads/characters/8297ad43-3259-4167-a6ea-f2354a89bcd4.png,http://localhost:3000/uploads/characters/c58e86f8-7015-4d56-83ef-afc17c224264.png}	f	2025-02-15 12:52:42.274	2025-06-07 11:39:42.665	\N
1abb1b0e-c3e2-4747-9509-49759c1e8923	7f251920-f7b9-4861-b738-a1e8a4f53463	\N	\N	Jiraea of the Besiegers		\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.275	2026-02-17 15:38:41.072	2026-02-17 15:38:41.071
324da5fd-d2ea-4883-bcc2-9e033b85e06d	7f251920-f7b9-4861-b738-a1e8a4f53463	\N	\N	Kjaer Rayn	Pronounced as Kyayear, granduncle to Leaf, accompanies him on his journey.	\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.274	2025-02-16 15:11:48.595	\N
ea2e4979-afd9-400a-9ac9-172794e17d03	7f251920-f7b9-4861-b738-a1e8a4f53463	5da036a0-d566-4d97-84fb-0dd04cf5aa33	\N	Irythn	Born into the royal family, Irythn was groomed for leadership and war. His upbringing honed his skills as a warrior and strategist. Initially, he fulfilled his role dutifully, leading armies and maintaining order. However, a pivotal encounter with Sigurros, a former comrade, challenged his perceptions of justice and authority. This rebellion revealed the injustices within the kingdom, prompting Irythn to question his role. He left his post in search of a path that aligns with his evolving sense of morality, seeking a balance between protecting the innocent and challenging oppressive systems.\r\n\r\nIrythn's internal conflict is central to his character—balancing the duty to uphold order with the necessity to challenge unjust systems. This duality makes him a nuanced figure, capable of enforcing laws while questioning their morality. His combat prowess and strategic mind are used with precision, reflecting his depth and complexity as he seeks his true place in the royal order.	Supporting	Male	\N	http://localhost:3000/uploads/characters/39ea76be-86a3-4d0c-8814-d769a60dc0fc.png	{http://localhost:3000/uploads/characters/19c14047-70e2-4ff9-87bc-3f0bf64c73a6.png,http://localhost:3000/uploads/characters/00572a68-1c22-4fc0-a082-e5faab6cefc1.png}	f	2025-02-23 04:52:00.333	2026-01-26 08:12:28.081	\N
6e3027c7-d9f0-4a2d-a413-2fd96ed49f7a	7f251920-f7b9-4861-b738-a1e8a4f53463	5da036a0-d566-4d97-84fb-0dd04cf5aa33	\N	Aryan of Dreiken		Supporting	Male	\N	http://localhost:3000/uploads/characters/8b9f4f9d-2f86-41fa-b013-8d7e24615bd1.png	{http://localhost:3000/uploads/characters/3412f578-6b2e-4ead-80f3-4b56de75174e.png,http://localhost:3000/uploads/characters/94de748b-a196-493e-b025-60cf0381f518.jpg,http://localhost:3000/uploads/characters/d7e3c370-245b-4c9a-8f32-2858dbb8282f.png,http://localhost:3000/uploads/characters/86bd58aa-0b29-499a-8d30-d4085a1563fc.jpg}	f	2025-02-15 12:52:42.275	2026-02-17 15:36:51.998	\N
ec979fb6-8715-4aea-8eeb-9786dc348c45	7f251920-f7b9-4861-b738-a1e8a4f53463	7ff6b318-c6ec-455b-8a39-16999583c8a7	\N	Rigord Tos	\N	Supporting	Male	\N	http://localhost:3000/uploads/characters/54dc9bde-01d1-436e-aa19-91a068f90569.png	{}	f	2025-05-24 12:06:32.959	2026-02-07 04:19:43.906	\N
6d54a8b2-d379-483e-946d-9fe0525dca86	7f251920-f7b9-4861-b738-a1e8a4f53463	7ff6b318-c6ec-455b-8a39-16999583c8a7	\N	Kaos	“I carved paradise out of godflesh. Look at it. Look at what we’ve become.” - Kaylos, Kaos (Draecreth)\r\n\r\nBorn in an age when humanity cowered beneath the shadow of the Erylthyr—ageless demigods who shaped the world as playthings—Kaos was a prodigy of violence and vision. A warrior and philosopher, he rejected the notion that humans were destined to be frail, ephemeral creatures. His ambition was singular: to make humanity the apex race, free from the whims of gods and their half-divine offspring. He saw the Erylthyr not as benevolent guides, but as chains binding mortal potential. Alongside his brother-in-arms, Mikael, Kaos became the first human to ascend to near-godhood through sheer will, transcending mortality without forsaking his form—a feat deemed impossible.\r\n\r\nKaos’s obsession led him to the western edge of the known world, where he and Mikael encountered The Whistler—a being masquerading as human, yet radiating wrongness. Its melody tore reality, plunging them into a void where time and causality unraveled. There, the Whistler showed Kaos a vision: humanity’s extinction, repeated across infinite timelines, always crushed by the Erylthyr or their Aelthar. But it also revealed a loophole—a way to steal divinity. When the Whistler returned them to their world, it vanished, leaving Kaos with a burning truth: to elevate humanity, he would need to become the monster he despised.\r\n\r\nBy slaughtering the Erylthyr, Kaos severed the Aelthar influence on the world, achieving what he had sought all along.	Antagonist	Male	\N	http://localhost:3000/uploads/characters/58743282-ff69-4e6e-ade1-fa605ff25379.png	{http://localhost:3000/uploads/characters/ccdca97d-3f8e-4a89-87dc-67dba7e39ff6.png,http://localhost:3000/uploads/characters/a7963020-4f1c-42c9-8eea-951fcb857731.jpg,http://localhost:3000/uploads/characters/b9f100d1-e09e-41c4-af87-79cd6a6b6886.jpg,http://localhost:3000/uploads/characters/17acfd53-642d-4be0-93a9-560c4f13cd91.png,http://localhost:3000/uploads/characters/be25427d-774e-4048-8502-262fe02f1a17.png,http://localhost:3000/uploads/characters/8d4f8c0a-a711-4c3c-be4c-d8842150ad47.jpg}	f	2025-02-15 12:52:42.274	2026-02-26 16:07:19.265	\N
1ae5a707-7b41-43d1-8cfe-5ce73048dc93	7f251920-f7b9-4861-b738-a1e8a4f53463	5da036a0-d566-4d97-84fb-0dd04cf5aa33	\N	Lady Lyra Rayn	Brief history update check	Supporting	Female	57	http://localhost:3000/uploads/character/1772534860706-Gemini_Generated_Image_x1ygiwx1ygiwx1yg.jpg	{http://localhost:3000/uploads/character/1772534860708-Gemini_Generated_Image_hficcihficcihfic.png}	f	2026-03-03 16:17:40.712313	2026-03-03 16:17:40.712313	\N
a4498511-f87d-4e12-aecd-b22435257b4e	7f251920-f7b9-4861-b738-a1e8a4f53463	5da036a0-d566-4d97-84fb-0dd04cf5aa33	\N	Ludwin Rayn		Background	Male	0	\N	{}	f	2025-02-15 12:52:42.275	2025-02-16 15:11:48.631	\N
ce68e072-5728-4fe8-8daa-03c4975d0924	7f251920-f7b9-4861-b738-a1e8a4f53463	7ff6b318-c6ec-455b-8a39-16999583c8a7	\N	Sir Dennys, the menace	Ah, the enigmatic nature of Sir Dennys, the menace. While his name may evoke notions of dishonor and chaos, it serves as a deliberate contrast to his true character and motivations. The choice of such a name is a part of his cunning strategy to deceive his enemies and maintain an aura of unpredictability.\r\n\r\nHe thrives in the shadows, navigating the treacherous waters of the world with a combination of wit, audacity, and a touch of trickery. He instills uncertainty and doubt in the minds of his adversaries.\r\n\r\nHowever, beneath his roguish exterior lies a complex individual driven by a deeper purpose. At times, he may resort to unconventional tactics and bend the rules\r\n\r\n\r\n\r\n\r\n\r\nJoseph Joestar x Captain Jack Sparrow. \r\n\r\nAlways somehow manages to come out on top through measures extraordinaire and unexplainable.	Supporting	Male	\N	http://localhost:3000/uploads/characters/392bbe8e-d32c-4187-af26-d074ceca7afe.png	{http://localhost:3000/uploads/characters/03db16e8-c855-4a6e-bc39-ac676f9c6b0a.png,http://localhost:3000/uploads/characters/edc5b07b-27d8-4d1c-b6e9-e92292b34825.png}	f	2025-02-15 12:52:42.275	2026-02-07 04:30:21.73	\N
8b34e708-eb56-4533-bb61-24dc38479bbb	7f251920-f7b9-4861-b738-a1e8a4f53463	7ff6b318-c6ec-455b-8a39-16999583c8a7	\N	Rum Thunderscar	\N	Minor	Male	\N	http://localhost:3000/uploads/characters/82caa0dc-3a1c-43ab-a2b6-2f01462ead81.png	{http://localhost:3000/uploads/characters/71bd2e12-9f0d-4b16-ae1e-13d084de46f6.png,http://localhost:3000/uploads/characters/22dfe1ef-6d55-46de-94ee-484ad6e9ddb2.png}	f	2026-02-07 04:51:44.242	2026-02-07 04:51:44.242	\N
55479f9a-f273-4592-88a0-81ce5d96031e	7f251920-f7b9-4861-b738-a1e8a4f53463	5da036a0-d566-4d97-84fb-0dd04cf5aa33	\N	Grail	\N	Antagonist	Male	\N	http://localhost:3000/uploads/characters/d2baf67b-1709-4e37-a561-0cbc48e3d250.jpg	{http://localhost:3000/uploads/characters/77437a29-6351-4653-a577-b947dc8db2d3.jpg,http://localhost:3000/uploads/characters/0076d0c5-84b5-484b-a045-7d19aa32dbaa.jpg}	f	2026-02-07 06:23:32.507	2026-02-08 03:24:47.224	\N
47aedefa-7fa5-491e-b534-fbf59431cc20	7f251920-f7b9-4861-b738-a1e8a4f53463	5da036a0-d566-4d97-84fb-0dd04cf5aa33	\N	Vedas	\N	Antagonist	Male	\N	http://localhost:3000/uploads/characters/fc3eeee4-eddd-4b31-bce1-5e44162081ac.png	{http://localhost:3000/uploads/characters/73b6316a-d022-419b-807e-6f7ea43b6df1.png,http://localhost:3000/uploads/characters/e660328a-ec6d-43eb-8ca2-5a2fa40b4699.png}	f	2026-02-16 05:16:22.086	2026-02-16 05:21:45.827	\N
21e2b29f-3ae4-4d6b-a836-3497b185f71d	7f251920-f7b9-4861-b738-a1e8a4f53463	a0a05a6b-5e74-4996-a967-bd90268fafb5	\N	Stone Knight Siegnus	Stone Knight	Supporting	Male	\N	http://localhost:3000/uploads/characters/eaef0438-c0b9-4018-a3e2-25de365337c4.png	{http://localhost:3000/uploads/characters/6f762860-014c-471a-9917-9141da19216a.png,http://localhost:3000/uploads/characters/458fe795-abf4-48d3-9ac3-b0b861951d29.jpg,http://localhost:3000/uploads/characters/4796be77-ab32-41e5-ae61-31f7a4a93d68.png}	f	2025-02-15 12:52:42.275	2026-02-08 13:52:59.215	\N
47d16386-d401-4e27-8a23-5bbcbbdf4b4d	7f251920-f7b9-4861-b738-a1e8a4f53463	e2f41ff4-c340-45bc-b269-d4827365eec6	\N	Carnach	\N	Antagonist	Male	\N	http://localhost:3000/uploads/characters/028a0803-b5df-4bb0-9773-1351c4f17761.png	{http://localhost:3000/uploads/characters/9930d1c0-22b7-4dd6-a34a-672d73f9ca1c.png,http://localhost:3000/uploads/characters/d9166cae-487c-4d1b-8366-6cbd89855817.png}	f	2026-02-17 06:42:26.607	2026-02-17 06:55:17.591	\N
838c74db-be37-4d19-87ae-2a502a9458f8	7f251920-f7b9-4861-b738-a1e8a4f53463	438116c7-03bc-485b-bbe6-312098db9aaa	\N	Agalloch	\N	Antagonist	Male	\N	http://localhost:3000/uploads/characters/80714bd4-c22e-47bb-a58c-d1ba7d367613.png	{http://localhost:3000/uploads/characters/ab0db01f-0c55-4772-ae67-cc8f5a5cef21.jpg,http://localhost:3000/uploads/characters/b739efda-24d3-4793-a88f-d6b92d2fdcdf.png}	f	2026-02-15 11:51:13.701	2026-02-15 12:35:05.806	\N
1c1e6634-4c74-4d63-8238-cd3dbd06c74e	7f251920-f7b9-4861-b738-a1e8a4f53463	7ff6b318-c6ec-455b-8a39-16999583c8a7	\N	Ayden Godsgift	\N	Antagonist	Male	34	http://localhost:3000/uploads/characters/8f40f30b-ef8e-43d7-9ec5-333451a8cd38.png	{http://localhost:3000/uploads/characters/00c39cd0-db84-4fa0-a916-a286267ad7e6.png,http://localhost:3000/uploads/characters/8d933a7a-7a5a-4d15-9f1a-55272c1c0638.png,http://localhost:3000/uploads/characters/315a9676-8b80-42b0-aa7c-2027b5da307b.png}	f	2026-02-17 07:17:37.116	2026-02-17 13:43:04.674	\N
92a5b6ff-311e-4312-a132-ad6c10c6a35e	7f251920-f7b9-4861-b738-a1e8a4f53463	\N	\N	Ludwig Rayn		\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.274	2025-02-16 15:11:48.596	\N
5352752a-4375-4aad-ae13-1dad1d4f3871	7f251920-f7b9-4861-b738-a1e8a4f53463	\N	\N	Ionia, of the Besiegers		\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.275	2026-02-17 15:38:46.38	2026-02-17 15:38:46.379
aa5b8c64-cc4c-49b6-8bce-164075fc0295	7f251920-f7b9-4861-b738-a1e8a4f53463	7ff6b318-c6ec-455b-8a39-16999583c8a7	\N	Mikael	"To become king of all, is not akin to climbing the highest peak, it is akin to a descent into oblivion."\r\n\r\n"I helped a man once, take his throne and become king of all, and i realised in helping him descend to those depths, I had reached there as well."	Supporting	Male	\N	http://localhost:3000/uploads/characters/f50e44a9-f9c8-4d36-b2bd-518976d46db1.png	{http://localhost:3000/uploads/characters/5120b14f-150a-40dd-b503-c4414b87f90b.png,http://localhost:3000/uploads/characters/9406b1fa-88ae-4a57-beda-597bb862d382.png,http://localhost:3000/uploads/characters/f00bf16d-0b65-4ce9-a103-fa7dfa5f567a.png,http://localhost:3000/uploads/characters/e1f73289-dd80-4298-b17c-2585a0a1def3.png,http://localhost:3000/uploads/characters/a6b899c9-7f10-4892-ab76-ce205c987ebd.png,http://localhost:3000/uploads/characters/003ad4b1-f271-4565-a25a-fdce7e95af78.png,http://localhost:3000/uploads/characters/9ee8dd5d-c755-4c88-a244-011e2bdb0420.png,http://localhost:3000/uploads/characters/e1ab2046-fa14-45a3-8489-ee1124f8954d.png}	f	2025-02-15 12:52:42.273	2026-02-18 13:20:09.75	\N
d52ec5f3-c6f2-491f-af7c-48dfe9e03dcf	7f251920-f7b9-4861-b738-a1e8a4f53463	e2f41ff4-c340-45bc-b269-d4827365eec6	\N	Varkarth Lathar	\N	Antagonist	Male	\N	http://localhost:3000/uploads/characters/53691401-a1dd-44c0-9686-30b5485d017f.png	{}	f	2026-02-24 02:38:06.251	2026-02-25 15:43:45.594	\N
3b733055-b14d-417f-8bef-1d8f22f67159	7f251920-f7b9-4861-b738-a1e8a4f53463	5da036a0-d566-4d97-84fb-0dd04cf5aa33	\N	Luthor Rayn	\N	Minor	Male	\N	http://localhost:3000/uploads/characters/3d2ea937-072e-4e2f-af28-6fddc257487b.png	{http://localhost:3000/uploads/characters/ff9b308d-a93e-456f-b7e3-38160817b810.jpg,http://localhost:3000/uploads/characters/31f9eebf-a021-4635-9a94-263068aee080.png}	f	2026-02-25 15:44:36.826	2026-02-26 08:56:25.213	\N
981185ed-7603-4d58-a5be-a2beaf7544bc	7f251920-f7b9-4861-b738-a1e8a4f53463	7ff6b318-c6ec-455b-8a39-16999583c8a7	\N	Eard Godsgift	\N	Antagonist	Male	\N	http://localhost:3000/uploads/characters/bd26e1dc-246d-48ef-897d-c6367b4d1cd0.png	{http://localhost:3000/uploads/characters/94d06261-2db0-4977-b0b8-210dd9dfc357.jpeg,http://localhost:3000/uploads/characters/de2c4fd1-6e20-4adb-9fd1-901ff9591380.png}	f	2026-02-24 02:11:21.205	2026-02-26 16:15:08.355	\N
aecf4c59-5e84-4afc-b9b8-04af30659bff	7f251920-f7b9-4861-b738-a1e8a4f53463	5da036a0-d566-4d97-84fb-0dd04cf5aa33	\N	Leaf Rayn	Leaf was born in the Rayn family. The youngest son of Lufous Rayn with his second wife Yvienna. Leaf was never treated well in the royal family. He escapes the kingdom of Braithlait, to go out on the search for his purpose.	Protagonist	Male	14	http://localhost:3000/uploads/characters/37866613-bfb3-491f-913b-1debb84b9f9e.png	{http://localhost:3000/uploads/characters/d4ae3451-cdba-40f8-a086-357ac32f90c4.png}	f	2025-02-15 12:52:42.273	2026-02-18 12:38:44.517	\N
87a0f292-8fe7-4783-a05e-5dd58bfbcea0	7f251920-f7b9-4861-b738-a1e8a4f53463	5da036a0-d566-4d97-84fb-0dd04cf5aa33	\N	Sigurrós	Sigurrós\r\n\r\nA child of the river, born from the murk of the Great Iris Canal, Sigurrós was shaped by paradox. Raised in Aeran’s rigid martial hierarchy yet never truly belonging to it, he was Grandmaster Illamar’s secret masterpiece—a weapon forged in the dark, far from the sacred dueling codes of his peers. Though denied inheritance and title, he became the blade Illamar’s blood son, Sirrhadiyr, could never wield: a Deathly One, Aeran’s most feared class of assassin. His training stripped him of mercy, replacing it with a cold calculus of angles, pressures, and vulnerabilities. He killed without flourish, leaving corpses so clinically dispatched they seemed untouched by violence—a signature that earned him the moniker Bloodless Ghost.\r\n\r\nThe cost of his artistry is Anathema—a gnawing void where purpose once resided. His skills, once a source of grim pride, now feel like borrowed tools with no hand to wield them. He wanders Feria, a specter adrift, carrying only the echoes of Aeran’s teachings: “A Deathly One does not dream. They dissolve.” Yet dissolution eludes him. Each kill—clean, efficient, devoid of passion—deepens the hollowness. His calming touch, which once gave him fleeting connection to others’ emotions, now feels like a curse, forcing him to absorb the fear, regret, or resignation of those he ends.\r\n\r\nContrast with Nikolas: \r\nWhere Nikolas burns with ambition, Sigurrós smolders with existential ash. Nikolas fights with raw, adaptive instinct, thriving in chaos; Sigurrós dances through combat like a mathematician executing a pre-solved equation, every motion rehearsed ten thousand times. He is faster, leaner—a scalpel to Nikolas’s hammer—yet envies the latter’s uncomplicated hunger. Their encounters crackle with unspoken rivalry: Sigurrós, the artist without a canvas; Nikolas, the brute with a kingdom to claim.\r\n\r\nKaos relation?	Protagonist	Male	\N	http://localhost:3000/uploads/characters/9a8e0a33-e9e5-432f-81ad-dda0a44c20d2.jpg	{http://localhost:3000/uploads/characters/44bebebb-e657-445c-90a3-35ae07ed0c55.png,http://localhost:3000/uploads/characters/f54fd4d5-629a-4431-8989-0b6d91254764.jpg,http://localhost:3000/uploads/characters/c7e05aaa-6bc6-4966-b16b-bad31cb6505a.jpg,http://localhost:3000/uploads/characters/f0c870a9-7de7-4bf4-b023-f09320b3ae4e.jpg,http://localhost:3000/uploads/characters/f825fe7e-d32a-4b44-9bfa-f76aded5ac8e.jpg}	f	2025-02-15 12:52:42.274	2026-02-26 16:10:47.71	\N
1116ccb6-f8ae-45d8-9d18-5b6adb8e38aa	7f251920-f7b9-4861-b738-a1e8a4f53463	5da036a0-d566-4d97-84fb-0dd04cf5aa33	\N	Leyla Rayn	Nyferis	Supporting	Female	\N	http://localhost:3000/uploads/characters/96319e24-03b8-482d-833d-25f6c8105484.jpg	{http://localhost:3000/uploads/characters/2844e324-e9d5-4ed3-bd0c-32d2afdc2f72.jpg,http://localhost:3000/uploads/characters/ae781472-3cb6-4046-ab34-718294543e92.jpg}	f	2025-02-15 12:52:42.274	2026-02-17 16:02:40.401	\N
da9695ef-d264-4e8a-8e12-34abc40ec5e1	7f251920-f7b9-4861-b738-a1e8a4f53463	438116c7-03bc-485b-bbe6-312098db9aaa	\N	Llara 	\N	Supporting	Female	\N	http://localhost:3000/uploads/characters/b6d67124-1de8-4114-9f4f-1a5895a0c4df.png	{http://localhost:3000/uploads/characters/3bd038f1-8877-497c-b4cf-d7c386e0fc97.png,http://localhost:3000/uploads/characters/1aab5a27-bdd6-4163-99d0-a107836e96b8.png,http://localhost:3000/uploads/characters/f45a7cb1-5db7-423d-892f-acec7a73e09c.png,http://localhost:3000/uploads/characters/15096105-791b-4c3d-9993-a7f3f5c076b7.png,http://localhost:3000/uploads/characters/96818d61-1a08-436c-8e63-3516af7c2337.png,http://localhost:3000/uploads/characters/bf1a0eaa-3ba6-4839-989d-bd5fe389ac17.png}	f	2025-03-28 19:54:16.964	2025-03-29 10:59:35.605	\N
2c915b3b-4d1e-42ca-bdf5-7f7c0be9e373	7f251920-f7b9-4861-b738-a1e8a4f53463	\N	\N	Fjara		Protagonist	Female	\N	http://localhost:3000/uploads/characters/742d6786-2895-4bdb-a2ff-ffb7b9420680.png	{http://localhost:3000/uploads/characters/293f310f-3d20-4ad8-811e-b961523a66eb.png,http://localhost:3000/uploads/characters/b9fff3ff-1f15-4dd2-924b-b9161ccc5fad.png}	f	2025-02-15 12:52:42.274	2025-02-16 15:28:36.374	\N
7b503057-9eae-4b4c-85be-459b80c3b37a	7f251920-f7b9-4861-b738-a1e8a4f53463	\N	\N	The Rage Knight		\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.274	2025-02-16 15:11:48.605	\N
23a6e3ca-0367-4a03-bb74-b4678fb8d6f0	7f251920-f7b9-4861-b738-a1e8a4f53463	e4522f38-912e-4b3d-9283-db59f2c1e7ed	\N	Sirius, Lord of the Void	One half of The Lord of Space and Time	\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.274	2025-02-16 15:10:25.728	\N
27e60eef-2875-45c1-af77-1e6699638e33	7f251920-f7b9-4861-b738-a1e8a4f53463	e4522f38-912e-4b3d-9283-db59f2c1e7ed	\N	Lazarus, Lord of Light		\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.274	2025-02-16 15:10:25.729	\N
2156dbdb-f1a0-4c2b-a692-fc3868bd79a2	7f251920-f7b9-4861-b738-a1e8a4f53463	e4522f38-912e-4b3d-9283-db59f2c1e7ed	\N	Kahn, Lord of Time	Other half of The Lord of Space and Time. It is said that Kahn has the power to stop time altogether.	\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.274	2025-02-16 15:10:25.731	\N
da691cbb-9d9e-4c5d-bc8a-86f312435679	7f251920-f7b9-4861-b738-a1e8a4f53463	\N	\N	Kaine		\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.274	2025-02-16 15:11:48.605	\N
67d99365-4d5b-4dd8-b49a-68d0d7a20500	7f251920-f7b9-4861-b738-a1e8a4f53463	\N	\N	The CubeHeads		\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.274	2025-02-16 15:11:48.606	\N
9cc89f3f-62ce-4297-8bef-1376240ddc43	7f251920-f7b9-4861-b738-a1e8a4f53463	\N	\N	Neer	Special Bird companion of Sigurros.they can make intra continental journeys.	\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.274	2025-02-16 15:11:48.607	\N
13cab68d-7778-4931-bb2a-b70ae2a893b0	7f251920-f7b9-4861-b738-a1e8a4f53463	\N	\N	Nomad Bayer		\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.274	2025-02-16 15:11:48.608	\N
087fd623-f742-44bd-a4a3-bb4442482f37	7f251920-f7b9-4861-b738-a1e8a4f53463	e4522f38-912e-4b3d-9283-db59f2c1e7ed	\N	Frenna, Goddess of Life,		\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.275	2025-02-16 15:10:25.726	\N
1a4a9720-2c7e-4c79-8c13-dc7ffecb4b57	7f251920-f7b9-4861-b738-a1e8a4f53463	e4522f38-912e-4b3d-9283-db59f2c1e7ed	\N	Lunas, Lord of the Night,		\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.275	2025-02-16 15:10:25.708	\N
d9e29e6a-e21a-43d3-b745-3415ca8d7d8e	7f251920-f7b9-4861-b738-a1e8a4f53463	\N	\N	Lyrielle, the one in slumber eternal	It is said that Lyrielle lies atop the great mountain of Aeran. There she rests in eternal slumber. Once broken, will trigger the end of the world.	\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.275	2025-02-16 15:11:48.634	\N
f24f94aa-11bb-4245-8777-35d6f394c093	7f251920-f7b9-4861-b738-a1e8a4f53463	\N	\N	Leaf Reapers	Leaf Reapers is a name given to the native of the Noor forests. They smoke plants.	\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.275	2025-02-23 03:48:15.618	2025-02-23 03:48:15.616
7da9f85e-abc1-422d-849f-f1c8d7b99959	7f251920-f7b9-4861-b738-a1e8a4f53463	\N	\N	Levisceris	Powers of electricity	\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.274	2025-02-16 15:11:48.588	\N
780f1f6d-ec6b-46b0-a563-e5fa82aca0cf	7f251920-f7b9-4861-b738-a1e8a4f53463	e4522f38-912e-4b3d-9283-db59f2c1e7ed	\N	Varkarth, Lord of the Abyss		\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.274	2025-02-16 15:10:25.725	\N
72026d7f-832f-45b1-9594-5333498f50d5	7f251920-f7b9-4861-b738-a1e8a4f53463	e4522f38-912e-4b3d-9283-db59f2c1e7ed	\N	Sabbath, Lord of the Mosaics		\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.275	2026-02-07 05:58:25.818	2026-02-07 05:58:25.816
10fd83d9-4185-4cba-a5ed-417aa9ffd534	7f251920-f7b9-4861-b738-a1e8a4f53463	\N	\N	Hasihn, of the Besiegers		\N	Unspecified	\N	\N	{}	t	2025-02-15 12:52:42.275	2026-02-17 15:38:37.262	2026-02-17 15:38:37.261
38b6d4ae-36c1-47da-9ce7-4bc98f319b72	7f251920-f7b9-4861-b738-a1e8a4f53463	438116c7-03bc-485b-bbe6-312098db9aaa	\N	Szeth	\N	Supporting	Male	\N	http://localhost:3000/uploads/character/1772535545314-Gemini_Generated_Image_sl2nqlsl2nqlsl2n.jpg	{http://localhost:3000/uploads/characters/8a4daf72-b245-46e1-ac19-cab85332a23a.png,http://localhost:3000/uploads/characters/e4a40d74-3ab3-41c3-9695-06008499f026.png,http://localhost:3000/uploads/character/1772535545315-Gemini_Generated_Image_sl2nqlsl2nqlsl2n.jpg,http://localhost:3000/uploads/character/1772535545315-Gemini_Generated_Image_9h4tnt9h4tnt9h4t.jpg}	f	2025-03-29 07:49:54.289	2025-03-29 08:04:05.983	\N
ffa831a7-3e07-4acc-9509-f38a045a000e	7f251920-f7b9-4861-b738-a1e8a4f53463	5da036a0-d566-4d97-84fb-0dd04cf5aa33	\N	Nikolas Kaisar	Nikolas towers over most men. Long, jet-black hair cascades in thick, wind-tossed strands past his shoulders, framing a chiseled, angular face with high cheekbones. He moves like a shadow in layered black garb: a tunic, loose yet cinched tight at the waist with dark wraps, its edges frayed from ceaseless wandering. Fitted black pants hug his legs, calves bound for swift strides, while frayed bandages sheath his forearms and hands, stained with the grit of combat. A tattered black cloak billows from his shoulders, and scarred leather boots crunch dust beneath rugged steps.\r\n\r\nNikolas is a man shackled by the specter of inadequacy. His life orbits a single purpose: to purge the weakness he believes courses through his veins. As a child, he witnessed his mother’s mind fracture after she witnessed her daughter and his sister be violated. He could not protect.\r\n\r\nNow a man, Nikolas wages a war against fragility. He hones his body into a weapon, training with a desperation that borders on self-destruction. His sister tends to their catatonic mother, but Nikolas cannot bear their haunted home—a tomb of his failures. He roams battlefields and training grounds, seeking opponents who might shatter his limits. Though his overall prowess lags behind warriors like Sigurrós, Nikolas possesses a feral instinct in combat, adapting in real-time with unpredictable ferocity. His greatest fear is not death, but irrelevance; he knows the world teems with beings like Kaos, who treat mortal frailty as a plaything.\r\n\r\nYet beneath his obsession lies a flicker of humanity—guilt for abandoning his sister, silent rage at his absent father, and the unspoken wish that strength might someday fill the void where love once lived.\r\n	Protagonist	Male	27	http://localhost:3000/uploads/characters/5255263c-9d2d-40e0-ab53-7dca6a776c08.png	{http://localhost:3000/uploads/characters/e3192656-810b-455c-8a88-3ab3df27b20e.png,http://localhost:3000/uploads/characters/dcbd1b4e-a677-4a7b-b20e-62ae1b283e2a.png,http://localhost:3000/uploads/characters/a89bf31b-df49-42e9-a853-bdeb61a2a751.png}	f	2025-02-08 15:30:50.416	2026-01-26 07:52:46.338	\N
bed15c7a-17a6-48a2-8d0c-f8f1b5746bb2	7f251920-f7b9-4861-b738-a1e8a4f53463	5da036a0-d566-4d97-84fb-0dd04cf5aa33	\N	Freya		Supporting	Female	27	http://localhost:3000/uploads/character/1772826136778-e544cd1352a487259c39c06ff86cb6c3.jpg	{http://localhost:3000/uploads/character/1772826136779-4f642131bb9d6ced1e60054fa4a64c1e.jpg,http://localhost:3000/uploads/character/1772826136779-3cbb847be78eab4f3aca19bee32b59b7.jpg,http://localhost:3000/uploads/character/1772826136779-998ae504e08948474a822bc22549d31c.jpg,http://localhost:3000/uploads/character/1772826136779-e544cd1352a487259c39c06ff86cb6c3.jpg}	f	2026-03-07 01:12:16.781602	2026-03-07 01:12:16.781602	\N
56d99c9a-f826-41ff-8e1a-2642270d3f88	7f251920-f7b9-4861-b738-a1e8a4f53463	7ff6b318-c6ec-455b-8a39-16999583c8a7	\N	Araella		Supporting	Female	23	http://localhost:3000/uploads/character/1772822238464-cfc89621371243b845f3901882869fe9.jpg	{http://localhost:3000/uploads/character/1772908724764-unnamed-(2).jpg,http://localhost:3000/uploads/character/1772908724765-Gemini_Generated_Image_g75purg75purg75p.png,http://localhost:3000/uploads/character/1772908724765-Gemini_Generated_Image_us02kpus02kpus02.png,http://localhost:3000/uploads/character/1772909189380-Gemini_Generated_Image_5qbbw5qbbw5qbbw5-(1).png}	f	2026-03-07 00:07:18.467527	2026-03-07 00:07:18.467527	\N
803dc902-f025-4c9d-a6b0-d584dfe3121e	7f251920-f7b9-4861-b738-a1e8a4f53463	5da036a0-d566-4d97-84fb-0dd04cf5aa33	\N	Lythiera Rayn		Background	Female	0	\N	{}	f	2026-03-08 18:06:12.218225	2026-03-08 18:06:12.218225	\N
f83895ec-3ef1-460b-8010-f0e7bd91f8f5	7f251920-f7b9-4861-b738-a1e8a4f53463	5da036a0-d566-4d97-84fb-0dd04cf5aa33	\N	Lyrielle Rayn		Minor	Female	22	\N	{}	f	2026-03-08 23:31:09.325542	2026-03-08 23:31:09.325542	\N
\.


--
-- Data for Name: constructs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.constructs (id, name, description, category, universe_id, created_at, updated_at, properties, rarity, tags, avatar_url, image_urls) FROM stdin;
7b6177fc-5d12-400f-9503-b7de34459854	Anathema	A condition that takes away one's lucidity slowly. Powerful men are corrupted and lose their lucidity, and become insane. The weak are rendered asleep with their eyes open. An endless sleep.  \r\n\r\nThe origins of the curse are unknown. It affects most people with weakness. But you see the truly powerful men are not killed, but corrupted. Some powerful men have been corrupted by the curse and have gone berserk. Shells of their true selves, they wait to devour. \r\n\r\n"Anathema will take everyone one day, none shall be saved. All corrupted. Anathema upon thee."	AFFLICTIONS	7f251920-f7b9-4861-b738-a1e8a4f53463	2025-06-02 10:07:10.684	2025-06-02 10:07:10.684	{"duration": "", "severity": "", "symptoms": [], "treatment": "", "contagious": false}	\N	{}	http://localhost:3000/uploads/constructs/cb0daa5d-0e52-456d-ace5-77b38dc3ff01.png	{http://localhost:3000/uploads/constructs/1cf1b0ff-f191-45e0-b572-393dfa93bf62.png}
b6d50775-bccc-4f01-add6-283be3095da5	Offieros	\N	MANIFESTATIONS	7f251920-f7b9-4861-b738-a1e8a4f53463	2026-02-18 16:51:45.233	2026-02-18 16:51:45.233	{"range": "", "effects": "", "triggers": [], "frequency": "", "visibility": ""}	Rare	{}	http://localhost:3000/uploads/constructs/a9f05669-38ee-4eea-8344-1d659e570462.jpg	{}
91c5ed5f-9fd2-4fb0-a730-0a2757f72d17	Godless		ENTITIES	7f251920-f7b9-4861-b738-a1e8a4f53463	2026-02-21 11:58:27.012	2026-03-06 20:34:57.526	{"type": "", "habitat": "", "abilities": [], "hostility": "", "intelligence": ""}	Rare	{}	\N	{}
e475f171-8340-4874-bbb2-91b1a67cdaa9	Chrysalis	It consumes and transforms, so the net death is in fact zero, since when the host dies, the parasitic chrysalis emerges. The influence of an Aelthar that grows and consumes that which is plentiful to feast upon and grow on top of. \r\n\r\nA potential story is when people try to drive away Chrysalids and Chrysalis, they try to throw the people afflicted into lakes, which leads to a catalyst event that spreads it even more, of decay and stagnation. Could have a festival or ritual about this as well.\r\n\r\n\r\n"A seed in a barren soil might curl up into a coil\r\nFlourish into something to\r\nGive back what you thought was "you"\r\nAnd give way to all that is new"\r\n\r\n"decay is not death, but a prelude to emergence."	MANIFESTATIONS	7f251920-f7b9-4861-b738-a1e8a4f53463	2025-06-02 16:05:13.949	2026-03-06 18:26:32.201	{"range": "", "effects": "", "triggers": [], "frequency": "", "visibility": "Visible"}		{}	http://localhost:3000/uploads/construct/1772821592199-2730a5ccefba0eb0812410927889f045.jpg	{http://localhost:3000/uploads/construct/1772821592200-a60fb621-bf50-4166-b9a8-54b1866fa19b.webp,http://localhost:3000/uploads/construct/1772821592200-fa382a76b0f4f7bb4bf16f23f5d7865e.jpg,http://localhost:3000/uploads/construct/1772821592200-2730a5ccefba0eb0812410927889f045.jpg,http://localhost:3000/uploads/construct/1772821592200-82a9d80f57dc739442cff36120df0bf8.jpg}
\.


--
-- Data for Name: ethnic_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ethnic_groups (id, race_id, name, description, avatar_url, image_urls, created_at, updated_at) FROM stdin;
d7c8956b-95e8-4eee-9acc-044e2b27fb8e	7ff6b318-c6ec-455b-8a39-16999583c8a7	Grinari	Estani Desert People	http://localhost:3000/uploads/ethnic-group/1772819478150-106e717acb2079f44c67b32e12b5ed80.jpg	{http://localhost:3000/uploads/ethnic-group/1772819329423-023e3d36c1f77a864df8037092a1db21.jpg,http://localhost:3000/uploads/ethnic-group/1772819329423-60a897619a6455b23d1780012c5b7043.jpg,http://localhost:3000/uploads/ethnic-group/1772819329424-ac7df048d833e6174b81e602ef13f582.jpg,http://localhost:3000/uploads/ethnic-group/1772819329423-106e717acb2079f44c67b32e12b5ed80.jpg,http://localhost:3000/uploads/ethnic-group/1772819329424-a7973b0ab49d2ca4dc4762b7c6fdd7ac.jpg,http://localhost:3000/uploads/ethnic-group/1772819329424-0638a05b4eb52f23ef69b73dc3bda23b.jpg}	2025-02-08 15:24:07.833	2026-03-06 17:51:18.151
\.


--
-- Data for Name: factions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.factions (id, name, description, universe_id, created_at, updated_at, type, avatar_url, image_urls) FROM stdin;
8e33ec1b-485d-4b0c-86c1-29fc3ccf9449	The Rayn Family		7f251920-f7b9-4861-b738-a1e8a4f53463	2026-03-08 05:48:47.409112	2026-03-08 05:48:47.409112	FAMILY	\N	{}
\.


--
-- Data for Name: galaxies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.galaxies (id, universe_id, name, description, type, created_at, updated_at, avatar_url, image_urls) FROM stdin;
efaa904e-4804-43a9-bdc2-a23cff6af6eb	7f251920-f7b9-4861-b738-a1e8a4f53463	Sulfurys	Brief Description Edited	SPIRAL	2025-02-23 06:26:19.613	2026-03-02 12:50:42.384	http://localhost:3000/uploads/celestial/1772437069931-Spiral-Galaxy-Magic-AI-Generated-4K-Wallpaper-1081x608.jpg	{http://localhost:3000/uploads/celestial/1772437069931-Spiral-Galaxy-Magic-AI-Generated-4K-Wallpaper-1081x608.jpg}
\.


--
-- Data for Name: map_svg_mappings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.map_svg_mappings (id, map_id, svg_element_id, feature_type, region_id, created_at, updated_at, x, y) FROM stdin;
795fa597-ad99-4731-ad14-c0c54de8baea	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	state2	state	d7ba07c0-5c54-4ae3-9d5e-51cd56731ef7	2026-03-01 06:07:39.61733	2026-03-01 06:07:39.61733	\N	\N
ece68562-03fb-4ad8-970a-6e8951f7caff	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	state11	state	dd15b0c3-88f0-4f10-b71f-5701b665a444	2026-03-01 06:07:39.620457	2026-03-01 06:07:39.620457	\N	\N
0095ee7f-d4f8-4bd5-9b05-dd163a97a963	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	state18	state	a9682e8d-6c25-46bb-859e-5e75a809be46	2026-03-01 06:07:39.620849	2026-03-01 06:07:39.620849	\N	\N
2b98f165-8593-4681-9d4b-95b64f01c61e	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	state19	state	554071ae-2591-4f75-81e5-fd47b3454455	2026-03-01 06:07:39.62118	2026-03-01 06:07:39.62118	\N	\N
4bf8c6e2-e260-4311-a852-ab9f657a249e	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	state23	state	86b78b30-c6a8-4675-aeac-1ca1d321ed66	2026-03-01 06:07:39.621469	2026-03-01 06:07:39.621469	\N	\N
f2e6f94c-41da-4383-8d1f-4067d9d39d15	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	state1	state	9feaed15-1241-4340-b32a-ba5232e74abe	2026-03-01 06:07:39.621765	2026-03-01 06:07:39.621765	\N	\N
97aa1c0e-e8f8-4846-ac90-d7a2161e5226	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	state7	state	3075a018-5a35-43f9-8564-1fa86e638cbf	2026-03-01 06:07:39.622093	2026-03-01 06:07:39.622093	\N	\N
0564fcfd-2aae-444b-9e31-ea79d8dac0cb	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	state20	state	9cff3d74-a3f0-4b6d-ab51-9e0b6402c4aa	2026-03-01 06:07:39.622555	2026-03-01 06:07:39.622555	\N	\N
7cfeaade-08c5-452a-91f1-f81d882b4eb5	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	state17	state	5e777132-5db9-4ee0-9bf9-c3f6d52d2235	2026-03-01 06:07:39.623235	2026-03-01 06:07:39.623235	\N	\N
4dacb4eb-a104-4f52-b546-e335cd321db2	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	state12	state	f27fa1d2-809d-4d9b-b2ed-573863cadd8f	2026-03-01 06:07:39.623574	2026-03-01 06:07:39.623574	\N	\N
4e37ccfc-a366-49c1-a21f-91e6b65bb7e4	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	state9	state	90f56212-11d8-4eac-8ffa-db89611a2c60	2026-03-01 06:07:39.623875	2026-03-01 06:07:39.623875	\N	\N
fa2c94d3-9e77-4b5d-a6ca-e7f39b57394a	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	state24	state	4fe6150b-f9b1-4192-818b-41e209e76cbb	2026-03-01 06:07:39.624122	2026-03-01 06:07:39.624122	\N	\N
74ec2080-950b-4133-a03b-bcdfa097696b	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	state21	state	1c01137c-ecaf-46aa-b17a-9a0142cd8c11	2026-03-01 06:07:39.624417	2026-03-01 06:07:39.624417	\N	\N
8dc94953-0810-4d17-9a89-d0870187bb4f	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	state16	state	e511b966-06fc-4b36-a122-4c0bbd26eea1	2026-03-01 06:07:39.624677	2026-03-01 06:07:39.624677	\N	\N
d5e7720a-7c8c-4c05-909f-aa30a1cb7f6a	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	state28	state	340d06e2-a7a0-4113-b2b5-88372d372a1a	2026-03-01 06:07:39.624932	2026-03-01 06:07:39.624932	\N	\N
0d29a224-f761-4442-9a45-3215a2b2800d	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	state14	state	5b1bb9cf-e8a2-4a87-8255-38aff878c921	2026-03-01 06:07:39.625186	2026-03-01 06:07:39.625186	\N	\N
6cc852e1-ad67-4d50-b599-28b26bb4b655	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	feature_28	lake	c00c045e-4063-4ebe-b231-bb6677f8877f	2026-03-03 02:26:17.415628	2026-03-02 20:56:59.174	\N	\N
9aee4b68-20a0-4164-bdd7-a6be9316bd80	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	custom-city-3a44be45-d0e9-4e21-96af-c0f49acc85e2	city	1a4d5041-376d-48fc-8da6-16377e180e37	2026-03-03 22:32:25.143837	2026-03-03 22:32:25.143837	3280.3296	548.67505
e1696ba2-7fd6-4346-b6fb-292409dc31f0	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	custom-region-32e5a0ab-7627-4d00-b825-baf2bf66a76d	ocean	bd4c4b6b-790f-4f89-a882-c1d688056ced	2026-03-04 16:50:19.337666	2026-03-04 16:50:19.337666	210.79433	1238.8275
d992e062-468f-408c-ae73-eef36ab24e66	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	custom-region-fe48ae20-5e32-4311-8ef1-ddb1fd2fc7b1	ocean	00927a1f-f8d2-4be8-a4bd-82a37f5e4bdb	2026-03-04 16:51:34.521202	2026-03-04 16:51:34.521202	831.9315	220.03102
01b94df0-f686-45ff-9eb2-06010548faa7	1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	custom-region-503902ad-aec9-4f20-b063-a6bfaaca968f	ocean	67d348f0-6fad-455d-8b9b-a88085b9e269	2026-03-04 20:53:36.908908	2026-03-04 20:53:36.908908	966.6756	1988.1359
\.


--
-- Data for Name: maps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maps (id, name, universe_id, region_id, image_url, created_at, updated_at) FROM stdin;
5d8ba1ed-34b1-4245-bec4-8bcfc244f652	Veneleyr Base	7f251920-f7b9-4861-b738-a1e8a4f53463	b2593dd8-2cc8-4888-b4cc-8ce59f852f6c	http://localhost:3000/uploads/maps/619aefce-5b9b-4419-82ae-ed18b90d43ad.svg	2025-06-04 14:52:56.968	2026-02-19 08:47:55.01
1c5504dc-b4d0-4dbc-a27e-bf808e68c97b	Vera Base	7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	http://localhost:3000/uploads/maps/1772561805832-Vilia-2026-03-03-23-46.svg	2025-02-23 12:29:17.326	2026-03-03 18:16:45.833
\.


--
-- Data for Name: nature; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nature (id, universe_id, name, type, description, avatar_url, image_urls, created_at, updated_at, occurance) FROM stdin;
583b6874-9a6b-455c-a037-5f6f2e2f67a1	7f251920-f7b9-4861-b738-a1e8a4f53463	Wyverns	PLANT	While Arch Dragons are the ancient, mountain-sized titans of the world, Wyverns are their leaner, more aggressive descendants—the specialized hunters of the sky. Unlike the six-limbed Arch Dragons (four legs and two wings), Wyverns possess a more aerodynamic, avian-inspired physiology. Their forelimbs are fused into their wings, forcing them to knuckle-walk on the ground like giant, leathery bats. This makes them significantly faster and more maneuverable in flight, capable of diving at speeds that would tear a lesser creature apart.	http://localhost:3000/uploads/nature/1772991586733-00b78681e1de261a5fac8b63f9eceb2d.jpg	{http://localhost:3000/uploads/nature/1772991586733-00b78681e1de261a5fac8b63f9eceb2d.jpg,http://localhost:3000/uploads/nature/1772991586733-24d345a0d2e62cd63f4dd4813c404054.jpg,http://localhost:3000/uploads/nature/1772991586733-ed88b22a61427b814f5f4d28f740f129.jpg}	2026-03-08 23:09:46.735585	2026-03-08 23:09:46.735585	EXTANT
76fd9646-ec8f-404f-8375-837b0bda9b95	7f251920-f7b9-4861-b738-a1e8a4f53463	Arch Dragons	ANIMAL	Arch Dragons are colossal, prehistoric entities that represent the pinnacle of dragon-kind. Unlike later, smaller iterations, Arch Dragons are titans, with wingspans that can blot out the sun and bodies composed of ancient, petrified rock, obsidian	http://localhost:3000/uploads/nature/1772990772719-Gemini_Generated_Image_un4cekun4cekun4c.png	{http://localhost:3000/uploads/nature/1772990772723-Gemini_Generated_Image_un4cekun4cekun4c.png,http://localhost:3000/uploads/nature/1772990772723-Gemini_Generated_Image_hv8id1hv8id1hv8i.png,http://localhost:3000/uploads/nature/1772990772723-ac401135c5d858af3391863e93add4c2.jpg,http://localhost:3000/uploads/nature/1772990772723-93591fbac360d2947cdd20b1e1fe5228.jpg}	2026-03-08 22:56:12.72727	2026-03-08 17:45:51.468	EXTINCT
e1e42bf4-4c82-4d84-b300-3cf16ba78ea8	7f251920-f7b9-4861-b738-a1e8a4f53463	Mistrals	ANIMAL		http://localhost:3000/uploads/nature/1772993135378-05e6b9bd095d84dbe8fbb38979ad0faa.jpg	{http://localhost:3000/uploads/nature/1772993135379-946623550adbb1a385c2f7ea7c1ef23f.jpg,http://localhost:3000/uploads/nature/1772993135379-05e6b9bd095d84dbe8fbb38979ad0faa.jpg}	2026-03-08 23:35:35.380899	2026-03-08 23:35:35.380899	EXTANT
54d3cf4d-b5c8-4c54-ad41-392564516070	7f251920-f7b9-4861-b738-a1e8a4f53463	Hollowwings	ANIMAL		http://localhost:3000/uploads/nature/1772993487684-72ea3ce082bba30fae63cb6c46f8c983.jpg	{http://localhost:3000/uploads/nature/1772993487685-72ea3ce082bba30fae63cb6c46f8c983.jpg,http://localhost:3000/uploads/nature/1772993487685-download.png,http://localhost:3000/uploads/nature/1772993487685-36b6f34736a77a7364d836b7a51b3b2e.jpg}	2026-03-08 23:41:27.686573	2026-03-08 23:41:27.686573	EXTANT
\.


--
-- Data for Name: planets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.planets (id, solar_system_id, parent_planet_id, name, description, is_habitable, created_at, updated_at, avatar_url, image_urls) FROM stdin;
7507fdd5-d01c-49b6-8574-f3d08338f7a3	d76ca657-8ae3-4dc6-a280-5552bbeec174	\N	Ethyra		t	2025-02-23 09:37:00.795	2026-03-02 13:53:26.434	http://localhost:3000/uploads/celestial/1772459606433-db6765820e982f7dfb9fb249a8f032c4.jpg	\N
\.


--
-- Data for Name: power_abilities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.power_abilities (id, category_id, name, description, created_at, updated_at, power_system_id, subsystem_id) FROM stdin;
\.


--
-- Data for Name: power_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.power_categories (id, subsystem_id, name, description, created_at, updated_at, power_system_id) FROM stdin;
0630ebdf-4d94-488c-8b16-844a9faaa890	17b96fea-3820-4ce1-9263-912abee74b04	Solstrom (Inferno)		2025-02-08 17:50:15.817	2025-02-08 17:50:15.817	\N
b16b6df8-db67-462f-91c7-2a52fad09930	17b96fea-3820-4ce1-9263-912abee74b04	Ephemerys (Conjuration)		2025-02-08 17:50:34.885	2025-02-08 17:50:34.885	\N
ec8f4863-f7f9-4810-9545-f119747050d5	17b96fea-3820-4ce1-9263-912abee74b04	Gheist (Therianthropy)		2025-02-08 17:50:47.981	2025-02-08 17:50:47.981	\N
1fce812e-57dd-4853-8d35-aa5402491536	17b96fea-3820-4ce1-9263-912abee74b04	Exsescera		2025-02-08 17:51:04.732	2025-02-08 17:51:04.732	\N
\.


--
-- Data for Name: power_subsystems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.power_subsystems (id, power_system_id, name, description, created_at, updated_at) FROM stdin;
7d7b039c-fd26-498e-8708-b974bd101d9a	569404c0-7dea-40c7-8697-37ba79bdbe4b	Halo		2025-02-08 17:48:15.3	2025-02-08 17:48:15.3
aaf93e7a-919f-4884-80eb-fa27e8a9577a	569404c0-7dea-40c7-8697-37ba79bdbe4b	Emyst		2025-02-08 17:48:19.473	2025-02-08 17:48:19.473
17b96fea-3820-4ce1-9263-912abee74b04	569404c0-7dea-40c7-8697-37ba79bdbe4b	Ithyr		2025-02-08 17:48:24.179	2025-02-08 17:48:24.179
366e6c86-c3d7-4c06-b0fd-1b6372ef29b1	3dd0f983-4aaf-474b-8d68-a084a1d6714d	Echoweaving		2025-02-08 17:49:13.983	2025-02-08 17:49:13.983
d3f2f4b8-60e8-4c9c-9b46-966d16e57b47	3dd0f983-4aaf-474b-8d68-a084a1d6714d	Veilweaving		2025-02-08 17:49:28.983	2025-02-08 17:49:28.983
7aa3d3c5-953b-484c-a817-f0036178094c	3dd0f983-4aaf-474b-8d68-a084a1d6714d	Strandweaving		2025-02-08 17:49:41.358	2025-02-08 17:49:41.358
06985310-3653-4563-8f0b-85cc69c14652	3dd0f983-4aaf-474b-8d68-a084a1d6714d	Dreamweaving		2025-02-08 17:49:50.605	2025-02-08 17:49:50.605
9775863d-295c-4ff6-ae42-f97573c8d42a	c560626e-35c9-4ea0-8c25-c805d5ce043d	Erderhythm	Powers related to manipulating soil, mud, and earth elements.\nAbilities include growing plants from the ground, creating protective barriers with mud, regenerating by burrowing, or summoning subterranean creatures.	2025-03-29 11:17:17.348	2025-03-29 11:17:40.333
eb5c65af-b739-4063-9daf-ba69e74c9716	c560626e-35c9-4ea0-8c25-c805d5ce043d	Verdurhythm		2025-03-29 11:19:50.908	2025-03-29 11:19:50.908
8fd67e53-c3e4-4d3b-9a82-53f037e1c8a8	2405ac0b-f6cf-4ad7-b3d5-288f6d3c39ab	Ardus		2026-03-05 23:05:51.930456	2026-03-05 17:36:23.592
7af13869-1eb2-4bf3-83c6-16e4e702e439	569404c0-7dea-40c7-8697-37ba79bdbe4b	Parados		2025-02-08 17:48:32.245	2026-03-05 17:41:09.895
254d7c32-6721-461d-8ffb-9dc4db3b86f8	a3a8454b-3caf-4081-982a-5306c005f86f	Vedas	Vedas consists of abilities that incur physical change in or around the user	2025-02-08 17:46:55.036	2026-03-05 17:48:42.879
0a76001d-146a-411c-abae-34bdba696be5	a3a8454b-3caf-4081-982a-5306c005f86f	Zephyr	Elemental Veiling flux that can be manipulated, transformed into elements of the world	2025-02-08 17:47:10.4	2026-03-05 17:50:57.344
\.


--
-- Data for Name: power_systems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.power_systems (id, root_of_power_id, name, description, created_at, updated_at) FROM stdin;
3dd0f983-4aaf-474b-8d68-a084a1d6714d	9bfffa2d-b4a5-4c1e-872f-6465f77add64	Threadweaving		2025-02-08 17:46:37.26	2025-02-08 17:46:37.26
c560626e-35c9-4ea0-8c25-c805d5ce043d	9bfffa2d-b4a5-4c1e-872f-6465f77add64	Arborhythm		2025-03-29 07:59:06.863	2025-03-29 08:03:50.215
2405ac0b-f6cf-4ad7-b3d5-288f6d3c39ab	9bfffa2d-b4a5-4c1e-872f-6465f77add64	Caranthesis		2026-03-05 19:03:46.685777	2026-03-05 17:34:01.061
569404c0-7dea-40c7-8697-37ba79bdbe4b	9bfffa2d-b4a5-4c1e-872f-6465f77add64	Dirge	The Gifts of the Human Race	2025-02-08 17:46:28.944	2026-03-05 17:39:45.653
a3a8454b-3caf-4081-982a-5306c005f86f	9bfffa2d-b4a5-4c1e-872f-6465f77add64	Affinity	The gifts of the Erylthyr and Lumen	2025-02-08 17:46:19.175	2026-03-05 17:47:18.78
\.


--
-- Data for Name: races; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.races (id, universe_id, name, description, lifespan, languages, avatar_url, image_urls, created_at, updated_at, deleted_at) FROM stdin;
7ff6b318-c6ec-455b-8a39-16999583c8a7	7f251920-f7b9-4861-b738-a1e8a4f53463	Human	Humans are the tenacious children of a world shaped by gods and their heirs, a race defined not by divine lineage but by relentless ambition and adaptability. Mortality is humanity’s greatest burden—and its sharpest weapon. With lifespans rarely stretching beyond 70 to 90 years, humans live with a urgency that drives them to build, conquer, and dream. They are ephemeral sparks in the grand tapestry of time, yet their fleeting existence fuels innovation, passion, and a hunger for legacy that outshines even the ageless\t		{}	http://localhost:3000/uploads/races/1f0015fb-8f52-4ea7-abf6-cb5f6a0b699e.png	{http://localhost:3000/uploads/races/826cf48b-9ff5-42ad-ac2a-f99319fea2ca.png,http://localhost:3000/uploads/races/ff708868-ace4-4296-8443-ab5f017a40c4.png,http://localhost:3000/uploads/races/97373a4c-b9de-47ba-87e2-437eb7369d9c.png,http://localhost:3000/uploads/races/2e3b6b7d-1571-4bf0-b3e7-3ef3e8e7317c.png,http://localhost:3000/uploads/races/c19c65fd-6785-410d-a809-0e7066e64b5a.png}	2025-02-08 08:54:06.523	2025-02-08 08:54:06.523	\N
9214151f-addb-4e12-9a74-1ddacbbfcd40	7f251920-f7b9-4861-b738-a1e8a4f53463	Erylthyr (Godchildren)	The Erylthyr are the chosen scions of the Lords, born from the divine essence of Order and Chaos and imbued with fragments of their creators’ boundless power. Neither fully mortal nor truly divine, they are ageless beings who walk the worlds as living conduits of their Lords’ will. Each Erylthyr is a masterpiece of cosmic design, shaped to reflect the domain of their patron—whether it be the relentless flow of time, the infinite expanse of the void, or the delicate balance of life and death.\r\n\r\n\r\nThough they are not immortal, the Erylthyr endure for eons, their existence marked by a quiet, inevitable permanence. They are the architects of mortal destinies, the weavers of cosmic threads, and the silent guardians of the balance between Order and Chaos. Yet, for all their power, they are bound by the limitations of their creation: they cannot ascend to the full divinity of their Lords, nor can they escape the purpose for which they were made.\r\n\r\nTo mortals, the Erylthyr are both revered and feared—beings of unimaginable beauty and terror, whose presence can herald either salvation or ruin. They are the hands of the Lords upon the worlds, shaping reality with a touch that is both gentle and inexorable. And though they may falter, though they may fall, the Erylthyr endure, for they are the eternal children of the cosmos, forever caught between the light of creation and the shadow of oblivion.		{}	http://localhost:3000/uploads/races/0c0242ae-1629-4d95-bd39-9a7c15f5c8d9.png	{http://localhost:3000/uploads/races/288ccb02-bea4-41f9-ab13-83829bca7c72.png}	2025-02-08 15:14:26.761	2025-02-08 15:16:28.259	\N
e4522f38-912e-4b3d-9283-db59f2c1e7ed	7f251920-f7b9-4861-b738-a1e8a4f53463	Aelthar (The Lordren)	The Lords are the essence of Order and Chaos made manifest, their existence a reflection of the eternal struggle and harmony that defines the cosmos.\t		{}	http://localhost:3000/uploads/races/096ccfba-83e7-42fd-b48d-a88d68d5f617.png	{http://localhost:3000/uploads/races/4ccfaa40-6a0b-4f62-9a4d-1c40e86b38d1.png}	2025-02-15 14:42:31.061	2025-02-15 14:42:31.061	\N
a0a05a6b-5e74-4996-a967-bd90268fafb5	7f251920-f7b9-4861-b738-a1e8a4f53463	Archaec	Archaecs are humanoid in appearance but are distinctly otherworldly. Their eyes are usually a piercing crimson or a void-like black giving them an unsettling gaze. Their hair is either a deep, raven black or a blood-red crimson, often wild and unkempt, adding to their chaotic appearance. Archaecs have extreme body types—either unnaturally skinny, with elongated limbs and sharp features, or excessively muscular, with bulging veins and a towering, intimidating presence. Their physical strength is far beyond that of a normal human, allowing them to crush bones with ease and leap great distances.		{}	http://localhost:3000/uploads/races/8d765f07-7789-4293-bdf9-d6d76de5d1d3.png	{http://localhost:3000/uploads/races/7c6a2e78-1fd8-4db9-b9d4-3246c70c92f4.png,http://localhost:3000/uploads/races/7849bc8a-8647-417c-8ff2-5ebae04b0de8.png,http://localhost:3000/uploads/races/aece336e-8a80-4acc-b215-33f94caebe24.png}	2025-02-12 16:31:13.813	2025-03-23 05:35:16.585	\N
438116c7-03bc-485b-bbe6-312098db9aaa	7f251920-f7b9-4861-b738-a1e8a4f53463	Arboreal	Arboreals are a unique race dwelling within dense evergreen forests, known for their remarkable ability to manipulate and shape trees into intricate homes, dwellings, and even castles suspended high among the forest canopy. They live in harmony with nature, cultivating sustainable practices that blend seamlessly into their woodland surroundings. Skilled in crafting from natural materials, Arboreans are adept at using the forest's resources creatively for shelter, food production, energy, and artistry, reflecting a deep cultural connection to the earth and its cycles. Their communities thrive on the principles of balance and coexistence, fostering a society that is both resilient against the forest's challenges and deeply attuned to its rhythms and harmony. They are a largely matriarchal society. 	200	{Verdish}	http://localhost:3000/uploads/races/545f4e5c-e876-468e-ae5f-ed94d2e3bd7a.png	{http://localhost:3000/uploads/races/5c04c9bd-0d3a-4e67-b166-2cafedfb8552.png,http://localhost:3000/uploads/races/c21e8e41-14c6-41af-b564-da458f413039.png,http://localhost:3000/uploads/races/d265a8a0-d125-4451-b068-f8c3b5814530.png,http://localhost:3000/uploads/races/6926c0de-6f58-47cd-af26-98045d0adfb4.png,http://localhost:3000/uploads/races/fbff5295-6cd5-42b2-b9d6-a9e62ea7201a.png}	2025-03-23 05:35:01.643	2025-05-03 05:26:32.186	\N
5da036a0-d566-4d97-84fb-0dd04cf5aa33	7f251920-f7b9-4861-b738-a1e8a4f53463	Lumen	The Lumen are the enigmatic inheritors of the Erylthyr’s legacy, a race of beings who walk the line between humanity and divinity. Towering over ordinary humans, though they would appear human at first glance, the Lumen are marked by subtle differences that set them apart. Their eyes, ordinary in moments of calm, ignite with a radiant silver-white glow in times of extreme stress, danger, or when they push themselves to their limits. This luminous flare is a glimpse of the divine spark that lingers within them, a faint echo of the Erylthyr’s boundless power. Their hair grow faster than humans, much faster, most lowborn Lumen are henceforth of long hair.\r\n\r\nThe Lumen live far longer than humans, their lifespans stretching to twice that of a mortal’s—though this longevity is inconsistent and unpredictable. Some Lumen may live for centuries, while others age more rapidly, their bodies succumbing to the strain of their inherited gifts. This inconsistency is a reminder that they are not truly divine, but rather beings caught between the mortal and the eternal. \r\n\r\nTheir connection to the Erylthyr is a mystery that has puzzled scholars and sages for generations. Some believe the Lumen are the descendants of the Erylthyr, their bloodline diluted but still carrying traces of their ancestors’ power. Others claim they are the result of the Erylthyr’s final act—a deliberate scattering of their essence into the mortal world, ensuring that their legacy would endure even as they faded into extinction. Whatever the truth, the Lumen are living relics of a bygone age, their existence a fragile bridge between the divine and the mortal		{}	http://localhost:3000/uploads/races/e497c969-fc7f-42e1-a4ae-3185467e07fe.png	{http://localhost:3000/uploads/races/8c2d5424-6e9f-4d97-955c-bbadce43b724.png,http://localhost:3000/uploads/races/00a70bb4-8730-495c-845d-9b916d1ae71b.png,http://localhost:3000/uploads/races/ff1cd194-bf00-49eb-ba73-b02a70a47518.png,http://localhost:3000/uploads/races/a4d28431-f67d-4cbe-b156-ebe420b4c75a.png,http://localhost:3000/uploads/races/6e73f708-7c9f-4d09-b6ea-90116dbeaf0b.png}	2025-02-07 23:35:45.689	2026-02-07 04:24:00.902	\N
e2f41ff4-c340-45bc-b269-d4827365eec6	7f251920-f7b9-4861-b738-a1e8a4f53463	Mosaic	A Mosaic body is a living contradiction. Human bone structure and cognition anchor them, but animal traits are grafted into their biology in ways that are neither decorative nor symbolic — they are functional, instinctive, and often dominant.\r\n\r\nHorns grow along human skull patterns but spiral or branch according to the animal influence. Eyes adapt to nocturnal, predatory, or herd awareness. Limbs may carry digitigrade balance, talons, hooves, or scaled plating, depending on their lineage.\r\n\r\nNo two Mosaics are identical. Each is a unique fusion — a living collage of traits that may harmonize… or constantly compete.		{}	http://localhost:3000/uploads/races/09e9d1e5-9308-49c6-9298-4e56237deb0f.png	{http://localhost:3000/uploads/races/536f5800-9e67-409e-900a-30610ea34f69.png,http://localhost:3000/uploads/races/08df194b-0074-4ec0-bb35-83020c11d11c.jpg,http://localhost:3000/uploads/races/4bc920e5-7b74-4c17-bcfc-820257819765.jpg,http://localhost:3000/uploads/races/f3de549a-1495-4093-89d8-919ad7e8fb51.png,http://localhost:3000/uploads/races/4d0f8149-114f-4999-994f-5c8ad342b407.png,http://localhost:3000/uploads/races/a424eab5-b5e1-4a56-a639-52858d854c4a.png,http://localhost:3000/uploads/races/0ad1c546-5c56-4124-8078-9de6967f0725.png}	2025-02-15 16:54:20.764	2026-02-17 16:06:59.937	\N
d96cef44-a943-4edd-b61d-9eb4834c79c0	7f251920-f7b9-4861-b738-a1e8a4f53463	Epiraph	The Epiraphs are a humanoid race born of altitude, silence, and law. To an untrained eye they resemble fair-skinned humans—slender, symmetrical, almost delicate—but this similarity is a deception. Their stillness hides speed that borders on the unnatural, and their composure masks a rigid, unforgiving worldview.\r\n\r\nThey are creatures of Order, not as a moral choice but as an instinct. Where chaos mutates and adapts, Epiraphs refine, align, and freeze reality into what they believe is its correct state. \r\n\r\nEpiraphs are lean and lightly built, favoring efficiency over brute strength. Their musculature is dense but restrained, lending them extraordinary quickness rather than power. Movement among them is economical—no wasted steps, no erratic gestures. Even in battle, an Epiraph appears calm, almost detached.\r\n\r\nHair: Universally white or silvered, regardless of age\r\n\r\nEyes: Pale tones—ice-blue, frost-grey, or voided white\r\n\r\nTemperature: Their skin is unnaturally cold to the touch\r\n\r\nAging: Slow and subtle; age is measured more by demeanor than appearance\r\n\r\nThey do not sweat, rarely shiver, and are unaffected by extreme cold. Snow gathers on them without melting.		{}	http://localhost:3000/uploads/races/c5f05184-6336-4ce1-b978-36dc43d495c8.png	{http://localhost:3000/uploads/races/09af6b48-5cb9-4f8a-b98c-c22c9646419c.png,http://localhost:3000/uploads/races/8bc50ae1-ff62-4294-8057-2db90651d815.png}	2026-02-07 05:40:04.245	2026-03-03 08:05:44.168	\N
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, token, user_id, expires_at, is_revoked, created_at, updated_at, device_info, ip_address) FROM stdin;
368efb00-3832-4ced-81ef-c8fd7123d28f	25c966bde5744419f0a0caf4bc71e3431075e15863591c21489827fad46407f6	39da6095-3273-4db3-be4b-1e4d9a4884a7	2026-03-14 16:53:11.643	t	2026-03-07 22:23:11.644454	2026-03-07 18:18:29.995	\N	\N
225a383b-c7b5-41d5-b223-89354e84e0f9	82fcfaa3cd0942f63c303785e184c72a88c7db268fb1b23516bd48e1f1b798b6	39da6095-3273-4db3-be4b-1e4d9a4884a7	2026-03-14 18:18:29.987	t	2026-03-07 23:48:29.988171	2026-03-07 19:28:38.064	\N	\N
c061e924-adad-4ada-90af-5d91bb06d55b	4a1ab22d081aa74d8cadc02308ea41d6b8de79b98fffa2cc9637a508350a95a2	39da6095-3273-4db3-be4b-1e4d9a4884a7	2026-03-14 19:28:38.061	t	2026-03-08 00:58:38.062644	2026-03-07 22:58:53.052	\N	\N
43b1b1ae-0a54-4d41-a972-2f4e9777deeb	4f6260baa5d43d038769cac659a3f0801f9b883b0231db6f6cddae66642faca2	39da6095-3273-4db3-be4b-1e4d9a4884a7	2026-03-14 22:58:53.047	t	2026-03-08 04:28:53.047553	2026-03-08 00:02:20.288	\N	\N
d78684e0-77f4-4c9d-84a2-96def4ccba96	969b1d876df31065c1348a468718b5dea1afb7b7f16cfbb76b24c5da891de8fb	39da6095-3273-4db3-be4b-1e4d9a4884a7	2026-03-15 00:02:20.286	t	2026-03-08 05:32:20.287138	2026-03-08 11:45:54.174	\N	\N
cdb93fc7-42d6-430c-a07b-1640159ab1ba	80f47bc90082785993b07fb903d88099f80dc8aa9ebaa172ea03da3d20e2a642	39da6095-3273-4db3-be4b-1e4d9a4884a7	2026-03-15 11:45:54.165	t	2026-03-08 17:15:54.166474	2026-03-08 12:45:57.47	\N	\N
25d568df-6b1d-481c-8fca-8ece023c4de4	57b981b4d29237cb43a386ebf6b70e48a5f8f891d0d2ebcee05143456d6df509	39da6095-3273-4db3-be4b-1e4d9a4884a7	2026-03-15 12:45:57.468	t	2026-03-08 18:15:57.468816	2026-03-08 13:48:31.74	\N	\N
8d08b159-d36d-4884-a5dd-9dd8d6cf23c8	6c11ff679fe45919608b9b7529f29c8fbbbdedbb66179a83b9acd9ac4247ba38	39da6095-3273-4db3-be4b-1e4d9a4884a7	2026-03-15 13:48:31.738	t	2026-03-08 19:18:31.739289	2026-03-08 16:17:55.325	\N	\N
b6506929-0959-4984-ba0a-b37869212d52	0f6e426d3e733f8685696aefbed74763679fb329d7a0a9c9bc1577103098e4db	39da6095-3273-4db3-be4b-1e4d9a4884a7	2026-03-15 17:25:56.367	f	2026-03-08 22:55:56.368063	2026-03-08 22:55:56.368063	\N	\N
327ff59b-ae41-42bd-8b83-2bdad6a0ce26	f6442f135b3b87a94cb33d934833a439b143e30b43f53045b2b6944066cff37c	39da6095-3273-4db3-be4b-1e4d9a4884a7	2026-03-15 16:17:55.322	t	2026-03-08 21:47:55.323493	2026-03-08 17:25:56.374	\N	\N
4d125065-6310-40e8-9366-216a6aca5fc1	9cf9b3896e7698b78318513923cf93d7f070143bf49c37106996128aba977b3e	39da6095-3273-4db3-be4b-1e4d9a4884a7	2026-03-13 17:46:00.687	t	2026-03-06 23:16:00.687969	2026-03-06 19:30:03.157	\N	\N
534926c6-3563-419c-a887-aa66da4b2209	d625a1df2ecf64632a3b6963af502870094efbb4a33d96867b8bf8f6abfd0f30	39da6095-3273-4db3-be4b-1e4d9a4884a7	2026-03-13 19:30:03.15	t	2026-03-07 01:00:03.151064	2026-03-06 20:30:51.13	\N	\N
79301597-535d-42fb-bc6b-8f9924ee552a	d6a8cb8f34761b43a70b299cbcaeb4f175c4dd3f9df54d006cb7f0fdc4f33b0e	39da6095-3273-4db3-be4b-1e4d9a4884a7	2026-03-14 09:29:17.268	f	2026-03-07 14:59:17.270347	2026-03-07 14:59:17.270347	\N	\N
ac5fb052-bf3f-43ea-9018-fe90c8f57503	1b2f88f157569e9bcae39c435f035cacacf474163638db8a62a2ccfa9978e44d	39da6095-3273-4db3-be4b-1e4d9a4884a7	2026-03-13 20:30:51.127	t	2026-03-07 02:00:51.128292	2026-03-07 09:29:17.278	\N	\N
\.


--
-- Data for Name: regions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.regions (id, name, description, universe_id, parent_id, created_at, updated_at, type, planet_id, religion_id, avatar_url, image_urls) FROM stdin;
a9682e8d-6c25-46bb-859e-5e75a809be46	Qarn	\N	7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	2025-02-23 12:59:32.389	2025-02-23 12:59:32.389	STATE	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	\N	{}
554071ae-2591-4f75-81e5-fd47b3454455	Noor	\N	7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	2025-02-23 13:01:02.04	2025-02-23 13:01:02.04	STATE	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	\N	{}
86b78b30-c6a8-4675-aeac-1ca1d321ed66	Elarilon	\N	7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	2025-02-23 13:01:44.556	2025-02-23 13:01:44.556	STATE	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	\N	{}
9feaed15-1241-4340-b32a-ba5232e74abe	The Fractured Isles	\N	7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	2025-02-23 13:07:40.902	2025-02-23 13:07:40.902	ISLAND	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	\N	{}
c00c045e-4063-4ebe-b231-bb6677f8877f	Blackwater Park	\N	7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	2025-02-23 13:11:47.111	2025-02-23 13:11:47.111	LAKE	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	\N	{}
9cff3d74-a3f0-4b6d-ab51-9e0b6402c4aa	Deiaryn	\N	7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	2025-02-23 13:14:51.115	2025-02-23 13:14:51.115	STATE	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	\N	{}
4fe6150b-f9b1-4192-818b-41e209e76cbb	Eryden	\N	7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	2025-02-23 13:17:23.77	2025-02-23 13:17:23.77	ISLAND	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	\N	{}
5e777132-5db9-4ee0-9bf9-c3f6d52d2235	Dreiken	\N	7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	2025-02-23 13:18:35.056	2025-02-23 13:18:35.056	STATE	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	\N	{}
1a4d5041-376d-48fc-8da6-16377e180e37	Varamor	\N	7f251920-f7b9-4861-b738-a1e8a4f53463	f27fa1d2-809d-4d9b-b2ed-573863cadd8f	2026-02-08 03:52:11.45	2026-02-08 03:52:11.45	CITY	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	\N	{}
1c01137c-ecaf-46aa-b17a-9a0142cd8c11	Navigr	\N	7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	2026-02-13 08:31:26.793	2026-02-13 08:31:26.793	STATE	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	\N	{}
e511b966-06fc-4b36-a122-4c0bbd26eea1	Ravern	\N	7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	2026-02-13 08:36:13.316	2026-02-13 08:36:13.316	STATE	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	\N	{}
f27fa1d2-809d-4d9b-b2ed-573863cadd8f	Feria	Feria is a harsh northern kingdom forged by cold, height, and endurance. Snow grips its lands for most of the year, glaciers carve its valleys, and relentless winds sweep across jagged mountain ranges that form natural walls around the realm. Survival here demands resilience, and that resilience defines the Ferian people.\r\n\r\nUnlike scattered warrior tribes, Feria stands united under a single king. Beneath him rule powerful regional lords who govern mountain territories and frozen coasts, each sworn in absolute loyalty to the crown. Authority is firm, structured, and unquestioned.\r\n\r\nAt the heart of the kingdom rises Varamor, a great mountain city carved into steep stone heights. Above it all stands Castle Blackhaven, a colossal fortress of black stone crowning the summit and stretching along the surrounding ridgelines like an iron crown. The city descends below in fortified tiers, its walls, towers, and narrow climbing streets built to endure siege, storm, and time itself. Varamor is not just a capital, it is a fortress layered upon a fortress.\r\n\r\nFeria’s power does not end in its mountains. Its longships dominate the frozen seas and treacherous coasts, built to endure brutal waters and strike where others cannot travel. Swift coastal raids and sudden landings make Ferian forces unpredictable and feared far beyond their borders.\r\n\r\nYet the kingdom’s greatest defense is not its army, but its land. Towering mountain barriers choke invasion routes into narrow passes. Blizzards swallow supply lines. Bitter cold weakens armies long before battle is joined. Even if invaders survive the climb, they face a capital built high above them, protected by sheer altitude and impenetrable stone. Many believe that conquering Feria is less a war against men than a war against winter itself, and winter always wins.\r\n\r\nTo the southern kingdoms, the people of Feria are often dismissed as uncultured brutes, creatures of snow, violence, and stubborn pride. But those who understand warfare know the truth:\r\n\r\nFeria is not savage.\r\nFeria is immovable.\r\nAnd no empire has ever taken what the mountains refuse to surrender.	7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	2025-02-23 12:32:27.798	2026-02-14 13:43:08.939	STATE	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	http://localhost:3000/uploads/regions/7e353336-ccb9-4ff7-95df-bf569e0cab5c.png	{http://localhost:3000/uploads/regions/6d7f9c45-a80d-490d-ac8b-459c561cec4c.png}
b2593dd8-2cc8-4888-b4cc-8ce59f852f6c	Veneleyr	The Unreached Lands	7f251920-f7b9-4861-b738-a1e8a4f53463	\N	2025-06-04 14:24:17.899	2026-03-02 13:20:43.181	CONTINENT	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	http://localhost:3000/uploads/regions/4be162ac-8594-41d0-92ca-d48556b36338.png	{http://localhost:3000/uploads/regions/c2364c63-ad08-4c09-9cb3-a6edd0773c40.png}
00927a1f-f8d2-4be8-a4bd-82a37f5e4bdb	The Duskveil Sea		7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	2025-02-23 13:09:48.006	2026-03-04 11:16:15.591	OCEAN	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	\N	{}
90f56212-11d8-4eac-8ffa-db89611a2c60	Varenhor		7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	2025-06-11 09:53:31.792	2026-03-04 11:55:59.017	STATE	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	\N	{}
f6892756-90a0-4c83-be86-00027028a8cc	Vera	Our continent	7f251920-f7b9-4861-b738-a1e8a4f53463	\N	2025-02-23 12:22:36.642	2026-03-05 07:33:03.188	CONTINENT	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	http://localhost:3000/uploads/region/1772695983182-Gemini_Generated_Image_kpv66fkpv66fkpv6.png	{http://localhost:3000/uploads/regions/370d2e45-2ca4-4c27-a15d-ce7fc99bc74f.png,http://localhost:3000/uploads/region/1772695983186-Gemini_Generated_Image_kpv66fkpv66fkpv6.png}
d7ba07c0-5c54-4ae3-9d5e-51cd56731ef7	Braithlait	Braithlait stands as the continent’s most politically complex and ceremonially grand realm: a land of layered loyalties, noble houses, and ancient crowns. Its rolling green highlands and fog-draped coastlines are dotted with fortified keeps that have stood for centuries, each bearing banners of proud lineages older than written record.\r\n\r\nPower is shared uneasily between monarch and nobility. Dukes command vast territories, knightly orders maintain martial honor, and councils of lords constantly maneuver for influence. Oaths are sacred, but ambition is rarely quiet.\r\n\r\nBraithlait’s military strength lies in discipline and hierarchy. Heavily armored cavalry, longbow regiments, and castle warfare define its strategy. Wars here are often slow, grinding campaigns of siege and supply rather than sudden conquest.\r\n\r\nReligion is deeply interwoven with governance. Grand cathedrals dominate major cities, and divine authority is frequently invoked to legitimize rulership. Festivals, coronations, and tournaments are spectacles of unity, and displays of power.	7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	2025-02-23 12:55:58.083	2026-02-14 13:59:39.453	STATE	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	http://localhost:3000/uploads/regions/891bff85-3d62-4448-8b28-3f8bec2ebd42.png	{http://localhost:3000/uploads/regions/f2ec0418-3a6c-4509-82f5-afedb8c2684e.png,http://localhost:3000/uploads/regions/6bd86c8e-5f8e-4f9d-8530-53700b370a46.png,http://localhost:3000/uploads/regions/e4234530-a18d-4ea3-b8c4-75acd691f08b.png}
dd15b0c3-88f0-4f10-b71f-5701b665a444	Aeran	In Aeran, the land rises in long, unbroken walls of stone. Mountains fold over one another in endless succession, their peaks catching snow that lingers even when lower valleys thaw. Roads do not cross the realm — they wind, climb, and vanish into mist before reappearing days later along another ridge. Distance is measured less by miles than by elevation, weather, and patience.\r\n\r\nSettlements grow where the mountains permit them. Cities are carved into terraces, their walls anchored deep into rock. Villages cling to narrow valleys warmed briefly by passing sunlight. High passes open only part of the year, and when winter closes them, entire regions turn inward, self-contained and silent beneath drifting snow.\r\n\r\nAbove all of it — above valleys, provinces, and ridgelines — stands the Imperial Throne.\r\n\r\nThe Emperor is seen rarely and commands even less, yet every banner, law, and oath traces its authority upward to that single seat. The throne does not direct the realm’s daily life; it gives the realm its shape. Its presence binds distant regions that might otherwise never look beyond their own mountains.	7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	2025-02-23 12:57:29.231	2026-02-14 14:37:36.152	STATE	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	http://localhost:3000/uploads/regions/a01aa029-c705-4a63-9f26-ac12eca9ab9e.jpg	{http://localhost:3000/uploads/regions/68e73bc0-af99-462b-a056-9bdfb2e5054e.jpg,http://localhost:3000/uploads/regions/9cf567af-9170-496f-bc3c-2bfa2dda132b.jpg,http://localhost:3000/uploads/regions/63a154ee-cfc1-4c4b-b146-a42b2e3ca81e.jpg,http://localhost:3000/uploads/regions/3dd9b60d-8e21-454f-b66f-8aa1b0121e43.jpg}
3075a018-5a35-43f9-8564-1fa86e638cbf	Estan	In Estan, the air hums with life long before sunrise. Temple bells echo across riverbanks as mist lifts from stepped ghats, merchants unfurl bright fabrics along crowded streets, and the scent of spice and incense drifts through layered cities built and rebuilt across centuries.\r\n\r\nEvery region moves to its own rhythm. Some lands are shaped by great rivers that flood and recede like breathing lungs. Others rise in terraced hills thick with cultivation, or stretch across deep forests where ancient shrines stand half-claimed by roots and time. Roads between provinces carry caravans laden not only with goods, but with dialects, rituals, music, and memory.\r\n\r\nPower flows from a single royal throne, distant yet ever-present. The king’s authority travels through governors, magistrates, temple councils, and noble houses, each overseeing lands as different from one another as seasons. Laws bind the empire together, but tradition gives it texture. In one city, festivals fill the night with flame and drum. In another, scholars debate philosophy beneath carved stone colonnades worn smooth by generations. Estan builds upward and outward at once, palaces ringed with gardens and water courts, markets layered in spirals of stone, temples rising like mountains shaped by human devotion. Color is everywhere: painted walls, woven banners, ceremonial dress, flowering courtyards. Even the simplest street can feel like part of something ancient and deliberate.	7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	2025-02-23 12:59:03.706	2026-02-14 13:56:07.844	STATE	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	http://localhost:3000/uploads/regions/f1543aac-26c0-4924-abcc-3add3fbe3d01.jpg	{http://localhost:3000/uploads/regions/b7474c42-70f7-4c61-8216-58789d41086a.png,http://localhost:3000/uploads/regions/a0d6b724-3100-4fcc-a92a-551aced04817.png,http://localhost:3000/uploads/regions/fc46a7d6-420c-404a-b461-4664ae9fcecd.png,http://localhost:3000/uploads/regions/1961c29f-c82f-4906-8029-10d507ef374d.jpg}
340d06e2-a7a0-4113-b2b5-88372d372a1a	Inys	Inys is not merely the northernmost landmass known to man — it is the place where the world forgets itself.\r\n\r\nThe island rises from a churning steel-grey ocean like a wound in the horizon. Its coasts are jagged and unwelcoming, carved by ancient ice and relentless wind. The ground is stone locked beneath layers of permafrost older than memory. Nothing grows in the soil except lichen the colour of ash, clinging like the last stubborn thought of life.\r\n\r\nThe wind never truly stops. It prowls, howls, whispers, then screams — as though the air itself resents being trapped here.\r\n\r\nMen say the land feels unfinished, as if creation abandoned the work halfway through and never returned.	7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	2026-02-15 03:35:56.28	2026-02-15 03:35:56.28	ISLAND	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	http://localhost:3000/uploads/regions/b060e0e3-2d79-4f60-a1de-2cf40c21d46f.jpg	{http://localhost:3000/uploads/regions/17913106-2175-45c8-aec6-e8141142afb4.jpg}
5b1bb9cf-e8a2-4a87-8255-38aff878c921	Ilyn mŏr	\N	7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	2026-02-15 06:28:01.121	2026-02-15 07:15:45.042	ISLAND	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	http://localhost:3000/uploads/regions/275c2d23-4ffa-47da-927c-ec3346ad5ec8.webp	{http://localhost:3000/uploads/regions/7a0355d7-91d1-4439-8c9f-c1d9f3313027.webp,http://localhost:3000/uploads/regions/0d948777-209b-42be-bb62-651b9aeb51e5.webp}
bd4c4b6b-790f-4f89-a882-c1d688056ced	Scarsrain Abyss		7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	2026-03-04 16:46:41.479117	2026-03-04 16:46:41.479117	OCEAN	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	\N	{}
67d348f0-6fad-455d-8b9b-a88085b9e269	The Vermillion Sea		7f251920-f7b9-4861-b738-a1e8a4f53463	f6892756-90a0-4c83-be86-00027028a8cc	2026-03-04 20:53:18.1109	2026-03-04 20:53:18.1109	OCEAN	7507fdd5-d01c-49b6-8574-f3d08338f7a3	\N	\N	{}
\.


--
-- Data for Name: religions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.religions (id, universe_id, name, description, deities, holy_sites, avatar_url, image_urls, created_at, updated_at) FROM stdin;
17ab36df-c9ae-436c-8ee2-e858c3bebb1d	7f251920-f7b9-4861-b738-a1e8a4f53463	The Faith of the Arbor (The Faith of Eythedral)	The Faith of the Arbor, also called the Faith of Eythedral, is the spiritual tradition of the Arboreals, a forest-dwelling, largely matriarchal people who live in harmony with living trees. At its heart is the belief that the entire forest of Noor shares a single living consciousness, centered in Erythdral, the Great Tree. Rather than worshipping a distant deity, the Arboreals revere the forest itself as a unified mind in which all life, memory, and growth are interconnected. Their religion teaches balance, gentle guidance of nature rather than control, and the return of all beings to the living cycle of the forest after death.	{Eythedral}	{}	http://localhost:3000/uploads/religions/f3a1a4ad-dc1c-4be3-b0ea-71ce8545703f.png	{}	2026-02-23 11:31:27.092	2026-02-26 05:15:03.704
\.


--
-- Data for Name: roots_of_power; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roots_of_power (id, universe_id, name, description, created_at, updated_at) FROM stdin;
9bfffa2d-b4a5-4c1e-872f-6465f77add64	7f251920-f7b9-4861-b738-a1e8a4f53463	Aethyr	Root of all power in Nyvaris	2025-02-08 17:45:11.46	2025-02-08 17:45:11.46
\.


--
-- Data for Name: solar_systems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.solar_systems (id, galaxy_id, name, description, created_at, updated_at, avatar_url, image_urls) FROM stdin;
d76ca657-8ae3-4dc6-a280-5552bbeec174	efaa904e-4804-43a9-bdc2-a23cff6af6eb	Nyvaris		2025-02-23 06:27:45.226	2026-03-02 13:48:36.494	http://localhost:3000/uploads/celestial/1772459316492-vintage-solar-system-model-astronomical-symbols-artistic-depiction-conjures-nostalgia-antiquated-celestial-314074015.webp	{http://localhost:3000/uploads/celestial/1772459316493-vintage-solar-system-model-astronomical-symbols-artistic-depiction-conjures-nostalgia-antiquated-celestial-314074015.webp}
\.


--
-- Data for Name: stars; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stars (id, solar_system_id, name, description, type, created_at, updated_at, avatar_url, image_urls) FROM stdin;
46eff9f8-84b2-456a-8ae0-c5893c7a273d	d76ca657-8ae3-4dc6-a280-5552bbeec174	Umbralys		HOT_BLUE_STAR	2025-02-23 09:21:59.869	2026-03-02 13:50:31.89	http://localhost:3000/uploads/celestial/1772459431889-Blue_Stars.webp	\N
\.


--
-- Data for Name: universes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.universes (id, name, description, user_id, created_at, updated_at) FROM stdin;
7f251920-f7b9-4861-b738-a1e8a4f53463	Astraeum	The World of Alistair Heus	39da6095-3273-4db3-be4b-1e4d9a4884a7	2025-02-07 23:07:27.221	2025-02-07 23:34:52.195
65c00844-cbb4-4c0d-9e7c-a7b2eba81fc8	The Forgotten Realms		39da6095-3273-4db3-be4b-1e4d9a4884a7	2026-03-01 22:01:09.741196	2026-03-01 22:01:09.741196
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, first_name, last_name, password, created_at, updated_at, last_login_at) FROM stdin;
39da6095-3273-4db3-be4b-1e4d9a4884a7	kartikjha13@gmail.com	Kartik	Jha	$2a$10$hYIHL/2ZYKfOdscoDbaVLeQytHDRtDnl/YWNoyA8VmV0/dwUHH35y	2026-02-27 02:48:51.408489	2026-02-27 02:48:51.408489	2026-03-07 16:53:11.638
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: postgres
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 32, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: character_power_access character_power_access_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.character_power_access
    ADD CONSTRAINT character_power_access_pkey PRIMARY KEY (id);


--
-- Name: character_relationships character_relationships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.character_relationships
    ADD CONSTRAINT character_relationships_pkey PRIMARY KEY (id);


--
-- Name: characters characters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_pkey PRIMARY KEY (id);


--
-- Name: constructs constructs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.constructs
    ADD CONSTRAINT constructs_pkey PRIMARY KEY (id);


--
-- Name: ethnic_groups ethnic_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ethnic_groups
    ADD CONSTRAINT ethnic_groups_pkey PRIMARY KEY (id);


--
-- Name: factions factions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factions
    ADD CONSTRAINT factions_pkey PRIMARY KEY (id);


--
-- Name: galaxies galaxies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.galaxies
    ADD CONSTRAINT galaxies_pkey PRIMARY KEY (id);


--
-- Name: map_svg_mappings map_svg_mappings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.map_svg_mappings
    ADD CONSTRAINT map_svg_mappings_pkey PRIMARY KEY (id);


--
-- Name: maps maps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maps
    ADD CONSTRAINT maps_pkey PRIMARY KEY (id);


--
-- Name: nature nature_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nature
    ADD CONSTRAINT nature_pkey PRIMARY KEY (id);


--
-- Name: planets planets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planets
    ADD CONSTRAINT planets_pkey PRIMARY KEY (id);


--
-- Name: power_abilities power_abilities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.power_abilities
    ADD CONSTRAINT power_abilities_pkey PRIMARY KEY (id);


--
-- Name: power_categories power_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.power_categories
    ADD CONSTRAINT power_categories_pkey PRIMARY KEY (id);


--
-- Name: power_subsystems power_subsystems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.power_subsystems
    ADD CONSTRAINT power_subsystems_pkey PRIMARY KEY (id);


--
-- Name: power_systems power_systems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.power_systems
    ADD CONSTRAINT power_systems_pkey PRIMARY KEY (id);


--
-- Name: races races_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.races
    ADD CONSTRAINT races_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: regions regions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regions
    ADD CONSTRAINT regions_pkey PRIMARY KEY (id);


--
-- Name: religions religions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.religions
    ADD CONSTRAINT religions_pkey PRIMARY KEY (id);


--
-- Name: roots_of_power roots_of_power_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roots_of_power
    ADD CONSTRAINT roots_of_power_pkey PRIMARY KEY (id);


--
-- Name: solar_systems solar_systems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solar_systems
    ADD CONSTRAINT solar_systems_pkey PRIMARY KEY (id);


--
-- Name: stars stars_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stars
    ADD CONSTRAINT stars_pkey PRIMARY KEY (id);


--
-- Name: universes universes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universes
    ADD CONSTRAINT universes_pkey PRIMARY KEY (id);


--
-- Name: map_svg_mappings uq_map_svg_element; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.map_svg_mappings
    ADD CONSTRAINT uq_map_svg_element UNIQUE (map_id, svg_element_id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: constructs_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX constructs_category_idx ON public.constructs USING btree (category);


--
-- Name: constructs_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX constructs_name_idx ON public.constructs USING btree (name);


--
-- Name: constructs_universe_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX constructs_universe_idx ON public.constructs USING btree (universe_id);


--
-- Name: nature_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX nature_name_idx ON public.nature USING btree (name);


--
-- Name: nature_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX nature_type_idx ON public.nature USING btree (type);


--
-- Name: nature_universe_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX nature_universe_idx ON public.nature USING btree (universe_id);


--
-- Name: religions_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX religions_name_idx ON public.religions USING btree (name);


--
-- Name: religions_universe_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX religions_universe_idx ON public.religions USING btree (universe_id);


--
-- Name: character_power_access character_power_access_ability_id_power_abilities_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.character_power_access
    ADD CONSTRAINT character_power_access_ability_id_power_abilities_id_fk FOREIGN KEY (ability_id) REFERENCES public.power_abilities(id) ON DELETE CASCADE;


--
-- Name: character_power_access character_power_access_category_id_power_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.character_power_access
    ADD CONSTRAINT character_power_access_category_id_power_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.power_categories(id) ON DELETE CASCADE;


--
-- Name: character_power_access character_power_access_character_id_characters_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.character_power_access
    ADD CONSTRAINT character_power_access_character_id_characters_id_fk FOREIGN KEY (character_id) REFERENCES public.characters(id) ON DELETE CASCADE;


--
-- Name: character_power_access character_power_access_power_system_id_power_systems_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.character_power_access
    ADD CONSTRAINT character_power_access_power_system_id_power_systems_id_fk FOREIGN KEY (power_system_id) REFERENCES public.power_systems(id) ON DELETE CASCADE;


--
-- Name: character_power_access character_power_access_subsystem_id_power_subsystems_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.character_power_access
    ADD CONSTRAINT character_power_access_subsystem_id_power_subsystems_id_fk FOREIGN KEY (subsystem_id) REFERENCES public.power_subsystems(id) ON DELETE CASCADE;


--
-- Name: character_relationships character_relationships_faction_id_factions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.character_relationships
    ADD CONSTRAINT character_relationships_faction_id_factions_id_fk FOREIGN KEY (faction_id) REFERENCES public.factions(id) ON DELETE CASCADE;


--
-- Name: character_relationships character_relationships_source_character_id_characters_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.character_relationships
    ADD CONSTRAINT character_relationships_source_character_id_characters_id_fk FOREIGN KEY (source_character_id) REFERENCES public.characters(id) ON DELETE CASCADE;


--
-- Name: character_relationships character_relationships_target_character_id_characters_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.character_relationships
    ADD CONSTRAINT character_relationships_target_character_id_characters_id_fk FOREIGN KEY (target_character_id) REFERENCES public.characters(id) ON DELETE CASCADE;


--
-- Name: character_relationships character_relationships_universe_id_universes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.character_relationships
    ADD CONSTRAINT character_relationships_universe_id_universes_id_fk FOREIGN KEY (universe_id) REFERENCES public.universes(id) ON DELETE CASCADE;


--
-- Name: characters characters_ethnic_group_id_ethnic_groups_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_ethnic_group_id_ethnic_groups_id_fk FOREIGN KEY (ethnic_group_id) REFERENCES public.ethnic_groups(id) ON DELETE SET NULL;


--
-- Name: characters characters_race_id_races_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_race_id_races_id_fk FOREIGN KEY (race_id) REFERENCES public.races(id) ON DELETE SET NULL;


--
-- Name: characters characters_universe_id_universes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_universe_id_universes_id_fk FOREIGN KEY (universe_id) REFERENCES public.universes(id) ON DELETE CASCADE;


--
-- Name: constructs constructs_universe_id_universes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.constructs
    ADD CONSTRAINT constructs_universe_id_universes_id_fk FOREIGN KEY (universe_id) REFERENCES public.universes(id) ON DELETE CASCADE;


--
-- Name: ethnic_groups ethnic_groups_race_id_races_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ethnic_groups
    ADD CONSTRAINT ethnic_groups_race_id_races_id_fk FOREIGN KEY (race_id) REFERENCES public.races(id) ON DELETE CASCADE;


--
-- Name: factions factions_universe_id_universes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factions
    ADD CONSTRAINT factions_universe_id_universes_id_fk FOREIGN KEY (universe_id) REFERENCES public.universes(id) ON DELETE CASCADE;


--
-- Name: galaxies galaxies_universe_id_universes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.galaxies
    ADD CONSTRAINT galaxies_universe_id_universes_id_fk FOREIGN KEY (universe_id) REFERENCES public.universes(id) ON DELETE CASCADE;


--
-- Name: map_svg_mappings map_svg_mappings_map_id_maps_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.map_svg_mappings
    ADD CONSTRAINT map_svg_mappings_map_id_maps_id_fk FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;


--
-- Name: map_svg_mappings map_svg_mappings_region_id_regions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.map_svg_mappings
    ADD CONSTRAINT map_svg_mappings_region_id_regions_id_fk FOREIGN KEY (region_id) REFERENCES public.regions(id) ON DELETE CASCADE;


--
-- Name: maps maps_region_id_regions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maps
    ADD CONSTRAINT maps_region_id_regions_id_fk FOREIGN KEY (region_id) REFERENCES public.regions(id) ON DELETE CASCADE;


--
-- Name: maps maps_universe_id_universes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maps
    ADD CONSTRAINT maps_universe_id_universes_id_fk FOREIGN KEY (universe_id) REFERENCES public.universes(id) ON DELETE CASCADE;


--
-- Name: nature nature_universe_id_universes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nature
    ADD CONSTRAINT nature_universe_id_universes_id_fk FOREIGN KEY (universe_id) REFERENCES public.universes(id) ON DELETE CASCADE;


--
-- Name: planets planets_solar_system_id_solar_systems_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planets
    ADD CONSTRAINT planets_solar_system_id_solar_systems_id_fk FOREIGN KEY (solar_system_id) REFERENCES public.solar_systems(id) ON DELETE CASCADE;


--
-- Name: power_abilities power_abilities_category_id_power_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.power_abilities
    ADD CONSTRAINT power_abilities_category_id_power_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.power_categories(id) ON DELETE CASCADE;


--
-- Name: power_abilities power_abilities_power_system_id_power_systems_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.power_abilities
    ADD CONSTRAINT power_abilities_power_system_id_power_systems_id_fk FOREIGN KEY (power_system_id) REFERENCES public.power_systems(id) ON DELETE CASCADE;


--
-- Name: power_abilities power_abilities_subsystem_id_power_subsystems_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.power_abilities
    ADD CONSTRAINT power_abilities_subsystem_id_power_subsystems_id_fk FOREIGN KEY (subsystem_id) REFERENCES public.power_subsystems(id) ON DELETE CASCADE;


--
-- Name: power_categories power_categories_power_system_id_power_systems_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.power_categories
    ADD CONSTRAINT power_categories_power_system_id_power_systems_id_fk FOREIGN KEY (power_system_id) REFERENCES public.power_systems(id) ON DELETE CASCADE;


--
-- Name: power_categories power_categories_subsystem_id_power_subsystems_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.power_categories
    ADD CONSTRAINT power_categories_subsystem_id_power_subsystems_id_fk FOREIGN KEY (subsystem_id) REFERENCES public.power_subsystems(id) ON DELETE CASCADE;


--
-- Name: power_subsystems power_subsystems_power_system_id_power_systems_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.power_subsystems
    ADD CONSTRAINT power_subsystems_power_system_id_power_systems_id_fk FOREIGN KEY (power_system_id) REFERENCES public.power_systems(id) ON DELETE CASCADE;


--
-- Name: power_systems power_systems_root_of_power_id_roots_of_power_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.power_systems
    ADD CONSTRAINT power_systems_root_of_power_id_roots_of_power_id_fk FOREIGN KEY (root_of_power_id) REFERENCES public.roots_of_power(id) ON DELETE CASCADE;


--
-- Name: races races_universe_id_universes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.races
    ADD CONSTRAINT races_universe_id_universes_id_fk FOREIGN KEY (universe_id) REFERENCES public.universes(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: regions regions_planet_id_planets_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regions
    ADD CONSTRAINT regions_planet_id_planets_id_fk FOREIGN KEY (planet_id) REFERENCES public.planets(id) ON DELETE SET NULL;


--
-- Name: regions regions_religion_id_religions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regions
    ADD CONSTRAINT regions_religion_id_religions_id_fk FOREIGN KEY (religion_id) REFERENCES public.religions(id) ON DELETE SET NULL;


--
-- Name: regions regions_universe_id_universes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regions
    ADD CONSTRAINT regions_universe_id_universes_id_fk FOREIGN KEY (universe_id) REFERENCES public.universes(id) ON DELETE CASCADE;


--
-- Name: religions religions_universe_id_universes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.religions
    ADD CONSTRAINT religions_universe_id_universes_id_fk FOREIGN KEY (universe_id) REFERENCES public.universes(id) ON DELETE CASCADE;


--
-- Name: roots_of_power roots_of_power_universe_id_universes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roots_of_power
    ADD CONSTRAINT roots_of_power_universe_id_universes_id_fk FOREIGN KEY (universe_id) REFERENCES public.universes(id) ON DELETE CASCADE;


--
-- Name: solar_systems solar_systems_galaxy_id_galaxies_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solar_systems
    ADD CONSTRAINT solar_systems_galaxy_id_galaxies_id_fk FOREIGN KEY (galaxy_id) REFERENCES public.galaxies(id) ON DELETE CASCADE;


--
-- Name: stars stars_solar_system_id_solar_systems_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stars
    ADD CONSTRAINT stars_solar_system_id_solar_systems_id_fk FOREIGN KEY (solar_system_id) REFERENCES public.solar_systems(id) ON DELETE CASCADE;


--
-- Name: universes universes_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universes
    ADD CONSTRAINT universes_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

