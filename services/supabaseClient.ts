
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://itckcfjwxcnmfbqfcnup.supabase.co';
// This key is a public anonymous key. It's safe to be used in a browser environment.
// You can find your key in the "API" section of your Supabase project settings.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0Y2tjZmp3eGNubWZicWZjbnVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTE3MzEsImV4cCI6MjA4MjE2NzczMX0.yEcklb2BmYLSTYZuZEurLBSXq2LfY7G3p0e9J-zZdDk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
