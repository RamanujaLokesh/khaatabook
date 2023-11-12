-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id bigint NOT NULL DEFAULT nextval('users_id_seq'::regclass),--SERIAL IS ENOUGH AS DATATYPE
    name text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    "profileId" integer,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_name_key UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;




-- for table expenses

-- Table: public.expenses

-- DROP TABLE IF EXISTS public.expenses;

CREATE TABLE IF NOT EXISTS public.expenses
(
    "expensesId" bigint NOT NULL,
    "userId" bigint NOT NULL,
    amount money NOT NULL,
    category text COLLATE pg_catalog."default" NOT NULL,
    note text COLLATE pg_catalog."default",
    CONSTRAINT expenses_pkey PRIMARY KEY ("expensesId"),
    CONSTRAINT "expenses_expenseId_key" UNIQUE ("expensesId")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.expenses
    OWNER to postgres;

-- iserting into arrays demo queries for getting familiar with database
    CREATE TABLE friends(
id SERIAL PRIMARY KEY,
	username TEXT NOT NULL,
friendslist TEXT[]
);


INSERT INTO friends(username,friendslist)
VALUES('user1','{"test1","friend2","user3"}');

-- to add a coloum to existing table
ALTER TABLE tymexprmnts/*table name*/ ADD COLUMN data char/*coloum name  datatype*/;

ALTER TABLE table_name ALTER COLUMN column_name TYPE new_data_type;


CREATE TABLE tymexprmnts (
  id SERIAL PRIMARY KEY,
timestampcoloum TIMESTAMP(0) DEFAULT current_timestamp,
data char
);

--
CREATE TABLE friends(
relation_id BIGSERIAL PRIMARY KEY,
	user_id BIGINT references users(userId),
	friends_array text[]
	
);
CREATE TABLE group_details(
group_id bigserial primary key,
	group_name text not null,
	host_id bigint references users(userid),
	host_name text references users(name),
	members text[] 
);
CREATE TABLE group_expensesheet(
id bigserial primary key,
	group_id bigint references groupdetails(groupid),
	amount money,
		payor_id bigint references users(userId),
	payor text references users(name),
	 debtors text[],
	note text,
	timestamp TIMESTAMP(0) DEFAULT current_timestamp
	
);

UPDATE friends SET friends_array = friends_array || '{new_element}' WHERE relation_id=1;


UPDATE sal_emp SET pay_by_quarter[1:2] = '{27000,27000}'
    WHERE name = 'Carol';

    UPDATE friends SET friends_array = friends_array ||$1 WHERE user_id=5;