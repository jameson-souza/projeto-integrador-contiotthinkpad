import { openDatabaseSync, type Database } from 'expo-sqlite';
import { Count } from '@/types';

const db: Database = openDatabaseSync('thinketcad.db');

export const initDB = async () => {
  db.execSync(
    'CREATE TABLE IF NOT EXISTS counts (id INTEGER PRIMARY KEY AUTOINCREMENT, lot TEXT, category TEXT, quantity INTEGER, timestamp TEXT NOT NULL);'
  );
  console.log('Database initialized');
};

export const addCount = async (lot: string, category: string, quantity: number) => {
  const timestamp = new Date().toISOString();
  db.runSync(
    'INSERT INTO counts (lot, category, quantity, timestamp) VALUES (?, ?, ?, ?);',
    lot, category, quantity, timestamp
  );
};

export const getCounts = async (filters: { lot?: string; category?: string; date?: string } = {}): Promise<Count[]> => {
  let query = 'SELECT * FROM counts';
  const params: any[] = [];
  const conditions: string[] = [];

  if (filters.lot) {
    conditions.push('lot LIKE ?');
    params.push(`%${filters.lot}%`);
  }
  if (filters.category) {
    conditions.push('category LIKE ?');
    params.push(`%${filters.category}%`);
  }
  if (filters.date) {
    conditions.push("strftime('%Y-%m-%d', timestamp) = ?");
    params.push(filters.date);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY timestamp DESC';

  const results = db.getAllSync<Count>(query, ...params);
  return results;
};

export const getSummary = async (): Promise<{ totalCounts: number, totalObjects: number }> => {
    const summary = db.getFirstSync<{ totalCounts: number, totalObjects: number }>('SELECT COUNT(id) as totalCounts, SUM(quantity) as totalObjects FROM counts');
    return {
        totalCounts: summary?.totalCounts || 0,
        totalObjects: summary?.totalObjects || 0,
    };
};

export const seedDatabase = async () => {
  const counts = await getCounts();
  if (counts.length > 0) {
    console.log('O banco de dados já contém dados.');
    return;
  }

  console.log('Populando o banco de dados com dados aleatórios...');
  const seedData = [
    { lot: 'LOTE-A', category: 'Parafusos', quantity: 150 },
    { lot: 'LOTE-B', category: 'Porcas', quantity: 300 },
    { lot: 'LOTE-A', category: 'Arruelas', quantity: 500 },
    { lot: 'LOTE-C', category: 'Parafusos', quantity: 80 },
    { lot: 'LOTE-B', category: 'Arruelas', quantity: 1200 },
    { lot: 'LOTE-D', category: 'Pregos', quantity: 250 },
    { lot: 'LOTE-A', category: 'Parafusos', quantity: 45 },
  ];

  for (const data of seedData) {
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();
    db.runSync(
      'INSERT INTO counts (lot, category, quantity, timestamp) VALUES (?, ?, ?, ?);',
      data.lot, data.category, data.quantity, timestamp
    );
  }
  console.log('Banco de dados populado.');
};