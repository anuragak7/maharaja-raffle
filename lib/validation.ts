import { z } from 'zod';

// Zod versions differ in the way required errors are specified. Use a
// compatible pattern (.nonempty / .min) to avoid TypeScript signature issues.
export const nameSchema = z
  .string()
  .nonempty('Required')
  .min(2, 'Too short')
  .max(50, 'Too long')
  .transform((s) => s.trim());

export const phoneSchema = z
  .string()
  .nonempty('Required')
  .min(7, 'Invalid phone number')
  .max(32, 'Invalid phone number');
export const entrySchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  location: z.enum(["Hicksville", "Bellerose"]),
  marketingOptIn: z.boolean().optional().default(false),
  // captcha removed
});

export type EntryInput = z.infer<typeof entrySchema>;