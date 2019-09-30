update  public.clients
set                 ${updateQueryformatter:raw}
where   id        = ${clientId}
RETURNING id  as client