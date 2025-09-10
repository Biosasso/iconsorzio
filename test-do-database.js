// Test database Digital Ocean
const { PrismaClient } = require('@prisma/client')

// Configurazione per database Digital Ocean
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['query', 'info', 'warn', 'error']
})

async function testDigitalOceanDatabase() {
  try {
    console.log('🔄 Testando database Digital Ocean...')
    console.log('📍 Host:', process.env.DATABASE_URL?.split('@')[1]?.split('/')[0])
    
    // Test connessione base
    const allieviCount = await prisma.allievo.count()
    console.log(`✅ Allievi nel database: ${allieviCount}`)
    
    // Test connessione servizi
    const serviziCount = await prisma.allievoServizio.count()
    console.log(`✅ Servizi nel database: ${serviziCount}`)
    
    // Test connessione utenti
    const utentiCount = await prisma.user.count()
    console.log(`✅ Utenti nel database: ${utentiCount}`)
    
    // Test connessione aziende
    const aziendeCount = await prisma.company.count()
    console.log(`✅ Aziende nel database: ${aziendeCount}`)
    
    // Test query complessa
    const serviziConValutazioni = await prisma.allievoServizio.findMany({
      where: {
        esito: {
          contains: 'valutazioni'
        }
      },
      take: 5
    })
    console.log(`✅ Servizi con valutazioni: ${serviziConValutazioni.length}`)
    
    console.log('🎉 Database Digital Ocean connesso e funzionante!')
    
  } catch (error) {
    console.error('❌ Errore connessione database Digital Ocean:', error.message)
    console.error('Stack:', error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

testDigitalOceanDatabase()
