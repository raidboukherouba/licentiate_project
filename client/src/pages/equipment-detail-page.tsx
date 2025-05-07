import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchEquipmentById } from '../services/equipmentService';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

export default function EquipmentDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { inventoryNum } = useParams<{ inventoryNum: string }>();
  const [equipment, setEquipment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadEquipmentDetails = async () => {
      if (!inventoryNum) return;

      try {
        const response = await fetchEquipmentById(inventoryNum);
        if ('equipment' in response) {
          setEquipment(response.equipment);
        }
      } catch (error: any) {
        navigate("/equipment-management/equipment-inventory", {
          state: { errorMessage: t("error.FailedToLoadEquipmentDetails") },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEquipmentDetails();
  }, [inventoryNum, navigate, t]);

  if (isLoading) {
    return <div>{t("global.loading")}...</div>;
  }

  if (!equipment) {
    return <div>{t("equipment.not_found")}</div>;
  }

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), 'PPP');
  };

  // Format price for display
  const formatPrice = (price?: number) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat(undefined, { 
      style: 'currency', 
      currency: 'USD' 
    }).format(price);
  };

  return (
    <div className="container bg-sidebar rounded-md mx-auto p-2 mt-4">
      <div>
        <div className="p-2">
          <div className="text-xl font-semibold text-gray-700 dark:text-white text-center">
            {equipment.equip_name} ({equipment.inventory_num})
          </div>
        </div>
        <div className="space-y-4 p-4">
          <div>
            <strong>{t("equipment.description")}:</strong>
            <p className="text-base">{equipment.equip_desc || "N/A"}</p>
          </div>
          <div>
            <strong>{t("equipment.acq_date")}:</strong> {formatDate(equipment.acq_date)}
          </div>
          <div>
            <strong>{t("equipment.purchase_price")}:</strong> {formatPrice(equipment.purchase_price)}
          </div>
          <div>
            <strong>{t("equipment.status")}:</strong> {equipment.equip_status || "N/A"}
          </div>
          <div>
            <strong>{t("equipment.quantity")}:</strong> {equipment.equip_quantity || "N/A"}
          </div>
          <div>
            <strong>{t("equipment.laboratory")}:</strong> {equipment.laboratory?.lab_name || "N/A"}
          </div>
        </div>
      </div>

      <div className="flex justify-end p-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => navigate('/equipment-management/equipment-inventory')}
        >
          <ArrowLeft className="w-4 h-4"/>
          {t("global.back")}
        </Button>
      </div>
    </div>
  );
}