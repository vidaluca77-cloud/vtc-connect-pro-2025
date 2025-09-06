import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (type === 'user.created') {
      const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert({
          clerk_user_id: data.id,
          email: data.email_addresses?.email_address || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error creating profile:', error)
        return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
