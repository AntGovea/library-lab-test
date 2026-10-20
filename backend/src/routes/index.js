export class Routes {
  static configure(app) {
    // Verifica que Express esté respondiendo.
    app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'ok',
        message: 'API funcionando',
      });
    });
    
    // ready: comprueba que PostgreSQL responde.
    app.get('/ready', async (req, res, next) => {
      try {
        await pool.query('SELECT 1');

        res.status(200).json({
          status: 'ready',
          database: 'connected',
        });
      } catch (error) {
        res.status(503).json({
          status: 'not_ready',
          database: 'unavailable',
        });
      }
    });
    // Más adelante:
    // app.use('/api/books', booksRouter);


    
  }
}