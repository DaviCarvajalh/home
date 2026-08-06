import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding KyMOS 3.0 database...");

  // ── Roles ──────────────────────────────────────────────────────────────
  const roles = [
    { name: "Administrador", description: "Acceso total al sistema" },
    { name: "Supervisor",    description: "Supervisión de módulos asignados" },
    { name: "Operador",      description: "Operación estándar del sistema" },
    { name: "Auditor",       description: "Acceso de solo lectura para auditoría" },
  ];

  for (const role of roles) {
    await prisma.secRole.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }
  console.log("  ✓ Roles creados");

  // ── Usuario administrador ──────────────────────────────────────────────
  const adminRole = await prisma.secRole.findUnique({ where: { name: "Administrador" } });
  if (!adminRole) throw new Error("Rol Administrador no encontrado");

  const passwordHash = await bcrypt.hash("Admin1234!", 12);

  await prisma.secUser.upsert({
    where: { email: "admin@kymos.cl" },
    update: {},
    create: {
      name:         "Admin",
      lastname:     "KyMOS",
      email:        "admin@kymos.cl",
      passwordHash,
      roleId:       adminRole.id,
      isActive:     true,
    },
  });
  console.log("  ✓ Usuario admin creado: admin@kymos.cl / Admin1234!");

  console.log("✅ Seed completado.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
