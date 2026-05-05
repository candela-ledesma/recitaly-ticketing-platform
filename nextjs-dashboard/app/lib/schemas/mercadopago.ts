// lib/schemas/mercadopago.ts
import { z } from "zod";

export const checkoutSchema = z.object({
    title: z.string().min(1),
    unit_price: z.number().positive(),
    quantity: z.number().int().positive().default(1),
});
