import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../infra/prisma';

async function main() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_NAME?.trim() || !ADMIN_EMAIL || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ADMIN_EMAIL)
      || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12 || Buffer.byteLength(ADMIN_PASSWORD) > 72) {
    throw new Error('Defina ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD (12 a 72 bytes) no ambiente local.');
  }
  if (await prisma.admin.findFirst({ where: { role: 'adm' } })) {
    throw new Error('Já existe administrador. Nenhuma conta foi alterada.');
  }
  await prisma.admin.create({ data: {
    nome: ADMIN_NAME.trim(), email: ADMIN_EMAIL.trim().toLowerCase(),
    senha: await bcrypt.hash(ADMIN_PASSWORD, 12), role: 'adm', status: 'ativo',
  } });
  console.log('Administrador inicial criado.');
}

main().catch(error => { console.error(error.message); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
