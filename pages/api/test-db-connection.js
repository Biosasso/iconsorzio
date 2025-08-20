export default async function handler(req, res) {
  try {
    // Test semplice: verifica se le variabili d'ambiente sono presenti
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    const hasSecret = !!process.env.SECRET;
    const hasNextAuthUrl = !!process.env.NEXTAUTH_URL;
    
    res.status(200).json({ 
      success: true, 
      message: "Test connessione database",
      environment: {
        hasDatabaseUrl,
        hasSecret,
        hasNextAuthUrl,
        nodeEnv: process.env.NODE_ENV,
        vercelUrl: process.env.VERCEL_URL
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Errore test:", error);
    
    res.status(500).json({ 
      success: false, 
      message: "Errore test",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
