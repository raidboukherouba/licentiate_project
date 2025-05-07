import i18next from "i18next";
import { z } from "zod";

export const functionSchema = z.object({
  func_name: z
    .string()
    .min(3, { message: i18next.t("function.validation.func_name_min") }) // Minimum length validation
    .max(100, { message: i18next.t("function.validation.func_name_max") }) // Maximum length validation
    .nonempty({ message: i18next.t("function.validation.func_name_required") }), // Required field validation
});

export const functionIdSchema = z
  .number()
  .int({ message: i18next.t("function.validation.func_id_integer") }) // Must be an integer
  .positive({ message: i18next.t("function.validation.func_id_positive") }); // Must be a positive number