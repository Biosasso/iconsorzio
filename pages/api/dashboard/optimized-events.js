// API ottimizzata per eventi dashboard
import { prisma } from '@/lib/db'
import { getSession } from 'next-auth/react'
import { getCachedData, setCachedData } from '@/lib/cache'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Cache key basata su utente e data
    const cacheKey = `dashboard-events-${session.user.id}-${new Date().toDateString()}`
    
    // Controlla cache
    const cachedData = getCachedData(cacheKey)
    if (cachedData) {
      return res.json(cachedData)
    }

    // Ottieni company attiva
    const activeCompany = await prisma.activeCompany.findFirst({
      where: { userId: session.user.id },
      select: { isActive: true }
    })

    if (!activeCompany) {
      return res.status(400).json({ error: 'No active company' })
    }

    // Query ottimizzata - solo campi necessari
    const events = await prisma.allievoServizio.findMany({
      where: {
        companyId: activeCompany.isActive,
        inizioServizio: {
          gte: Math.floor((Date.now() - 90 * 24 * 60 * 60 * 1000) / 1000) // Ultimi 90 giorni
        }
      },
      select: {
        id: true,
        inizioServizio: true,
        fineServizio: true,
        esito: true,
        AllievoIstruzione: {
          select: {
            allievo: {
              select: {
                nome: true,
                cognome: true
              }
            }
          }
        },
        tariffa: {
          select: {
            tipo: {
              select: {
                tipo: true
              }
            }
          }
        }
      },
      orderBy: {
        inizioServizio: 'asc'
      }
    })

    // Salva in cache
    setCachedData(cacheKey, events)

    res.json(events)

  } catch (error) {
    console.error('Dashboard events error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
