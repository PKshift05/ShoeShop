import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { selectEmail, selectUserID, selectUserName } from '../../redux-toolkit/slice/authSlice';

import { OverlayLoading, Skeleton } from '../../animation-loading';
import Review from '../review/Review';
import { selectOrderDetail } from '../../redux-toolkit/slice/orderSlice';
import { fetchOrderDetails } from '../../redux-toolkit/action/orderAction';

const OrderDetail = () => {
  const { id } = useParams()
  const [openReview, setOpenReview] = useState(false)
  const [reviewDone, setReviewDone] = useState(false)
  const [review, setReview] = useState('')
  const dispatch = useDispatch();
  const { OrderDetail, loading, error } = useSelector((state) => state.orders);
  // const userID = useSelector(selectUserID) || localStorage.getItem('userID')
  const displayEmail = localStorage.getItem('displayEmail')
  const displayName = localStorage.getItem('displayName')
  const getOrder = async () => {
    dispatch(fetchOrderDetails(id))
  }

  const getReview = async () => {


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

  const solveBrand = (brand) => {
    switch (brand) {
      case 'classic':
        return 'Classic'
      case 'sunbaked':
        return 'Sunbaked'
      case 'chuck-07s':
        return 'Chuck 07S'
      case 'one-star':
        return 'One Star'
      case 'psy-kicks':
        return 'PSY Kicks'
      default:
        break;
    }
  }
  const totalPrice = OrderDetail?.reduce((total, order) => total + order.price * order.quantity, 0);
  const totalDeliverFee = OrderDetail[0]?.shippingFee
  const totalDiscount = OrderDetail?.reduce((total, order) => total + order.price * order.discount * order.quantity, 0);
  const totalOrder = totalPrice + totalDeliverFee - totalDiscount
  const solvePrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
    getOrder()
  }, [])

  useEffect(() => {
    getReview()
  }, [OrderDetail, reviewDone])

  console.log(OrderDetail)
  return (
    <>
      <OverlayLoading loading={loading}>
        {/* <Review
          id={OrderDetail.orderId}
          openReview={openReview}
          setOpenReview={setOpenReview}
          setReviewDone={setReviewDone}
          review={review}
          orderID={OrderDetail.orderId}> */}
        <div className={`w-full py-[30px] ${loading && 'blur-[2px]'}`}>
          <div className="max-w-[1230px] mx-auto ">
            <div className="w-full px-[15px] pb-[30px]">
              <div className="w-full flex">
                <form className='w-full flex'>
                  {/* left */}
                  <div className="basis-[58.33%] pr-[30px] flex flex-col gap-5">
                    <div className="w-full">
                      <div className="flex items-center">
                        <h1 className='text-[22px] text-bgPrimary font-bold uppercase'>
                          Chi tiết đơn hàng
                        </h1>
                        <div className="inline-flex px-2 border border-[#777] ml-2 text-[16px]  items-center justify-center">
                          <p className="inline-block text-primary uppercase">{OrderDetail[0]?.status}</p>
                        </div>
                      </div>
                      <div className="w-[50px] h-[3px] my-[10px] bg-red-600"></div>
                      <div className="">
                        <div className="flex justify-between uppercase font-bold border-[2px] border-transparent border-b-[#ccc]">
                          <h2 className='text-[14px] tracking-widest text-bgPrimary py-2'>Sản phẩm</h2>
                          <h2 className='text-[14px] tracking-widest text-bgPrimary py-2'>Tổng</h2>
                        </div>
                        <div >
                          {OrderDetail?.map((order, index) => (
                            <div key={index} className="flex items-center justify-between border border-transparent border-b-[#ddd]">
                              <div className="flex pb-4 mt-4">
                                <Skeleton loading={loading}>
                                  <NavLink
                                    to={`/san-pham/${order?.productCode}`}
                                    className=''>
                                    <img className="h-[80px] object-cover"
                                      src={order?.path ?order.path.split(',')[0].trim() : '' } alt="" />
                                  </NavLink>
                                </Skeleton>
                                <div className="pl-4">
                                  <div className="">
                                    <Skeleton loading={loading}>
                                      <NavLink
                                        to={`/san-pham/${order?.productCode}`}
                                        className='text-[#334862]'>
                                        {order?.productName || 'day la ten de chay skeleton'}
                                      </NavLink>
                                    </Skeleton>
                                    <Skeleton loading={loading} className='inline-block'>
                                      <p className='inline-block ml-1'> ×{order?.quantity}</p>
                                    </Skeleton>
                                  </div>
                                  <Skeleton loading={loading}>
                                    <div className="text-[14px] text-[#777]">
                                      <p className="mr-1 inline-block">Phân loại hàng:</p>
                                      {/* {`${solveCategory(order?.cartProduct.category)} | ${solveBrand(order?.cartProduct.brand)}`} */}
                                    </div>
                                  </Skeleton>
                                  <div className="text-primary px-1 text-[12px] border border-primary inline-block">7 ngày trả hàng</div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {!loading && OrderDetail?.status === 'Hoàn thành' && (
                            <NavLink
                              onClick={() => setOpenReview(true)}
                              className='bg-primary text-white px-4 py-1 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
                              <span className='tracking-wider uppercase text-[14px] font-medium'>
                                {review ? 'Sửa đánh giá' : 'Đánh giá'}
                              </span>
                            </NavLink>
                          )}
                        </div>
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Tổng phụ</h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className={`${loading && 'w-[100px]'} font-bold inline-block text-[14px]`}>
                              {solvePrice(totalPrice) || '9.999.999'} ₫
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Giao hàng</h2>
                          <Skeleton className={`${loading && 'w-[100px]'} inline-block`} loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {solvePrice(totalDeliverFee) || '9.999.999'} ₫
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Giảm giá từ shop</h2>
                          <Skeleton className={`${loading && 'w-[100px]'} inline-block`} loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {solvePrice(totalDiscount) || '9.999.999'} ₫
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Phương thức thanh toán</h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {OrderDetail && OrderDetail?.paymentType
                                ? `${OrderDetail?.paymentType === "cash"
                                  ? 'Trả tiền mặt khi nhận hàng'
                                  : 'Chuyển khoản ngân hàng'}`
                                : 'Trả tiền mặt khi nhận hàng'}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Tổng cộng</h2>
                          <Skeleton className={`${loading && 'w-[100px]'} inline-block`} loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {solvePrice(totalOrder)}đ
                            </h2>
                          </Skeleton>
                        </div>
                      </div>
                    </div>
                    <div style={{
                      height: '.1875rem',
                      width: '100%',
                      backgroundPositionX: '-1.875rem',
                      backgroundSize: '7.25rem .1875rem',
                      backgroundImage: 'repeating-linear-gradient(45deg,#6fa6d6,#6fa6d6 33px,transparent 0,transparent 41px,#f18d9b 0,#f18d9b 74px,transparent 0,transparent 82px)',
                    }}></div>
                    <div className="w-full">
                      <h1 className='text-[22px] text-bgPrimary font-bold uppercase'>Địa chỉ giao hàng</h1>
                      <div className="w-[50px] h-[3px] my-[10px] bg-red-600"></div>
                      <div className="">
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Tỉnh / Thành phố
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {OrderDetail[0]?.shipCity}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Quận / Huyện
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {OrderDetail[0]?.shipRegion}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Phường / Xã
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {OrderDetail[0]?.shipRegion}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Địa chỉ cụ thể
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {OrderDetail[0]?.shipAddress}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Số điện thoại
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {localStorage.getItem('contact')}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Ghi chú
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {OrderDetail[0]?.note === ""
                                ?
                                <p className={`${loading || 'italic'}`}>Không có ghi chú</p> : OrderDetail[0]?.note}
                            </h2>
                          </Skeleton>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* right */}
                  <div className='self-start flex-1 py-6  bg-[#fafafa] shadow-md px-[30px] border-[2px] border-solid'>
                    <strong className='text-[#7a9c59] font-bold block mb-5 uppercase'>
                      Thông tin đặt hàng
                    </strong>
                    <ul className=''>
                      <li className='flex mb-3'>
                        <p className='mr-1'>Thời gian đặt hàng:</p>
                        <Skeleton className='inline-block' loading={loading}>
                          <strong className='text-[16px]'>{`${OrderDetail[0]?.createdDate} `}</strong>
                        </Skeleton>
                      </li>
                      <li className='flex mb-3 text-[16px]'>
                        <p className='mr-1'>Tên hiển thị:</p>
                        <Skeleton className='inline-block' loading={loading}>
                          <strong>{displayName}</strong>
                        </Skeleton>
                      </li>
                      <li className='flex mb-3 text-[16px]'>
                        <p className='mr-1'>Email:</p>
                        <Skeleton className='inline-block' loading={loading}>
                          <strong>{displayEmail}</strong>
                        </Skeleton>
                      </li>
                      <li className='flex mb-3 text-[16px]'>
                        <p className='mr-1'>Tổng cộng:</p>
                        <Skeleton className='inline-block' loading={loading}>
                          <strong>
                            {solvePrice(totalOrder)}đ
                          </strong>
                        </Skeleton>
                      </li>
                      <li className='flex mb-3 text-[16px]'>
                        <p className='mr-1'>Phương thức thanh toán:</p>
                        <Skeleton className='inline-block' loading={loading}>
                          <strong className='font-bold inline-block'>
                            {OrderDetail && OrderDetail?.paymentType
                              ? `${OrderDetail?.paymentType === "cash"
                                ? 'Trả tiền mặt khi nhận hàng'
                                : 'Chuyển khoản ngân hàng'}`
                              : 'Trả tiền mặt khi nhận hàng'}
                          </strong>
                        </Skeleton>
                      </li>
                    </ul>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div >
        {/* </Review> */}
      </OverlayLoading >
    </>
  );
};

export default OrderDetail;