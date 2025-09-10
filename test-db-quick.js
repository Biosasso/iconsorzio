// Test rapido database
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testDb() {
  try {
    const count = await prisma.allievo.count()
    console.log('✅ Database connesso - Allievi:', count)
  } catch (err) {
    console.error('❌ Errore DB:', err.message)
  } finally {
    await prisma.$disconnect()
  }
}

testDb()
