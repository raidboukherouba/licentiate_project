import i18next from "i18next";
import { z } from "zod";

export const specialitySchema = z.object({
  spec_name: z
    .string()
    .min(3, { message: i18next.t("speciality.validation.spec_name_min") }) // Minimum length validation
    .max(100, { message: i18next.t("speciality.validation.spec_name_max") }) // Maximum length validation
    .nonempty({ message: i18next.t("speciality.validation.spec_name_required") }), // Required field validation
});

export const specialityIdSchema = z.number().int().positive({
  message: i18next.t("speciality.validation.spec_id_positive"),
});