import { z } from "zod";
import i18next from "i18next";

export const reviewSchema = z.object({
  review_title: z
    .string()
    .trim()
    .max(200, { message: i18next.t("review.validation.review_title_max") })
    .nonempty(i18next.t("review.validation.review_title_required")),
  issn: z
    .string()
    .trim()
    .length(9, { message: i18next.t("review.validation.issn_length") })
    .regex(/^\d{4}-\d{3}[\dX]$/, { 
      message: i18next.t("review.validation.issn_pattern") 
    }),
    e_issn: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform(val => val === "" ? null : val)
    .refine(val => !val || /^\d{4}-\d{3}[\dX]$/.test(val), {
      message: i18next.t("review.validation.e_issn_pattern"),
  }),

  review_vol: z
    .string()
    .trim()
    .max(20, { message: i18next.t("review.validation.review_vol_max") })
    .optional()
    .nullable()
    .transform(val => val === "" ? null : val),
  publisher_id: z
    .number()
    .int()
    .positive({ message: i18next.t("review.validation.publisher_id_positive") })
}).strict({ message: i18next.t("error.AttributeNotAllowed") });

export const reviewIdSchema = z.number().int().positive();