import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from '../src/db/schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
    console.log('🔄 Actualizando nombres de las organizaciones...');

    // 1. Cambiar el nombre de 'Organization 2' a 'APT'
    await db.update(schema.organizations)
        .set({ name: 'APT' })
        .where(eq(schema.organizations.name, 'Organization 2'));

    console.log('✅ "Organization 2" ha sido renombrada a "APT"');

    // 2. Cambiar el nombre de 'Default Org' a 'Georgia Urology'
    await db.update(schema.organizations)
        .set({ name: 'Georgia Urology' })
        .where(eq(schema.organizations.name, 'Default Org'));

    console.log('✅ "Default Org" ha sido renombrada a "Georgia Urology"');

    console.log('🎉 Proceso completado exitosamente.');
}

main().catch(console.error);