import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Plus, X, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { fetchCommunicationById } from "@/services/communicationService";
import { fetchAllDoctoralStudents } from '@/services/doctoralStudentService';
import { assignDoctoralStudentToCommunication, removeDoctoralStudentFromCommunication } from '@/services/publishDoctoralStudentCommService';

interface DoctoralStudent {
  reg_num: number;
  doc_stud_fname: string;
  doc_stud_lname: string;
}

export default function DoctoralStudentPublications() {
  const { idComm } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [communication, setCommunication] = useState<any>(null);
  const [allStudents, setAllStudents] = useState<DoctoralStudent[]>([]);
  const [assignedStudents, setAssignedStudents] = useState<DoctoralStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const communicationData = await fetchCommunicationById(Number(idComm));
        const studentsData = await fetchAllDoctoralStudents();
        
        setCommunication(communicationData.communication);
        setAllStudents(studentsData.doctoralStudents);
        setAssignedStudents(communicationData.communication.DoctoralStudents || []);
      } catch (error) {
        toast.error(t('error.loadingData'));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [idComm]);

  const handleAssign = async (reg_num: number) => {
    try {
      const result = await assignDoctoralStudentToCommunication(reg_num, Number(idComm));
      
      if ('error' in result) {
        throw new Error(result.error);
      }

      const student = allStudents.find(s => s.reg_num === reg_num);
      if (student) {
        setAssignedStudents([...assignedStudents, student]);
      }
      toast.success(t('communication.studentAssigned'));
    } catch (error) {
      toast.error(t('error.assignmentFailed'));
    }
  };

  const handleRemove = async (reg_num: number) => {
    try {
      const result = await removeDoctoralStudentFromCommunication(reg_num, Number(idComm));
      
      if ('error' in result) {
        throw new Error(result.error);
      }

      setAssignedStudents(assignedStudents.filter(s => s.reg_num !== reg_num));
      toast.success(t('communication.studentRemoved'));
    } catch (error) {
      toast.error(t('error.removalFailed'));
    }
  };

  if (loading) return <div>{t('global.loading')}...</div>;

  return (
    <div className="container mx-auto p-2">
      <div className='flex justify-between gap-2 bg-sidebar p-2 mb-4'>
        <h1>
          <span className='font-semibold'>{t('communication.manageStudents')}:</span>
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
          <h2 className="text-lg font-semibold mb-3 pl-2">{t('communication.availableStudents')}</h2>
          <div className="space-y-2">
            {allStudents
              .filter(s => !assignedStudents.some(as => as.reg_num === s.reg_num))
              .map(student => (
                <div key={student.reg_num} className="flex justify-between items-center p-2 border rounded hover:bg-sidebar">
                  <span className='text-sm'>{student.doc_stud_fname} {student.doc_stud_lname}</span>
                  <div 
                    className='cursor-pointer'
                    onClick={() => handleAssign(student.reg_num)}
                  >
                    <Plus className="h-3 w-3" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 pl-2">{t('communication.assignedStudents')}</h2>
          <div className="space-y-2">
            {assignedStudents.length > 0 ? (
              assignedStudents.map(student => (
                <div key={student.reg_num} className="flex justify-between items-center p-2 border rounded hover:bg-sidebar">
                  <span className='text-sm'>{student.doc_stud_fname} {student.doc_stud_lname}</span>
                  <div 
                    className='cursor-pointer'
                    onClick={() => handleRemove(student.reg_num)}
                  >
                    <X className="h-3 w-3" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">{t('communication.noStudentsAssigned')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}