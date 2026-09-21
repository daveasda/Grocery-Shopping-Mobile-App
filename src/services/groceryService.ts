import { authService } from './authService';

const supabaseClient = authService.supabaseClient;

export const groceryService = {

  async getItems(userId: string) {

    const { data, error } = await supabaseClient
      .from('grocery_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(
        '[Grocery] Get items error:',
        error
      );

      return {
        data: null,
        error,
      };
    }

    return {
      data,
      error: null,
    };
  },


  async addItem(userId: string,  name: string, quantity: number)
    {

        const { data, error } = await supabaseClient
            .from('grocery_items')
            .insert({
            user_id: userId,
            name: name,
            quantity: quantity,
            is_bought: false,
            })
            .select()
            .single();

        if (error) {
            console.error(
            '[Grocery] Add item error:',
            error
            );

            return {
            data: null,
            error,
            };
        }

        return {
            data,
            error: null,
        };
    },

    async updateItem(itemId: number,isBought: boolean) 
    {

        const { data, error } = await supabaseClient
            .from('grocery_items')
            .update({
            is_bought: isBought,
            })
            .eq('id', itemId)
            .select()
            .single();

        if (error) {
            console.error(
            '[Grocery] Update item error:',
            error
            );

            return {
            data: null,
            error,
            };
        }

        return {
            data,
            error: null,
        };
    },

    async deleteItem(itemId: number) {

        const { error } = await supabaseClient
            .from('grocery_items')
            .delete()
            .eq('id', itemId);

        if (error) {
            console.error(
            '[Grocery] Delete item error:',
            error
            );

            return {
            error,
            };
        }

        return {
            error: null,
        };
    },

};