import { z } from "zod";
import i18next from "i18next";

export const researcherSchema = z.object({
  res_fname: z
    .string()
    .trim()
    .max(50, { message: i18next.t("researcher.validation.res_fname_max") })
    .nonempty(i18next.t("researcher.validation.res_fname_required")),
  res_lname: z
    .string()
    .trim()
    .max(50, { message: i18next.t("researcher.validation.res_lname_max") })
    .nonempty(i18next.t("researcher.validation.res_lname_required")),
  res_fname_ar: z
    .string()
    .trim()
    .max(50, { message: i18next.t("researcher.validation.res_fname_ar_max") })
    .nonempty(i18next.t("researcher.validation.res_fname_ar_required")),
  res_lname_ar: z
    .string()
    .trim()
    .max(50, { message: i18next.t("researcher.validation.res_lname_ar_max") })
    .nonempty(i18next.t("researcher.validation.res_lname_ar_required")),
  res_gender: z
    .enum(["Male", "Female"], { 
      errorMap: () => ({ message: i18next.t("researcher.validation.res_gender_invalid") })
    }),
  res_attach_struc: z
    .string()
    .trim()
    .max(100, { message: i18next.t("researcher.validation.res_attach_struc_max") })
    .optional()
    .nullable()
    .transform(val => val === "" ? null : val),
  res_birth_date: z
    .union([z.string().datetime(), z.null()])
    .optional()
    .nullable(),
  res_phone: z
    .string()
    .trim()
    .regex(/^(07|06|05)\d{8}$/, { 
      message: i18next.t("researcher.validation.res_phone_pattern") 
    })
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(val => val === "" ? null : val),
  res_address: z
    .string()
    .trim()
    .max(250, { message: i18next.t("researcher.validation.res_address_max") })
    .optional()
    .nullable()
    .transform(val => val === "" ? null : val),
  res_grade: z
    .string()
    .trim()
    .max(50, { message: i18next.t("researcher.validation.res_grade_max") })
    .optional()
    .nullable()
    .transform(val => val === "" ? null : val),
  res_diploma: z
    .string()
    .trim()
    .max(50, { message: i18next.t("researcher.validation.res_diploma_max") })
    .optional()
    .nullable()
    .transform(val => val === "" ? null : val),
  res_prof_email: z
    .string()
    .email({ message: i18next.t("researcher.validation.res_prof_email_invalid") })
    .max(100, { message: i18next.t("researcher.validation.res_prof_email_max") })
    .nonempty(i18next.t("researcher.validation.res_prof_email_required")),
  res_pers_email: z
    .string()
    .email({ message: i18next.t("researcher.validation.res_pers_email_invalid") })
    .max(100, { message: i18next.t("researcher.validation.res_pers_email_max") })
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(val => val === "" ? null : val),
  res_gs_link: z
    .string()
    .url({ message: i18next.t("researcher.validation.res_gs_link_invalid") })
    .max(250, { message: i18next.t("researcher.validation.res_gs_link_max") })
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(val => val === "" ? null : val),
  res_rg_link: z
    .string()
    .url({ message: i18next.t("researcher.validation.res_rg_link_invalid") })
    .max(250, { message: i18next.t("researcher.validation.res_rg_link_max") })
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(val => val === "" ? null : val),
  res_page_link: z
    .string()
    .url({ message: i18next.t("researcher.validation.res_page_link_invalid") })
    .max(250, { message: i18next.t("researcher.validation.res_page_link_max") })
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(val => val === "" ? null : val),
  res_orcid: z
    .string()
    .url({ message: i18next.t("researcher.validation.res_orcid_invalid") })
    .regex(/^https:\/\/orcid\.org\/\d{4}-\d{4}-\d{4}-\d{4}$/, {
      message: i18next.t("researcher.validation.res_orcid_pattern")
    })
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(val => val === "" ? null : val),
  res_pub_count: z
    .number()
    .int()
    .min(0, { message: i18next.t("researcher.validation.res_pub_count_min") })
    .default(0),
  res_cit_count: z
    .number()
    .int()
    .min(0, { message: i18next.t("researcher.validation.res_cit_count_min") })
    .default(0),
  func_code: z
    .number()
    .int()
    .positive({ message: i18next.t("researcher.validation.func_code_positive") })
    .nonnegative(i18next.t("researcher.validation.func_code_required")),
  spec_code: z
    .number()
    .int()
    .positive({ message: i18next.t("researcher.validation.spec_code_positive") })
    .nonnegative(i18next.t("researcher.validation.spec_code_required")),
  lab_code: z
    .number()
    .int()
    .positive({ message: i18next.t("researcher.validation.lab_code_positive") })
    .nonnegative(i18next.t("researcher.validation.lab_code_required")),
  team_id: z
    .number()
    .int()
    .positive({ message: i18next.t("researcher.validation.team_id_positive") })
    .nonnegative(i18next.t("researcher.validation.team_id_required")),
  is_director: z.boolean().default(false),
}).strict({ message: i18next.t("error.AttributeNotAllowed") });

export const researcherIdSchema = z.number().int().positive();