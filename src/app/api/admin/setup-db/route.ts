import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic' ; 

export async function GET() {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
    );

    // Remove clear_password column from profiles table for security
    const { error } = await supabaseAdmin.rpc('exec_sql', {
      sql_query: "ALTER TABLE profiles DROP COLUMN IF EXISTS clear_password;"
    });

    if (error) {
      // If RPC fails (which it might if not set up), try a direct query if possible
      console.error("Migration error:", error);
      return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({ success: true, message: "Column removed successfully for security" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
