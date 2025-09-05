import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { Webhook } from 'svix';

// Interface pour les événements Clerk
interface ClerkUser {
  id: string;
  email_addresses: Array<{
    email_address: string;
    id: string;
  }>;
  first_name: string | null;
  last_name: string | null;
  image_url: string;
  created_at: number;
  updated_at: number;
}

interface ClerkEvent {
  type: string;
  data: ClerkUser;
}

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

if (!supabaseUrl || !supabaseServiceKey || !clerkWebhookSecret) {
  throw new Error('Variables d\'environnement manquantes pour la synchronisation Clerk-Supabase');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    // Vérification de la signature du webhook Clerk
    const headersList = headers();
    const svix_id = headersList.get('svix-id');
    const svix_timestamp = headersList.get('svix-timestamp');
    const svix_signature = headersList.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json(
        { error: 'En-têtes de webhook manquants' },
        { status: 400 }
      );
    }

    const body = await request.text();
    const wh = new Webhook(clerkWebhookSecret);

    let evt: ClerkEvent;
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as ClerkEvent;
    } catch (err) {
      console.error('Erreur de vérification du webhook:', err);
      return NextResponse.json(
        { error: 'Webhook invalide' },
        { status: 400 }
      );
    }

    // Traitement des événements Clerk
    const { type, data } = evt;
    const userId = data.id;
    const email = data.email_addresses[0]?.email_address;
    const firstName = data.first_name;
    const lastName = data.last_name;
    const imageUrl = data.image_url;
    const createdAt = new Date(data.created_at);
    const updatedAt = new Date(data.updated_at);

    console.log(`Événement Clerk reçu: ${type} pour l'utilisateur ${userId}`);

    switch (type) {
      case 'user.created':
        // Créer un nouvel utilisateur dans Supabase
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            clerk_id: userId,
            email: email,
            first_name: firstName,
            last_name: lastName,
            avatar_url: imageUrl,
            created_at: createdAt.toISOString(),
            updated_at: updatedAt.toISOString(),
            status: 'active',
            role: 'driver' // Par défaut, les utilisateurs sont des chauffeurs
          })
          .select()
          .single();

        if (createError) {
          console.error('Erreur lors de la création de l\'utilisateur:', createError);
          return NextResponse.json(
            { error: 'Erreur lors de la création de l\'utilisateur' },
            { status: 500 }
          );
        }

        // Créer un profil chauffeur par défaut
        const { error: profileError } = await supabase
          .from('driver_profiles')
          .insert({
            user_id: newUser.id,
            license_number: '',
            vehicle_type: '',
            vehicle_model: '',
            vehicle_plate: '',
            status: 'pending_verification',
            rating: 0,
            total_rides: 0,
            created_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Erreur lors de la création du profil chauffeur:', profileError);
        }

        console.log(`Utilisateur créé avec succès: ${newUser.id}`);
        break;

      case 'user.updated':
        // Mettre à jour l'utilisateur dans Supabase
        const { error: updateError } = await supabase
          .from('users')
          .update({
            email: email,
            first_name: firstName,
            last_name: lastName,
            avatar_url: imageUrl,
            updated_at: updatedAt.toISOString()
          })
          .eq('clerk_id', userId);

        if (updateError) {
          console.error('Erreur lors de la mise à jour de l\'utilisateur:', updateError);
          return NextResponse.json(
            { error: 'Erreur lors de la mise à jour de l\'utilisateur' },
            { status: 500 }
          );
        }

        console.log(`Utilisateur mis à jour avec succès: ${userId}`);
        break;

      case 'user.deleted':
        // Marquer l'utilisateur comme supprimé (soft delete)
        const { error: deleteError } = await supabase
          .from('users')
          .update({
            status: 'deleted',
            updated_at: new Date().toISOString()
          })
          .eq('clerk_id', userId);

        if (deleteError) {
          console.error('Erreur lors de la suppression de l\'utilisateur:', deleteError);
          return NextResponse.json(
            { error: 'Erreur lors de la suppression de l\'utilisateur' },
            { status: 500 }
          );
        }

        console.log(`Utilisateur supprimé avec succès: ${userId}`);
        break;

      default:
        console.log(`Événement non géré: ${type}`);
        break;
    }

    return NextResponse.json(
      { message: 'Synchronisation réussie', type, userId },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur lors de la synchronisation Clerk-Supabase:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Gérer les autres méthodes HTTP
export async function GET() {
  return NextResponse.json(
    { message: 'Endpoint de synchronisation Clerk-Supabase actif' },
    { status: 200 }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, svix-id, svix-timestamp, svix-signature',
    },
  });
}
