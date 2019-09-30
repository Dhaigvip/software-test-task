insert into public.clients(
	phonenumber,
	payloadHash,
	firstname,
	surname
) values (
	${phonenumber},
	${payloadHash},
	${firstname},
	${surname}
) RETURNING id  as client