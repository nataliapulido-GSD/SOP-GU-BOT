import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm'; // 👈 Importa 'eq'
import * as schema from '../src/db/schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
    console.log('🔄 Actualizando URL...');

    const REAL_URL = 'https://nataliagarciapulido.app.n8n.cloud/webhook/18711183-c39f-4d3c-9197-ccf3c07472e8/chat';

    await db.update(schema.organizations)
        .set({ apiUrl: REAL_URL })
        .where(eq(schema.organizations.name, 'Organization 2')); // 👈 Usa eq(columna, valor)

    console.log('✅ URL actualizada exitosamente a:', REAL_URL);
}

main().catch(console.error);