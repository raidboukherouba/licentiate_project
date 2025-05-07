import { z } from "zod";
import i18next from "i18next";

export const assignResearcherSchema = z
  .object({
    res_code: z
      .number({
        required_error: i18next.t("assignResearcher.validation.res_code_required"),
        invalid_type_error: i18next.t("assignResearcher.validation.res_code_number")
      })
      .int()
      .positive({ message: i18next.t("assignResearcher.validation.res_code_positive") }),
    inventory_num: z
      .string({
        required_error: i18next.t("assignResearcher.validation.inventory_num_required"),
        invalid_type_error: i18next.t("assignResearcher.validation.inventory_num_string")
      })
      .trim()
      .max(50, { message: i18next.t("assignResearcher.validation.inventory_num_max") }),
    res_assign_date: z
      .string({
        required_error: i18next.t("assignResearcher.validation.res_assign_date_required")
      })
      .datetime({ message: i18next.t("assignResearcher.validation.res_assign_date_invalid") }),
    res_return_date: z
      .union([z.string().datetime(), z.null()])
      .optional()
      .nullable()
      .transform((val) => (val === "" ? null : val)),
  })
  .strict({ message: i18next.t("error.AttributeNotAllowed") });

export const updateAssignResearcherSchema = z
  .object({
    res_assign_date: z
      .string({
        required_error: i18next.t("assignResearcher.validation.res_assign_date_required")
      })
      .datetime({ message: i18next.t("assignResearcher.validation.res_assign_date_invalid") }),
    res_return_date: z
      .union([z.string().datetime(), z.null()])
      .optional()
      .nullable()
      .transform((val) => (val === "" ? null : val)),
  })
  .strict({ message: i18next.t("error.AttributeNotAllowed") });

export const assignResearcherIdSchema = z.object({
  res_code: z
    .number({
      required_error: i18next.t("assignResearcher.validation.res_code_required"),
      invalid_type_error: i18next.t("assignResearcher.validation.res_code_number")
    })
    .int()
    .positive({ message: i18next.t("assignResearcher.validation.res_code_positive") }),
  inventory_num: z
    .string({
      required_error: i18next.t("assignResearcher.validation.inventory_num_required"),
      invalid_type_error: i18next.t("assignResearcher.validation.inventory_num_string")
    })
    .trim()
    .max(50, { message: i18next.t("assignResearcher.validation.inventory_num_max") }),
});