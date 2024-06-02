import React from 'react';
import PageProducts from '../../components/pageProducts/PageProducts';
import { STORE_BOY_PRODUCTS, selectBoyProducts, selectProductBySub } from '../../redux-toolkit/slice/productSlice';


const Nike = () => {
  return (
    <>
      <PageProducts
        currentName='NIKE'
        supplier='Nike'
        fieldValue='giay-nam'
        STORE_NAME_PRODUCTS={STORE_BOY_PRODUCTS}
        selectNameProduct={selectProductBySub}
      />
    </>
  );
};

export default Nike;