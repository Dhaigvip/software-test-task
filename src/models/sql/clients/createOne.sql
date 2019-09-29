insert into public.clients(
	phoneNumber,
	payloadHash,
	firstname,
	surname
) values (
	${phoneNumber},
	${payloadHash},
	${firstname},
	${surname}
) RETURNING id  as client