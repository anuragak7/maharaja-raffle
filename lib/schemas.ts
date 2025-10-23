import { z } from 'zod';

export const nameSchema = z.string().nonempty('Required').min(2, 'Too short').max(50, 'Too long').transform((s) => s.trim());
export const phoneSchema = z.string().nonempty('Required').min(7).max(32);
export const entrySchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  marketingOptIn: z.boolean().optional().default(false)
});

export type EntryInput = z.infer<typeof entrySchema>;