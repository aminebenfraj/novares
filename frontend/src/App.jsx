import { Routes, Route } from 'react-router-dom';
import Showpd from './pages/productDesignation/productDesignation-form';
import Createpd from './pages/productDesignation/productDesignation-table';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { AuthProvider } from './context/AuthContext';
import MassProductionForm from './pages/MassProductionForm/MassProductionForm';
import MassProductionEdit from './pages/MassProductionForm/EditMassProductionForm';
import MassProductionTable from './pages/MassProductionForm/MassProductionList'

import { Home } from './pages/homepage/Home';
import  Test  from './pages/D01/Test';
import  Test1  from './pages/D01/Test1';
import  Test2  from './pages/D01/Test2';
import  Test3  from './pages/D01/Test3';
import  Test4  from './pages/D01/Test4';
import  Test5  from './pages/D01/Test5';
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

function App() {
  return (
      <AuthProvider>
    <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/pd/create" element={<Showpd />} />
          <Route path="/pd" element={<Createpd />} />
          <Route path="/masspd/create" element={<MassProductionForm />} />
          <Route path="/masspd/edit/:id" element={<MassProductionEdit />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/masspd" element={<MassProductionTable />} />
          <Route path="/test" element={<Test />} />
          <Route path="/test1" element={<Test1 />} />
          <Route path="/test2" element={<Test2 />} />
          <Route path="/test3" element={<Test3 />} />
          <Route path="/test4" element={<Test4 />} />
          <Route path="/test5" element={<Test5 />} />
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
        <Route path="task/edit/:id" element={<EditTask />} />
        <Route path="kickoff/edit/:id" element={<EditKickOff />} />
        <Route path="kickoff" element={<KickOffList />} />
        <Route path="kickoff/create" element={<KickOffForm />} />
    </Routes>
      </AuthProvider>
  );
}

export default App;
