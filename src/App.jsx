import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./Scrolltop";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";
import LeadershipArticales from "./components/pages/insights/LeadershipArticales";
import LeadershipArticle from "./components/pages/insights/LeadershipArticle";

import Programs from "./components/pages/program/Programs";
import Program from "./components/pages/program/Program";
import FilteredPrograms from "./components/FilteredProgram";
import ManageProgram from "./components/pages/Admin/ManageProgram";
import Subscribe from "./components/pages/Subscribe";
import Calendar from "./components/pages/Calendar";
import BookCall from "./components/pages/BookCall";
import Enroll from "./components/pages/Enroll";
import ManageCallSlots from "./components/pages/Admin/ManageCallSlots";
import ManageInquiries from "./components/pages/Admin/ManageInquiries";
import ManageArticales from "./components/pages/Admin/ManageArticales";
import WaitingList from "./components/pages/Admin/WaitingList";
import AdminLoginAndProtect from "./components/pages/Admin/AdminLoginAndProtect";
import ContactList from "./components/pages/Admin/ContactsList";
import NotFound from "./components/pages/page404";

// products
import ProductList from "./components/pages/product/ProductList";
import ProductDetail from "./components/pages/product/ProductDetail";
import OrderForm from "./components/pages/product/OrderForm";
import ManageProducts from "./components/pages/Admin/ManageProducts";

function App() {
  return (
    <Router>
       <ScrollToTop />
      <Navbar />
      <main className=" md:my-0 bg-red-50">
        <Routes>
          <Route path="/searchProgram" element={<FilteredPrograms />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        
          
          <Route path="/insights" element={<LeadershipArticales />} />
          <Route path="/insights/:id" element={<LeadershipArticle />} />

          {/* Program Pages */}
          <Route path="/programs" element={<Programs />} />
          <Route path="/program/:type/:id" element={<Program />} />{" "}

          {/* Fixed route here */}
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/bookcall" element={<BookCall />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/enroll/:programType/:programId" element={<Enroll />} />
          <Route path="/search" element={<FilteredPrograms />}/> 

          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/order" element={<OrderForm />} />
          

          {/* Admin Pages */}
          <Route
            path="/admin"
            element={
              <AdminLoginAndProtect>
                <ManageProgram />
              </AdminLoginAndProtect>
            }
          />
          <Route
            path="/admin/manageproducts"
            element={
              <AdminLoginAndProtect>
                <ManageProducts />
              </AdminLoginAndProtect>
            }
          />
          <Route
            path="/admin/manageprogram"
            element={
              <AdminLoginAndProtect>
                <ManageProgram />
              </AdminLoginAndProtect>
            }
          />
          <Route
            path="/admin/managecallslots"
            element={
              <AdminLoginAndProtect>
                <ManageCallSlots />
              </AdminLoginAndProtect>
            }
          />
          <Route
            path="/admin/manageinquiries"
            element={
              <AdminLoginAndProtect>
                <ManageInquiries />
              </AdminLoginAndProtect>
            }
          />
          <Route
            path="/admin/managearticales"
            element={
              <AdminLoginAndProtect>
                <ManageArticales />
              </AdminLoginAndProtect>
            }
          />
          <Route
            path="/admin/waitinglist"
            element={
              <AdminLoginAndProtect>
                <WaitingList />
              </AdminLoginAndProtect>
            }
          />
          <Route
            path="/admin/contactlist"
            element={
              <AdminLoginAndProtect>
                <ContactList />
              </AdminLoginAndProtect>
            }
          />
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
