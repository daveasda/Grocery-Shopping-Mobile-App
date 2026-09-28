# Grocery Shopping Mobile App

A simple mobile grocery shopping application built using React Native and Expo.

The application allows users to create an account, sign in, and manage their own grocery list. Grocery data and user authentication are handled using Supabase.

## Features

- User registration and login
- User authentication with Supabase
- Add grocery items
- View grocery items
- Mark items as bought or not bought
- Delete grocery items
- Each user has their own grocery list
- Row Level Security (RLS) for protecting user data

## CRUD Operations

The application supports the four basic CRUD operations:

- **Create** - Add a new grocery item
- **Read** - View grocery items
- **Update** - Mark an item as bought or not bought
- **Delete** - Remove a grocery item

## Technologies Used

- React Native
- Expo
- TypeScript
- Expo Router
- NativeWind
- Supabase
- Supabase Authentication
- Supabase PostgreSQL Database
- Supabase Row Level Security

## Project Structure

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   └── login.tsx
│   │
│   ├── (app)/
│   │   ├── _layout.tsx
│   │   ├── home.tsx
│   │   └── add-item.tsx
│   │
│   └── _layout.tsx
│
├── context/
│   └── AuthContext.tsx
│
└── services/
    ├── authService.ts
    └── groceryService.ts
```

## Database

The application uses a Supabase table named `grocery_items`.

Main fields include:

- `id`
- `user_id`
- `name`
- `quantity`
- `is_bought`
- `created_at`

Row Level Security policies ensure that users can only access and modify their own grocery items.

## Running the Project

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the Expo project:

```bash
cd Grocery-Shopping-Mobile-App/my-app
```

Install dependencies:

```bash
npm install
```

Create the required environment variables for Supabase:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the Expo development server:

```bash
npx expo start
```

The application can then be opened using an Android emulator or Expo Go.

## Screenshots

### Grocery List

<img width="540" height="877" alt="image" src="https://github.com/user-attachments/assets/d4ed3035-a20e-4836-b87b-0414ce071c04" />

### Add Grocery Item

<img width="422" height="840" alt="image" src="https://github.com/user-attachments/assets/59752f41-b886-4b92-9740-d166c8a8e2ed" />
