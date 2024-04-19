import { Role, User } from '@/entities/user.entiry.js';
import bcryptService from '@/services/bcrypt.service.js';
import { myDataSource } from '@/utils/app-data-source.js';

await myDataSource.initialize();

const role = ['super-admin', 'admin', 'user'];

let roles: Role[] = [];

//add roles to role table
const roleRepository = myDataSource.getRepository(Role);

for (let i = 0; i < role.length; i++) {
  const newRole = roleRepository.create();
  newRole.name = role[i];
  await newRole.save();
  roles.push(newRole);
}

//add dummy admin user
const userRepo = myDataSource.getRepository(User);
const superAdmin = userRepo.create({
  password: await bcryptService.encryptPassword('Password@123'),
  name: 'Admin',
  phoneNumber: '1234567890',
  email:"admin@gmail.com",
  role: roles,
  isVerified: true,
});
await superAdmin.save();
