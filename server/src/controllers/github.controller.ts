import { NextFunction, Request, Response } from 'express';
import { githubService } from '../services/github.service';
import { analyzeProfile } from '../services/analysis.service';
import { aiService } from '../services/ai.service';

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { username } = req.params;
    const profile = await githubService.getUser(username);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

export async function getRepos(req: Request, res: Response, next: NextFunction) {
  try {
    const { username } = req.params;
    const repos = await githubService.getRepos(username);
    res.json(repos);
  } catch (err) {
    next(err);
  }
}

export async function analyze(req: Request, res: Response, next: NextFunction) {
  try {
    const { username } = req.params;
    const [profile, repos] = await Promise.all([
      githubService.getUser(username),
      githubService.getRepos(username),
    ]);

    const analysis = analyzeProfile(profile, repos);
    const insights = await aiService.generateInsights(analysis);

    res.json({ ...analysis, insights });
  } catch (err) {
    next(err);
  }
}
