import React, { useEffect, useRef, useState } from 'react';
import CarLoading from '../../components/carLoading/CarLoading';

import { useDispatch, useSelector } from 'react-redux';
import { selectUserID } from '../../redux-toolkit/slice/authSlice';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltLeft, faTags } from '@fortawesome/free-solid-svg-icons';
import { selectEmail } from '../../redux-toolkit/slice/authSlice';
import { selectUserName } from '../../redux-toolkit/slice/authSlice';
import { OverlayLoading, Skeleton } from '../../animation-loading';
import { toast } from 'react-toastify';
import CheckoutSuccess from '../checkoutSuccess/CheckoutSuccess';
import { selectCartItems, selectTotalDiscout, selectTotalPayment } from '../../redux-toolkit/slice/cartSlice';
import { fetchCartItems } from '../../redux-toolkit/action/cartAction';
import { fetchMakeOrder } from '../../redux-toolkit/action/orderAction';
import { selectLoading } from '../../redux-toolkit/slice/orderSlice';
const CheckOut = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.cart);
  const { message, error } = useSelector((state) => state.orders);
  const loadingMakeOrder = useSelector(selectLoading)
  const [loadingNavigate, setLoadingNavigate] = useState(false)
  const totalPayment = useSelector(selectTotalPayment)

  const cartProducts = useSelector(selectCartItems)

  const displayEmail = localStorage.getItem('displayEmail')
  const displayName = localStorage.getItem('displayName')
  const imgAvatar = localStorage.getItem('imgAvatar')
  //
  const navigate = useNavigate()
  //
  const [deliveryFee, setDeliveryFee] = useState(30000)
  const discount = useSelector(selectTotalDiscout)
  const [vouchers, setVouchers] = useState(new Map())
  const [checkTypeVouchers, setCheckTypeVouchers] = useState({})
  const inputVoucher = useRef()
  const vouchersID = useRef([])
  //
  const cartItemsIds = cartProducts.map(item => item.id)
  const [shippingAddress, setShippingAddress] = useState({
    paymentType: 0,
    shippingCity: '',
    shippingRegion: '',
    shippingAddress: '',
    phoneNumber: '',
    note: '',
  })
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)

  console.log(cartItemsIds)
  const getProducts = async () => {

  }

  const handleInventory = async () => {

  }

  const getCartProducts = async () => {
    dispatch(fetchCartItems());
  }

  const getVouchers = async () => {

  }

  const handleShippingAddress = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    })
  }

  //để xử lí khi ấn đặt hàng thì sẽ xóa tất cả sản phẩm trong giỏ hàng
  const handleDeleteAllCart = async () => {

  }

  const saveOrder = async () => {

  }

  const handleVoucherFalse = async () => {

  }

  const handleOrder = async (e) => {
    e.preventDefault();

    if (shippingAddress.shippingCity === ''
      || shippingAddress.shippingRegion === ''
      || shippingAddress.shippingAddress === ''
      || shippingAddress.phoneNumber === '') {
      toast.error('Vui lòng điền hết các trường hợp', {
        autoClose: 1200,
        position: 'top-left'
      });
    } else {
      if (!loading) {
        window.scrollTo({
          top: 0,
        });
        setLoadingNavigate(true);
        const resultAction = await dispatch(fetchMakeOrder({
          cartItemsIds: cartItemsIds,
          paymentType: shippingAddress.paymentType,
          shippingCity: shippingAddress.shippingCity,
          shippingRegion: shippingAddress.shippingRegion,
          shippingAddress: shippingAddress.shippingAddress,
          shippingFee: deliveryFee,
          note: "SDT" + shippingAddress.phoneNumber + " " + shippingAddress.note
        }));
        setLoadingNavigate(false);

        if (fetchMakeOrder.fulfilled.match(resultAction)) {
          const { status, message } = resultAction.payload;
          if (status === 0) {
            setCheckoutSuccess(true);
            navigate('/thanh-toan/success');
            toast.success(message, {
              autoClose: 1200,
            });
          } else {
            setCheckoutSuccess(false);
            toast.error(message, {
              autoClose: 1200,
            });
          }
        } else if (fetchMakeOrder.rejected.match(resultAction)) {
          const errorMessage = resultAction.payload ? resultAction.payload : resultAction.error.message;
          setCheckoutSuccess(false);
          toast.error(errorMessage, {
            autoClose: 1200,
          });
        }
      }
    }
  };

  const solveDate = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('vi-VN', { month: 'long' });
    const year = today.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  const solveTime = () => {
    const now = new Date()
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    return `${hour}:${minute}:${second}`;
  }

  const solvePrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  }

  useEffect(() => {
    getProducts()
  }, [])



  return (
    <>
      {!checkoutSuccess
        ? (
          <OverlayLoading loading={loadingNavigate}>
            <div className={`w-full py-[30px] ${loadingNavigate && 'blur-[2px]'}`}>
              <div className="max-w-[1230px] mx-auto ">
                <div className="w-full px-[15px] pb-[30px]">
                  <div className="w-full flex">
                    {(cartProducts.length === 0
                      || JSON.parse(localStorage.getItem('cartLength')) === 0) && !loading
                      ? <div className="w-full h-[480px] flex flex-col gap-10 items-center justify-center">
                        <img className='w-full h-[300px] object-contain' src="../../orderNoExist.png" alt="" />
                        <h1 className='text-center text-[36px] font-bold text-bgPrimary font-mono leading-[32px] uppercase'>Đơn thanh toán không tồn tại</h1>
                        <NavLink
                          to='/'
                          className='bg-primary text-white px-4 py-3 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
                          <FontAwesomeIcon className='mr-[6px]' icon={faLongArrowAltLeft} />
                          <span className='text-[20px]'>Quay lại trang chủ</span>
                        </NavLink>
                      </div>
                      : (
                        <div className='w-full flex flex-row'>
                          {/* left */}
                          <div className="basis-[58.33%] pr-[30px]">
                            <h1 className='text-[18px] mb-4 font-bold text-bgPrimary uppercase'>
                              Thông tin thanh toán
                            </h1>
                            <div className="w-full text-[#222] text-[14px] flex flex-col gap-5 ">
                              <p>
                                <label className='mb-2 font-bold block' htmlFor="account_display_name">Tên hiển thị *</label>
                                <input
                                  placeholder={displayName || localStorage.getItem('displayName') || ""}
                                  name="name"
                                  className='align-middle pointer-events-none bg-white shadow-sm text-[#333] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2 transition-all ease-linear duration-150 focus:shadow-shadowPink focus:border focus:border-[#ea4c8966]' id='account_display_name' type="text" />
                                <span className='text-[#353535] text-[16px] italic'>Để thay đổi tên, hãy vào "Thông tin tài khoản"</span>
                              </p>

                              <p>
                                <label className='mb-2 font-bold block'>Địa chỉ email *</label>
                                <input
                                  name="email"
                                  autoComplete="off"
                                  placeholder={displayEmail || localStorage.getItem('displayEmail') || ""}
                                  className='align-middle pointer-events-none bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                                <span className='text-[#353535] text-[16px] italic'>Bạn không thể thay đổi email</span>
                              </p>
                              <p>
                                <label className='mb-2 font-bold block'>Tỉnh / Thành phố *</label>
                                <input
                                  value={shippingAddress.shippingCity}
                                  onChange={handleShippingAddress}
                                  name="shippingCity"
                                  autoComplete="off"
                                  required
                                  placeholder="Nhập vào tỉnh/ thành phố"
                                  className='align-middle bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                              </p>

                              <p>
                                <label className='mb-2 font-bold block'>Quận / Huyện *</label>
                                <input
                                  value={shippingAddress.shippingRegion}
                                  onChange={handleShippingAddress}
                                  name="shippingRegion"
                                  autoComplete="off"
                                  required
                                  placeholder="Nhập vào quận/ huyện"
                                  className='align-middle bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                              </p>

                              {/* <p>
                                <label className='mb-2 font-bold block'>Phường / Xã *</label>
                                <input
                                  value={shippingAddress.wards}
                                  onChange={handleShippingAddress}
                                  name="wards"
                                  autoComplete="off"
                                  required
                                  placeholder="Nhập vào phường/ xã"
                                  className='align-middle bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                              </p> */}

                              <p>
                                <label className='mb-2 font-bold block'>Địa chỉ cụ thể *</label>
                                <input
                                  value={shippingAddress.shippingAddress}
                                  onChange={handleShippingAddress}
                                  name="shippingAddress"
                                  autoComplete="off"
                                  required
                                  placeholder="Nhập vào địa chỉ nhà cụ thể"
                                  className='align-middle bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                              </p>

                              <p>
                                <label className='mb-2 font-bold block'>Số điện thoại *</label>
                                <input
                                  value={shippingAddress.phoneNumber}
                                  onChange={handleShippingAddress}
                                  name="phoneNumber"
                                  autoComplete="off"
                                  required
                                  placeholder="Nhập vào số điện thoại liên hệ"
                                  className='align-middle bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="number" />
                              </p>

                              <p>
                                <label className='mb-2 font-bold block'>Ghi chú đơn hàng (tùy chọn)</label>
                                <textarea
                                  value={shippingAddress.note}
                                  onChange={handleShippingAddress}
                                  name="note"
                                  autoComplete="off"
                                  cols={30}
                                  rows={5}
                                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                                  className='align-middle bg-white shadow-sm text-[#222] px-3 pt-3 block w-full text-[16px] border border-solid border-[#ccc] rounded-[4px] bg-transparent outline-none' type="text" />
                              </p>

                            </div>
                          </div>
                          {/* right */}
                          <div className={`self-start flex-1 pt-[15px] pb-[30px] px-[30px] border-[2px] border-solid ${!loadingNavigate && 'border-primary'}`}>
                            <div className="w-full border-[3px] border-transparent border-b-[#ececec] text-[18px] font-bold py-2 uppercase tracking-wider">
                              <h1 className='mb-4'>Đơn hàng của bạn</h1>
                              <div className="flex justify-between">
                                <h2 className='text-[14px] tracking-widest'>Sản phẩm</h2>
                                <h2 className='text-[14px] tracking-widest'>Tổng</h2>
                              </div>
                            </div>
                            {(cartProducts.length === 0
                              ? Array(3).fill()
                              : cartProducts).map((cartProduct, idx) => (
                                <div
                                  key={idx}
                                  className={`${!loading ? 'py-4' : 'my-2'} grid grid-cols-7 items-center justify-center border-top border-bottom border-transparent border-b-[#ddd] text-[14px]`}>
                                  <Skeleton loading={loading} className={`${loading && 'mb-2 w-3/4 h-[30px]'} flex overflow-hidden col-span-5`}>
                                    <img
                                      onClick={() => navigate(`/san-pham/${cartProduct?.code}`)}
                                      className=' col-span-2 rounded-[4px] h-[60px] w-[60px]  object-cover cursor-pointer'
                                      src={cartProduct.path ? cartProduct.path.split(',')[0].trim() : ''} alt={cartProduct?.name} />
                                    <h2
                                      className='text-[#666]'>{cartProduct?.name || 'day la ten de chay skeleton animation animation animation animation'}
                                      <strong className='text-bgPrimary font-blod ml-1'>× {cartProduct?.quantity}</strong>
                                    </h2>
                                  </Skeleton>
                                  <Skeleton loading={loading} className='overflow-hidden col-span-2 text-right'>
                                    <div className="">
                                      <span
                                        className='font-bold inline-block'>
                                        {cartProduct?.price
                                          ? `${solvePrice(cartProduct?.price * cartProduct?.quantity)} ₫`
                                          : 'day la gia tien'}
                                      </span>
                                    </div>
                                  </Skeleton>
                                </div>
                              ))}

                            <div className='flex items-center justify-between border-top border-bottom border-transparent border-b-[#ddd] py-2 text-[14px]'>
                              <Skeleton loading={loading} className='overflow-hidden'>
                                <h2 className=''>Tổng phụ</h2>
                              </Skeleton>
                              <Skeleton loading={loading} className='overflow-hidden'>
                                <h2 className='font-bold'>
                                  {totalPayment
                                    ? `${solvePrice(totalPayment)} ₫`
                                    : 'day la tong tien'}
                                </h2>
                              </Skeleton>
                            </div>
                            <div className='flex items-center justify-between border-top border-bottom border-transparent border-b-[#ddd] py-4 text-[14px]'>
                              <Skeleton loading={loading} className='overflow-hidden'>
                                <h2 className=''>Giao hàng</h2>
                              </Skeleton>
                              <Skeleton loading={loading} className='overflow-hidden'>
                                <div className="">
                                  <p className='text-right'>
                                    Phí giao hàng toàn quốc:
                                    <span className='font-bold ml-1'>{`${solvePrice(deliveryFee)} ₫`}</span>
                                  </p>
                                </div>
                              </Skeleton>
                            </div>
                            <Skeleton loading={loading}
                              className={`${loading && 'h-6'} overflow-hidden`}>
                              <div className='flex items-center justify-between border-top border-bottom border-transparent border-b-[#ddd] py-3 text-[14px]'>
                                <h2 className=''>Giảm giá từ shop:</h2>
                                <span className='font-bold ml-1'>{solvePrice(discount)}₫</span>
                              </div>
                            </Skeleton>
                            <div className='flex items-center justify-between border-[3px]border-top border-bottom border-transparent border-b-[#ddd] py-2 text-[14px]'>
                              <Skeleton loading={loading} className='overflow-hidden'>
                                <h2 className=''>Tổng thanh toán</h2>
                              </Skeleton>
                              <Skeleton loading={loading} className='overflow-hidden'>
                                <h2 className='font-bold'>
                                  {totalPayment
                                    ? `${totalPayment + deliveryFee - discount > 0
                                      ? solvePrice(totalPayment + deliveryFee - discount)
                                      : 0} ₫`
                                    : 'day la tong tien'}
                                </h2>
                              </Skeleton>
                            </div>
                            <div className="border-[3px] pb-3 border-transparent border-top border-bottom border-b-[#ddd]">
                              <div className="pt-6 flex gap-2">
                                <FontAwesomeIcon
                                  className='text-[#b0b0b0] text-[20px]'
                                  icon={faTags}
                                  rotation={90} />
                                <p className='font-bold text-[14px] uppercase tracking-widest'>Phiếu ưu đãi</p>
                              </div>
                              <input
                                ref={inputVoucher}
                                className='mb-5 mt-3 text-[16px] w-full px-3 py-2 outline-none border border-[#ccc] focus:shadow-shadowPink'
                                placeholder='Mã ưu đãi'
                                type="text" name="" id="" />
                              <button
                                // onClick={(e) => {
                                //   if (!loading) {
                                //     e.preventDefault()
                                //     if (inputVoucher.current.value === 'FREESHIP') {
                                //       setDeliveryFee(0)
                                //       toast.success('Áp dụng mã miễn phí vận chuyển thành công', {
                                //         autoClose: 1200
                                //       })
                                //       inputVoucher.current.value = ''
                                //     }
                                //     else {
                                //       if (!vouchers.has(inputVoucher.current.value)) {
                                //         toast.error('Mã giảm giá không tồn tại', {
                                //           autoClose: 1200
                                //         })
                                //       }
                                //       else if (checkTypeVouchers[inputVoucher.current.value] === false) {
                                //         toast.error('Bạn đã áp dụng mã giảm giá', {
                                //           autoClose: 1200
                                //         })
                                //       }
                                //       else {
                                //         const field = inputVoucher.current.value
                                //         vouchersID.current.push(vouchers.get(field).voucherID)
                                //         setCheckTypeVouchers(prevState => {
                                //           return Object.assign({}, prevState, { [field]: false });
                                //         })
                                //         setDiscount(Number(vouchers.get(field).value))
                                //         inputVoucher.current.value = ''
                                //         toast.success('Áp dụng mã giảm giá thành công', {
                                //           autoClose: 1200
                                //         })
                                //       }
                                //     }
                                //   }
                                // }}
                                className='w-full p-2 border border-[#ccc] bg-[#f9f9f9] hover:bg-[#c7c7c7] flex items-center justify-center -tracking-tighter text-[16px] text-[#666] transition-all ease-in-out duration-100'>
                                Áp dụng
                              </button>
                            </div>
                            <div className='mt-6 text-[14px]'>
                              <div className="flex flex-col gap-4 mb-4">
                                <div className="flex gap-2">
                                  <input
                                    value={0}
                                    onChange={handleShippingAddress}
                                    type="radio"
                                    name="paymentMethod"
                                    id="checkbox-1"
                                    checked={shippingAddress.paymentType === 0} />
                                  <label htmlFor='checkbox-1' className='text-[14px] font-bold'>Trả tiền mặt khi nhận hàng</label>
                                </div>
                                <div className="flex gap-2">
                                  <input
                                    value={1}
                                    onChange={handleShippingAddress}
                                    type="radio"
                                    name="paymentMethod"
                                    id="checkbox-2"
                                    checked={shippingAddress.paymentType === 1} />
                                  <label htmlFor='checkbox-2' className='text-[14px] font-bold'>Chuyển khoản ngân hàng</label>
                                </div>
                              </div>
                              <button
                                onClick={handleOrder}
                                className='px-6 py-3 bg-secondary font-bold tracking-widest text-white hover:brightness-90 transition-all ease-in-out duration-100 uppercase'>Đặt hàng
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                  </div>
                </div>
              </div>
            </div >
          </OverlayLoading>
        )
        : <CheckoutSuccess
          cartProducts={cartProducts}
          totalPayment={totalPayment}
          shippingAddress={shippingAddress}
          deliveryFee={deliveryFee}
          discount={discount}
          orderDate={solveDate()}
          orderTime={solveTime()}
        />
      }
    </>
  );
};

export default CheckOut;