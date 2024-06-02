import React from 'react';
import PageProducts from '../../components/pageProducts/PageProducts';
import { STORE_GIRL_PRODUCTS, selectGirlProducts, selectProductBySub } from '../../redux-toolkit/slice/productSlice';

const Adidas = () => {
  return (
    <>
      <PageProducts
        currentName='Adidas'
        supplier='Adidas'
        fieldValue='giay-nu'
        STORE_NAME_PRODUCTS={STORE_GIRL_PRODUCTS}
        selectNameProduct={selectProductBySub} />
    </>
  );
};

export default Adidas;
