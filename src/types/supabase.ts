export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string
          deleted: boolean
          id: string
          name: string | null
          secret_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted?: boolean
          id?: string
          name?: string | null
          secret_id?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          deleted?: boolean
          id?: string
          name?: string | null
          secret_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expanded_urls: {
        Row: {
          expanded_url: string | null
          favicon: string | null
          id: number
          last_updated: string
          metadata: Json | null
          provider_id: number | null
          screenshot: string | null
          short_url: string | null
          snapshot: string | null
        }
        Insert: {
          expanded_url?: string | null
          favicon?: string | null
          id?: number
          last_updated?: string
          metadata?: Json | null
          provider_id?: number | null
          screenshot?: string | null
          short_url?: string | null
          snapshot?: string | null
        }
        Update: {
          expanded_url?: string | null
          favicon?: string | null
          id?: number
          last_updated?: string
          metadata?: Json | null
          provider_id?: number | null
          screenshot?: string | null
          short_url?: string | null
          snapshot?: string | null
        }
        Relationships: []
      }
      invited_users: {
        Row: {
          accepted: boolean
          accepted_on: string | null
          email: string
          id: number
          invited_on: string
          username: string
        }
        Insert: {
          accepted?: boolean
          accepted_on?: string | null
          email: string
          id?: number
          invited_on?: string
          username: string
        }
        Update: {
          accepted?: boolean
          accepted_on?: string | null
          email?: string
          id?: number
          invited_on?: string
          username?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_visit: boolean
          id: string
          last_seen: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_visit?: boolean
          id: string
          last_seen?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_visit?: boolean
          id?: string
          last_seen?: string
          username?: string
        }
        Relationships: []
      }
      short_url_providers: {
        Row: {
          id: number
          provider: string
        }
        Insert: {
          id?: number
          provider: string
        }
        Update: {
          id?: number
          provider?: string
        }
        Relationships: []
      }
      short_urls: {
        Row: {
          created_at: string
          created_by: string
          deleted: boolean
          id: number
          pending: boolean
          provider_id: number | null
          slug: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted?: boolean
          id?: number
          pending?: boolean
          provider_id?: number | null
          slug: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted?: boolean
          id?: number
          pending?: boolean
          provider_id?: number | null
          slug?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "short_urls_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "short_urls_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "short_url_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: number
          tag: string
        }
        Insert: {
          created_at?: string
          id?: number
          tag: string
        }
        Update: {
          created_at?: string
          id?: number
          tag?: string
        }
        Relationships: []
      }
      url_info: {
        Row: {
          description: string | null
          favicon: string | null
          id: number
          last_updated: string
          metadata: Json | null
          screenshot: string | null
          snapshot: string | null
          title: string
          url_id: number
        }
        Insert: {
          description?: string | null
          favicon?: string | null
          id?: number
          last_updated?: string
          metadata?: Json | null
          screenshot?: string | null
          snapshot?: string | null
          title: string
          url_id: number
        }
        Update: {
          description?: string | null
          favicon?: string | null
          id?: number
          last_updated?: string
          metadata?: Json | null
          screenshot?: string | null
          snapshot?: string | null
          title?: string
          url_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "url_info_url_id_fkey"
            columns: ["url_id"]
            isOneToOne: false
            referencedRelation: "short_urls"
            referencedColumns: ["id"]
          },
        ]
      }
      url_reports: {
        Row: {
          cloudflare_scan_results: string | null
          id: number
          last_scanned: string
          ready: boolean
          url_id: number
        }
        Insert: {
          cloudflare_scan_results?: string | null
          id?: number
          last_scanned?: string
          ready?: boolean
          url_id: number
        }
        Update: {
          cloudflare_scan_results?: string | null
          id?: number
          last_scanned?: string
          ready?: boolean
          url_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "url_reports_url_id_fkey"
            columns: ["url_id"]
            isOneToOne: false
            referencedRelation: "short_urls"
            referencedColumns: ["id"]
          },
        ]
      }
      url_stats: {
        Row: {
          flags: number
          hits: number
          id: number
          inspects: number
          last_updated: string
          url_id: number
        }
        Insert: {
          flags?: number
          hits?: number
          id?: number
          inspects?: number
          last_updated?: string
          url_id: number
        }
        Update: {
          flags?: number
          hits?: number
          id?: number
          inspects?: number
          last_updated?: string
          url_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "url_stats_url_id_fkey"
            columns: ["url_id"]
            isOneToOne: true
            referencedRelation: "short_urls"
            referencedColumns: ["id"]
          },
        ]
      }
      url_summaries: {
        Row: {
          created_at: string
          id: number
          summary: string | null
          url_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          summary?: string | null
          url_id: number
        }
        Update: {
          created_at?: string
          id?: number
          summary?: string | null
          url_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "url_summaries_url_id_fkey"
            columns: ["url_id"]
            isOneToOne: false
            referencedRelation: "short_urls"
            referencedColumns: ["id"]
          },
        ]
      }
      url_tags: {
        Row: {
          id: number
          tag_id: number
          tagged_at: string
          url_id: number
        }
        Insert: {
          id?: number
          tag_id: number
          tagged_at?: string
          url_id: number
        }
        Update: {
          id?: number
          tag_id?: number
          tagged_at?: string
          url_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "url_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "url_tags_url_id_fkey"
            columns: ["url_id"]
            isOneToOne: false
            referencedRelation: "short_urls"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_api_key: {
        Args: {
          _api_key: string
          _api_key_name: string
          _user_id: string
        }
        Returns: string
      }
      get_user_api_key: {
        Args: {
          _user_id: string
          _key_id: string
        }
        Returns: {
          name: string
          key: string
        }[]
      }
      get_user_api_keys: {
        Args: {
          _user_id: string
        }
        Returns: {
          name: string
          key: string
        }[]
      }
      get_user_by_api_key: {
        Args: {
          _key: string
        }
        Returns: {
          userid: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
