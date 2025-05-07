// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/Auth-context'; // Adjust the import path
import { ProtectedRoute } from './components/protected-route';
import App from './App';
import NotFound from './pages/not-found';
import { 
  Route, 
  RouterProvider, 
  createBrowserRouter, 
  createRoutesFromElements, 
} from 'react-router-dom';
import Faculty from './pages/faculty';
import Domain from './pages/domain';
import Department from './pages/department';
import Team from './pages/team';
import Laboratory from './pages/laboratory';
import Function from './pages/function';
import Speciality from './pages/speciality';
import ProductionType from './pages/production-type';
import Publisher from './pages/publisher';
import ReviewSpeciality from './pages/review-speciality';
import Category from './pages/category';

import AddLaboratoryPage from './pages/add-laboratory-page';
import EditLaboratoryPage from './pages/edit-laboratory-page';
import LaboratoryDetailPage from './pages/laboratory-detail-page';

import Equipment from './pages/equipment';
import AddEquipmentPage from './pages/add-equipment-page';
import EditEquipmentPage from './pages/edit-equipment-page';
import EquipmentDetailPage from './pages/equipment-detail-page';

import Reviews from './pages/review';
import AddReviewPage from './pages/add-review-page';
import EditReviewPage from './pages/edit-review-page';
import ReviewDetailPage from './pages/review-detail-page';

import SpecialityAssignment from './components/review/speciality-assignment';
import CategoryAssignment from './components/review/category-assignment';

import Researcher from './pages/researcher';
import AddResearcherPage from './pages/add-researcher-page';
import EditResearcherPage from './pages/edit-researcher-page';
import ResearcherDetailPage from './pages/researcher-detail-page';

import DoctoralStudent from './pages/doctoral-student';
import AddDoctoralStudentPage from './pages/add-doctoral-student-page';
import EditDoctoralStudentPage from './pages/edit-doctoral-student-page';
import DoctoralStudentDetailPage from './pages/doctoral-student-detail-page';

import Supervise from './pages/supervise';
import AddSupervisePage from './pages/add-supervise-page';
import EditSupervisePage from './pages/edit-supervise-page';
import SuperviseDetailPage from './pages/supervise-detail-page';

import AssignResearcher from './pages/assign-researcher';
import AddAssignResearcherPage from './pages/add-assign-researcher-page';
import EditAssignResearcherPage from './pages/edit-assign-researcher-page';
import AssignResearcherDetailPage from './pages/assign-researcher-detail-page';

import AssignDoctoralStudent from './pages/assign-doctoral-student';
import AddAssignDoctoralStudentPage from './pages/add-assign-doctoral-student-page';
import EditAssignDoctoralStudentPage from './pages/edit-assign-doctoral-student-page';
import AssignDoctoralStudentDetailPage from './pages/assign-doctoral-student-detail-page';

import Communications from './pages/communication';
import AddCommunicationPage from './pages/add-communication-page';
import EditCommunicationPage from './pages/edit-communication-page';
import CommunicationDetailPage from './pages/communication-detail-page';
import ResearcherPublications from './components/communication/researchers-publications';
import DoctoralStudentPublications from './components/communication/doctoral-students-publications';

import Publications from './pages/publication';
import AddPublicationPage from './pages/add-publication-page';
import EditPublicationPage from './pages/edit-publication-page';
import PublicationDetailPage from './pages/publication-detail-page';
import ResearcherPublicationsPub from './components/publication/researchers-publications-pub';
import DoctoralStudentPublicationsPub from './components/publication/doctoral-students-publications-pub';

import LogIn from './pages/login';
import './i18n/i18n';
import './index.css';


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<LogIn />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<App />}>
          <Route path="/organizational-structure/faculties" element={<Faculty />} />
          <Route path="/organizational-structure/domains" element={<Domain />} />
          <Route path="/organizational-structure/departments" element={<Department />} />
          <Route path="/organizational-structure/teams" element={<Team />} />
          <Route path="/organizational-structure/laboratories" element={<Laboratory />} />
          <Route path="/organizational-structure/laboratories/add-laboratory" element={<AddLaboratoryPage />} />
          <Route path="/organizational-structure/laboratories/edit-laboratory/:labCode" element={<EditLaboratoryPage />} />
          <Route path="/organizational-structure/laboratories/:labCode" element={<LaboratoryDetailPage />} />

          <Route path="/personnel-management/functions" element={<Function />} />
          <Route path="/personnel-management/specialities" element={<Speciality />} />
          
          <Route path="/personnel-management/researchers" element={<Researcher />} />
          <Route path="/personnel-management/researchers/:resCode" element={<ResearcherDetailPage />} />
          <Route path="/personnel-management/researchers/add-researcher" element={<AddResearcherPage />} />
          <Route path="/personnel-management/researchers/edit-researcher/:resCode" element={<EditResearcherPage />} />

          <Route path="/personnel-management/doctoral-students" element={<DoctoralStudent />} />
          <Route path="/personnel-management/doctoral-students/:regNum" element={<DoctoralStudentDetailPage />} />
          <Route path="/personnel-management/doctoral-students/add-doctoral-student" element={<AddDoctoralStudentPage />} />
          <Route path="/personnel-management/doctoral-students/edit-doctoral-student/:regNum" element={<EditDoctoralStudentPage />} />

          <Route path="/personnel-management/supervise" element={<Supervise />} />
          <Route path="/personnel-management/supervise/:resCode/:regNum" element={<SuperviseDetailPage />} />
          <Route path="/personnel-management/supervise/add-supervise" element={<AddSupervisePage />} />
          <Route path="/personnel-management/supervise/edit-supervise/:resCode/:regNum" element={<EditSupervisePage />} />

          <Route path="/research-productions/production-types" element={<ProductionType />} />
          <Route path="/research-productions/publishers" element={<Publisher />} />


          <Route path="/publications-management/scientific-reviews" element={<Reviews />} />
          <Route path="/publications-management/scientific-reviews/add-review" element={<AddReviewPage />} />
          <Route path="/publications-management/scientific-reviews/edit-review/:reviewNum" element={<EditReviewPage />} />
          <Route path="/publications-management/scientific-reviews/:reviewNum" element={<ReviewDetailPage />} />

          <Route path="/publications-management/review-specialities" element={<ReviewSpeciality />} />
          <Route path="/publications-management/publication-categories" element={<Category />} />
          <Route path="/publications-management/scientific-reviews/:reviewNum/specialities" element={<SpecialityAssignment />} />
          <Route path="/publications-management/scientific-reviews/:reviewNum/categories" element={<CategoryAssignment />} />

          <Route path="/equipment-management/equipment-inventory" element={<Equipment />} />
          <Route path="/equipment-management/equipment-inventory/add-equipment" element={<AddEquipmentPage />} />
          <Route path="/equipment-management/equipment-inventory/edit-equipment/:inventoryNum" element={<EditEquipmentPage />} />
          <Route path="/equipment-management/equipment-inventory/:inventoryNum" element={<EquipmentDetailPage />} />

          <Route path="/equipment-management/assign-researcher" element={<AssignResearcher />} />
          <Route path="/equipment-management/assign-researcher/add-assignment" element={<AddAssignResearcherPage />} />
          <Route path="/equipment-management/assign-researcher/edit-assignment/:resCode/:inventoryNum" element={<EditAssignResearcherPage />} />
          <Route path="/equipment-management/assign-researcher/:resCode/:inventoryNum" element={<AssignResearcherDetailPage />} />

          <Route path="/equipment-management/assign-doctoral-student" element={<AssignDoctoralStudent />} />
          <Route path="/equipment-management/assign-doctoral-student/add-assignment" element={<AddAssignDoctoralStudentPage />} />
          <Route path="/equipment-management/assign-doctoral-student/edit-assignment/:regNum/:inventoryNum" element={<EditAssignDoctoralStudentPage />} />
          <Route path="/equipment-management/assign-doctoral-student/:regNum/:inventoryNum" element={<AssignDoctoralStudentDetailPage />} />

          <Route path="/research-productions/communications" element={<Communications />} />
          <Route path="/research-productions/communications/add-communication" element={<AddCommunicationPage />} />
          <Route path="/research-productions/communications/edit-communication/:idComm" element={<EditCommunicationPage />} />
          <Route path="/research-productions/communications/:idComm" element={<CommunicationDetailPage />} />
          <Route path="/research-productions/communications/:idComm/researchers" element={<ResearcherPublications />} />
          <Route path="/research-productions/communications/:idComm/doctoral-students" element={<DoctoralStudentPublications />} />

          <Route path="/research-productions/publications" element={<Publications />} />
          <Route path="/research-productions/publications/add-publication" element={<AddPublicationPage />} />
          <Route path="/research-productions/publications/edit-publication/:doi" element={<EditPublicationPage />} />
          <Route path="/research-productions/publications/:doi" element={<PublicationDetailPage />} />
          <Route path="/research-productions/publications/:doi/researchers" element={<ResearcherPublicationsPub />} />
          <Route path="/research-productions/publications/:doi/doctoral-students" element={<DoctoralStudentPublicationsPub />} />
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </>
  )
);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);