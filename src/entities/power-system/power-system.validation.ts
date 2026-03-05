import { z } from "zod";
import { createPaginatedQuerySchema } from "@/common/validation.utils";
import { sortablePowerSystemFields } from "@/entities/power-system/power-system.constants";

export const createPowerSystemSchema = z.object({
    name: z.string().min(1),
    rootOfPowerId: z.string().uuid(),
    description: z.string().nullable().optional(),
});

export const updatePowerSystemSchema = createPowerSystemSchema
    .partial()
    .omit({ rootOfPowerId: true });

export const powerSystemQuerySchema = createPaginatedQuerySchema(
    sortablePowerSystemFields,
    "updatedAt",
    {
        name: z.string().optional(),
        rootOfPowerId: z.string().uuid().optional(),
    },
);
