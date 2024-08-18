import express, { Router, Request, Response } from "express";
const router: Router = express.Router();
import { pool } from "../../db";

interface CartItem {
    user_id: string;
    product_id: number;
    quantity: number;
    total_price: number;
  }
  
function calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.quantity * item.total_price, 0);
}
  
router.post('/checkout/:cart_id', async (req: Request, res: Response) => {
    try {
      const { cart_id } = req.params;
  
      // Retrieve cart items
      const cartItemsResult = await pool.query('SELECT * FROM shopping_cart WHERE cart_id = $1', [cart_id]);
      const cartItems = cartItemsResult.rows as CartItem[];
  
      // Calculate total amount
      const totalAmount = calculateTotal(cartItems);
  
      // Create a new order
      const newOrderResult = await pool.query('INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING order_id', [cartItems[0].user_id, totalAmount]);
      const newOrderId = newOrderResult.rows[0].order_id;
  
      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: newOrderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.total_price / item.quantity
      }));
      await pool.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES $1', [orderItems]);
  
      // Delete the cart
      await pool.query('DELETE FROM shopping_cart WHERE cart_id = $1', [cart_id]);
  
      res.json({ message: 'Checkout successful' });
      
    } catch (err) {
      console.error(err);
      res.status(500).send('Checkout failed');
    }
});
  
  export default router;