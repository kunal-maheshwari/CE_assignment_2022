create table projects(
    projects_id serial primary key not null,
    name varchar(25),
    description varchar(255),
    skills text[],
    members varchar(25),
    is_active boolean,
    created_at timestamp default now() not null,
    updated_at timestamp default now() not null
);