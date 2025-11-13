import "./App.css";
// eslint-disable-next-line import/first
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import About from "./about/About";
import Awards from "./about/Awards";
import Directors from "./about/Directors";
import Knowledge from "./about/Knowledge";
import { KnowledgeBaseProvider } from "./about/KnowledgeBaseContext";
import Affiliate from "./Affiliate/Affiliate";
import Affiliatelogin from "./Affiliate/Affiliatelogin";
import AffiliateProducts from "./Affiliate/AffiliateProducts";
import Affiliatesignup from "./Affiliate/Affiliatesignup";
import AssociatesList from "./Associates/AssociatesList";
import Associateslogin from "./Associates/AssociatesLogin";
import Associatessignup from "./Associates/Associatessignup";
import Blog from "./Blog/Blog";
import Blogdetails from "./Blog/Blogdetails";
import Bloodtestkid from "./Bloodtest/Bloodtestkid";
import Fullbodycheckup from "./Bloodtest/Fullbodycheckup";
import Igetest from "./Bloodtest/Igetest";
import Pcodtest from "./Bloodtest/Pcodtest";
import Pragnancybloodtest from "./Bloodtest/Pragnancybloodtest";
import Seniorcitizenfemale from "./Bloodtest/Seniorcitizenfemale";
import Seniorcitizenmale from "./Bloodtest/Seniorcitizenmale";
import Serologytest from "./Bloodtest/Serologytest";
import Swineflue from "./Bloodtest/Swineflue";
import Camping from "./camping/Camping";
import { CustomerProvider } from "./Components/MyContext";
import Center from "./contact/Center";
import Centerdetails from "./contact/Centerdetails";
import Contact from "./contact/Contact";
import Feedback from "./contact/Feedback";
import Joinhandwithus from "./contact/Joinhandwithus";
import Doctor from "./doctor/Doctor";
import Doctorlogin from "./doctor/Doctorlogin";
import Doctorsignup from "./doctor/Doctorsignup";
import Doctorpage from "./doctorpages/Doctorpage";
import Payment from "./E-Commerce/Payment";
import ProductDetails from "./E-Commerce/ProductDetail";
import { ProductList } from "./E-Commerce/ProductList";
import { Test } from "./E-Commerce/Test";
import { WebHookPage } from "./E-Commerce/WebHookPage";
import Footer from "./footer/Footer";
import Forgotpass from "./forgotpassword/Forgotpass";
import Home from "./home/Home";
import Tellusmore from "./home/Tellusmore";
import Hospital from "./hospital/Hospital";
import Hospitallogin from "./hospital/Hospitallogin";
import Hospitalsignup from "./hospital/Hospitalsignup";
import Sterling from "./hospitalpages/Sterling";
import DoctorInquiry from "./inquity/Doctor";
import Patient from "./inquity/Patient";
import Labpage from "./laboraotrypage/Labpage";
import Laboratory from "./laboratory/Laboratory";
import Laboratorypage from "./laboratory/Laboratorypage";
import HomeServiceProvider from "./MedicalServiceAtHome/HomeServiceProviderLogin";
import HomeServiceProviderPage from "./MedicalServiceAtHome/HomeServiceProviderPage";
import HomeServiceProviderRegister from "./MedicalServiceAtHome/HomeServiceProviderRegister";
import HomEquipmentsProviderRegister from "./MedicalEquipmentsAtHome/HomEquipmentsProviderRegister";
import HomeService from "./MedicalServiceAtHome/HomeServices";
import Acceptdoctor from "./meeting/Acceptdoctor";
import Acceptpatient from "./meeting/Acceptpatient";
import Checkout from "./navbar/Checkout";
import Myaccount from "./navbar/Myaccount";
import News from "./News and midia/News";
import Patientlogin from "./patients/Patientlogin";
import Patientsignup from "./patients/Patientsignup";
import Pharmacy from "./pharmacy/Pharmacy";
import Pharmacylogin from "./pharmacy/Pharmacylogin";
import Pharmacysignup from "./pharmacy/Pharmacysignup";
import Pharmacypage from "./pharmacypages/Pharmacypage";
import PrintStatement from "./Print/Printstatment";
import Privacy from "./privacy/Privacy";
import Terms from "./privacy/Terms";
import Policies from "./privacy/Policies";
import Registration from "./registration/Registration";
import Signup from "./registration/Signup";
import Scrolltop from "./scrolltop/Scrolltop";
import Service from "./Service/Service";
import ServiceProvider from "./Service/ServiceProvider";
import ServiceProviderlogin from "./Service/ServiceProviderLogin";
import Testimonial from "./Testimonial/Testimonial";
import Vendorlogin from "./vendor/vendorlogin";
import Vendorpage from "./vendor/vendorpage";
import Vendorsignup from "./vendor/vendorsignup";
import HomeEquipment from "./MedicalEquipmentsAtHome/HomeEquipment";
import HomeEquipmentProviderPage from "./MedicalEquipmentsAtHome/HomeEquipmentProviderPage";
import HomeEquipmentProviderLogin from "./MedicalEquipmentsAtHome/HomeEquipmentProviderLogin";
import Maintenance from "./Maintenance";

function App() {
  return (
    <>
      <Router>
        <KnowledgeBaseProvider>
          <CustomerProvider>
            <ScrollToTop smooth />
            <Scrolltop />
            <Routes>
           
              <Route path="/" element={<Home />} />
              <Route path="/patient-login" element={<Patientlogin />} />
              <Route path="/patient-signup" element={<Patientsignup />} />
              <Route path="/hospital" element={<Hospital />} />
              <Route path="/hospital-login" element={<Hospitallogin />} />
              <Route path="/doctor-login" element={<Doctorlogin />} />
              <Route path="/laboratory-login" element={<Laboratory />} />
              <Route path="/pharmacy-login" element={<Pharmacylogin />} />
              <Route path="/hospital-signup" element={<Hospitalsignup />} />
              <Route path="/pharmacy-signup" element={<Pharmacysignup />} />
              <Route path="/doctor-signup" element={<Doctorsignup />} />
              <Route path="/laboratory" element={<Laboratorypage />} />
              <Route path="/pharmacy" element={<Pharmacy />} />
              <Route path="/doctor" element={<Doctor />} />
              <Route path="/forgotpassword" element={<Forgotpass />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/sign-up" element={<Signup />} />
              <Route path="/privacy-policies" element={<Privacy />} />
              <Route path="/terms-condition" element={<Terms />} />
              <Route path="/policies" element={<Policies />} />
              <Route path="/sterling-hospital" element={<Sterling />} />
              <Route path="/pharmacy-page" element={<Pharmacypage />} />
              <Route path="/patient-inquiry" element={<Patient />} />
              <Route path="/pharmacy-page" element={<Doctor />} />
              <Route path="/doctor-page" element={<Doctorpage />} />
              <Route path="/lab-page" element={<Labpage />} />
              <Route path="/tellusmore" element={<Tellusmore />} />
              <Route path="/camping" element={<Camping />} />
              <Route path="/cms/:_ID" element={<About />} />
              <Route path="/doctor-inquiry" element={<DoctorInquiry />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blogdetails/:id" element={<Blogdetails />} />
              <Route path="/news" element={<News />} />
              <Route path="/awards" element={<Awards />} />
              <Route path="/knowledge" element={<Knowledge />} />
              <Route
                path="/pregnancy-blood-test"
                element={<Pragnancybloodtest />}
              />
              <Route path="/blood-test-kids" element={<Bloodtestkid />} />
              <Route path="/full-body-checkup" element={<Fullbodycheckup />} />
              <Route
                path="/senior-citizen-male"
                element={<Seniorcitizenmale />}
              />
              <Route
                path="/senior-citizen-female"
                element={<Seniorcitizenfemale />}
              />
              <Route path="/swine-flue" element={<Swineflue />} />
              <Route path="/serology-blood-test" element={<Serologytest />} />
              <Route path="/PCOD-pofile-blood-test" element={<Pcodtest />} />
              <Route path="/ige-test" element={<Igetest />} />
              <Route path="/Directors" element={<Directors />} />
              <Route path="/center" element={<Center />} />
              <Route path="/Feedback" element={<Feedback />} />
              <Route path="/centerdetails/:id" element={<Centerdetails />} />
              <Route
                path="/join-handwith-us/:id"
                element={<Joinhandwithus />}
              />
              <Route path="/Testimonial" element={<Testimonial />} />
              <Route path="/product-details/:id" element={<ProductDetails />} />
              <Route path="/view-cart" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/my-account" element={<Myaccount />} />
              <Route path="/doctor/status" element={<Acceptdoctor />} />
              <Route path="/patient/status" element={<Acceptpatient />} />
              <Route path="/print-statement/:id" element={<PrintStatement />} />
              <Route path="/product-list" element={<ProductList />} />

              <Route path="/affiliate" element={<Affiliate />} />
              <Route path="/affiliate-login" element={<Affiliatelogin />} />
              <Route path="/affiliate-signup" element={<Affiliatesignup />} />
              <Route path="/api/test" element={<Test />} />
              <Route path="/webhook-return" element={<WebHookPage />} />
              <Route path="/service" element={<Service />} />
              <Route path="/home-service" element={<HomeService />} />
              <Route path="/home-equipment" element={<HomeEquipment />} />

              {/* product vendor */}
              <Route path="/vendor-signup" element={<Vendorsignup />} />
              <Route path="/vendor-login" element={<Vendorlogin />} />
              <Route path="/vendor/:id" element={<Vendorpage />} />

              <Route
                path="/affiliate-products/:id"
                element={<AffiliateProducts />}
              />

              {/* outside service */}
              <Route
                path="/service-provider/:id"
                element={<ServiceProvider />}
              />
              <Route
                path="/service-provider-login"
                element={<ServiceProviderlogin />}
              />

              {/* medical services at home service provider external link */}
              <Route
                path="/medical-services/service-provider-login"
                element={<HomeServiceProvider />}
              />
              
              <Route
                path="/medical-services/service-provider-register"
                element={<HomeServiceProviderRegister />}
              />

              <Route
                path="/medical-services/service-provider/:id"
                element={<HomeServiceProviderPage />}
              />

               {/* medical equipments at home service provider external link */}
               <Route
                path="/medical-equipments/equipment-provider-register"
                element={<HomEquipmentsProviderRegister />}
              />

              <Route
                path="/medical-equipments/equipment-provider-login"
                element={<HomeEquipmentProviderLogin />}
              />

              <Route
                path="/medical-equipments/equipment-provider/:id"
                element={<HomeEquipmentProviderPage />}
              />

              <Route path="/associates-login" element={<Associateslogin />} />
              <Route path="/associates-signup" element={<Associatessignup />} />
              <Route path="/associates-list" element={<AssociatesList />} />
            </Routes>
            {window.location.pathname == "/" && <Footer />}
          </CustomerProvider>
        </KnowledgeBaseProvider>
      </Router>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Maintenance />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
