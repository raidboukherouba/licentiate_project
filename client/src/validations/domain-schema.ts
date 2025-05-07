import i18next from "i18next";
import { z } from "zod";

export const domainSchema = z.object({
  domain_name: z
    .string()
    .trim()
    .max(200, { message: i18next.t("domain.validation.domain_name_max") })
    .nonempty(i18next.t("domain.validation.domain_name_required")),
  domain_abbr: z
    .string()
    .trim()
    .max(20, { message: i18next.t("domain.validation.domain_abbr_max") })
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),
}).strict({ message: i18next.t("error.AttributeNotAllowed") });

export const domainIdSchema = z.number().int().positive();


