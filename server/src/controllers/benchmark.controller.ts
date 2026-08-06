import { Request, Response } from 'express';
import { benchmarkingService } from '../services/benchmarking.service';

export const getBenchmarkForProfile = async (req: Request, res: Response) => {
  try {
    const { profileId } = req.params;
    const benchmark = await benchmarkingService.getBenchmarkForProfile(profileId);
    res.json(benchmark);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const updateGlobalBenchmarks = async (req: Request, res: Response) => {
  try {
    await benchmarkingService.updateGlobalBenchmarks();
    res.json({ message: 'Global benchmarks updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllBenchmarks = async (req: Request, res: Response) => {
  try {
    const benchmarks = await benchmarkingService.getAllBenchmarks();
    res.json(benchmarks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllArchetypes = async (req: Request, res: Response) => {
  try {
    const archetypes = await benchmarkingService.getAllArchetypes();
    res.json(archetypes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
