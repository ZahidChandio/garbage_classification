// src/components/LandingPage.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import PrevBtn from "./components/PrevBtn";
import NextBtn from "./components/NextBtn";
import SwiperCore from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import axios from 'axios';

const LandingPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [classifiedImage, setClassifiedImage] = useState(null);
  const [location, setLocation] = useState(null);
  // const location = [37.7489532, -122.4445678,18.51]
  const [dustbins, setDustbins] = useState([]);
  SwiperCore.use([Autoplay]);

  const handleImageChange = async (e) => {
    setIsProcessing(true);
    const file = e.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
    // Send the image to the server
    const formData = new FormData();
    formData.append('file', file);
    fetch('http://localhost:8000/classify/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Success:', result);
        setIsProcessing(false);        
        setClassifiedImage(result.image_label);
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsProcessing(false);
      });
  };

  const dustbinLocationIcon = new Icon({
    iconUrl: "/icons/dustbin-location.svg",
    iconSize: [25, 25]
  });

  const userLocationIcon = new Icon({
    iconUrl: "/icons/user-location.svg",
    iconSize: [25, 25]
  });

  useEffect(() => {
    // Check if the browser supports Geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation([
            latitude,
            longitude
          ]);    
          if(classifiedImage) {
            const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY; 
            const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=${classifiedImage+" dustbins"}&key=${API_KEY}`;
            axios.get(apiUrl)
            .then(response => {
              console.log(response.data);
              console.log(response.data.results);
              const dustbins = response.data.results.map(dustbin => {
                return {
                  type: dustbin?.name,
                  location: { latitude: dustbin.geometry.location.lat, longitude: dustbin.geometry.location.lng }
                }
              });
              setDustbins(dustbins);
            })
            .catch(error => {
              console.error('Error fetching dustbins data:', error);
            });
          } 
        },
        (error) => {
          console.error("Error getting location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser");
      alert("Geolocation is not supported by your browser");
    }
  }, [classifiedImage]);

  return (
    <Container>
      <h2 className='mt-4 text-3xl font-bold'>Garbage Classification</h2>
      <div className="relative flex !justify-center gap-4 mt-4 lg:mt-8 z-10 w-full">
          {/* Swiper Wrapper content is justified to center in index.css file */}
          <Swiper
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            slidesPerView={1}
            spaceBetween={40}
            navigation={false}
            modules={[Pagination, Navigation]}
            className="mySwiper !w-fit !justify-center"
          >
            <div className="absolute flex justify-between w-full top-1/2 -translate-y-1/2 z-20">
              <PrevBtn className="" />
              <NextBtn className="" />
            </div>
            <SwiperSlide
              className="!h-[400px] !w-full"
            >
              <img
                src={`/images/dustbin-1.jpg`}
                className="h-full w-full"
                alt="property"
              />
            </SwiperSlide>
            <SwiperSlide
              className="!h-[400px] !w-full"
            >
              <img
                src={`/images/dustbins.jpg`}
                className="h-full w-full"
                alt="property"
              />
            </SwiperSlide>
            <SwiperSlide
              className="!h-[400px] !w-full"
            >
              <img
                src={`/images/dustbin-4.jpg`}
                className="h-full w-full"
                alt="property"
              />
            </SwiperSlide>
          </Swiper>
        </div>
      <Intro>
        Welcome to our garbage classification project. We aim to help you
        classify different types of garbage using advanced technology.
      </Intro>
      <ImageInputLabel>Select an image of waste to classify</ImageInputLabel>
      <ImageInput type="file" onChange={handleImageChange} />
      {selectedImage && (
        <InputImage>
          <img src={selectedImage} alt="Output" />
        </InputImage>
      )}
      {classifiedImage && <ImageOutputLabel>Image is classified as</ImageOutputLabel>}
        <OuputDiv>
          { isProcessing ? <span> Processing Image</span> 
            :  classifiedImage ? <span>{classifiedImage.toUpperCase()}</span> : null 
          }
        </OuputDiv>
      { classifiedImage && <MapOutputLabel>{classifiedImage.toUpperCase()} dustbins near your location: </MapOutputLabel>}
      
      {/* Map */}
      {location && 
      <MapContainer center={location} zoom={13} scrollWheelZoom={true} style={{ height: '450px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {location && 
          <Marker position={location} icon={userLocationIcon}>
            <Popup>
              Your location
            </Popup>
          </Marker>
        }
        {dustbins.length > 0 && 
          dustbins.map((dustbin, index) => (
            <Marker
              key={index}
              position={[dustbin.location.latitude, dustbin.location.longitude]}
              icon={dustbinLocationIcon}
            >
              <Popup>{`Dustbin Type: ${dustbin.type}`}</Popup>
            </Marker>
          ))
        }
      </MapContainer>}
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: auto;
  padding: 20px;
  text-align: center;
`;

const Intro = styled.p`
  margin: 20px auto;
  color: #666;
  font-size: 1.1em;
  margin-bottom: 25px;
`;

const ImageInputLabel = styled.label`
  display: block;
  font-size: 1.1em;
    color: #333;
    font-weight: bold;
`;

const ImageOutputLabel = styled.label`
  display: block;
  margin-bottom: 1rem;
  font-size: 1.1em;
    color: #333;
    font-weight: bold;
`;

const ImageInput = styled.input`
margin: 10px 0;
border: 1px solid rgba(0, 0, 0, 0.5);
padding: 10px;
border-radius: 7px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.1);
  outline: none;
  `;

const InputImage = styled.div`
  margin: 0.8rem auto;
  
  background-color: #f5f5f5;
  width: fit-content;
  padding: 0.4rem;
  border-radius: 12px;
  span {
    font-size: 1.1em;
    color: #333;
    font-weight: bold;
    background-color: #fff;
  }
`;

const OuputDiv = styled.div`
margin: 2rem auto;
span {
  font-size: 1.1em;
  margin: 1rem auto;
  color: #333;
  font-weight: bold;
    background-color: green;
    padding: 0.4rem 1rem;
    color: #fff;
    border-radius: 4px;
  }
`;

const MapOutputLabel = styled.label`
  display: block;
  margin-bottom: 1rem;
  font-size: 1.1em;
  color: #333;
  font-weight: bold;
`;

export default LandingPage;
