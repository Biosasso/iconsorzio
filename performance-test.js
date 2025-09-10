// Test performance database
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testPerformance() {
  console.log('🔍 TEST PERFORMANCE DATABASE')
  console.log('==============================')
  
  try {
    // Test 1: Connessione base
    console.log('1. Test connessione base...')
    const start1 = Date.now()
    const allieviCount = await prisma.allievo.count()
    const time1 = Date.now() - start1
    console.log(`   ✅ Allievi: ${allieviCount} (${time1}ms)`)
    
    // Test 2: Query complessa
    console.log('2. Test query complessa...')
    const start2 = Date.now()
    const servizi = await prisma.allievoServizio.findMany({
      include: {
        AllievoIstruzione: {
          include: {
            allievo: true
          }
        },
        istruttore: {
          include: {
            profile: true
          }
        },
        veicolo: true,
        tariffa: {
          include: {
            tipo: true
          }
        }
      },
      take: 100
    })
    const time2 = Date.now() - start2
    console.log(`   ✅ Servizi con join: ${servizi.length} (${time2}ms)`)
    
    // Test 3: Query dashboard
    console.log('3. Test query dashboard...')
    const start3 = Date.now()
    const thirtyDaysAgo = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000)
    const dashboardData = await prisma.allievoServizio.findMany({
      where: {
        inizioServizio: {
          gte: thirtyDaysAgo // Ultimi 30 giorni (Unix timestamp)
        }
      },
      include: {
        AllievoIstruzione: {
          include: {
            allievo: true
          }
        }
      }
    })
    const time3 = Date.now() - start3
    console.log(`   ✅ Dashboard data: ${dashboardData.length} (${time3}ms)`)
    
    // Test 4: Connessioni multiple
    console.log('4. Test connessioni multiple...')
    const start4 = Date.now()
    const promises = []
    for (let i = 0; i < 10; i++) {
      promises.push(prisma.allievo.count())
    }
    await Promise.all(promises)
    const time4 = Date.now() - start4
    console.log(`   ✅ 10 query parallele: ${time4}ms`)
    
    // Risultati
    console.log('')
    console.log('📊 RISULTATI:')
    console.log(`   Connessione base: ${time1}ms`)
    console.log(`   Query complessa: ${time2}ms`)
    console.log(`   Dashboard: ${time3}ms`)
    console.log(`   Query parallele: ${time4}ms`)
    
    if (time1 > 1000) console.log('   ⚠️  Connessione base LENTA')
    if (time2 > 5000) console.log('   ⚠️  Query complessa MOLTO LENTA')
    if (time3 > 3000) console.log('   ⚠️  Dashboard LENTA')
    if (time4 > 2000) console.log('   ⚠️  Query parallele LENTE')
    
  } catch (error) {
    console.error('❌ Errore:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testPerformance()
