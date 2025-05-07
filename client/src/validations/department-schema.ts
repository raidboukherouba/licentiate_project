import i18next from "i18next";
import { z } from "zod";

export const departmentSchema = z.object({
  dept_name: z
    .string()
    .min(3, { message: i18next.t("department.validation.dept_name_min") })
    .max(100, { message: i18next.t("department.validation.dept_name_max") })
    .nonempty(i18next.t("department.validation.dept_name_required")),
});