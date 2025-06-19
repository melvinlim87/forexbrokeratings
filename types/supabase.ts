export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Define your database tables here
      // Example:
      // profiles: {
      //   Row: {
      //     id: string
      //     created_at: string
      //     email: string
      //     // ... other fields
      //   }
      //   Insert: {
      //     id?: string
      //     created_at?: string
      //     email: string
      //     // ... other fields
      //   }
      //   Update: {
      //     id?: string
      //     created_at?: string
      //     email?: string
      //     // ... other fields
      //   }
      // }
    }
    Views: {
      // Define your views here
    }
    Functions: {
      // Define your functions here
    }
    Enums: {
      // Define your enums here
    }
  }
}
