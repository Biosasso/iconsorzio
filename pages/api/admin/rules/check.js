import { prisma } from '@/lib/db'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(500).json('Non permesso!')
    }

    try {
        const companyId = req.body.activeCompany;
        const id = req.body.id;

        // Validazione input
        if (!companyId || !id) {
            return res.status(400).json({ error: 'Parametri mancanti' });
        }

        const rulesListArray = await prisma.usersCompanies.findFirst({
            where: {
                companyId: companyId.isActive,
                userId: id
            },
            select: {
                rulesGroup: {
                    select: {
                        companyRulesGroup: {
                            select: {
                                rule: {
                                    select: {
                                        accessCode: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Controllo se il risultato esiste
        if (!rulesListArray || !rulesListArray.rulesGroup) {
            return res.status(404).json({ error: 'Regole non trovate' });
        }

        res.json({ rulesListArray: rulesListArray.rulesGroup.companyRulesGroup });

    } catch (error) {
        console.error('Database error in /api/admin/rules/check:', error);
        
        // Gestione specifica per errori di connessione
        if (error.code === 'P2037') {
            console.error('Troppe connessioni al database');
            return res.status(503).json({ error: 'Database temporaneamente sovraccarico' });
        }
        
        // Per altri errori di database
        if (error.code && error.code.startsWith('P')) {
            console.error('Errore Prisma:', error.code);
            return res.status(500).json({ error: 'Errore database' });
        }
        
        // Per errori generici
        return res.status(500).json({ error: 'Errore interno del server' });
    }
}
