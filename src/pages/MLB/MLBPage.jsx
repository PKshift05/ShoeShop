import React from 'react';
import PageProducts from '../../components/pageProducts/PageProducts';
import { STORE_CHILD_PRODUCTS, selectChildProducts, selectProductBySub } from '../../redux-toolkit/slice/productSlice';


const MLB = () => {
  return (
    <>
      <PageProducts
        currentName='MLB'
        supplier='MLB'
        fieldValue='giay-tre-em'
        STORE_NAME_PRODUCTS={STORE_CHILD_PRODUCTS}
        selectNameProduct={selectProductBySub} />
    </>
  );
};

export default MLB;