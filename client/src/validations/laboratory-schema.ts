import { z } from "zod";
import i18next from "i18next";

export const laboratorySchema = z.object({
  lab_name: z
    .string()
    .trim()
    .max(250, { message: i18next.t("laboratory.validation.lab_name_max") })
    .nonempty(i18next.t("laboratory.validation.lab_name_required")),
  lab_abbr: z
    .string()
    .trim()
    .max(20, { message: i18next.t("laboratory.validation.lab_abbr_max") })
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),
  lab_desc: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),
  lab_address: z
    .string()
    .trim()
    .max(250, { message: i18next.t("laboratory.validation.lab_address_max") })
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),
  lab_phone: z
    .string()
    .trim()
    .regex(/^0\d{8}$/, { message: i18next.t("laboratory.validation.lab_phone_pattern") })
    .optional()
    .nullable()
    .or(z.literal("")) // Allow empty string explicitly
    .transform((val) => (val === "" ? null : val)),
  faculty_id: z
    .number()
    .int()
    .positive({ message: i18next.t("laboratory.validation.faculty_id_positive") })
    .nonnegative(i18next.t("laboratory.validation.faculty_id_required")),
  domain_id: z
    .number()
    .int()
    .positive({ message: i18next.t("laboratory.validation.domain_id_positive") })
    .nonnegative(i18next.t("laboratory.validation.domain_id_required")),
  dept_id: z
    .number()
    .int()
    .positive({ message: i18next.t("laboratory.validation.dept_id_positive") })
    .nonnegative(i18next.t("laboratory.validation.dept_id_required")),
}).strict({ message: i18next.t("error.AttributeNotAllowed") });

export const laboratoryIdSchema = z.number().int().positive();