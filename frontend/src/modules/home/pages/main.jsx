import Navbar from '../components/navbar';
import InversionSection from '../components/investment';
import FeaturesSection from '../components/information';
import CreditSimulator from '../components/simulation';
import App from "../components/features";
import Footer from '../components/footer';

export const MainPage = () => (
    <div>
        <Navbar />
        <FeaturesSection />
        <InversionSection/>
        <App/>
       {/* <InversionSection/>*/}
        <CreditSimulator />
        <Footer />
    </div>
);


