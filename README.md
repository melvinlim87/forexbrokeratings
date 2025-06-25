# Forex Broker Ratings

A comprehensive platform for comparing and reviewing forex brokers.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Update the environment variables in `.env.local` with your actual API keys and configuration.

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

```bash
# Start the development server
npm run dev
```

## Guides Page Data Maintenance

To update the broker spread, regulation, or comparison data on the Guides page:
1. Edit `src/data/brokers.ts`.
2. Adjust the `brokers` array with new spreads, regulation info, or other fields as needed.
3. Save and redeploy. The Guides page will reflect the new data.

**Note:** Always verify regulatory status and spreads on the official broker website before updating.
