begin;
create extension if not exists pgcrypto;

create table if not exists public.clients (
    id UUID primary key default gen_random_uuid(),
	payloadHash varchar(44) UNIQUE not null,
    phonenumber varchar(64) not null,
		firstname varchar(64) not null,
		surname varchar(64) not null
);

/* For testing purpose. :) */
TRUNCATE public.clients CASCADE;


insert into public.clients (payloadHash, phoneNumber, firstname, surname) values
	('updog?', '+44076546546545', 'FName', 'LName');

/* testing end */
commit;