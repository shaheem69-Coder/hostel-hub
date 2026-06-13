-- NIT HostelHub starter schema for Supabase.
-- Run this in the Supabase SQL editor, then add RLS policies to match your college roles.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  college_id text unique not null,
  full_name text not null,
  role text not null check (role in ('student', 'warden', 'admin')),
  department text,
  phone text,
  language text default 'en',
  verification_status text default 'pending' check (verification_status in ('pending', 'verified', 'rejected')),
  created_at timestamptz default now()
);

create table if not exists hostels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  hostel_type text not null,
  gender_policy text not null,
  description text,
  created_at timestamptz default now()
);

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  hostel_id uuid references hostels(id) on delete cascade,
  room_number text not null,
  floor int not null,
  sharing_type text not null,
  annual_fee numeric not null,
  total_beds int not null,
  available_beds int not null,
  status text default 'available',
  unique (hostel_id, room_number)
);

create table if not exists room_applications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade,
  room_id uuid references rooms(id),
  priority_score int default 0,
  status text default 'submitted' check (status in ('submitted', 'provisional', 'approved', 'rejected', 'cancelled')),
  created_at timestamptz default now()
);

create table if not exists complaints (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade,
  room_id uuid references rooms(id),
  category text not null,
  description text not null,
  status text default 'open' check (status in ('open', 'assigned', 'in_progress', 'resolved', 'closed')),
  assigned_to text,
  created_at timestamptz default now()
);

create table if not exists leaves (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade,
  from_date date not null,
  to_date date not null,
  reason text not null,
  guardian_phone text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

create table if not exists visitors (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade,
  visitor_name text not null,
  relation text not null,
  phone text,
  visit_time timestamptz not null,
  status text default 'scheduled' check (status in ('scheduled', 'checked_in', 'checked_out', 'rejected')),
  created_at timestamptz default now()
);

create table if not exists notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  category text not null,
  audience text default 'all',
  published_by uuid references profiles(id),
  published_at timestamptz default now()
);

create table if not exists pg_listings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area text not null,
  latitude numeric,
  longitude numeric,
  monthly_rent numeric,
  rating numeric,
  available_seats int default 0,
  safety_tag text,
  verification_status text default 'college_listed'
);

alter table profiles enable row level security;
alter table hostels enable row level security;
alter table rooms enable row level security;
alter table room_applications enable row level security;
alter table complaints enable row level security;
alter table leaves enable row level security;
alter table visitors enable row level security;
alter table notices enable row level security;
alter table pg_listings enable row level security;
