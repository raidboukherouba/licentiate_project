import i18next from "i18next";
import { z } from "zod";

// Validation schema for publisher
export const publisherSchema = z.object({
  publisher_name: z
    .string()
    .trim()
    .max(50, { message: i18next.t("publisher.validation.publisher_name_max") })
    .nonempty(i18next.t("publisher.validation.publisher_name_required")),
  country: z
    .string()
    .trim()
    .max(50, { message: i18next.t("publisher.validation.country_max") })
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)), // Transform empty string to null
}).strict({ message: i18next.t("error.AttributeNotAllowed") });

// Validation schema for publisher ID
export const publisherIdSchema = z.number().int().positive();