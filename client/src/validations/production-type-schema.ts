import i18next from "i18next";
import { z } from "zod";

// Zod schema for production type
export const productionTypeSchema = z.object({
  type_name: z
    .string()
    .min(3, { message: i18next.t("productionType.validation.type_name_min") }) // Minimum length validation
    .max(100, { message: i18next.t("productionType.validation.type_name_max") }) // Maximum length validation
    .nonempty({ message: i18next.t("productionType.validation.type_name_required") }), // Required field validation
}).strict(); // Ensures no unknown fields are allowed

// Zod schema for production type ID
export const productionTypeIdSchema = z.number().int().positive({
  message: i18next.t("productionType.validation.type_id_positive"),
});