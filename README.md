## NextJS 14 & Supabase password manager

Base project forked from: https://github.com/jolbol1/supatodo
which originally was a fork of: https://github.com/shadcn-ui/taxonomy

### What I added/changed

- rewrote project into a password manager
- removed /login registration logic and added it to the /register path
- added /passwords route
- added form components for passwords
- added passwords and user_secret tables in supabase
- added/changed server actions:
    - register form now has server side validation with zod,
    - register actions now also give new users their individual user secret for password encryption,
    - added password actions that handle adding and removing passwords - these use user secrets, argon2 and AES to send encrypted passwords to the database,
    - added getDecryptedPasswords function for fetching and decrypting user passwords.
- added calculatePasswordStrength utility function for meassuring password strength
- the above mentioned function is later used for styling password cards
- changed header and root page to fit project
- probably did more things that I already forgot about, sorry!

NOTE: Adding user secrets creation has broken authentication with GitHub and I haven't fixed it yet.

### How to run project locally

```
npm install
npm run build
npm run dev
```

### Supabase setup

Don't forget to add the supbase_url and supabase_anon_key environment variables!

```sql
-- passwords table
CREATE TABLE passwords (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    password TEXT NOT NULL,
    website TEXT NOT NULL,
    salt TEXT NOT NULL,
    inserted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
alter table passwords enable row level security;
create policy "Individuals can create passwords." on passwords for
    insert with check (auth.uid() = user_id);
create policy "Individuals can view their own passwords. " on passwords for
    select using ((select auth.uid()) = user_id);
create policy "Individuals can update their own passwords." on passwords for
    update using ((select auth.uid()) = user_id);
create policy "Individuals can delete their own passwords." on passwords for
    delete using ((select auth.uid()) = user_id);

-- user secrets table
create table user_secrets (
  user_id UUID references auth.users not null primary key,
  secret text not null
);

create policy "Users can access their own secret" on user_secrets
  for all
  using (auth.uid() = user_id);

```
