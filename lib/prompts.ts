import { supabase } from './supabase';

export interface UserPrompt {
  id: string;
  user_id: string;
  prompt_id: string;
  question: string;
  answer: string;
  is_custom: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getUserPrompts(userId: string): Promise<{ success: boolean; data?: UserPrompt[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('user_prompts' as any)
      .select('*')
      .eq('user_id', userId)
      .order('prompt_id', { ascending: true });

    if (error) {
      console.error('Error fetching user prompts:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as unknown as UserPrompt[] };
  } catch (error) {
    console.error('Unexpected error fetching user prompts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function saveUserPrompts(
  prompts: Array<{ prompt_id: string; question: string; answer: string; is_custom: boolean }>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    const upsertPayload = prompts.map((p) => ({
      user_id: userId,
      prompt_id: p.prompt_id,
      question: p.question,
      answer: p.answer,
      is_custom: p.is_custom,
      updated_at: new Date().toISOString(),
    }));

    if (upsertPayload.length === 0) {
      return { success: true };
    }

    const { error } = await supabase
      .from('user_prompts' as any)
      .upsert(upsertPayload as any, {
        onConflict: 'user_id,prompt_id',
      });

    if (error) {
      console.error('Error saving user prompts:', error);
      return { success: false, error: error.message };
    }

    await supabase
      .from('user_profiles')
      .update({ updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    return { success: true };
  } catch (error) {
    console.error('Unexpected error saving user prompts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// AI prompt optimisation is not available in this version (Gemini dropped from MVP).
export async function optimizePrompt(
  _question: string,
  _draftAnswer: string
): Promise<{ success: boolean; text?: string; error?: string }> {
  return { success: false, error: 'AI optimisation is not available yet.' };
}
