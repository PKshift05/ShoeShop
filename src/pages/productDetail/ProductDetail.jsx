
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCartShopping, faChevronLeft, faChevronRight, faCircleCheck, faMinus, faPlus, faStar, faTags, faTruckFast, faWrench } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLoggedIn, selectUserID } from '../../redux-toolkit/slice/authSlice';
import CarLoading from '../../components/carLoading/CarLoading'
import { RESET_PRODUCT_BY_SUP, selectProductBySub, selectProducts } from '../../redux-toolkit/slice/productSlice';
import { Card, ProductItem } from '../../components';
import OverlayProduct from './OverlayProduct';
import { ADD_TO_CART } from '../../redux-toolkit/slice/cartSlice';
import { Skeleton, Spinning } from '../../animation-loading';
import { toast } from 'react-toastify';
import StarsRating from 'react-star-rate';
import { fetchProductDetails, resetProductDetail, selectProducItemtDetails, selectProductDetails, selectProductDetailsLoading } from '../../redux-toolkit/slice/productDetailSlice';
import { addItemToCart } from '../../redux-toolkit/action/cartAction';
import { fetchProductsByCategory } from '../../redux-toolkit/action/productAction';

const solvePrice = (price) => {
  return Number(price).toLocaleString('vi-VN');
}

const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')
  const logined = useSelector(selectIsLoggedIn) || JSON.parse(localStorage.getItem('logined'))
  //
  const [allReviews, setAllReviews] = useState([])
  //
  const [openOverlay, setOpenOverlay] = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  //top prodcut show
  const [idxActive, setIdxActive] = useState(0)
  const [translateShowX, setTranslateShowX] = useState(0)
  const [hoverShowProduct, setHoverShowProduct] = useState(false)
  //bottom product
  const [translateX, setTranslateX] = useState(0)
  const [hoverSimilarProduct, setHoverSimilarProduct] = useState(false)

  const loading = useSelector(selectProductDetailsLoading)
  const [loadingAddtoCart, setLoadingAddtoCart] = useState(false)
  const product = useSelector(selectProductDetails);
  const navigate = useNavigate()

  const products = useSelector(selectProductBySub)
  const ProductDetail = useSelector(selectProducItemtDetails)

  const [quantity, setQuantity] = useState(1)
  

  const [imgProductsPreview, setImgProductsPreview] = useState([])

  console.log(imgProductsPreview)//trả về item là trả về item nào mang giá trị trusy thôi nhé :v short syntax
  const [similarProducts, setSimilarProducts] = useState([])
  const [selectedSize, setSelectedSize] = useState('');
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedQuantitySize, setSelectedQuantitySize] = useState(null);


  useEffect(() => {
    if (id) {
      dispatch(resetProductDetail())
      dispatch(RESET_PRODUCT_BY_SUP())
      dispatch(fetchProductDetails({ code: id }));
      
    }
  }, [id]);

  useEffect(() => {
    if (product && product.length > 0) {
      const sizes = product.map(item => ({ size: item.size, id: item.id, quantity: item.quantity }));
      setAvailableSizes(sizes);
      if (sizes.length > 0) {
        setSelectedSize(sizes[0].size);
        setSelectedProductId(sizes[0].id);
        setSelectedQuantitySize(sizes[0].quantity);
      }
      setImgProductsPreview([]);
      dispatch(fetchProductsByCategory(product[0]?.supplier))

    }
  }, [product]);

  useEffect(() => {
    if (products.items) {
      setSimilarProducts(products.items)
    }
    console.log(similarProducts)
  }, [products])

 

  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    setSelectedSize(newSize);
    const selectedProduct = availableSizes.find(item => item.size === newSize);
    if (selectedProduct) {
      setSelectedProductId(selectedProduct.id);
      setSelectedQuantitySize(selectedProduct.quantity);
    }
  }
  const getReviews = async () => {

  }

  const averageRate = () => {
    const totalRate = allReviews.reduce((total, review) => {
      return total + review.rate;
    }, 0)
    if (allReviews.length === 0) return 0
    return (totalRate / allReviews.length).toFixed(1)
  }

  const solveCategory = (category) => {
    switch (category) {
      case 'giay-nam':
        return 'Giày nam'
      case 'giay-nu':
        return 'Giày nữ'
      case 'giay-tre-em':
        return 'Giày trẻ em'
      default:
        break;
    }
  }




  const detectUser = (functionUser, e) => {
    return functionUser(e)
  }



  const handleAddToCart = async () => {
    if (loading) return;
    console.log(product?.id)
    setLoadingAddtoCart(true);
    try {
      await dispatch(addItemToCart({ productId: selectedProductId, quantity: quantity })).unwrap();
      toast.success('Thêm sản phẩm vào giỏ hàng thành công');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
    } finally {
      setLoadingAddtoCart(false);
    }
  };
  useEffect(() => {
    if (ProductDetail && ProductDetail.images) {
      const imgUrls = ProductDetail.images.split(',').map(url => url.trim());
      setImgProductsPreview([]);
      console.log(imgProductsPreview)
      setImgProductsPreview(imgUrls.filter(item => item));
    }
  }, [ProductDetail]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
    })

    //lấy ra sản phẩm đó lúc vào trang
    getReviews()
  }, [id]) //param là id để xử lí việc vẫn ở trang đó nhưng bấm vào sản phẩm khác (ở Sản phẩm tương tự cuối trang) thì nó phải re-render lại để hiển thị, nếu k có cái này thì hình ảnh vẫn là của sản phẩm trước

  useEffect(() => {
    setIdxActive(translateShowX / 584)
    //
    if (translateShowX < 0) setTranslateShowX((imgProductsPreview.length - 1) * 584)
    else if (translateShowX > (imgProductsPreview.length - 1) * 584) setTranslateShowX(0)
  }, [translateShowX])

  return (
    <>
      <OverlayProduct
        activeImg={activeImg}
        openOverlay={openOverlay}
        setOpenOverlay={setOpenOverlay}
        imgProductsPreview={imgProductsPreview}>
        <div>
          {/* top */}
          <div className="w-full">
            <div className="w-full h-full py-10">
              <div className="max-w-[1230px] h-full mx-auto px-[15px] flex gap-8">
                {/* left  */}
                <div className={`flex-1 ${openOverlay && 'pointer-events-none select-none'}`}>
                  <div
                    onMouseEnter={() => (!loading && setHoverShowProduct(true))}
                    onMouseLeave={() => (!loading && setHoverShowProduct(false))}
                    className="relative mb-4 w-[584px] h-[425px] overflow-hidden whitespace-nowrap">
                    <button
                      className={`${hoverShowProduct ? '' : 'left-2 opacity-0'} hover:text-primary outline-none py-8 px-4 absolute cursor-pointer left-0 top-1/2 translate-y-[-50%] z-30 transition-all ease-in-out duration-500 ${imgProductsPreview.length === 1 ? 'hidden' : ''}`}
                      onClick={() => { setTranslateShowX(translateShowX - 584) }}>
                      <FontAwesomeIcon className='text-[36px]' icon={faChevronLeft} />
                    </button>
                    <Skeleton loading={loading} className='overflow-hidden' rounded='rounded-sm' height='h-full'>
                      <div
                        style={{
                          transform: `translateX(-${translateShowX}px)`
                        }}
                        className='h-full transition-all ease-in-out duration-300'>
                        {imgProductsPreview.map((imgProduct, idx) => (
                          <img
                            key={idx}
                            onClick={async () => {
                              await new Promise((resolve) => {
                                window.scroll({
                                  top: 0,
                                  behavior: 'smooth'
                                })
                                resolve()
                              })
                              setActiveImg(idx)
                              setOpenOverlay(true)
                            }}
                            className='inline-flex w-[584px] h-full cursor-pointer object-contain' src={imgProduct} alt="" />
                        ))}
                      </div>
                    </Skeleton>

                    <button
                      className={`${hoverShowProduct ? '' : 'right-2 opacity-0'} hover:text-primary outline-none py-8 px-4 absolute cursor-pointer right-0 top-1/2 translate-y-[-50%] z-30 transition-all ease-in-out duration-500 ${imgProductsPreview.length === 1 ? 'hidden' : ''}`}
                      onClick={() => { setTranslateShowX(translateShowX + 584) }}>
                      <FontAwesomeIcon className='text-[36px]' icon={faChevronRight} />
                    </button>
                  </div>

                  <div className="w-full h-[70px] min-[1024px]:h-[95px] mb-6">
                    {/* fix height cứng để slide nè, responsive cẩn thận nhé */}
                    <div className="w-[584px] h-full cursor-grab overflow-hidden whitespace-nowrap">
                      {(imgProductsPreview.length === 0
                        ? Array(5).fill()
                        : imgProductsPreview).map((imgProduct, idx) => (
                          <div
                            onClick={() => {
                              setIdxActive(idx)
                              setTranslateShowX(idx * 584)
                            }}
                            key={idx}
                            className={`inline-flex ${idx > 0 ? 'pl-[10px]' : ''} w-1/5 h-full`}>
                            <Skeleton className='overflow-hidden' loading={loading} rounded='rounded-[4px]' width='w-full'>
                              <img
                                className={`cursor-pointer border-[2px] rounded-[4px] ${idxActive === idx ? 'border-bgPrimary' : ' border-[#aaa] opacity-40'} h-full inline-block w-full object-contain transition-all ease-in-out duration-150 `}
                                src={imgProduct || ''}
                                alt="" />
                            </Skeleton>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* right */}
                <div className="flex-1 pb-[30px]">
                  <nav className='text-[#94949e] uppercase text-[14px]'>
                    <Skeleton className='overflow-hidden' loading={loading} rounded='rounded-[4px]'>
                      <NavLink className='transition-all ease-linear duration-100 hover:text-bgPrimary hover:opacity-70mb-2' to='/'>Trang chủ</NavLink>
                      <div className="mx-2 inline-block">/</div>
                      <NavLink
                        to={`/${ProductDetail.supplier}`}
                        className='transition-all ease-linear duration-100 hover:text-bgPrimary hover:opacity-70mb-2'>{ProductDetail.supplier}</NavLink>
                    </Skeleton>
                  </nav>
                  <div className={`${loading && 'mt-[14px] mb-[14px]'}`}>
                    <Skeleton className='overflow-hidden' loading={loading} rounded='rounded-[4px]'>
                      <h1 className='text-[28px] text-bgPrimary font-semibold'>
                        {ProductDetail.name || 'Day la ten san pham de chay skeleton'}
                      </h1>
                    </Skeleton>
                  </div>
                  <Skeleton
                    loading={loading} className='inline-flex overflow-hidden' rounded='rounded-[4px]'>
                    <div className="inline-flex gap-3">
                      <div className="">
                        <FontAwesomeIcon className='text-[#f9dc4b] text-[18px] mr-2' icon={faStar} />
                        <p className='inline-block text-[#767676] font-medium'>
                          {averageRate() || 0}
                        </p>
                      </div>
                      <div className="w-[2px] bg-[#e6e6e6]"></div>
                      <p className='text-[#767676] font-medium'>{allReviews.length} Đánh giá</p>
                    </div>
                  </Skeleton>
                  <Skeleton loading={loading} className='mt-4 mb-4 overflow-hidden'>
                    <div className={`flex items-center gap-3 ${loading && 'mt-4 mb-4'}`}>
                      {/* cái đề để tránh flex nó làm cho height tăng theo thằng con dài nhất mà mình chỉ muốn nó py-1 theo font thui */}
                      <div className="">
                        <div className="inline-flex rounded-[12px] items-center gap-1 w-auto bg-[#6ab87e]/20 py-1 px-2">
                          <FontAwesomeIcon className='text-[#6ab87e] text-[14px]' icon={faTags} />
                          <p className='text-[#6ab87e] font-medium text-[14px]'>{ProductDetail.discount * 100}%</p>
                        </div>
                      </div>
                      <p className="inline-block line-through text-[#aaa] text-[16px]">
                        {solvePrice(Math.floor(ProductDetail.price))}
                        <span className='text-[14px] align-top'>₫</span>
                      </p>
                      <p className="inline-block font-semibold text-[26px] text-bgPrimary">
                        {solvePrice(ProductDetail.price - ProductDetail.price * ProductDetail.discount)}
                        <span className='text-[22px] align-top'>₫</span>
                      </p>
                    </div>
                  </Skeleton>
                  <Skeleton loading={loading} className='my-[10px] h-[8px] inline-block overflow-hidden'>
                    <div className="w-[50px] h-[2px] bg-black/20"></div>
                  </Skeleton>
                  <Skeleton loading={loading} className='mb-[20px] overflow-hidden'>
                    <div className={`${!loading && 'mb-[20px]'} grid grid-cols-5 items-start`}>
                      <div className="col-span-1 mb-3 font-medium text-[18px] text-[#1b1b1b] inline-flex items-center gap-3">
                        <p className=''>Vận chuyển</p>
                      </div>
                      <div className='col-span-4 inline-flex flex-col'>
                        <div className="flex gap-2">
                          <FontAwesomeIcon className='text-[#00c7a3] text-[18px] mt-1' icon={faTruckFast} />
                          <p className='text-[16px] font-medium'>Miễn phí vận chuyển</p>
                        </div>
                        <p className='text-[16px] opacity-80 ml-[30px]'>Miễn phí vận chuyển cho đơn hàng trên 850.000₫</p>
                      </div>
                    </div>
                  </Skeleton>
                  <div className='flex gap-2'>

                    <Skeleton className='overflow-hidden' loading={loading} rounded='rounded-[4px]'>
                      <div className=" mb-3 mt-1 font-medium text-[18px] text-[#1b1b1b]">Size</div>
                    </Skeleton>
                    <Skeleton className='overflow-hidden' loading={loading} rounded='rounded-[4px]'>
                      <div className="w-full flex items-center gap-2">
                        <select
                          className=" h-[40px] text-center outline-none border rounded-sm"
                          value={selectedSize}
                          onChange={handleSizeChange}>
                          {availableSizes.map((size, idx) => (
                            <option key={idx} value={size.size}>{size.size}</option>
                          ))}
                        </select>
                      </div>
                    </Skeleton>
                  </div>

                  <Skeleton loading={loading} className='mb-[20px] overflow-hidden'>
                    <div className={`${!loading && 'mb-[20px]'} grid grid-cols-5 items-center`}>
                      <div className="col-span-1 mb-3 mt-3 font-medium text-[18px] text-[#1b1b1b] inline-flex items-center gap-3">
                        <p className=''>Số lượng</p>
                      </div>
                      {/* input */}
                      <div className='col-span-1 inline-flex'>
                        <div className="flex items-center justify-center gap-6 px-3 py-1 border border-[#ccc] font-bold">
                          <button
                            onClick={() => {
                              if (quantity > 1) setQuantity(quantity - 1)
                            }}
                            type='button' className='flex items-center outline-none text-bgPrimary font-medium '>
                            <FontAwesomeIcon className='text-[24px] font-medium' icon={faMinus} />
                          </button>
                          <div
                            value={quantity}
                            className='text-bgPrimary outline-none text-center text-[18px] font-medium' > {quantity < 10 ? `0${quantity}` : quantity}
                          </div>
                          <button
                            onClick={() => {
                              //chỉ đc set đến max số lượng tồn kho
                              setQuantity(quantity + 1)
                            }}
                            type='button' className='flex items-center outline-none text-bgPrimary font-medium '>
                            <FontAwesomeIcon className='text-[24px] font-medium' icon={faPlus} />
                          </button>
                        </div>
                      </div>
                      <div className="col-span-2 flex gap-2 ml-4 items-center">
                        <div className="w-[2px] h-6 bg-[#e6e6e6]"></div>
                        <span className="text-[#757575] text-[12px]">
                          {selectedQuantitySize < 1 ? 'hết hàng' : `còn ${selectedQuantitySize} sản phẩm`}
                        </span>

                      </div>
                    </div>
                  </Skeleton>
                  {/* <div className="mb-[15px]">
                      <p className='font-medium text-[18px] text-[#1b1b1b] mb-3'>

                      </p>
                    </div> */}
                  <Skeleton loading={loading} className='inline-block mb-[25px] w-[373px] h-[46px] overflow-hidden'>
                    <div className={`${!loading && 'mb-[25px]'} inline-grid grid-cols-12 gap-6 w-[373px] h-[46px]`}>
                      <button
                        onClick={(e) => {
                          if (!logined) navigate('/dang-nhap')
                          else detectUser(handleAddToCart, e)
                        }}
                        className='col-span-7 h-full px-3 bg-primary text-white text-[16px] leading-[37px] font-bold tracking-[1px] uppercase transition-all ease-in duration-150 focus:outline-none hover:bg-[#a40206]'>
                        {loadingAddtoCart
                          ? <Spinning />
                          : <div className="flex gap-2 items-center justify-center">
                            <FontAwesomeIcon className='text-[18px]' icon={faCartShopping} />
                            Thêm vào giỏ
                          </div>}
                      </button>
                    </div>
                  </Skeleton>
                  <Skeleton loading={loading} className={loading && 'overflow-hidden'}>
                    <div className="w-full py-4 px-6 shadow-shadowHover">
                      <p className="font-bold text-[18px] leading-[22px] mt-1 mb-5">Quyền lợi khách hàng & Bảo hành</p>
                      <div className="inline-flex gap-2 my-2">
                        <FontAwesomeIcon className='text-[#6ab87e] text-[22px]' icon={faCircleCheck} />
                        <p className='text-[16px] font-bold'>Chính sách hoàn trả của ShoesPlus</p>
                      </div>
                      <p className='text-[16px] ml-[30px]'>Trả hàng hoàn tiền trong vòng 48 giờ cho các sản phẩm bị lỗi kỹ thuật, bể vỡ, không đúng mô tả hoặc không đúng như đơn đặt hàng.</p>

                      <div className="inline-flex gap-2 my-2">
                        <FontAwesomeIcon className='text-[#6ab87e] text-[22px]' icon={faCircleCheck} />
                        <p className='text-[16px] font-bold'>Chính sách bảo hành của ShoesPlus</p>
                      </div>
                      <p className='text-[16px] ml-[30px]'>Bảo hành bao gồm các lỗi do nhà sản xuất như lỗi về chất liệu, lỗi thiết kế. Không bao gồm các lỗi do sử dụng sai cách hoặc tai nạn gây ra.</p>
                    </div>
                  </Skeleton>
                </div>
              </div>
            </div>
          </div>

          {/* bottom */}
          {!loading && (
            <div className="w-full">
              <div className="max-w-[1230px] h-full px-[15px] mx-auto">
                {/* thong tin bo sung */}
                <div className="w-full h-full pt-[36px] pb-[8px] border border-transparent border-t-[#ddd]">
                  <div className="w-full h-full p-[20px]  border-[#ddd]">
                    <div className="pb-[8px]">
                      <h1 className='font-bold text-[18px] leading-[32px] text-[#1c1c1c] uppercase'>Thông tin bổ sung</h1>
                    </div>
                    <div className="w-[50px] h-[3px] mt-1 mb-3 bg-red-600"></div>
                    <div className="flex flex-col w-full">
                      <div className="grid grid-cols-12 justify-between py-[12px] border-top border-bottom border-transparent border-b-[#ddd]">
                        <h1 className='col-span-3 font-bold text-[14px] uppercase leading-[15x] text-[#353535]'>Danh mục</h1>
                        <p className='col-span-9 leading-[24px] text-[#666]'>{ProductDetail.category}</p>
                      </div>
                      <div className="grid grid-cols-12 justify-between py-[12px]  border-bottom border-transparent border-b-[#ddd]">
                        <h1 className='col-span-3 font-bold text-[14px] uppercase leading-[15x] text-[#353535]'>Thương hiệu</h1>
                        <p className='col-span-9 leading-[24px] text-[#666]'>{ProductDetail.supplier}</p>
                      </div>
                      <div className="grid grid-cols-12 justify-between pt-[12px]">
                        <h1 className='col-span-3 font-bold text-[14px] uppercase leading-[15x] text-[#353535]'>Mô tả sản phẩm</h1>
                        <p className='col-span-9 leading-[24px] text-[#666]'>{ProductDetail.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* danh gia */}
                <div className="w-full h-full py-[20px] mt-2">
                  <div className="w-full h-full p-[20px] border border-[#ddd]">
                    <div className="pb-2">
                      <h1 className='font-bold text-[18px] leading-[32px] text-[#1c1c1c] uppercase'>Đánh giá sản phẩm</h1>
                    </div>
                    <div className="w-[50px] h-[3px] my-2 bg-red-600"></div>
                    <div className="flex flex-col w-full">
                      {/* no have comment */}
                      {/* <div className="w-full min-h-[200px] flex flex-col gap-4 items-center justify-center">
                        <img src="../../noHaveComment.png" alt="" />
                        <p className='text-[18px] font-medium opacity-75'>Chưa có đánh giá</p>
                      </div> */}
                      {/*comment */}
                      {allReviews.length === 0
                        ? <div className="w-full flex flex-col gap-4 items-center justify-center">
                          <img
                            className=''
                            src="../../noHaveComment.png" alt="" />
                          <p className='text-[17px] text-center'>Hiện chưa có đánh giá nào</p>
                        </div>
                        : (
                          <div className="">
                            {allReviews.map((review, idx) => {
                              return (
                                <div
                                  key={idx}
                                  className={`flex gap-4 pt-5 ${idx < allReviews.length - 1 ? 'border border-transparent border-b-[#ddd] pb-8' : ''}`}>
                                  <div className="w-[50px] h-[50px] rounded-full border border-[#ddd] overflow-hidden">
                                    {/* phải xử lí nếu nó không có avatar thì cho avatar mặc định */}
                                    <img className='w-full h-full object-contain'
                                      src={review.imgAvatar}
                                      alt="" />
                                  </div>
                                  <div className="flex-1 flex flex-col">
                                    <span className='font-medium'>{review.displayName}</span>
                                    <div className="text-[14px] detail-product-star">
                                      <StarsRating
                                        disabled
                                        value={review.rate}
                                      />
                                    </div>
                                    <div className="text-black opacity-50 text-[14px] mt-2">
                                      {`${review.orderDate} ${review.orderTime} | Phân loại hàng: ${ProductDetail.category}`}
                                    </div>
                                    <div className="mt-2  ">{review.typeReview}</div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* sp tuong tu */}
                <div className="w-full h-full pt-4 pb-[20px]">
                  <div className="w-full h-full">
                    <div className="ml-5 pb-[8px]">
                      <h1 className='font-bold text-[18px] leading-[32px] text-[#1c1c1c] uppercase'>Sản phẩm tương tự</h1>
                    </div>
                    <div className="ml-5 w-[50px] h-[3px] mt-1 mb-5 bg-red-600"></div>

                    <div
                      onMouseEnter={() => setHoverSimilarProduct(true)}
                      onMouseLeave={() => setHoverSimilarProduct(false)}
                      className="w-full relative">
                      {/* icon left */}
                      <div
                        // 240 là width của từng phần tử, nếu responsive thì thay đổi đi
                        //tức là mỗi lần nhấn thì sang trái 1 phần tử (240px)
                        onClick={() => setTranslateX(translateX - 240)}
                        className={`absolute ${hoverSimilarProduct ? 'w-[60px] h-[60px] shadow-shadowAuth' : 'w-[46px] h-[46px] shadow-shadowAccount'} bg-white text-bgPrimary rounded-full left-[-22px] top-1/2 translate-y-[-60%] flex items-center justify-center cursor-pointer transition-all ease-in-out duration-200 z-30 ${translateX === 0 ? 'hidden' : ''}`}>
                        <FontAwesomeIcon className='text-[20px]' icon={faArrowLeft} />
                      </div>
                      {/* main */}
                      <div className="overflow-hidden whitespace-nowrap h-[309px]">
                        <div
                          style={{
                            transform: `translateX(-${translateX}px)`
                          }}
                          className="w-full transition-all ease-linear duration-300">
                          {similarProducts.map((item, idx) => (
                            <div
                              key={idx}
                              // nếu trên điện thoại thì đổi w-1/5 thành w-1/3 hoặc w-1/2 nhé
                              className="inline-flex w-1/5 px-[10px] pb-5 h-full select-none">
                              <Card width='w-full' >
                                <ProductItem
                                  productId={item?.id}
                                  productCode={item?.productCode}
                                  img={item?.images ? item.images.split(',')[0].trim() : ''}
                                  name={item?.name}
                                  price={solvePrice(item?.price)}

                                  text='Mua hàng'
                                  //prevLink là id của cái trang hiện tại chứa sp, chứ kp item.id nhé
                                  setLoadingPage={loading}
                                  //top
                                  setIdxActive={setIdxActive}
                                  setHoverShowProduct={setHoverShowProduct}
                                  setTranslateShowX={setTranslateShowX}
                                  //2 thằng set bên dưới là xử lí khi ấn vào 1 sp ở similar Products qua sp đó rùi, nhưng nếu không set về 0 và về false thì qua sp mới nó vẫn bị như lúc cũ, bỏ ra chạy thử là biết
                                  setTranslateX={setTranslateX}
                                  setHoverSimilarProduct={setHoverSimilarProduct}

                                />
                              </Card>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* icon right */}
                      <div
                        // 240 là width của từng phần tử, nếu responsive thì thay đổi đi
                        //tức là mỗi lần nhấn thì sang phải 1 phần tử (240px)
                        onClick={() => setTranslateX(translateX + 240)}
                        className={`absolute ${hoverSimilarProduct ? 'w-[60px] h-[60px] shadow-shadowAuth' : 'w-[46px] h-[46px] shadow-shadowAccount'} bg-white text-bgPrimary rounded-full right-[-22px] top-1/2 translate-y-[-60%] flex items-center justify-center cursor-pointer transition-all ease-linear duration-200 z-30 ${translateX === (similarProducts.length - 5) * 240 ? 'hidden' : ''}`}>
                        <FontAwesomeIcon className='text-[18px]' icon={faArrowRight} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </OverlayProduct>
    </>
  );
};

export default ProductDetail;