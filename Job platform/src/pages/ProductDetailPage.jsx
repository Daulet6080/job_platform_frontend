import React from 'react';
import BannerCarusel from '../components/BannerCarusel'
import Footer from '../components/Footer'
import Header from '../components/Header'
import NavigationBar from '../components/NavigationBar'
import ProductDetail from '../components/ProductDetail';

export default function ProductDetailPage() {
  return (
    <div>
      <Header/>
      <NavigationBar/>
      <BannerCarusel/>
      <ProductDetail/>
      <Footer/>
    </div>
  );
}
