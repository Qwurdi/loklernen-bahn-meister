
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aaksuooblyaogujnnxhe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFha3N1b29ibHlhb2d1am5ueGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgzNTY1NzksImV4cCI6MjAyMzkzMjU3OX0.viBtoHOHM5FHt9BO4C8ahpkS9tgwchVJnPTshc0TSWo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
