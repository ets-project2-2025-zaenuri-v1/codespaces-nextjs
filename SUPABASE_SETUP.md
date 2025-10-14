# Supabase Database Setup Guide

This guide will help you set up the Supabase database for the Pempek POS application.

## 🚀 Step-by-Step Setup

### 1. Create a New Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Select your organization
4. Enter a project name (e.g., "pempek-pos")
5. Set a strong database password
6. Select a region closest to your users
7. Click "Create new project"

### 2. Get Your Database Credentials

1. In your Supabase project, go to **Settings** > **API**
2. Copy the following values:
   - Project URL
   - anon public key
   - service_role key (keep this secret!)

### 3. Set Up Environment Variables

Create a `.env.local` file in your project root and add:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Run the Database Schema

We've split the schema into 4 files to make it easier to run:

1. **Tables**: `supabase/schema/01_tables.sql`
2. **Indexes & Triggers**: `supabase/schema/02_indexes_triggers.sql`
3. **Views & Sample Data**: `supabase/schema/03_views_data.sql`
4. **RLS Policies**: `supabase/schema/04_rls_policies.sql`

#### Option A: Using the Supabase SQL Editor (Recommended)

1. In your Supabase project, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of each file in order:
   - First: `supabase/schema/01_tables.sql`
   - Second: `supabase/schema/02_indexes_triggers.sql`
   - Third: `supabase/schema/03_views_data.sql`
   - Fourth: `supabase/schema/04_rls_policies.sql`
4. Click "Run" for each file

#### Option B: Using the Complete Schema File

If you prefer to run everything at once:

1. In your Supabase project, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run"

### 5. Verify the Setup

1. In the Supabase **Table Editor**, you should see:
   - organizations table with sample data
   - outlets table with sample data
   - products table with sample data
   - All other tables created

2. Test the database connection by running:
   ```bash
   npm run dev
   ```
   And visiting `http://localhost:3000/api/test-db`

## 🔧 Troubleshooting

### Error: "column product_id specified more than once"

This error was fixed in the updated schema files. Make sure you're using the latest files from the `supabase/schema/` directory.

### Error: "function app_is_member_of does not exist"

Make sure you've run the files in the correct order:
1. Tables first
2. Indexes & Triggers second
3. Views & Sample Data third
4. RLS Policies fourth

### Error: "relation does not exist"

This usually means you haven't run all the schema files or they were run in the wrong order. Start over with a fresh database and run the files in the correct order.

## 📊 Sample Data

The schema includes sample data for:
- 1 organization: "Pempek Palembang"
- 1 outlet: "Main Outlet"
- 3 categories: "Pempek", "Minuman", "Lainnya"
- 5 products with prices and costs
- 5 ingredients with stock levels
- 5 recipes with ingredients
- 5 dining tables

You can modify or add to this data as needed.

## 🔐 Row Level Security (RLS)

The schema includes comprehensive RLS policies to ensure users can only access data from their own organization. The policies support role-based access control with these roles:
- owner
- admin
- cashier
- cook
- waiter
- courier

## 🚀 Next Steps

Once your database is set up:

1. Configure Clerk authentication
2. Test the application
3. Deploy to Vercel

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)