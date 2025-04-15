import BannerCarusel from '../../components/BannerCarusel.jsx'
import Category from '../../components/Category.jsx'
import Footer from '../../components/Footer.jsx'
import Header from '../../components/Header.jsx'
import NavigationBar from '../../components/NavigationBar.jsx'
import '../../App.css';

export default function JobSeekerDashboard() {
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