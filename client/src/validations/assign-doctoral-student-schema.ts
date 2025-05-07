import { z } from "zod";
import i18next from "i18next";

export const assignDoctoralStudentSchema = z
  .object({
    reg_num: z
      .number({
        required_error: i18next.t("assignDoctoralStudent.validation.reg_num_required"),
        invalid_type_error: i18next.t("assignDoctoralStudent.validation.reg_num_number")
      })
      .int()
      .min(100000000000, { message: i18next.t("assignDoctoralStudent.validation.reg_num_min") })
      .max(999999999999, { message: i18next.t("assignDoctoralStudent.validation.reg_num_max") }),
    inventory_num: z
      .string({
        required_error: i18next.t("assignDoctoralStudent.validation.inventory_num_required"),
        invalid_type_error: i18next.t("assignDoctoralStudent.validation.inventory_num_string")
      })
      .trim()
      .max(50, { message: i18next.t("assignDoctoralStudent.validation.inventory_num_max") }),
    doc_stud_assign_date: z
      .string({
        required_error: i18next.t("assignDoctoralStudent.validation.doc_stud_assign_date_required")
      })
      .datetime({ message: i18next.t("assignDoctoralStudent.validation.doc_stud_assign_date_invalid") }),
    doc_stud_return_date: z
      .union([z.string().datetime(), z.null()])
      .optional()
      .nullable()
      .transform((val) => (val === "" ? null : val)),
  })
  .strict({ message: i18next.t("error.AttributeNotAllowed") });

export const updateAssignDoctoralStudentSchema = z
  .object({
    doc_stud_assign_date: z
      .string({
        required_error: i18next.t("assignDoctoralStudent.validation.doc_stud_assign_date_required")
      })
      .datetime({ message: i18next.t("assignDoctoralStudent.validation.doc_stud_assign_date_invalid") }),
    doc_stud_return_date: z
      .union([z.string().datetime(), z.null()])
      .optional()
      .nullable()
      .transform((val) => (val === "" ? null : val)),
  })
  .strict({ message: i18next.t("error.AttributeNotAllowed") });

export const assignDoctoralStudentIdSchema = z.object({
  reg_num: z
    .number({
      required_error: i18next.t("assignDoctoralStudent.validation.reg_num_required"),
      invalid_type_error: i18next.t("assignDoctoralStudent.validation.reg_num_number")
    })
    .int()
    .min(100000000000, { message: i18next.t("assignDoctoralStudent.validation.reg_num_min") })
    .max(999999999999, { message: i18next.t("assignDoctoralStudent.validation.reg_num_max") }),
  inventory_num: z
    .string({
      required_error: i18next.t("assignDoctoralStudent.validation.inventory_num_required"),
      invalid_type_error: i18next.t("assignDoctoralStudent.validation.inventory_num_string")
    })
    .trim()
    .max(50, { message: i18next.t("assignDoctoralStudent.validation.inventory_num_max") }),
});