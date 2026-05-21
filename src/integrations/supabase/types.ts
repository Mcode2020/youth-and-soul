export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      brand_discounts: {
        Row: {
          brand_name: string
          created_at: string
          discount_code: string
          discount_percent: number
          id: string
          is_active: boolean | null
          updated_at: string
        }
        Insert: {
          brand_name: string
          created_at?: string
          discount_code: string
          discount_percent?: number
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Update: {
          brand_name?: string
          created_at?: string
          discount_code?: string
          discount_percent?: number
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          address: string | null
          allergies: string | null
          city: string | null
          created_at: string
          current_medications: string | null
          date_of_birth: string | null
          email: string
          email_consent: boolean | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          mdi_response: Json | null
          medical_conditions: string | null
          monthly_price: number
          phone: string | null
          previous_treatments: string | null
          program_slug: string
          sms_consent: boolean | null
          state: string | null
          status: string
          tier_label: string
          tier_name: string
          user_id: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          allergies?: string | null
          city?: string | null
          created_at?: string
          current_medications?: string | null
          date_of_birth?: string | null
          email: string
          email_consent?: boolean | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          mdi_response?: Json | null
          medical_conditions?: string | null
          monthly_price: number
          phone?: string | null
          previous_treatments?: string | null
          program_slug: string
          sms_consent?: boolean | null
          state?: string | null
          status?: string
          tier_label: string
          tier_name: string
          user_id?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          allergies?: string | null
          city?: string | null
          created_at?: string
          current_medications?: string | null
          date_of_birth?: string | null
          email?: string
          email_consent?: boolean | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          mdi_response?: Json | null
          medical_conditions?: string | null
          monthly_price?: number
          phone?: string | null
          previous_treatments?: string | null
          program_slug?: string
          sms_consent?: boolean | null
          state?: string | null
          status?: string
          tier_label?: string
          tier_name?: string
          user_id?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      featured_products: {
        Row: {
          brand_name: string
          category: string | null
          clicks: number | null
          created_at: string
          ends_at: string | null
          id: string
          image_url: string | null
          impressions: number | null
          is_active: boolean | null
          original_price: number | null
          placement_fee: number
          placement_type: string
          price: number
          priority_score: number | null
          product_name: string
          starts_at: string
        }
        Insert: {
          brand_name: string
          category?: string | null
          clicks?: number | null
          created_at?: string
          ends_at?: string | null
          id?: string
          image_url?: string | null
          impressions?: number | null
          is_active?: boolean | null
          original_price?: number | null
          placement_fee: number
          placement_type?: string
          price: number
          priority_score?: number | null
          product_name: string
          starts_at?: string
        }
        Update: {
          brand_name?: string
          category?: string | null
          clicks?: number | null
          created_at?: string
          ends_at?: string | null
          id?: string
          image_url?: string | null
          impressions?: number | null
          is_active?: boolean | null
          original_price?: number | null
          placement_fee?: number
          placement_type?: string
          price?: number
          priority_score?: number | null
          product_name?: string
          starts_at?: string
        }
        Relationships: []
      }
      influencer_posts: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          platform: string
          post_type: string | null
          sort_order: number | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          platform?: string
          post_type?: string | null
          sort_order?: number | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          platform?: string
          post_type?: string | null
          sort_order?: number | null
          title?: string
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          age: number | null
          author_name: string
          content: string
          created_at: string
          goal: string | null
          helpful_count: number | null
          id: string
          product_id: string
          rating: number
          time_to_result: string | null
          user_id: string | null
          would_repurchase: boolean | null
        }
        Insert: {
          age?: number | null
          author_name: string
          content: string
          created_at?: string
          goal?: string | null
          helpful_count?: number | null
          id?: string
          product_id: string
          rating: number
          time_to_result?: string | null
          user_id?: string | null
          would_repurchase?: boolean | null
        }
        Update: {
          age?: number | null
          author_name?: string
          content?: string
          created_at?: string
          goal?: string | null
          helpful_count?: number | null
          id?: string
          product_id?: string
          rating?: number
          time_to_result?: string | null
          user_id?: string | null
          would_repurchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "seller_products"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_vip: boolean | null
          updated_at: string
          vip_expires_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_vip?: boolean | null
          updated_at?: string
          vip_expires_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_vip?: boolean | null
          updated_at?: string
          vip_expires_at?: string | null
        }
        Relationships: []
      }
      program_doctors: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          photo_url: string | null
          program_slug: string
          sort_order: number | null
          specialty: string | null
          testimonial: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          photo_url?: string | null
          program_slug: string
          sort_order?: number | null
          specialty?: string | null
          testimonial: string
          title?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          photo_url?: string | null
          program_slug?: string
          sort_order?: number | null
          specialty?: string | null
          testimonial?: string
          title?: string
        }
        Relationships: []
      }
      program_results: {
        Row: {
          after_image_url: string | null
          age: number | null
          before_image_url: string | null
          created_at: string
          duration: string
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          program_slug: string
          quote: string
          rating: number
          sort_order: number | null
          stat: string
          stat_label: string
          tier: string | null
        }
        Insert: {
          after_image_url?: string | null
          age?: number | null
          before_image_url?: string | null
          created_at?: string
          duration: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          program_slug: string
          quote: string
          rating?: number
          sort_order?: number | null
          stat: string
          stat_label: string
          tier?: string | null
        }
        Update: {
          after_image_url?: string | null
          age?: number | null
          before_image_url?: string | null
          created_at?: string
          duration?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          program_slug?: string
          quote?: string
          rating?: number
          sort_order?: number | null
          stat?: string
          stat_label?: string
          tier?: string | null
        }
        Relationships: []
      }
      program_videos: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          program_slug: string
          sort_order: number | null
          title: string
          youtube_embed_url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          program_slug: string
          sort_order?: number | null
          title: string
          youtube_embed_url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          program_slug?: string
          sort_order?: number | null
          title?: string
          youtube_embed_url?: string
        }
        Relationships: []
      }
      recently_viewed: {
        Row: {
          id: string
          product_brand: string
          product_id: string
          product_image: string | null
          product_name: string
          product_original_price: number | null
          product_price: number
          product_url: string | null
          user_id: string
          viewed_at: string
        }
        Insert: {
          id?: string
          product_brand: string
          product_id: string
          product_image?: string | null
          product_name: string
          product_original_price?: number | null
          product_price: number
          product_url?: string | null
          user_id: string
          viewed_at?: string
        }
        Update: {
          id?: string
          product_brand?: string
          product_id?: string
          product_image?: string | null
          product_name?: string
          product_original_price?: number | null
          product_price?: number
          product_url?: string | null
          user_id?: string
          viewed_at?: string
        }
        Relationships: []
      }
      saved_products: {
        Row: {
          created_at: string
          id: string
          product_brand: string
          product_id: string
          product_image: string | null
          product_name: string
          product_original_price: number | null
          product_price: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_brand: string
          product_id: string
          product_image?: string | null
          product_name: string
          product_original_price?: number | null
          product_price: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_brand?: string
          product_id?: string
          product_image?: string | null
          product_name?: string
          product_original_price?: number | null
          product_price?: number
          user_id?: string
        }
        Relationships: []
      }
      seller_products: {
        Row: {
          benefits: string | null
          brand: string
          category: string
          created_at: string
          description: string | null
          discount_code: string | null
          goals: string[] | null
          id: string
          images: string[] | null
          key_ingredients: string | null
          original_price: number | null
          price: number
          product_name: string
          product_url: string | null
          revenue: number | null
          sales_count: number | null
          seller_id: string
          status: string
          updated_at: string
          usage_instructions: string | null
          views: number | null
        }
        Insert: {
          benefits?: string | null
          brand: string
          category: string
          created_at?: string
          description?: string | null
          discount_code?: string | null
          goals?: string[] | null
          id?: string
          images?: string[] | null
          key_ingredients?: string | null
          original_price?: number | null
          price: number
          product_name: string
          product_url?: string | null
          revenue?: number | null
          sales_count?: number | null
          seller_id: string
          status?: string
          updated_at?: string
          usage_instructions?: string | null
          views?: number | null
        }
        Update: {
          benefits?: string | null
          brand?: string
          category?: string
          created_at?: string
          description?: string | null
          discount_code?: string | null
          goals?: string[] | null
          id?: string
          images?: string[] | null
          key_ingredients?: string | null
          original_price?: number | null
          price?: number
          product_name?: string
          product_url?: string | null
          revenue?: number | null
          sales_count?: number | null
          seller_id?: string
          status?: string
          updated_at?: string
          usage_instructions?: string | null
          views?: number | null
        }
        Relationships: []
      }
      seo_authority_sources: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          priority: number
          url: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          priority?: number
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          priority?: number
          url?: string
        }
        Relationships: []
      }
      seo_generation_queue: {
        Row: {
          created_at: string
          error_message: string | null
          hub_id: string
          id: string
          processed_at: string | null
          question: string | null
          result_spoke_id: string | null
          status: string
          topic: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          hub_id: string
          id?: string
          processed_at?: string | null
          question?: string | null
          result_spoke_id?: string | null
          status?: string
          topic: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          hub_id?: string
          id?: string
          processed_at?: string | null
          question?: string | null
          result_spoke_id?: string | null
          status?: string
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_generation_queue_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "seo_hub_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_generation_queue_result_spoke_id_fkey"
            columns: ["result_spoke_id"]
            isOneToOne: false
            referencedRelation: "seo_spoke_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_hub_pages: {
        Row: {
          canonical_url: string | null
          category: string
          content: string
          created_at: string
          external_links: Json | null
          h1_title: string | null
          hero_subtitle: string | null
          hero_title: string
          id: string
          internal_links: Json | null
          is_published: boolean | null
          keywords: string[] | null
          meta_description: string | null
          og_description: string | null
          og_title: string | null
          published_at: string | null
          related_products_category: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          category: string
          content: string
          created_at?: string
          external_links?: Json | null
          h1_title?: string | null
          hero_subtitle?: string | null
          hero_title: string
          id?: string
          internal_links?: Json | null
          is_published?: boolean | null
          keywords?: string[] | null
          meta_description?: string | null
          og_description?: string | null
          og_title?: string | null
          published_at?: string | null
          related_products_category?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          category?: string
          content?: string
          created_at?: string
          external_links?: Json | null
          h1_title?: string | null
          hero_subtitle?: string | null
          hero_title?: string
          id?: string
          internal_links?: Json | null
          is_published?: boolean | null
          keywords?: string[] | null
          meta_description?: string | null
          og_description?: string | null
          og_title?: string | null
          published_at?: string | null
          related_products_category?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_spoke_pages: {
        Row: {
          canonical_url: string | null
          content: string
          created_at: string
          external_links: Json | null
          h1_title: string | null
          hub_id: string
          id: string
          internal_links: Json | null
          is_ai_generated: boolean | null
          is_published: boolean | null
          keywords: string[] | null
          meta_description: string | null
          og_description: string | null
          og_title: string | null
          page_type: string
          published_at: string | null
          question: string | null
          slug: string
          sources: string[] | null
          stats: Json | null
          tags: string[] | null
          target_keyword: string | null
          title: string
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          content: string
          created_at?: string
          external_links?: Json | null
          h1_title?: string | null
          hub_id: string
          id?: string
          internal_links?: Json | null
          is_ai_generated?: boolean | null
          is_published?: boolean | null
          keywords?: string[] | null
          meta_description?: string | null
          og_description?: string | null
          og_title?: string | null
          page_type?: string
          published_at?: string | null
          question?: string | null
          slug: string
          sources?: string[] | null
          stats?: Json | null
          tags?: string[] | null
          target_keyword?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          content?: string
          created_at?: string
          external_links?: Json | null
          h1_title?: string | null
          hub_id?: string
          id?: string
          internal_links?: Json | null
          is_ai_generated?: boolean | null
          is_published?: boolean | null
          keywords?: string[] | null
          meta_description?: string | null
          og_description?: string | null
          og_title?: string | null
          page_type?: string
          published_at?: string | null
          question?: string | null
          slug?: string
          sources?: string[] | null
          stats?: Json | null
          tags?: string[] | null
          target_keyword?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_spoke_pages_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "seo_hub_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      site_reviews: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          review_text: string
          sort_order: number | null
          source: string | null
          stars: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          review_text: string
          sort_order?: number | null
          source?: string | null
          stars?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          review_text?: string
          sort_order?: number | null
          source?: string | null
          stars?: number
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          environment: string
          id: string
          price_id: string
          product_id: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          price_id: string
          product_id: string
          status?: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          price_id?: string
          product_id?: string
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      vip_subscriptions: {
        Row: {
          created_at: string
          expires_at: string
          free_consultations_remaining: number | null
          id: string
          plan_type: string
          price_paid: number
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          free_consultations_remaining?: number | null
          id?: string
          plan_type?: string
          price_paid: number
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          free_consultations_remaining?: number | null
          id?: string
          plan_type?: string
          price_paid?: number
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_active_subscription: {
        Args: { check_env?: string; user_uuid: string }
        Returns: boolean
      }
      link_enrollments_to_user: {
        Args: { _email: string; _user_id: string }
        Returns: undefined
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
