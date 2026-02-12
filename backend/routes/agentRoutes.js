import express from 'express';
import { Planner } from '../agents/Planner.js';
import { Generator } from '../agents/Generator.js';
import { Explainer } from '../agents/Explainer.js';
import { VersionStore } from '../store/VersionStore.js';

const router = express.Router();
const planner = new Planner();
const generator = new Generator();
const explainer = new Explainer();

// POST /api/agent/generate
router.post('/generate', async (req, res) => {
  try {
    const { intent, parentId } = req.body;

    if (!intent) {
      return res.status(400).json({ error: 'Intent is required' });
    }

    console.log('🎯 AI Generating UI:', intent);

    // 🔥 USE AI PLANNER
    const plan = await planner.plan(intent);
    const code = generator.generate(plan);
    const explanation = await explainer.explain(
      intent,
      plan,
      null,
      [],
      false
    );

    const version = VersionStore.createVersion({
      intent,
      plan,
      code,
      explanation,
      parentId
    });

    res.json({ success: true, version });

  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/agent/modify
router.post('/modify', async (req, res) => {
  try {
    const { intent, versionId } = req.body;

    if (!intent) {
      return res.status(400).json({ error: 'Intent is required' });
    }

    if (!versionId) {
      return res.status(400).json({ error: 'versionId is required' });
    }

    const previousVersion = VersionStore.getVersion(versionId);

    if (!previousVersion) {
      return res.status(404).json({
        error: `Version ${versionId} not found`,
        message: 'Generate a UI first'
      });
    }

    console.log('🔄 AI Modifying Version:', versionId);
    console.log('🔄 Intent:', intent);

    // 🔥 AI PLAN WITH CONTEXT
    const plan = await planner.plan(intent, previousVersion.plan);
    const code = generator.modify(plan, previousVersion.code);

    const explanation = await explainer.explain(
      intent,
      plan,
      previousVersion.code,
      [],
      true
    );

    const version = VersionStore.createVersion({
      intent,
      plan,
      code,
      explanation,
      parentId: versionId
    });

    res.json({ success: true, version });

  } catch (error) {
    console.error('Modify error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
