import i18next from "i18next";
import { z } from "zod";

export const facultySchema = z.object({
  faculty_name: z
    .string()
    .min(3, { message: i18next.t("faculty.validation.faculty_name_min") })
    .max(100, { message: i18next.t("faculty.validation.faculty_name_max") })
    .nonempty(i18next.t("faculty.validation.faculty_name_required")),
});
