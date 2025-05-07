import i18next from "i18next";
import { z } from "zod";

// Zod validation schema for category
export const categorySchema = z.object({
  cat_name: z
    .string()
    .min(3, { message: i18next.t("category.validation.cat_name_min") }) // Minimum length validation
    .max(100, { message: i18next.t("category.validation.cat_name_max") }) // Maximum length validation
    .nonempty(i18next.t("category.validation.cat_name_required")), // Required field validation
});

// Zod validation schema for category ID
export const categoryIdSchema = z.number().int().positive({
  message: i18next.t("category.validation.cat_id_positive"),
});