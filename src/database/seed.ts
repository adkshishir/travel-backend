import dataSource from './data-source';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-role.enum';

async function main() {
  await dataSource.initialize();
  const userRepo = dataSource.getRepository(User);
  const adminEmail = process.env.ADMIN_EMAIL || 'adhikarishishir50@gmail.com';
  const exists = await userRepo.findOne({ where: { email: adminEmail } });
  if (!exists) {
    await userRepo.save(
      userRepo.create({
        email: adminEmail,
        role: UserRole.ADMIN,
      }),
    );
    console.log(`Admin user created: ${adminEmail}`);
  } else {
    console.log(`Admin already exists: ${adminEmail}`);
  }
  await dataSource.destroy();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
