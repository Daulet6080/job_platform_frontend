import BannerCarusel from '../components/BannerCarusel'
import Category from '../components/Category'
import Footer from '../components/Footer'
import Header from '../components/Header'
import NavigationBar from '../components/NavigationBar'
import '../App.css'; 

export default function Home() {
  return (
    <div>
      <Header/>
      <NavigationBar/>
      <BannerCarusel/>
      <Category/>
      <Footer/>
    </div>
  )
}