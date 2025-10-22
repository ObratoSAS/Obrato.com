import { z } from 'zod';

export const pluginManifestSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  version: z.string().regex(/\d+\.\d+\.\d+/),
  type: z.enum(['auth', 'activity', 'report', 'theme']),
  description: z.string().optional(),
  settings: z.record(z.any()).optional()
});

export type PluginManifest = z.infer<typeof pluginManifestSchema>;

export interface PluginContext {
  log: (message: string, metadata?: Record<string, unknown>) => void;
  emit: (event: string, payload: Record<string, unknown>) => Promise<void>;
}

export interface PluginLifecycle {
  onLoad?(context: PluginContext): Promise<void> | void;
  onUnload?(context: PluginContext): Promise<void> | void;
}

export function definePlugin(manifest: PluginManifest, lifecycle: PluginLifecycle) {
  return { manifest, lifecycle };
}
