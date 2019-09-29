update  public.clients
set                 ${formatter:raw}
where   id        = ${clientId}
RETURNING id  as client