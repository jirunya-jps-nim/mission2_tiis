const express = require('express');
const cors = require('cors');
require('dotenv').config();

const learnersRouter = require('./routes/learners');
const followupsRouter = require('./routes/followups');
const statsRouter = require('./routes/stats');
const { checkSupabaseHealth } = require('./supabaseClient');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString('th-TH')}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/learners', learnersRouter);
app.use('/api/followups', followupsRouter);
app.use('/api/stats', statsRouter);

// Run Automated Tests endpoint
const { runAllTests } = require('./tests/testCases');
app.post('/api/run-tests', async (req, res) => {
  try {
    const results = await runAllTests();
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  const supabaseActive = await checkSupabaseHealth();
  res.json({
    status: 'online',
    system: 'FollowUp Radar API',
    mission: 'TIIS Mission 2',
    timestamp: new Date().toISOString(),
    supabase_configured: true,
    supabase_connected: supabaseActive
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` FollowUp Radar API running at: http://localhost:${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log(` Supabase URL: ${process.env.SUPABASE_URL || 'https://cwglopfaevserbrmcgpw.supabase.co'}`);
  console.log(`=======================================================`);
});
