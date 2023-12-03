import { React } from "react";
import { useSwiper } from "swiper/react";

const NextBtn = (props) => {
  const swiper = useSwiper();

  return (
    <button
      className={`${props.className} `}
      onClick={() => swiper.slideNext()}
    >
      <i className={`fa fa-chevron-right text-3xl text-gray-500 cursor-pointer`} aria-hidden="true"></i>
    </button>
  );
};

export default NextBtn;
