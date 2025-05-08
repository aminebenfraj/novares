import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/protected-route"
import Unauthorized from "./pages/auth/Unauthorized"

// Auth Pages
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

// Admin Pages
import AdminDashboard from "./pages/roleMangement/AdminDashboard"
import EditUserRoles from "./pages/roleMangement/EditUserRoles"
import CreateUser from "./pages/roleMangement/CreateUser"

// Home Page
import Home from "./pages/homepage/Home"

// User Pages
import ProfilePage from "./pages/user/profile-page"
import SettingsPage from "./pages/user/settings-page"

// Product Designation Pages
import Showpd from "./pages/productDesignation/productDesignation-form"
import Createpd from "./pages/productDesignation/productDesignation-table"
import EditProductDesignation from "./pages/productDesignation/EditProductDesignation"

// Mass Production Pages
import MassProductionForm from "./pages/MassProductionForm/MassProductionForm"
import MassProductionEdit from "./pages/MassProductionForm/EditMassProductionForm"
import MassProductionTable from "./pages/MassProductionForm/MassProductionList"
import MassProductionDetails from "./pages/MassProductionForm/MassProductionDetails"

// Feasibility Pages
import FeasibilityList from "./pages/feasability/FeasibilityList"
import CreateFeasibility from "./pages/feasability/CreateFeasibility"
import FeasibilityDetails from "./pages/feasability/FeasibilityDetails"
import EditFeasibility from "./pages/feasability/EditFeasibility"

// Check-in Pages
import CheckinList from "./pages/checkin/CheckinList"
import CreateCheckin from "./pages/checkin/CreateCheckin"
import EditCheckin from "./pages/checkin/EditCheckin"

// OK For Lunch Pages
import OkForLunchList from "./pages/okForLunch/OkForLunchList"
import CreateOkForLunch from "./pages/okForLunch/CreateOkForLunch"
import EditOkForLunch from "./pages/okForLunch/EditOkForLunch"

// Validation For Offer Pages
import ValidationForOfferList from "./pages/ValidationForOffer/ValidationForOfferList"
import CreateValidationForOffer from "./pages/ValidationForOffer/CreateValidationForOffer"
import EditValidationForOffer from "./pages/ValidationForOffer/EditValidationForOffer"

// Task Pages
import TaskList from "./pages/task/TaskList"
import TaskForm from "./pages/task/TaskForm"
import EditTask from "./pages/task/EditTask"

// Kick Off Pages
import KickOffList from "./pages/kick_off/KickOffList"
import KickOffForm from "./pages/kick_off/KickOffForm"
import EditKickOff from "./pages/kick_off/EditKickOff"

// Design Pages
import DesignList from "./pages/design/DesignList"
import DesignForm from "./pages/design/DesignForm"
import EditDesign from "./pages/design/EditDesign"

// Inventory Management Pages
import ShowCategories from "./pages/gestionStock/categories/ShowCategories"
import CreateCategory from "./pages/gestionStock/categories/CreateCategory"
import EditCategory from "./pages/gestionStock/categories/EditCategory"
import ShowLocations from "./pages/gestionStock/location/ShowLocations"
import CreateLocation from "./pages/gestionStock/location/CreateLocation"
import EditLocation from "./pages/gestionStock/location/EditLocation"
import ShowMachines from "./pages/gestionStock/machine/ShowMachines"
import CreateMachine from "./pages/gestionStock/machine/CreateMachine"
import EditMachine from "./pages/gestionStock/machine/EditMachine"
import SupplierList from "./pages/gestionStock/suppliers/SupplierList"
import CreateSupplier from "./pages/gestionStock/suppliers/CreateSupplier"
import EditSupplier from "./pages/gestionStock/suppliers/EditSupplier"
import MaterialList from "./pages/gestionStock/materials/MaterialList"
import CreateMaterial from "./pages/gestionStock/materials/CreateMaterial"
import EditMaterial from "./pages/gestionStock/materials/EditMaterial"
import MaterialDetails from "./pages/gestionStock/materials/material-details"
import Materialmachinelist from "../src/pages/gestionStock/machineMaterials/material-machine-list"
import Materialmachinecreate from "../src/pages/gestionStock/machineMaterials/material-machine-create"
import Materialmachinedetails from "../src/pages/gestionStock/machineMaterials/material-machine-details"
import Materialmachineedit from "../src/pages/gestionStock/machineMaterials/material-machine-edit"
import MachineDashboard from "./pages/gestionStock/machine_dashboard/machine-dashboard"

// Facilities Pages
import FacilitiesList from "./pages/facilities/FacilitiesList"
import FacilitiesForm from "./pages/facilities/facilitiesForm"
import EditFacilities from "./pages/facilities/EditFacilities"

// P-P Tuning Pages
import Pptuninglist from "./pages/p-p-tuning/pptuninglist"
import P_P_TuningForm from "./pages/p-p-tuning/pptuningform"
import Editpptuning from "./pages/p-p-tuning/editpptuning"

// Qualification Confirmation Pages
import QualificationconfirmationList from "./pages/qualificationconfirmationform/qualificationconfirmationList"
import Qualificationconfirmationform from "./pages/qualificationconfirmationform/qualificationconfirmationform"
import Editqualificationconfirmation from "./pages/qualificationconfirmationform/editqualificationconfirmation"
import Qualificationconfirmationdetails from "./pages/qualificationconfirmationform/qualificationconfirmationdetails"

// Process Qualification Pages
import ProcessQualificationList from "./pages/process_qualif/processqualificationlist"
import ProcessQualificationForm from "./pages/process_qualif/processQualificationForm"
import EditProcessQualification from "./pages/process_qualif/editProcessQualification"

// Pedido (Order) Pages
import PedidoList from "./pages/pedido/PedidoList"
import Createpedido from "./pages/pedido/create-pedido"
import Editpedido from "./pages/pedido/edit-pedido"
import PedidoDetails from "./pages/pedido/PedidoDetails"
import ShowSolicitante from "./pages/pedido/solicitante/show-solicitante"
import EditSolicitante from "./pages/pedido/solicitante/edit-solicitante"
import CreateSolicitante from "./pages/pedido/solicitante/create-solicitante"
import ShowTableStatus from "./pages/pedido/status/show-table-status"
import EditTableStatus from "./pages/pedido/status/edit-table-status"
import CreateTableStatus from "./pages/pedido/status/create-table-status"
import ShowTipo from "./pages/pedido/tipo/show-tipo"
import EditTipo from "./pages/pedido/tipo/edit-tipo"
import CreateTipo from "./pages/pedido/tipo/create-tipo"

// Readiness Pages
import ReadinessList from "./pages/readiness/readiness-list"
import ReadinessForm from "./pages/readiness/readinessForm"
import ReadinessDetails from "./pages/readiness/readiness-details"
import ReadinessEdit from "./pages/readiness/readiness-edit"
import Documentation from "./pages/readiness/documentation/DocumentationList"
import EditDocumentation from "./pages/readiness/documentation/EditDocumentation"
import Logistics from "./pages/readiness/logistics/LogisticsList"
import EditLogistics from "./pages/readiness/logistics/EditLogistics"
import Maintenance from "./pages/readiness/Maintenance/MaintenanceList"
import EditMaintenance from "./pages/readiness/Maintenance/EditMaintenance"
import Packaging from "./pages/readiness/Packaging/PackagingList"
import EditPackaging from "./pages/readiness/Packaging/EditPackaging"
import ProcessStatusIndustrials from "./pages/readiness/ProcessStatusIndustrials/ProcessStatusIndustrialsList"
import EditProcessStatusIndustrials from "./pages/readiness/ProcessStatusIndustrials/EditProcessStatusIndustrials"
import ProductProcess from "./pages/readiness/ProductProcess/ProductProcessList"
import EditProductProcess from "./pages/readiness/ProductProcess/EditProductProcess"
import RunAtRateProduction from "./pages/readiness/RunAtRateProduction/RunAtRateProductionList"
import EditRunAtRateProduction from "./pages/readiness/RunAtRateProduction/EditRunAtRateProduction"
import Safety from "./pages/readiness/Safety/SafetyList"
import EditSafety from "./pages/readiness/Safety/EditSafety"
import Supp from "./pages/readiness/Supp/SuppList"
import EditSupp from "./pages/readiness/Supp/EditSupp"
import Training from "./pages/readiness/Training/TrainingList"
import EditTraining from "./pages/readiness/Training/EditTraining"
import ToolingStatus from "./pages/readiness/ToolingStatus/ToolingStatusList"
import EditToolingStatus from "./pages/readiness/ToolingStatus/EditToolingStatus"

// Logistic Pages
import Call from "./pages/logistic/call"

function App() {
  // Define role groups for different sections
  const adminRoles = ["Admin"]
  const productionRoles = [
    "Admin", 
    "PRODUCCION", 
    "Manufacturing Eng. Manager", 
    "Manufacturing Eng. Leader",
    "Project Manager",
    "Business Manager",
    "Financial Leader",
    "Methodes UAP1&3",
    "Methodes UAP2",
    "Maintenance Manager",
    "Maintenance Leader UAP2",
    "Prod. Plant Manager UAP1",
    "Prod. Plant Manager UAP2",
    "Quality Manager",
    "Quality Leader UAP1",
    "Quality Leader UAP2",
    "Quality Leader UAP3"]
 const logisticRoles = ["Admin"]
  const inventoryRoles = ["Admin"]
  const qualityRoles = ["Admin"]

  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Home route - redirects to login if not authenticated */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* User profile routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles={adminRoles}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-user/:license"
          element={
            <ProtectedRoute requiredRoles={adminRoles}>
              <EditUserRoles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-user"
          element={
            <ProtectedRoute requiredRoles={adminRoles}>
              <CreateUser />
            </ProtectedRoute>
          }
        />

        {/* Product Designation routes */}
        <Route
          path="/pd/create"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <Showpd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pd"
          element={
            <ProtectedRoute>
              <Createpd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pd/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <EditProductDesignation />
            </ProtectedRoute>
          }
        />

        {/* Mass Production routes */}
        <Route
          path="/masspd/create"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <MassProductionForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masspd/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <MassProductionEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masspd/detail/:id"
          element={
            <ProtectedRoute>
              <MassProductionDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masspd"
          element={
            <ProtectedRoute>
              <MassProductionTable />
            </ProtectedRoute>
          }
        />

        {/* Feasibility routes */}
        <Route
          path="/Feasibility"
          element={
            <ProtectedRoute>
              <FeasibilityList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/CreateFeasibility"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <CreateFeasibility />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feasibility/:id"
          element={
            <ProtectedRoute>
              <FeasibilityDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feasibility/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <EditFeasibility />
            </ProtectedRoute>
          }
        />

        {/* Check-in routes */}
        <Route
          path="/checkins"
          element={
            <ProtectedRoute>
              <CheckinList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkins/create"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <CreateCheckin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkins/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <EditCheckin />
            </ProtectedRoute>
          }
        />

        {/* OK For Lunch routes */}
        <Route
          path="/okforlunch"
          element={
            <ProtectedRoute>
              <OkForLunchList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/okforlunch/create"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <CreateOkForLunch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/okforlunch/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <EditOkForLunch />
            </ProtectedRoute>
          }
        />

        {/* Validation For Offer routes */}
        <Route
          path="/validationforoffer"
          element={
            <ProtectedRoute>
              <ValidationForOfferList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/validationforoffer/create"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <CreateValidationForOffer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/validationforoffer/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <EditValidationForOffer />
            </ProtectedRoute>
          }
        />

        {/* Task routes */}
        <Route
          path="/tasklist"
          element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/task/create"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <TaskForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="task/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <EditTask />
            </ProtectedRoute>
          }
        />

        {/* Kick Off routes */}
        <Route
          path="kickoff"
          element={
            <ProtectedRoute>
              <KickOffList />
            </ProtectedRoute>
          }
        />
        <Route
          path="kickoff/create"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <KickOffForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="kickoff/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <EditKickOff />
            </ProtectedRoute>
          }
        />

        {/* Design routes */}
        <Route
          path="design"
          element={
            <ProtectedRoute>
              <DesignList />
            </ProtectedRoute>
          }
        />
        <Route
          path="design/create"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <DesignForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="design/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <EditDesign />
            </ProtectedRoute>
          }
        />

        {/* Categories routes */}
        <Route
          path="categories"
          element={
            <ProtectedRoute>
              <ShowCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="categories/create"
          element={
            <ProtectedRoute requiredRoles={inventoryRoles}>
              <CreateCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="categories/edit/:id"
          element={
            <ProtectedRoute requiredRoles={inventoryRoles}>
              <EditCategory />
            </ProtectedRoute>
          }
        />

        {/* Locations routes */}
        <Route
          path="locations"
          element={
            <ProtectedRoute>
              <ShowLocations />
            </ProtectedRoute>
          }
        />
        <Route
          path="locations/create"
          element={
            <ProtectedRoute requiredRoles={inventoryRoles}>
              <CreateLocation />
            </ProtectedRoute>
          }
        />
        <Route
          path="locations/edit/:id"
          element={
            <ProtectedRoute requiredRoles={inventoryRoles}>
              <EditLocation />
            </ProtectedRoute>
          }
        />

        {/* Machines routes */}
        <Route
          path="machines"
          element={
            <ProtectedRoute>
              <ShowMachines />
            </ProtectedRoute>
          }
        />
        <Route
          path="/machines/create"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <CreateMachine />
            </ProtectedRoute>
          }
        />
        <Route
          path="machines/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <EditMachine />
            </ProtectedRoute>
          }
        />

        {/* Suppliers routes */}
        <Route
          path="/suppliers"
          element={
            <ProtectedRoute>
              <SupplierList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suppliers/create"
          element={
            <ProtectedRoute requiredRoles={inventoryRoles}>
              <CreateSupplier />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suppliers/edit/:id"
          element={
            <ProtectedRoute requiredRoles={inventoryRoles}>
              <EditSupplier />
            </ProtectedRoute>
          }
        />

        {/* Materials routes */}
        <Route
          path="/materials"
          element={
            <ProtectedRoute>
              <MaterialList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/materials/create"
          element={
            <ProtectedRoute requiredRoles={inventoryRoles}>
              <CreateMaterial />
            </ProtectedRoute>
          }
        />
        <Route
          path="/materials/edit/:id"
          element={
            <ProtectedRoute requiredRoles={inventoryRoles}>
              <EditMaterial />
            </ProtectedRoute>
          }
        />
        <Route
          path="/materials/details/:id"
          element={
            <ProtectedRoute>
              <MaterialDetails />
            </ProtectedRoute>
          }
        />

        {/* Machine Material routes */}
        <Route
          path="/machinematerial"
          element={
            <ProtectedRoute>
              <Materialmachinelist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/machinematerial/create"
          element={
            <ProtectedRoute requiredRoles={inventoryRoles}>
              <Materialmachinecreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/machinematerial/detail/:id"
          element={
            <ProtectedRoute>
              <Materialmachinedetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/machinematerial/edit/:id"
          element={
            <ProtectedRoute requiredRoles={inventoryRoles}>
              <Materialmachineedit />
            </ProtectedRoute>
          }
        />

        {/* Facilities routes */}
        <Route
          path="/facilities"
          element={
            <ProtectedRoute>
              <FacilitiesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/facilities/create"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <FacilitiesForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/facilities/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <EditFacilities />
            </ProtectedRoute>
          }
        />

        {/* P-P Tuning routes */}
        <Route
          path="/pptuning"
          element={
            <ProtectedRoute>
              <Pptuninglist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pptuning/create"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <P_P_TuningForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/p_p_tuning/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <Editpptuning />
            </ProtectedRoute>
          }
        />

        {/* Qualification Confirmation routes */}
        <Route
          path="/qualificationconfirmation"
          element={
            <ProtectedRoute>
              <QualificationconfirmationList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qualificationconfirmation/create"
          element={
            <ProtectedRoute requiredRoles={qualityRoles}>
              <Qualificationconfirmationform />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qualificationconfirmation/edit/:id"
          element={
            <ProtectedRoute requiredRoles={qualityRoles}>
              <Editqualificationconfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qualificationconfirmation/:id"
          element={
            <ProtectedRoute>
              <Qualificationconfirmationdetails />
            </ProtectedRoute>
          }
        />

        {/* Process Qualification routes */}
        <Route
          path="/processQualification"
          element={
            <ProtectedRoute>
              <ProcessQualificationList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/processQualification/create"
          element={
            <ProtectedRoute requiredRoles={qualityRoles}>
              <ProcessQualificationForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/processQualification/edit/:id"
          element={
            <ProtectedRoute requiredRoles={qualityRoles}>
              <EditProcessQualification />
            </ProtectedRoute>
          }
        />

        {/* Pedido (Order) routes */}
        <Route
          path="/pedido"
          element={
            <ProtectedRoute>
              <PedidoList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedido/create"
          element={
            <ProtectedRoute requiredRoles={logisticRoles}>
              <Createpedido />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Pedido/edit/:id"
          element={
            <ProtectedRoute requiredRoles={logisticRoles}>
              <Editpedido />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedido/:id"
          element={
            <ProtectedRoute>
              <PedidoDetails />
            </ProtectedRoute>
          }
        />

        {/* Solicitante routes */}
        <Route
          path="/solicitante"
          element={
            <ProtectedRoute>
              <ShowSolicitante />
            </ProtectedRoute>
          }
        />
        <Route
          path="/solicitante/edit/:id"
          element={
            <ProtectedRoute requiredRoles={logisticRoles}>
              <EditSolicitante />
            </ProtectedRoute>
          }
        />
        <Route
          path="/solicitante/create"
          element={
            <ProtectedRoute requiredRoles={logisticRoles}>
              <CreateSolicitante />
            </ProtectedRoute>
          }
        />

        {/* Table Status routes */}
        <Route
          path="/table-status"
          element={
            <ProtectedRoute>
              <ShowTableStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tablestatus/edit/:id"
          element={
            <ProtectedRoute requiredRoles={logisticRoles}>
              <EditTableStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tablestatus/create"
          element={
            <ProtectedRoute requiredRoles={logisticRoles}>
              <CreateTableStatus />
            </ProtectedRoute>
          }
        />

        {/* Tipo routes */}
        <Route
          path="/tipo"
          element={
            <ProtectedRoute>
              <ShowTipo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tipo/edit/:id"
          element={
            <ProtectedRoute requiredRoles={logisticRoles}>
              <EditTipo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tipo/create"
          element={
            <ProtectedRoute requiredRoles={logisticRoles}>
              <CreateTipo />
            </ProtectedRoute>
          }
        />

        {/* Call routes */}
        <Route
          path="/call"
          element={
            <ProtectedRoute requiredRoles={logisticRoles}>
              <Call />
            </ProtectedRoute>
          }
        />

        {/* Readiness routes */}
        <Route
          path="/readiness"
          element={
            <ProtectedRoute>
              <ReadinessList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/readiness/create"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <ReadinessForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/readiness/detail/:id"
          element={
            <ProtectedRoute>
              <ReadinessDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/readiness/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <ReadinessEdit />
            </ProtectedRoute>
          }
        />

        {/* Documentation routes */}
        <Route
          path="/documentation"
          element={
            <ProtectedRoute>
              <Documentation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documentation/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <EditDocumentation />
            </ProtectedRoute>
          }
        />

        {/* Logistics routes */}
        <Route
          path="/logistics"
          element={
            <ProtectedRoute>
              <Logistics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/edit/:id"
          element={
            <ProtectedRoute requiredRoles={logisticRoles}>
              <EditLogistics />
            </ProtectedRoute>
          }
        />

        {/* Maintenance routes */}
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute>
              <Maintenance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <EditMaintenance />
            </ProtectedRoute>
          }
        />

        {/* Packaging routes */}
        <Route
          path="/packaging"
          element={
            <ProtectedRoute>
              <Packaging />
            </ProtectedRoute>
          }
        />
        <Route
          path="/packaging/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <EditPackaging />
            </ProtectedRoute>
          }
        />

        {/* Process Status Industrials routes */}
        <Route
          path="/process-status-industrials"
          element={
            <ProtectedRoute>
              <ProcessStatusIndustrials />
            </ProtectedRoute>
          }
        />
        <Route
          path="/process-status-industrials/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <EditProcessStatusIndustrials />
            </ProtectedRoute>
          }
        />

        {/* Product Process routes */}
        <Route
          path="/product-process"
          element={
            <ProtectedRoute>
              <ProductProcess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product-process/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <EditProductProcess />
            </ProtectedRoute>
          }
        />

        {/* Run At Rate Production routes */}
        <Route
          path="/run-at-rate"
          element={
            <ProtectedRoute>
              <RunAtRateProduction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/run-at-rate/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <EditRunAtRateProduction />
            </ProtectedRoute>
          }
        />

        {/* Safety routes */}
        <Route
          path="/safety"
          element={
            <ProtectedRoute>
              <Safety />
            </ProtectedRoute>
          }
        />
        <Route
          path="/safety/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <EditSafety />
            </ProtectedRoute>
          }
        />

        {/* Supply routes */}
        <Route
          path="/supply"
          element={
            <ProtectedRoute>
              <Supp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supply/edit/:id"
          element={
            <ProtectedRoute requiredRoles={logisticRoles}>
              <EditSupp />
            </ProtectedRoute>
          }
        />

        {/* Training routes */}
        <Route
          path="/training"
          element={
            <ProtectedRoute>
              <Training />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <EditTraining />
            </ProtectedRoute>
          }
        />

        {/* Tooling Status routes */}
        <Route
          path="/tooling-status"
          element={
            <ProtectedRoute>
              <ToolingStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tooling-status/edit/:id"
          element={
            <ProtectedRoute requiredRoles={productionRoles}>
              <EditToolingStatus />
            </ProtectedRoute>
          }
        />

        {/* Machine Dashboard route */}
        <Route
          path="/machine-dashboard"
          element={
            <ProtectedRoute>
              <MachineDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
