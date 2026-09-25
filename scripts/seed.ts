import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
    console.log('🌱 Iniciando seed...');

    const [org] = await db.insert(schema.organizations).values({
        name: 'Organization 2',
        apiUrl: 'https://api.default-org.com/chat',
    }).returning();

    console.log('✅ Organización creada:', org.name);

    const passwordHash = await bcrypt.hash('admin123', 10);
    const [user] = await db.insert(schema.users).values({
        name: 'Admin User',
        email: 'admin_organization2@sopgubot.com',
        passwordHash,
        organizationId: org.id,
        role: 'admin',
    }).returning();

    console.log('✅ Usuario creado:', user.email);
    console.log('🔑 Contraseña:', 'admin123');
    console.log('🌱 Seed completado.');
}

main().catch(console.error);