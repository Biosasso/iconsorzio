// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '../../lib/db.ts'
import { hashPassword } from '../../lib/auth';

export default async function insertUserAPI(req, res) {

  const password = 'Polacchino123!'
  const hashedPassword = await hashPassword(password);

  const insertAccount = await prisma.user.create({
    data: {
      name: 'Patrick Sturlini',
      email: 'biosasso@gmail.com',
      emailVerified: new Date(),
      password: hashedPassword,
      image: ''
    }
  })

  res.status(200).json({ name: 'Utente Inserito' })
}
