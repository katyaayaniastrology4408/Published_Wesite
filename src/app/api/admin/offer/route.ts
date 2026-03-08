import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

// GET: Fetch offer settings
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("offer_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Table exists but no rows
        return NextResponse.json({
            is_active: false,
            start_date: null,
            end_date: null,
            original_price: 851,
            offer_price: 501,
            title: "🎉 Special Festival Offer",
            urgency_text: "Only Few Slots Left",
            popup_text: "🎉 Special Festival Offer – Book Now at ₹501 Only!",
            max_slots: 50,
            used_slots: 0,
            payment_link: "https://urpy.link/D9kGay"
        });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Auto-disable if end date is passed
    // Auto-disable if end date is passed
    if (data.is_active && data.end_date && new Date(data.end_date) < new Date()) {
        await supabase.from("offer_settings").update({ is_active: false }).eq("id", 1);
        data.is_active = false;
    }

    // Auto-disable if max slots reached
    if (data.is_active && data.used_slots >= data.max_slots) {
        await supabase.from("offer_settings").update({ is_active: false }).eq("id", 1);
        data.is_active = false;
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch offer settings" }, { status: 500 });
  }
}

// PUT: Update offer settings (Admin Only - protected by middleware)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
        is_active, 
        start_date, 
        end_date, 
        original_price, 
        offer_price, 
        title, 
        urgency_text, 
        popup_text,
        max_slots,
        used_slots,
        payment_link
    } = body;

    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    
    if (is_active !== undefined) updateData.is_active = is_active;
    if (start_date !== undefined) updateData.start_date = start_date;
    if (end_date !== undefined) updateData.end_date = end_date;
    if (original_price !== undefined) updateData.original_price = original_price;
    if (offer_price !== undefined) updateData.offer_price = offer_price;
    if (title !== undefined) updateData.title = title;
    if (urgency_text !== undefined) updateData.urgency_text = urgency_text;
    if (popup_text !== undefined) updateData.popup_text = popup_text;
    if (max_slots !== undefined) updateData.max_slots = max_slots;
    if (used_slots !== undefined) updateData.used_slots = used_slots;
    if (payment_link !== undefined) updateData.payment_link = payment_link;

    const { data, error } = await supabase
      .from("offer_settings")
      .update(updateData)
      .eq("id", 1)
      .select()
      .single();

    if (error) {
        // Fallback: if row doesn't exist, insert it
        if (error.code === 'PGRST116') {
            const { data: insertData, error: insertError } = await supabase
              .from("offer_settings")
              .insert({ id: 1, ...updateData })
              .select()
              .single();
            if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
            return NextResponse.json({ success: true, settings: insertData });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, settings: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update offer settings" }, { status: 500 });
  }
}
