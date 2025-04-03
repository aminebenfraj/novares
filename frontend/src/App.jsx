import { Routes, Route } from 'react-router-dom';
import Showpd from './pages/productDesignation/productDesignation-form';
import Createpd from './pages/productDesignation/productDesignation-table';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { AuthProvider } from './context/AuthContext';
import MassProductionForm from './pages/MassProductionForm/MassProductionForm';
import MassProductionEdit from './pages/MassProductionForm/EditMassProductionForm';
import MassProductionTable from './pages/MassProductionForm/MassProductionList'
import MassProductionDetails from './pages/MassProductionForm/MassProductionDetails'
import  Home from './pages/homepage/Home';
import AdminDashboard from './pages/roleMangement/AdminDashboard';
import EditUserRoles from './pages/roleMangement/EditUserRoles';
import CreateUser from './pages/roleMangement/CreateUser';
import CreateFeasibility from './pages/feasability/CreateFeasibility';
import FeasibilityDetails from './pages/feasability/FeasibilityDetails';
import FeasibilityList from './pages/feasability/FeasibilityList';
import CheckinList from './pages/checkin/CheckinList';
import CreateCheckin from './pages/checkin/CreateCheckin';
import EditCheckin from './pages/checkin/EditCheckin';
import OkForLunchList from './pages/okForLunch/OkForLunchList';
import CreateOkForLunch from './pages/okForLunch/CreateOkForLunch';
import EditOkForLunch from './pages/okForLunch/EditOkForLunch';
import EditFeasibility from './pages/feasability/EditFeasibility';
import CreateValidationForOffer from './pages/ValidationForOffer/CreateValidationForOffer';
import EditValidationForOffer from './pages/ValidationForOffer/EditValidationForOffer';
import ValidationForOfferList from './pages/ValidationForOffer/ValidationForOfferList';
import TaskForm from './pages/task/TaskForm';
import TaskList from './pages/task/TaskList';
import EditTask from './pages/task/EditTask';
import EditKickOff from './pages/kick_off/EditKickOff';
import KickOffList from './pages/kick_off/KickOffList';
import KickOffForm from './pages/kick_off/KickOffForm';
import DesignList from './pages/design/DesignList';
import DesignForm from './pages/design/DesignForm';
import EditDesign from './pages/design/EditDesign';
import EditProductDesignation from './pages/productDesignation/EditProductDesignation';
import CreateCategory from './pages/gestionStock/categories/CreateCategory';
import EditCategory from './pages/gestionStock/categories/EditCategory';
import ShowCategories from './pages/gestionStock/categories/ShowCategories';
import CreateLocation from './pages/gestionStock/location/CreateLocation';
import EditLocation from './pages/gestionStock/location/EditLocation';
import ShowLocations from './pages/gestionStock/location/ShowLocations';
import CreateMachine from './pages/gestionStock/machine/CreateMachine';
import EditMachine from './pages/gestionStock/machine/EditMachine';
import ShowMachines from './pages/gestionStock/machine/ShowMachines';
import SupplierList from './pages/gestionStock/suppliers/SupplierList';
import CreateSupplier from './pages/gestionStock/suppliers/CreateSupplier';
import EditSupplier from './pages/gestionStock/suppliers/EditSupplier';
import MaterialList from './pages/gestionStock/materials/MaterialList';
import CreateMaterial from './pages/gestionStock/materials/CreateMaterial';
import MaterialDetails from './pages/gestionStock/materials/material-details';
import EditMaterial from './pages/gestionStock/materials/EditMaterial';
import FacilitiesForm from './pages/facilities/facilitiesForm';
import FacilitiesList from './pages/facilities/FacilitiesList';
import EditFacilities from './pages/facilities/EditFacilities';
import Pptuninglist from './pages/p-p-tuning/pptuninglist';
import P_P_TuningForm from './pages/p-p-tuning/pptuningform';
import Editpptuning from './pages/p-p-tuning/editpptuning';
import Editqualificationconfirmation from './pages/qualificationconfirmationform/editqualificationconfirmation';
import Qualificationconfirmationdetails from './pages/qualificationconfirmationform/qualificationconfirmationdetails';
import Qualificationconfirmationform from './pages/qualificationconfirmationform/qualificationconfirmationform';
import QualificationconfirmationList from './pages/qualificationconfirmationform/qualificationconfirmationList';
import ProcessQualificationForm from './pages/process_qualif/processQualificationForm';
import ProcessQualificationList from './pages/process_qualif/processqualificationlist';
import EditProcessQualification from './pages/process_qualif/editProcessQualification';
import PedidoList from './pages/pedido/PedidoList';
import Createpedido from './pages/pedido/create-pedido';
import Editpedido from './pages/pedido/edit-pedido';
import PedidoDetails from './pages/pedido/PedidoDetails';
import Materialmachinecreate from '../src/pages/gestionStock/machineMaterials/material-machine-create';
import Materialmachinelist from '../src/pages/gestionStock/machineMaterials/material-machine-list';
import Materialmachineedit from '../src/pages/gestionStock/machineMaterials/material-machine-edit';
import Materialmachinedetails from '../src/pages/gestionStock/machineMaterials/material-machine-details';
import  ReadinessForm from './pages/readiness/readinessForm';
import  ReadinessDetails from './pages/readiness/readiness-details';
import  ReadinessEdit from './pages/readiness/readiness-edit';
import  ReadinessList from './pages/readiness/readiness-list';
import  CreateSolicitante from './pages/pedido/solicitante/create-solicitante';
import  EditSolicitante from './pages/pedido/solicitante/edit-solicitante';
import  ShowSolicitante from './pages/pedido/solicitante/show-solicitante';
import  CreateTableStatus from './pages/pedido/status/create-table-status';
import  EditTableStatus from './pages/pedido/status/edit-table-status';
import  ShowTableStatus from './pages/pedido/status/show-table-status';
import  CreateTipo from './pages/pedido/tipo/create-tipo';
import  EditTipo from './pages/pedido/tipo/edit-tipo';
import  ShowTipo from './pages/pedido/tipo/show-tipo';
import  Call from './pages/logistic/call';
import  Documentation from './pages/readiness/documentation/DocumentationList';
import  EditDocumentation from './pages/readiness/documentation/EditDocumentation';
import  EditLogistics from './pages/readiness/logistics/EditLogistics';
import  Logistics from './pages/readiness/logistics/LogisticsList';
import  Maintenance from './pages/readiness/Maintenance/MaintenanceList';
import  EditMaintenance from './pages/readiness/Maintenance/EditMaintenance';
import  EditPackaging from './pages/readiness/Packaging/EditPackaging';
import  Packaging from './pages/readiness/Packaging/PackagingList';
import  EditProcessStatusIndustrials from './pages/readiness/ProcessStatusIndustrials/EditProcessStatusIndustrials';
import  ProcessStatusIndustrials from './pages/readiness/ProcessStatusIndustrials/ProcessStatusIndustrialsList';
import  ProductProcess from './pages/readiness/ProductProcess/ProductProcessList';
import  EditProductProcess from './pages/readiness/ProductProcess/EditProductProcess';
import  EditRunAtRateProduction from './pages/readiness/RunAtRateProduction/EditRunAtRateProduction';
import  RunAtRateProduction from './pages/readiness/RunAtRateProduction/RunAtRateProductionList';



function App() {
  return (
      <AuthProvider>
    <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/pd/create" element={<Showpd />} />
          <Route path="/pd" element={<Createpd />} />
          <Route path="/pd/edit/:id" element={<EditProductDesignation />} />
          <Route path="/masspd/create" element={<MassProductionForm />} />
          <Route path="/masspd/edit/:id" element={<MassProductionEdit />} />
          <Route path="/masspd/detail/:id" element={<MassProductionDetails />} />
          <Route path="/masspd" element={<MassProductionTable />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/edit-user/:license" element={<EditUserRoles />} />
        <Route path="/admin/create-user" element={<CreateUser />} />
        <Route path="/Feasibility" element={<FeasibilityList />} />
        <Route path="/CreateFeasibility" element={<CreateFeasibility />} />
        <Route path="/feasibility/:id" element={<FeasibilityDetails />} />
        <Route path="/feasibility/edit/:id" element={<EditFeasibility />} />
        <Route path="/checkins" element={<CheckinList />} />
      <Route path="/checkins/create" element={<CreateCheckin />} />
      <Route path="/checkins/edit/:id" element={<EditCheckin />} />
      <Route path="/okforlunch" element={<OkForLunchList />} />
      <Route path="/okforlunch/create" element={<CreateOkForLunch />} />
      <Route path="/okforlunch/edit/:id" element={<EditOkForLunch />} />
      <Route path="/validationforoffer/create" element={<CreateValidationForOffer/>} />
      <Route path="/validationforoffer" element={<ValidationForOfferList />} />
        <Route path="/validationforoffer/edit/:id" element={<EditValidationForOffer />} />
        <Route path="/tasklist" element={<TaskList />} />
        <Route path="/task/create" element={<TaskForm />} />
        <Route path="task/edit/:id" element={<EditTask />} />
        <Route path="kickoff/edit/:id" element={<EditKickOff />} />
        <Route path="kickoff/create" element={<KickOffForm />} />
        <Route path="kickoff" element={<KickOffList />} />
        <Route path="design" element={<DesignList />} />
        <Route path="design/create" element={<DesignForm />} />
        <Route path="design/edit/:id" element={<EditDesign />} />          
        <Route path="categories/create" element={<CreateCategory />} />          
        <Route path="categories/edit/:id" element={<EditCategory />} />          
        <Route path="categories" element={<ShowCategories />} />          
        <Route path="locations/create" element={<CreateLocation />} />          
        <Route path="locations/edit/:id" element={<EditLocation />} />          
        <Route path="locations" element={<ShowLocations />} />          
        <Route path="/machines/create" element={<CreateMachine />} />          
        <Route path="machines/edit/:id" element={<EditMachine />} />          
        <Route path="machines" element={<ShowMachines />} />     
        <Route path="/suppliers" element={<SupplierList />} />
        <Route path="/suppliers/create" element={<CreateSupplier />} />
        <Route path="/suppliers/edit/:id" element={<EditSupplier />} />   
        <Route path="/materials" element={<MaterialList />} />
        <Route path="/materials/create" element={<CreateMaterial />} />
        <Route path="/materials/edit/:id" element={<EditMaterial />} />
        <Route path="/materials/details/:id" element={<MaterialDetails />} />
        <Route path="/facilities/create" element={<FacilitiesForm />} />
        <Route path="/facilities" element={<FacilitiesList />} />
        <Route path="/facilities/edit/:id" element={<EditFacilities />} />
        <Route path="/pptuning" element={<Pptuninglist />} />
        <Route path="/pptuning/create" element={<P_P_TuningForm />} />
        <Route path="/p_p_tuning/edit/:id" element={<Editpptuning />} />
        <Route path="/qualificationconfirmation/create" element={<Qualificationconfirmationform />} />
        <Route path="/qualificationconfirmation/edit/:id" element={<Editqualificationconfirmation />} />
        <Route path="/qualificationconfirmation/:id" element={<Qualificationconfirmationdetails />} />
        <Route path="/qualificationconfirmation" element={< QualificationconfirmationList/>} />
        <Route path="/processQualification/create" element={< ProcessQualificationForm/>} />
        <Route path="/processQualification" element={< ProcessQualificationList/>} />
        <Route path="/processQualification/edit/:id" element={< EditProcessQualification/>} />
        <Route path="/pedido" element={< PedidoList/>} />
        <Route path="/pedido/create" element={< Createpedido/>} />
        <Route path="/Pedido/edit/:id" element={< Editpedido/>} />
        <Route path="/pedido/:id" element={<PedidoDetails />} />
        <Route path="/machinematerial/create" element={< Materialmachinecreate/>} />
        <Route path="/machinematerial" element={< Materialmachinelist/>} />
        <Route path="/machinematerial/detail/:id" element={< Materialmachinedetails/>} />
        <Route path="/machinematerial/edit/:id" element={< Materialmachineedit/>} />
        <Route path="/readiness/create" element={< ReadinessForm/>} />
        <Route path="/readiness/detail/:id" element={< ReadinessDetails/>} />
        <Route path="/readiness/edit/:id" element={< ReadinessEdit/>} />
        <Route path="/readiness" element={< ReadinessList/>} />
        <Route path="/solicitante" element={< ShowSolicitante/>} />
        <Route path="/solicitante/edit/:id" element={< EditSolicitante/>} />
        <Route path="/solicitante/create" element={< CreateSolicitante/>} />
        <Route path="/table-status" element={< ShowTableStatus/>} />
        <Route path="/tablestatus/edit/:id" element={< EditTableStatus/>} />
        <Route path="/tablestatus/create" element={< CreateTableStatus/>} />
        <Route path="/tipo" element={< ShowTipo/>} />
        <Route path="/tipo/edit/:id" element={< EditTipo/>} />
        <Route path="/tipo/create" element={< CreateTipo/>} />
        <Route path="/call" element={< Call/>} />
        <Route path="/documentation" element={< Documentation/>} />
        <Route path="/documentation/edit/:id" element={< EditDocumentation/>} />
        <Route path="/logistics/edit/:id" element={< EditLogistics/>} />
        <Route path="/logistics" element={< Logistics/>} />
        <Route path="/maintenance" element={< Maintenance/>} />
        <Route path="/maintenance/edit/:id" element={< EditMaintenance/>} />
        <Route path="/packaging/edit/:id" element={< EditPackaging/>} />
        <Route path="/packaging" element={< Packaging/>} />
        <Route path="/process-status-industrials" element={< ProcessStatusIndustrials/>} />
        <Route path="/process-status-industrials/edit/:id" element={< EditProcessStatusIndustrials/>} />
        <Route path="/product-process/edit/:id" element={< EditProductProcess/>} />
        <Route path="/product-process" element={< ProductProcess/>} />
        <Route path="/run-at-rate" element={< RunAtRateProduction/>} />
        <Route path="/run-at-rate/edit/:id" element={< EditRunAtRateProduction/>} />
    </Routes>
      </AuthProvider>
  );
}

export default App;
