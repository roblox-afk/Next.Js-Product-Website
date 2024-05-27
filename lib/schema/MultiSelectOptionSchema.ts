import { z } from 'zod';
export const MultiSelectOptionSchema = z.object({
    label: z.string(),
    value: z.string(),
    disable: z.boolean().optional(),
})