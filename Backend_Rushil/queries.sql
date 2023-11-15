CREATE TABLE users(
	user_id BIGSERIAL,
	name TEXT NOT NULL UNIQUE,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	google_id TEXT,
	PRIMARY KEY(user_id)
);


CREATE TABLE expensesheet(
	expenseId BIGSERIAL,
	user_id BIGINT NOT NULL,
	amount MONEY,
	category TEXT NOT NULL,
	note TEXT,
	timeStamp TIMESTAMP(0) DEFAULT ,
	PRIMARY KEY(expenseId),
	FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE friends(
relation_id BIGSERIAL PRIMARY KEY,
	user_id BIGINT REFERENCES users(user_id),
	friends_array TEXT[]
	
);

CREATE TABLE groupdetails(
groupId BIGSERIAL PRIMARY KEY,
	group_name text not null,
	host_id bigint references users(user_id),
	host_name text references users(name),
	members text[] 
	
);

CREATE TABLE group_expensesheet(
	id BIGSERIAL PRIMARY KEY,
	group_id bigint references groupdetails(groupid),
	amount money,
	payor_id bigint references users(user_id),
	payor text references users(name),
	debtors text[],
	note text,
	timeStamp TIMESTAMP(0) DEFAULT current_timestamp
	
);

INSERT INTO users (username,email,password,google_id)
VALUES ('Rush', 'lol@mail.com','pass','lol@gmail.com'),('Rama','haha@mail.com','word','haha@gmail.com');


