// /lib/inventory.ts
import { query } from './db';

interface Inventory {
  id: number;
  name: string;
  amount: number;
  unit: string;
  reorder: boolean;
}

// fetch all inventory items
export async function getAllInventory(): Promise<Inventory[]> {
  return query<Inventory>('SELECT * FROM inventory');
}

// fetch a single inventory item by ID
export async function getInventoryById(id: number): Promise<Inventory | null> {
  const [item] = await query<Inventory>(
    'SELECT * FROM inventory WHERE id = $1',
    [id]
  );
  return item || null;
}

// add a new inventory item
export async function addInventory(
  name: string,
  amount: number,
  unit: string,
  reorder: boolean
): Promise<Inventory> {
  const [item] = await query<Inventory>(
    'INSERT INTO inventory (name, amount, unit, reorder) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, amount, unit, reorder]
  );
  return item;
}

// update an existing inventory item by ID
export async function updateInventory(
  id: number,
  name: string,
  amount: number,
  unit: string,
  reorder: boolean
): Promise<Inventory> {
  const [item] = await query<Inventory>(
    'UPDATE inventory SET name = $1, amount = $2, unit = $3, reorder = $4 WHERE id = $5 RETURNING *',
    [name, amount, unit, reorder, id]
  );
  return item;
}

// delete an inventory item by ID
export async function deleteInventory(id: number): Promise<void> {
  await query('DELETE FROM inventory WHERE id = $1', [id]);
}