import i18next from "i18next";
import { z } from "zod";

export const teamSchema = z
  .object({
    team_name: z
      .string()
      .trim()
      .max(200, { message: i18next.t("team.validation.team_name_max") })
      .nonempty(i18next.t("team.validation.team_name_required")),
    team_abbr: z
      .string()
      .trim()
      .max(20, { message: i18next.t("team.validation.team_abbr_max") })
      .optional()
      .nullable()
      .transform((val) => (val === "" ? null : val)), // Convert empty string to null
    team_desc: z
      .string()
      .trim()
      .optional()
      .nullable()
      .transform((val) => (val === "" ? null : val)), // Convert empty string to null
  })
  .strict({ message: i18next.t("error.AttributeNotAllowed") }); // Disallow unknown attributes

export const teamIdSchema = z
  .number()
  .int()
  .positive({ message: i18next.t("team.validation.team_id_positive") });