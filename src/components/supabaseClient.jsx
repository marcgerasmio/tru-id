import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qcyxdokiqavqyohmyqeq.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjeXhkb2tpcWF2cXlvaG15cWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5MTg1ODYsImV4cCI6MjA0NDQ5NDU4Nn0.tcPj0r_-ZHQv-G8F5c2bp2dm8fMo7jf0PxpMCzdv8x8';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
