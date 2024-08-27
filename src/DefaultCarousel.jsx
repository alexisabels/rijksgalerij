/* eslint-disable react/prop-types */
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./DefaultCarousel.css";
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}
function DefaultCarousel({ art }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    fade: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="carousel-container">
      <div className="carousel-slider">
        <Slider {...settings}>
          {art.map((artObject) => (
            <div key={artObject.id} className="slick-slide">
              <div className="slide-content">
                <img
                  src={artObject.webImage?.url}
                  alt={artObject.title}
                  className="carousel-image"
                />
                <p className="slide-title">{artObject.longTitle}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default DefaultCarousel;
