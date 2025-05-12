import { z } from 'zod';

export const bridgeFile = z.object({
  name: z.string(),
  content: z.string(),
  createdAt: z.string().transform((s) => new Date(s)),
});

export type BridgeFile = z.infer<typeof bridgeFile>;
