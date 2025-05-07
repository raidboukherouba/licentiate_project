import { z } from "zod";
import i18next from "i18next";

export const publicationSchema = z
  .object({
    doi: z
      .string()
      .min(10, { message: i18next.t("publication.validation.doi_min") }) // Adjusted minimum length if needed
      .max(50, { message: i18next.t("publication.validation.doi_max") })
      .regex(/^(https:\/\/doi\.org\/)?10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+$/, {
        message: i18next.t("publication.validation.doi_invalid"),
      }),

    article_title: z
      .string()
      .trim()
      .max(200, { message: i18next.t("publication.validation.article_title_max") })
      .nonempty(i18next.t("publication.validation.article_title_required")),

      submission_date: z
      .string({
        required_error: i18next.t("publication.validation.submission_date_required")
      })
      .datetime({ message: i18next.t("publication.validation.submission_date_future") }),
    
    acceptance_date: z
      .string({
        required_error: i18next.t("publication.validation.acceptance_date_required")
      })
      .datetime({ message: i18next.t("publication.validation.acceptance_date_invalid") }),

    pub_pages: z
      .string()
      .trim()
      .max(10, { message: i18next.t("publication.validation.pub_pages_max") })
      .optional()
      .nullable()
      .transform((val) => (val ? val.trim() : null)),

    review_num: z
      .number()
      .int()
      .positive({ message: i18next.t("publication.validation.review_num_positive") }),

    type_id: z
      .number()
      .int()
      .positive({ message: i18next.t("publication.validation.type_id_positive") }),
  })
  .strict({ message: i18next.t("error.AttributeNotAllowed") }) // ✅ Apply `.strict()` here
  .refine((data) => data.acceptance_date >= data.submission_date, {
    message: i18next.t("publication.validation.acceptance_date_before_submission"),
    path: ["acceptance_date"],
  });

export const doiSchema = z
  .string()
  .trim()
  .max(50, { message: i18next.t("publication.validation.doi_max") })
  .nonempty(i18next.t("publication.validation.doi_required"));
