import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Plus, X, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { fetchCommunicationById } from "@/services/communicationService";
import { fetchAllResearchers } from '@/services/researcherService';
import { assignResearcherToCommunication, removeResearcherFromCommunication } from '@/services/publishResearcherCommService';

interface Researcher {
  res_code: number;
  res_fname: string;
  res_lname: string;
}

export default function ResearcherPublications() {
  const { idComm } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [communication, setCommunication] = useState<any>(null);
  const [allResearchers, setAllResearchers] = useState<Researcher[]>([]);
  const [assignedResearchers, setAssignedResearchers] = useState<Researcher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const communicationData = await fetchCommunicationById(Number(idComm));
        const researchersData = await fetchAllResearchers();
        
        setCommunication(communicationData.communication);
        setAllResearchers(researchersData.researchers);
        setAssignedResearchers(communicationData.communication.Researchers || []);
      } catch (error) {
        toast.error(t('error.loadingData'));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [idComm]);

  const handleAssign = async (res_code: number) => {
    try {
      const result = await assignResearcherToCommunication(res_code, Number(idComm));
      
      if ('error' in result) {
        throw new Error(result.error);
      }

      const researcher = allResearchers.find(r => r.res_code === res_code);
      if (researcher) {
        setAssignedResearchers([...assignedResearchers, researcher]);
      }
      toast.success(t('communication.researcherAssigned'));
    } catch (error) {
      toast.error(t('error.assignmentFailed'));
    }
  };

  const handleRemove = async (res_code: number) => {
    try {
      const result = await removeResearcherFromCommunication(res_code, Number(idComm));
      
      if ('error' in result) {
        throw new Error(result.error);
      }

      setAssignedResearchers(assignedResearchers.filter(r => r.res_code !== res_code));
      toast.success(t('communication.researcherRemoved'));
    } catch (error) {
      toast.error(t('error.removalFailed'));
    }
  };

  if (loading) return <div>{t('global.loading')}...</div>;

  return (
    <div className="container mx-auto p-2">
      <div className='flex justify-between gap-2 bg-sidebar p-2 mb-4'>
        <h1>
          <span className='font-semibold'>{t('communication.manageResearchers')}:</span>
          <span className='text-sm'> "{communication?.title_comm}"</span>
        </h1>

        <Button 
          size="sm"
          variant="outline" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="mr-2 h-3 w-3" />
          {t('global.back')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-3 pl-2">{t('communication.availableResearchers')}</h2>
          <div className="space-y-2">
            {allResearchers
              .filter(r => !assignedResearchers.some(ar => ar.res_code === r.res_code))
              .map(researcher => (
                <div key={researcher.res_code} className="flex justify-between items-center p-2 border rounded hover:bg-sidebar">
                  <span className='text-sm'>{researcher.res_fname} {researcher.res_lname}</span>
                  <div 
                    className='cursor-pointer'
                    onClick={() => handleAssign(researcher.res_code)}
                  >
                    <Plus className="h-3 w-3" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 pl-2">{t('communication.assignedResearchers')}</h2>
          <div className="space-y-2">
            {assignedResearchers.length > 0 ? (
              assignedResearchers.map(researcher => (
                <div key={researcher.res_code} className="flex justify-between items-center p-2 border rounded hover:bg-sidebar">
                  <span className='text-sm'>{researcher.res_fname} {researcher.res_lname}</span>
                  <div 
                    className='cursor-pointer'
                    onClick={() => handleRemove(researcher.res_code)}
                  >
                    <X className="h-3 w-3" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">{t('communication.noResearchersAssigned')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}