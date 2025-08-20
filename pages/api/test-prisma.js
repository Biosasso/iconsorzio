import { prisma } from "../../lib/db.ts";

export default async function handler(req, res) {
  try {
    // Test semplice: conta gli utenti nel database
    const userCount = await prisma.user.count();
    
    res.status(200).json({ 
      success: true, 
      message: "Prisma funziona correttamente!",
      userCount: userCount,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Errore Prisma:", error);
    
    res.status(500).json({ 
      success: false, 
      message: "Errore Prisma",
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
}
