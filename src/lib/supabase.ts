import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Status = 'new' | 'in_progress' | 'resolved' | 'closed';

export interface Ticket {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: Status;
  description: string;
  created_at: string;
  user: {
    id: string;
    email: string;
    raw_user_meta_data: {
      name: string;
    };
  };
  messages: Message[];
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  is_admin: boolean;
  user: {
    raw_user_meta_data: {
      name: string;
    };
  };
}

export async function fetchTickets() {
  const { data: tickets, error } = await supabase
    .from('tickets')
    .select(`
      *,
      user:user_id (
        id,
        email,
        raw_user_meta_data
      ),
      messages (
        id,
        content,
        created_at,
        is_admin,
        user:user_id (
          raw_user_meta_data
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return tickets;
}

export async function createTicket(ticketData: Partial<Ticket>) {
  const { data, error } = await supabase
    .from('tickets')
    .insert([ticketData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTicketStatus(ticketId: string, status: Status) {
  const { data, error } = await supabase
    .from('tickets')
    .update({ status })
    .eq('id', ticketId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createMessage(messageData: {
  ticket_id: string;
  content: string;
  is_admin: boolean;
  user_id: string;
}) {
  const { data, error } = await supabase
    .from('messages')
    .insert([messageData])
    .select(`
      *,
      user:user_id (
        raw_user_meta_data
      )
    `)
    .single();

  if (error) throw error;
  return data;
}