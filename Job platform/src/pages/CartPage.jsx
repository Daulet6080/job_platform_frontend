import { Header } from "antd/es/layout/layout";
import NavigationBar from "../components/NavigationBar";
import BannerCarusel from "../components/BannerCarusel";
import Cart from "../components/Cart";
import Footer from "../components/Footer";

export default function CartPage(){
    return(
       <div>
            <Header/>
            <NavigationBar/>
            <BannerCarusel/>
            <Cart/>
            <Footer/>
       </div> 
    )
}