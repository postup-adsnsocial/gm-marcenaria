import { supabase } from './supabase';
import { categories as mockCategories } from '../data/mock';

export async function fetchCategories(): Promise<string[]> {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('project_categories')
        .select('name')
        .order('name');

      if (error) {
        // If table doesn't exist, Supabase might return an error.
        // In that case, we fall back to mock categories.
        console.warn('Could not fetch categories from Supabase, using mock data:', error.message);
        return mockCategories;
      }

      if (data && data.length > 0) {
        return data.map(cat => cat.name);
      }
    }
    return mockCategories;
  } catch (error) {
    console.error('Error in fetchCategories:', error);
    return mockCategories;
  }
}

export async function addCategory(name: string): Promise<boolean> {
  try {
    if (supabase) {
      const { error } = await supabase
        .from('project_categories')
        .insert([{ name }]);

      if (error) {
        console.error('Error adding category to Supabase:', error.message);
        return false;
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error in addCategory:', error);
    return false;
  }
}
