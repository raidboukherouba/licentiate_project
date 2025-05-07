import { z } from "zod";
import i18next from "i18next";

export const communicationSchema = z.object({
  title_comm: z
    .string()
    .trim()
    .max(150, { message: i18next.t("communication.validation.title_comm_max") })
    .nonempty(i18next.t("communication.validation.title_comm_required")),
  event_title: z
    .string()
    .trim()
    .max(150, { message: i18next.t("communication.validation.event_title_max") })
    .nonempty(i18next.t("communication.validation.event_title_required")),
  year_comm: z
    .number()
    .int()
    .min(1900, { message: i18next.t("communication.validation.year_comm_min") })
    .max(new Date().getFullYear(), { message: i18next.t("communication.validation.year_comm_max") }),
  url_comm: z
    .string()
    .max(250, { message: i18next.t("communication.validation.url_comm_max") })
    .optional()
    .nullable()
    .transform(val => (val ? val.trim() : null))
    .refine(val => val === null || /^https?:\/\/.+\..+$/.test(val), {
        message: i18next.t("communication.validation.url_comm_invalid"),
    }),
  type_id: z
    .number()
    .int()
    .positive({ message: i18next.t("communication.validation.type_id_positive") })
}).strict({ message: i18next.t("error.AttributeNotAllowed") });

export const communicationIdSchema = z.number().int().positive();