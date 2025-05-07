import i18next from "i18next";
import { z } from "zod";

// Zod schema for review speciality
export const reviewSpecialitySchema = z.object({
  spec_name_review: z
    .string()
    .min(3, { message: i18next.t("reviewSpeciality.validation.spec_name_review_min") })
    .max(100, { message: i18next.t("reviewSpeciality.validation.spec_name_review_max") })
    .nonempty(i18next.t("reviewSpeciality.validation.spec_name_review_required")),
});

// Zod schema for review speciality ID
export const reviewSpecialityIdSchema = z
  .number()
  .int({ message: i18next.t("reviewSpeciality.validation.spec_id_review_integer") })
  .positive({ message: i18next.t("reviewSpeciality.validation.spec_id_review_positive") });