import { prisma } from './lib/db';
import { revalidatePath } from 'next/cache';

export default async function PrismaPage() {

  // 1. READ: Get users from DB
  const users = await prisma.user.findMany();

  // 2. CREATE: Server Action
  async function addUser(formData) {
    'use server';

    await prisma.user.create({
      data: {
        email: formData.get('email'),
        name: formData.get('name'),
      },
    });

    revalidatePath('/'); // Refresh list
  }

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>Prisma</h1>

      {/* Form */}
      <form action={addUser} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc' }}>
        <h3>Add User</h3>
        <input name="email" placeholder="Email" required style={{ marginRight: '10px', padding: '5px' }} />
        <input name="name" placeholder="Name" style={{ marginRight: '10px', padding: '5px' }} />
        <button type="submit" style={{ background: 'black', color: 'white', padding: '5px 15px' }}>
          Save
        </button>
      </form>

      {/* List */}
      <h3>Database Users:</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}