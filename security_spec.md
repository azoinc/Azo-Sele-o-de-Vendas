# Security Spec

## Data Invariants
1. `corretores`: A user profile containing name, phone, creci, cpf, role. A user can only create their own profile, default to `corretor` role. Users can only update their own non-role fields. Gerentes can read/write anything in `corretores`.
2. `visitas`: A visit log. Tied to a `corretorId`. A Corretor can only create/update their own visits, and cannot change the `corretorId`. Gerentes can read/write any visit.

## Dirty Dozen Payloads
1. Unauthenticated read of corretores -> DENY
2. Unauthenticated create of visita -> DENY
3. Create corretor for another UID -> DENY
4. Create corretor with role 'gerente' as non-gerente -> DENY
5. Update own role to 'gerente' -> DENY
6. Read another corretor's profile as non-gerente -> DENY
7. List visitas without filter as non-gerente -> DENY (cannot scrape)
8. Create visita for another corretorId -> DENY
9. Update visita to change corretorId -> DENY
10. Update visita of another corretor -> DENY
11. Missing required field on visita create -> DENY
12. Invalid empreendimento enum value -> DENY
