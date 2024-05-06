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
      assistants: {
        Row: {
          createdAt: string
          deletedAt: string | null
          id: number
          identity: string | null
          name: string
          style: string | null
          updatedAt: string
          voice: Json | null
        }
        Insert: {
          createdAt?: string
          deletedAt?: string | null
          id?: number
          identity?: string | null
          name: string
          style?: string | null
          updatedAt?: string
          voice?: Json | null
        }
        Update: {
          createdAt?: string
          deletedAt?: string | null
          id?: number
          identity?: string | null
          name?: string
          style?: string | null
          updatedAt?: string
          voice?: Json | null
        }
        Relationships: []
      }
      calls: {
        Row: {
          createdAt: string
          deletedAt: string | null
          endedAt: string | null
          id: number
          prompt: string | null
          read: boolean
          recordingUrl: string | null
          startedAt: string | null
          status: string | null
          summary: string | null
          taskId: number | null
          transcribed: boolean | null
          transcript: string | null
          type: string
          updatedAt: string
          vapiId: string | null
        }
        Insert: {
          createdAt?: string
          deletedAt?: string | null
          endedAt?: string | null
          id?: number
          prompt?: string | null
          read?: boolean
          recordingUrl?: string | null
          startedAt?: string | null
          status?: string | null
          summary?: string | null
          taskId?: number | null
          transcribed?: boolean | null
          transcript?: string | null
          type: string
          updatedAt?: string
          vapiId?: string | null
        }
        Update: {
          createdAt?: string
          deletedAt?: string | null
          endedAt?: string | null
          id?: number
          prompt?: string | null
          read?: boolean
          recordingUrl?: string | null
          startedAt?: string | null
          status?: string | null
          summary?: string | null
          taskId?: number | null
          transcribed?: boolean | null
          transcript?: string | null
          type?: string
          updatedAt?: string
          vapiId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calls_taskId_fkey"
            columns: ["taskId"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          extension: string | null
          id: number
          name: string
          phoneNumber: string
        }
        Insert: {
          extension?: string | null
          id?: number
          name: string
          phoneNumber: string
        }
        Update: {
          extension?: string | null
          id?: number
          name?: string
          phoneNumber?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assistantId: number | null
          contactName: string | null
          contactPhoneNumber: string | null
          createdAt: string
          deletedAt: string | null
          id: number
          instructions: string
          maxCallDuration: number | null
          name: string
          responseGuidelines: string | null
          scheduledAt: string | null
          status: string
          type: string | null
          updatedAt: string
        }
        Insert: {
          assistantId?: number | null
          contactName?: string | null
          contactPhoneNumber?: string | null
          createdAt?: string
          deletedAt?: string | null
          id?: number
          instructions: string
          maxCallDuration?: number | null
          name: string
          responseGuidelines?: string | null
          scheduledAt?: string | null
          status?: string
          type?: string | null
          updatedAt?: string
        }
        Update: {
          assistantId?: number | null
          contactName?: string | null
          contactPhoneNumber?: string | null
          createdAt?: string
          deletedAt?: string | null
          id?: number
          instructions?: string
          maxCallDuration?: number | null
          name?: string
          responseGuidelines?: string | null
          scheduledAt?: string | null
          status?: string
          type?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assistantId_fkey"
            columns: ["assistantId"]
            isOneToOne: false
            referencedRelation: "assistants"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          createdAt: string
          deletedAt: string | null
          email: string
          id: number
          name: string | null
          updatedAt: string
          username: string | null
        }
        Insert: {
          createdAt?: string
          deletedAt?: string | null
          email: string
          id?: number
          name?: string | null
          updatedAt?: string
          username?: string | null
        }
        Update: {
          createdAt?: string
          deletedAt?: string | null
          email?: string
          id?: number
          name?: string | null
          updatedAt?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
