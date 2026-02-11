import express from 'express';
import { VersionStore } from '../store/VersionStore.js';

const router = express.Router();

// GET /api/versions
router.get('/', (req, res) => {
  try {
    const versions = VersionStore.getAllVersions();
    res.json({ versions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/versions/:id
router.get('/:id', (req, res) => {
  try {
    const version = VersionStore.getVersion(req.params.id);
    if (!version) {
      return res.status(404).json({ error: 'Version not found' });
    }
    res.json({ version });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/versions/:id/rollback
router.post('/:id/rollback', (req, res) => {
  try {
    const version = VersionStore.getVersion(req.params.id);
    if (!version) {
      return res.status(404).json({ error: 'Version not found' });
    }
    res.json({ success: true, version });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/versions/clear
router.delete('/clear', (req, res) => {
  try {
    VersionStore.clear();
    res.json({ success: true, message: 'All versions cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;