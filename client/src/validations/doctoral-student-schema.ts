import { z } from "zod";
import i18next from "i18next";

export const doctoralStudentSchema = z.object({
  reg_num: z
    .number()
    .int()
    .min(100000000000, { message: i18next.t("doctoralStudent.validation.reg_num_min") })
    .max(999999999999, { message: i18next.t("doctoralStudent.validation.reg_num_max") })
    .nonnegative(i18next.t("doctoralStudent.validation.reg_num_required")),
  doc_stud_fname: z
    .string()
    .trim()
    .max(50, { message: i18next.t("doctoralStudent.validation.doc_stud_fname_max") })
    .nonempty(i18next.t("doctoralStudent.validation.doc_stud_fname_required")),
  doc_stud_lname: z
    .string()
    .trim()
    .max(50, { message: i18next.t("doctoralStudent.validation.doc_stud_lname_max") })
    .nonempty(i18next.t("doctoralStudent.validation.doc_stud_lname_required")),
  doc_stud_fname_ar: z
    .string()
    .trim()
    .max(50, { message: i18next.t("doctoralStudent.validation.doc_stud_fname_ar_max") })
    .nonempty(i18next.t("doctoralStudent.validation.doc_stud_fname_ar_required")),
  doc_stud_lname_ar: z
    .string()
    .trim()
    .max(50, { message: i18next.t("doctoralStudent.validation.doc_stud_lname_ar_max") })
    .nonempty(i18next.t("doctoralStudent.validation.doc_stud_lname_ar_required")),
  doc_stud_gender: z
    .enum(["Male", "Female"], { 
      errorMap: () => ({ message: i18next.t("doctoralStudent.validation.doc_stud_gender_invalid") })
    }),
  doc_stud_attach_struc: z
    .string()
    .trim()
    .max(100, { message: i18next.t("doctoralStudent.validation.doc_stud_attach_struc_max") })
    .optional()
    .nullable()
    .transform(val => val === "" ? null : val),
  doc_stud_birth_date: z
    .union([z.string().datetime(), z.null()])
    .optional()
    .nullable(),
  doc_stud_phone: z
    .string()
    .trim()
    .regex(/^(07|06|05)\d{8}$/, { 
      message: i18next.t("doctoralStudent.validation.doc_stud_phone_pattern") 
    })
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(val => val === "" ? null : val),
  doc_stud_address: z
    .string()
    .trim()
    .max(250, { message: i18next.t("doctoralStudent.validation.doc_stud_address_max") })
    .optional()
    .nullable()
    .transform(val => val === "" ? null : val),
  doc_stud_grade: z
    .string()
    .trim()
    .max(50, { message: i18next.t("doctoralStudent.validation.doc_stud_grade_max") })
    .optional()
    .nullable()
    .transform(val => val === "" ? null : val),
  doc_stud_diploma: z
    .string()
    .trim()
    .max(50, { message: i18next.t("doctoralStudent.validation.doc_stud_diploma_max") })
    .optional()
    .nullable()
    .transform(val => val === "" ? null : val),
  doc_stud_prof_email: z
    .string()
    .email({ message: i18next.t("doctoralStudent.validation.doc_stud_prof_email_invalid") })
    .max(100, { message: i18next.t("doctoralStudent.validation.doc_stud_prof_email_max") })
    .nonempty(i18next.t("doctoralStudent.validation.doc_stud_prof_email_required")),
  doc_stud_pers_email: z
    .string()
    .email({ message: i18next.t("doctoralStudent.validation.doc_stud_pers_email_invalid") })
    .max(100, { message: i18next.t("doctoralStudent.validation.doc_stud_pers_email_max") })
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(val => val === "" ? null : val),
  doc_stud_gs_link: z
    .string()
    .url({ message: i18next.t("doctoralStudent.validation.doc_stud_gs_link_invalid") })
    .max(250, { message: i18next.t("doctoralStudent.validation.doc_stud_gs_link_max") })
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(val => val === "" ? null : val),
  doc_stud_rg_link: z
    .string()
    .url({ message: i18next.t("doctoralStudent.validation.doc_stud_rg_link_invalid") })
    .max(250, { message: i18next.t("doctoralStudent.validation.doc_stud_rg_link_max") })
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(val => val === "" ? null : val),
  doc_stud_page_link: z
    .string()
    .url({ message: i18next.t("doctoralStudent.validation.doc_stud_page_link_invalid") })
    .max(250, { message: i18next.t("doctoralStudent.validation.doc_stud_page_link_max") })
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(val => val === "" ? null : val),
  doc_stud_orcid: z
    .string()
    .url({ message: i18next.t("doctoralStudent.validation.doc_stud_orcid_invalid") })
    .regex(/^https:\/\/orcid\.org\/\d{4}-\d{4}-\d{4}-\d{4}$/, {
      message: i18next.t("doctoralStudent.validation.doc_stud_orcid_pattern")
    })
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(val => val === "" ? null : val),
  doc_stud_pub_count: z
    .number()
    .int()
    .min(0, { message: i18next.t("doctoralStudent.validation.doc_stud_pub_count_min") })
    .default(0),
  doc_stud_cit_count: z
    .number()
    .int()
    .min(0, { message: i18next.t("doctoralStudent.validation.doc_stud_cit_count_min") })
    .default(0),
  lab_code: z
    .number()
    .int()
    .positive({ message: i18next.t("doctoralStudent.validation.lab_code_positive") })
    .nonnegative(i18next.t("doctoralStudent.validation.lab_code_required")),
  team_id: z
    .number()
    .int()
    .positive({ message: i18next.t("doctoralStudent.validation.team_id_positive") })
    .nonnegative(i18next.t("doctoralStudent.validation.team_id_required")),
  func_code: z
    .number()
    .int()
    .positive({ message: i18next.t("doctoralStudent.validation.func_code_positive") })
    .nonnegative(i18next.t("doctoralStudent.validation.func_code_required")),
  spec_code: z
    .number()
    .int()
    .positive({ message: i18next.t("doctoralStudent.validation.spec_code_positive") })
    .nonnegative(i18next.t("doctoralStudent.validation.spec_code_required")),
}).strict({ message: i18next.t("error.AttributeNotAllowed") });

export const regNumSchema = z
  .number()
  .int()
  .min(100000000000, { message: i18next.t("doctoralStudent.validation.reg_num_min") })
  .max(999999999999, { message: i18next.t("doctoralStudent.validation.reg_num_max") })
  .nonnegative(i18next.t("doctoralStudent.validation.reg_num_required"));