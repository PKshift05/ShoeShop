import React, { useEffect, useRef, useState } from 'react';
import InputForm from '../inputForm/InputForm';
import { NavLink } from 'react-router-dom';
import { Card, ProductItem } from '..';
import NewestProduct from './NewestProduct';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../pagination/Pagination';
import { Skeleton } from '../../animation-loading';
import { fetchProductsByCategory } from '../../redux-toolkit/action/productAction';

import { RESET_PRODUCT_BY_SUP, selectProductBySub } from '../../redux-toolkit/slice/productSlice';
import ValueFilter from './ValueFilter';

const solvePrice = (price) => {
  return Number(price).toLocaleString('vi-VN');
}

const itemsPerPage = 8;

const PageProducts = ({ currentName, supplier, fieldValue, STORE_NAME_PRODUCTS, selectNameProduct }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [productPreview, setProductPreview] = useState([]);
  const filterRef = useRef();
  const queryRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fromPrice, setFromPrice] = useState(null);
  const [toPrice, setToPrice] = useState(null);
  const [fromPriceValue, setFromPriceValue] = useState(null);
  const [toPriceValue, setToPriceValue] = useState(null);
  
  const productsBySub = useSelector(selectProductBySub);

  useEffect(() => {
    dispatch(RESET_PRODUCT_BY_SUP());
    dispatch(fetchProductsByCategory({ supplier, pageNum: currentPage, pageSize: itemsPerPage, category: selectedCategory, fromPrice, toPrice }));
  }, [dispatch, supplier, currentPage, selectedCategory, fromPrice, toPrice]);

  useEffect(() => {
    if (productsBySub.items) {
      setProductPreview(productsBySub.items);
      setLoading(productsBySub.status !== 'succeeded');
    }
  }, [productsBySub]);

  const solveQuery = (value) => {
    switch (value) {
      case 'latest':
        return { field: 'createAt', order: -1 };
      case 'oldest':
        return { field: 'createAt', order: 1 };
      case 'lowest-price':
        return { field: 'price', order: 1 };
      case 'highest-price':
        return { field: 'price', order: -1 };
      case 'a-z':
        return { field: 'name', order: 1 };
      case 'z-a':
        return { field: 'name', order: -1 };
      default:
        return { field: 'createAt', order: -1 };
    }
  }

  const handleFilterProduct = (e) => {
    const value = e.target.value;
    if (value === 'all') {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(value);
    }
    setCurrentPage(1);
  }

  const categoryMapping = {
    Adidas: ['Entrap', 'Super Start'],
    Nike: ['AF1', 'Low Jordan'],
    MLB: ['Liner'],
  };
  console.log(supplier)
  const categoryOptions = categoryMapping[supplier] || [];
  const handleQueryProduct = (e) => {
    const query = solveQuery(e.target.value);
    const sortedProducts = [...productPreview].sort((a, b) => {
      if (query.order === 1) {
        return a[query.field] > b[query.field] ? 1 : -1;
      } else {
        return a[query.field] < b[query.field] ? 1 : -1;
      }
    });
    setProductPreview(sortedProducts);
    setCurrentPage(1);
  }

  const handleFromPriceChange = (e) => {
    setFromPrice(e.target.value);
  };

  const handleToPriceChange = (e) => {
    setToPrice(e.target.value);
  };
  const handlePriceFilter = () => {
    setFromPrice(fromPriceValue);
    setToPrice(toPriceValue);
    setFromPriceValue(null);
    setToPriceValue(null);
    setCurrentPage(1);
  }

  console.log(productPreview.length > itemsPerPage)
  console.log(productsBySub.total)

  return (
    <>
      <div className='min-h-[666px]'>
        <div className="max-w-[1230px] px-[15px] mx-auto min-h-[60px] pt-5 flex items-center justify-between">
          <div className="flex-1">
            <NavLink to='/' className='uppercase text-[18px] text-[#95959f]'>
              Trang chủ
            </NavLink>
            <div className="mx-2 inline-block">/</div>
            <span className='uppercase text-[18px] font-bold '>{currentName}</span>
          </div>
          <div className="flex items-center">
            <p className='inline-block text-[16px] text-[#353535] mr-8'>
              <span className='font-bold'>Số lượng</span>: {productsBySub.total} sản phẩm
            </p>
            <select
              ref={queryRef}
              onChange={handleQueryProduct}
              className='outline-none mr-[12px] px-3 py-3 pr-16 text-bgPrimary cursor-pointer border bg-white border-solid border-[#ccc] shadow-shadowSearch'
              name="sort-by" id="">
              <option key='0' value="default">Sắp xếp theo</option>
              <option key='1' value="latest">Mới nhất</option>
              <option key='2' value="oldest">Cũ nhất</option>
              <option key='3' value="lowest-price">Giá tăng dần</option>
              <option key='4' value="highest-price">Giá giảm dần</option>
              <option key='5' value="a-z">A - Z</option>
              <option key='6' value="z-a">Z - A</option>
            </select>
            <>
              <select
                ref={filterRef}
                onChange={handleFilterProduct}
                className='outline-none mr-[12px] px-3 py-3 pr-16 text-bgPrimary cursor-pointer border bg-white border-solid border-[#ccc] shadow-shadowSearch'
                name="sort-by"
                id=""
              >
                <option key='0' value="default">Lọc sản phẩm theo</option>
                <option key='1' value="all">Tất cả</option>
                {categoryOptions.map((category, idx) => (
                  <option key={idx + 1} value={category}>{category}</option>
                ))}
              </select>
            </>
            {/* <div className="flex items-center">
              <input type="number" id="fromPrice" placeholder="From Price" className="outline-none mr-[12px] px-3 py-3 text-bgPrimary border bg-white border-solid border-[#ccc] shadow-shadowSearch" />
              <input type="number" id="toPrice" placeholder="To Price" className="outline-none mr-[12px] px-3 py-3 text-bgPrimary border bg-white border-solid border-[#ccc] shadow-shadowSearch" />
              <button onClick={handlePriceFilter} className="px-3 py-3 text-bgPrimary cursor-pointer border bg-white border-solid border-[#ccc] shadow-shadowSearch">Filter</button>
            </div> */}
          </div>
        </div>

        <div className="w-full">
          <div className='max-w-[1230px] min-h-[666px] pt-[30px] mx-auto flex'>
            <div className='max-w-[25%] px-[15px] pb-[30px]'>
              <div className="w-full ">
                {/* <ValueFilter
                  productPreview={productPreview}
                  setProductPreview={setProductPreview}
                  queryRef={queryRef}
                  filterRef={filterRef}
                  selectNameProduct={selectNameProduct}
                  setCurrentPage={setCurrentPage}
                /> */}
                <aside className="w-full">
                  <p className='font-bold text-bgPrimary text-[16px] uppercase tracking-widest'>Khoảng giá</p>
                  <div className={`w-full my-5 flex items-center gap-3`}>
                    <input className='w-1/2 py-2 bg-white border'
                      value={fromPrice}
                      type='number'
                      onChange={(e) => setFromPrice(e.target.value)}
                      placeholder='VNĐ'
                      id='fromPrice'
                      maxLength={7}
                    // borderColor={`${errorRange ? 'border-primary' : ''}`}
                    />
                    <div className="w-[24px] h-[2px] bg-[#aaa] "></div>
                    <input className='w-1/2 py-2 bg-white border'
                      value={toPrice}
                      type='number'
                      placeholder='VNĐ'
                      onChange={(e) => setToPrice(e.target.value)}
                      id='toPrice'
                      maxLength={7}
                    // borderColor={`${errorRange ? 'border-primary' : ''}`}
                    />
                  </div>
                  <div className="flex gap-2 items-center">

                    <button onClick={handlePriceFilter} className="bg-[#666] rounded-full text-white text-[16px] py-[6px] px-6">
                      Lọc
                    </button>
                  </div>
                </aside>


                <NewestProduct loading={loading} productDemo={productPreview} />
              </div>
            </div>

            <div className="flex-1">
              {productPreview.length === 0 && !loading ? (
                <div className='flex flex-col items-center'>
                  <img className='w-[350px] object-cover' src="./notFound.jpg" alt="Not Found" />
                  <h1 className='text-[26px] text-center text-bgPrimary font-mono'>Không tìm thấy sản phẩm nào</h1>
                </div>
              ) : (
                <>
                  <div className={`px-[15px] ${productPreview.length > 0 && 'min-h-[596px]'} grid grid-cols-4`}>
                    {(productPreview.length === 0 ? Array(8).fill() : productPreview).map((item, idx) => (
                      <div key={idx} className="w-full px-[10px] pb-5">
                        <Skeleton loading={loading} className={`${loading && 'overflow-hidden rounded-[6px]'}`}>
                          <Card width='w-full' >
                            <ProductItem
                              productId={item?.id}
                              productCode={item?.productCode}
                              img={item?.images ? item.images.split(',')[0].trim() : ''}
                              name={item?.name}
                              price={solvePrice(item?.price)}
                              idURL={fieldValue}
                              text='Mua hàng'
                            />
                          </Card>
                        </Skeleton>
                      </div>
                    ))}
                  </div>
                  {productsBySub?.total > itemsPerPage && ( // Corrected condition
                    <Pagination
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      itemsPerPage={itemsPerPage}
                      totalItems={productsBySub.total} // Pass total number of items for pagination
                    />

                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageProducts;
