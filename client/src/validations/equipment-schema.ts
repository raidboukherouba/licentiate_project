import { z } from "zod";
import i18next from "i18next";

export const equipmentSchema = z
  .object({
    inventory_num: z
      .string()
      .min(8, { message: i18next.t("equipment.validation.inventory_num_min") })
      .max(50, { message: i18next.t("equipment.validation.inventory_num_max") })
      .regex(/^[A-Za-z0-9-_]+$/, { message: i18next.t("equipment.validation.inventory_num_pattern") }),
    equip_name: z
      .string()
      .trim()
      .nonempty(i18next.t("equipment.validation.equip_name_required")),
    equip_desc: z
      .string()
      .trim()
      .optional()
      .nullable()
      .transform((val) => (val === "" ? null : val)),
    acq_date: z
      .union([z.string().datetime(), z.null()])
      .optional()
      .nullable(),
    purchase_price: z
      .string()
      .trim()
      .regex(/^\d+(\.\d+)?$/, { message: i18next.t("equipment.validation.purchase_price_positive") }) // Ensures numeric format
      .optional()
      .nullable()
      .transform((val) => (val ? parseFloat(val) : null))
      .or(z.number().positive().optional().nullable()),
    equip_status: z
      .string()
      .trim()
      .max(50, { message: i18next.t("equipment.validation.equip_status_max") })
      .optional()
      .nullable()
      .transform((val) => (val === "" ? null : val)),
    equip_quantity: z
      .number()
      .int()
      .positive({ message: i18next.t("equipment.validation.equip_quantity_positive") })
      .or(z.null())
      .optional(),
    lab_code: z
      .number()
      .int()
      .positive({ message: i18next.t("equipment.validation.lab_code_positive") })
      .nonnegative(i18next.t("equipment.validation.lab_code_required")),
  })
  .strict({ message: i18next.t("error.AttributeNotAllowed") });

export const inventoryNumSchema = z
  .string()
  .min(8, { message: i18next.t("equipment.validation.inventory_num_min") })
  .max(50, { message: i18next.t("equipment.validation.inventory_num_max") })
  .regex(/^[A-Za-z0-9-_]+$/, { message: i18next.t("equipment.validation.inventory_num_pattern") })
  .nonempty(i18next.t("equipment.validation.inventory_num_required"));
