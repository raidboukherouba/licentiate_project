import { z } from "zod";
import i18next from "i18next";

export const superviseSchema = z
  .object({
    res_code: z
      .number({
        required_error: i18next.t("supervise.validation.res_code_required"),
        invalid_type_error: i18next.t("supervise.validation.res_code_number")
      })
      .int()
      .positive({ message: i18next.t("supervise.validation.res_code_positive") }),
    reg_num: z
      .number({
        required_error: i18next.t("supervise.validation.reg_num_required"),
        invalid_type_error: i18next.t("supervise.validation.reg_num_number")
      })
      .int()
      .min(100000000000, { message: i18next.t("supervise.validation.reg_num_min") })
      .max(999999999999, { message: i18next.t("supervise.validation.reg_num_max") }),
    super_start_date: z
      .string({
        required_error: i18next.t("supervise.validation.super_start_date_required")
      })
      .datetime({ message: i18next.t("supervise.validation.super_start_date_invalid") }),
    super_end_date: z
      .union([z.string().datetime(), z.null()])
      .optional()
      .nullable()
      .transform((val) => (val === "" ? null : val)),
    super_theme: z
      .string({
        required_error: i18next.t("supervise.validation.super_theme_required")
      })
      .trim()
      .min(1, { message: i18next.t("supervise.validation.super_theme_required") })
      .max(250, { message: i18next.t("supervise.validation.super_theme_max") }),
  })
  .strict({ message: i18next.t("error.AttributeNotAllowed") });

export const updateSuperviseSchema = z
  .object({
    super_start_date: z
      .string({
        required_error: i18next.t("supervise.validation.super_start_date_required")
      })
      .datetime({ message: i18next.t("supervise.validation.super_start_date_invalid") }),
    super_end_date: z
      .union([z.string().datetime(), z.null()])
      .optional()
      .nullable()
      .transform((val) => (val === "" ? null : val)),
    super_theme: z
      .string({
        required_error: i18next.t("supervise.validation.super_theme_required")
      })
      .trim()
      .min(1, { message: i18next.t("supervise.validation.super_theme_required") })
      .max(250, { message: i18next.t("supervise.validation.super_theme_max") }),
  })
  .strict({ message: i18next.t("error.AttributeNotAllowed") });

export const superviseIdSchema = z.object({
  res_code: z
    .number({
      required_error: i18next.t("supervise.validation.res_code_required"),
      invalid_type_error: i18next.t("supervise.validation.res_code_number")
    })
    .int()
    .positive({ message: i18next.t("supervise.validation.res_code_positive") }),
  reg_num: z
    .number({
      required_error: i18next.t("supervise.validation.reg_num_required"),
      invalid_type_error: i18next.t("supervise.validation.reg_num_number")
    })
    .int()
    .min(100000000000, { message: i18next.t("supervise.validation.reg_num_min") })
    .max(999999999999, { message: i18next.t("supervise.validation.reg_num_max") }),
});