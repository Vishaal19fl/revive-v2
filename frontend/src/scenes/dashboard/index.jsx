import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Chip, IconButton, Typography, useTheme, useMediaQuery, List, ListItem, Card, CardContent, Divider } from "@mui/material";
import { tokens } from "../../theme";
import Modal from "@mui/material/Modal";
import { useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import newRequest from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";
import { ColorModeContext } from "../../theme";
import PendingIcon from "@mui/icons-material/Pending";
import InventoryIcon from "@mui/icons-material/Inventory";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import PieChart from "../../components/PieChart";
import StatBox from "../../components/StatBox";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ProgressCircle from "../../components/ProgressCircle";
import "./dashboard1.scss"
import LocalShipping from '@mui/icons-material/LocalShipping';
import Sidebar from '../global/Sidebar';
import NewsSlider from '../../components/newsSlider/NewsSlider';
import Marquee from 'react-fast-marquee';
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import useSound from 'use-sound'; 
import buzzerSound from './buzzer.wav';

const Dashboard1 = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [ocrData, setOcrData] = useState([]);
  const [isLoading2, setIsLoading] = useState(true);
  const [error2, setError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
const [latestData, setLatestData] = useState([]);
const mapRef = useRef(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};



  const getSeverityColor = (severity) => {
    const lowercaseSeverity = severity?.toLowerCase();
    switch(lowercaseSeverity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
      default:
        return 'success';
    }
  }
  const { data: inventoryData, isLoading : isLoading1, error: error1 } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => newRequest.get("/inventory").then((res) => res.data),
  });
  useEffect(() => {
    if (inventoryData) {
      console.log(inventoryData); // Log inventoryData after it has been fetched
    }
  }, [inventoryData]);

  const inventoryItems = Array.isArray(inventoryData?.inventoryItems) ? inventoryData.inventoryItems : [
    { itemName: "Item A", count: 20 },
    { itemName: "Item B", count: 15 },
    { itemName: "Item C", count: 10 },
    { itemName: "Item D", count: 5 },
  ];
console.log(inventoryItems);
const [isBlinking, setIsBlinking] = useState(false);
  const [playBuzzer] = useSound(buzzerSound);

  



  const handleRefresh = () => {
    setLatestData(ocrData);
    setIsBlinking(true);
    playBuzzer();
    setShowPopup(true);

    setTimeout(() => {
      setIsBlinking(false);
    }, 8000); 

    
  };

  useEffect(() => {
    const handleMiddleClick = (event) => {
      if (event.button === 1) {
        event.preventDefault(); // Prevents default browser behavior for middle-click
        handleRefresh();
      }
    };

    // Attach event listener
    window.addEventListener('mousedown', handleMiddleClick);

    // Clean up event listener
    return () => {
      window.removeEventListener('mousedown', handleMiddleClick);
    };
  }, [ocrData]);
console.log(ocrData[0])
const handleClosePopup = () => setShowPopup(false);
  
  const { data: ordersData, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: () => newRequest.get("/orders").then((res) => res.data),
  });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await newRequest.get('/ocrdata'); 
        console.log('API response:', response.data); 
        console.log('OCR Data Length:', response.data.ocrData?.length || 0); 
        setOcrData(response.data.ocrData || []); 
      } catch (error) {
        console.error('Error fetching OCR data:', error);
        setOcrData([]); // Set empty array on error
      }
    };

    fetchNews();
  }, []);

  const orders = Array.isArray(ordersData?.orders) ? ordersData.orders : [];
  const donationCount = orders.length;
  const recentDonations = orders.slice(-6);
  const activeDisasters = ocrData.length;
  const severeDisasters = ocrData.filter((item) => item.severity?.toLowerCase() === "high").length;
  const uniqueLocations = new Set(ocrData.map((item) => item.location)).size;


  const processData = (data) => {
    const counts = {
      High: 0,
      Medium: 0,
      Low: 0,
    };

    if (!data || !Array.isArray(data)) return [
      { severity: "High", count: 0 },
      { severity: "Medium", count: 0 },
      { severity: "Low", count: 0 },
    ];

    data.forEach((item) => {
      const severity = item.severity ? item.severity.toLowerCase().trim() : "";
      if (severity === "high") {
        counts.High++;
      } else if (severity === "medium") {
        counts.Medium++;
      } else if (severity === "low") {
        counts.Low++;
      }
    });

    return [
      { severity: "High", count: counts.High },
      { severity: "Medium", count: counts.Medium },
      { severity: "Low", count: counts.Low },
    ];
  };

  const chartData = processData(ocrData);
  const pinnedLocations = [
    {
      location: "Odisha",
      disaster_type: "Flood",
      severity: "high",
      timestamp: "2024-12-06 10:30:00",
      report: "Severe flooding due to incessant rains has affected several districts in Odisha, causing widespread damage."
    },
    {
      location: "Chennai",
      disaster_type: "Cyclone",
      severity: "medium",
      timestamp: "2024-12-07 08:15:00",
      report: "Cyclone impact in Chennai led to power outages and tree falls in the coastal areas."
    }
  ];
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.gomaps.pro/maps/api/js?key=AlzaSyU90DpF7dwn-eFgHEAQbZNYb5kjz1u8G-u&libraries=geometry,places&callback=initMap`;
    script.async = true;
    script.defer = true;
    window.initMap = initMap;

    document.body.appendChild(script);
  }, []);

  const initMap = (coordinates) => {
    if (coordinates) {
      const { lat, lng } = coordinates;
      window.open(`https://maps.gomaps.pro/maps?q=${lat},${lng}&z=15`, '_blank');
    }
  };

  const handleMapPopup = (coordinates) => {
    initMap(coordinates);
  };
  
  const textArray = [
    "Severe weather warning: Heavy rainfall expected tomorrow.",
    "Flood alert: Evacuate low-lying areas immediately.",
    "Earthquake detected: Stay indoors and protect yourself.",
    "Tsunami warning: Move to higher ground immediately.",
    "Emergency helpline: Dial 12345 for assistance.",
    "Heatwave alert: Stay hydrated and avoid outdoor activities.",
    "Shelter locations: Nearest relief camp is at XYZ Community Center.",
    "Power outage expected: Prepare with emergency supplies.",
    "Road closures: Avoid Route 56 due to landslides.",
    "Stay tuned: Follow official channels for updates.",
  ];
  
  

  return (
    <Box display="flex" className="dashboard-box">
      {isBlinking && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            zIndex: 9999,
            animation: 'blink 0.5s alternate infinite',
          }}
        ></div>
      )}
      
      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
      <Modal
        isOpen={showMapModal}
        onRequestClose={() => setShowMapModal(false)}
        contentLabel="Map Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            height: '600px',
            width: '95%',
            margin: 'auto',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        }}
      >
        <div
        ref={mapRef}
        id="map"
        style={{ height: '600px', width: '95%', borderRadius: '10px', margin:"auto", display:'flex', alignItems:'center', justifyContent:'center' }}
      ></div>
      </Modal>
      {/* SIDEBAR */}
      <Sidebar/>

      <Box flexGrow={1} m="30px">
      {/* HEADER */}
      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between" alignItems="center">
        <Header title="ADMIN DASHBOARD" subtitle="Welcome to your dashboard" titleSize="h4" />
        
        {/* <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton> */}
        {/* <Box mb={4}>
          <NewsSlider/>
        </Box> */}

<Box mt={isMobile ? '20px' : '0'}>
<Link to="/donationpage" className="link">
<Button
    
   
    sx={{
      marginRight: "10px",
      marginBottom:"20px",
      backgroundColor: colors.greenAccent[700],
      color: colors.grey[100],
      fontSize: "14px",
      fontWeight: "bold",
      padding: "10px 20px",
    }}
  >
   Donate
  </Button></Link>
  {/* <Button
    onClick={() => navigate('/donationpage')}
    sx={{
      backgroundColor: colors.blueAccent[700],
      color: colors.grey[100],
      fontSize: "14px",
      fontWeight: "bold",
      padding: "10px 20px",
      mb: "20px",
    }}
  >
    Make Donation
  </Button> */}
  
</Box>

      </Box>
      <Box display="grid" mb="20px" gap="20px">
  <div className="marquee-section-1" style={{overflow:"hidden"}}>
  <div class="breaking-news-label">Breaking News</div>
  <Marquee className="marquee" autoFill speed={20}>
  <div className="text-gallery">
    {ocrData.map((data, index) => (
      <div key={index} className="text-gallery-item">
      <div className="blinking-lights"></div>
      <p
        className="gallery-text"
        
        onClick={() => handleMapPopup(data.coordinates)}
      >
        {data.data} {/* Replace with desired property */}
      </p>
    </div>
    ))}
  </div>
</Marquee>

  </div>
</Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns={isMobile ? '1fr' : 'repeat(12, 1fr)'}
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 - Modern Stat Cards */}
        <Box
          gridColumn={isMobile ? 'span 12' : 'span 3'}
          sx={{
            borderRadius: "20px",
            background: '#ffffff',
            boxShadow: '8px 8px 20px rgba(0, 0, 0, 0.1), -8px -8px 20px rgba(255, 255, 255, 0.9)',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.95)',
            }
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6" sx={{ color: '#8B8FA3', fontSize: '14px', mb: 1, fontWeight: 500 }}>
                Total Disasters
              </Typography>
              <Typography variant="h3" sx={{ color: '#2D3748', fontWeight: 'bold', mb: 0.5 }}>
                {activeDisasters}
              </Typography>
              <Typography variant="caption" sx={{ color: '#48BB78', fontSize: '12px', fontWeight: 600 }}>
                +2 this month
              </Typography>
            </Box>
            <Box sx={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)',
              boxShadow: '0 8px 16px rgba(255, 167, 38, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <WarningAmberOutlinedIcon sx={{ color: '#fff', fontSize: '28px' }} />
            </Box>
          </Box>
        </Box>

        <Box
          gridColumn={isMobile ? 'span 12' : 'span 3'}
          sx={{
            borderRadius: "20px",
            background: '#ffffff',
            boxShadow: '8px 8px 20px rgba(0, 0, 0, 0.1), -8px -8px 20px rgba(255, 255, 255, 0.9)',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.95)',
            }
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6" sx={{ color: '#8B8FA3', fontSize: '14px', mb: 1, fontWeight: 500 }}>
                Total Donations
              </Typography>
              <Typography variant="h3" sx={{ color: '#2D3748', fontWeight: 'bold', mb: 0.5 }}>
                {donationCount}
              </Typography>
              <Typography variant="caption" sx={{ color: '#48BB78', fontSize: '12px', fontWeight: 600 }}>
                +6.1% from last month
              </Typography>
            </Box>
            <Box sx={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #5C6BC0 0%, #3949AB 100%)',
              boxShadow: '0 8px 16px rgba(92, 107, 192, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <InventoryIcon sx={{ color: '#fff', fontSize: '28px' }} />
            </Box>
          </Box>
        </Box>

        <Box
          gridColumn={isMobile ? 'span 12' : 'span 3'}
          sx={{
            borderRadius: "20px",
            background: '#ffffff',
            boxShadow: '8px 8px 20px rgba(0, 0, 0, 0.1), -8px -8px 20px rgba(255, 255, 255, 0.9)',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.95)',
            }
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6" sx={{ color: '#8B8FA3', fontSize: '14px', mb: 1, fontWeight: 500 }}>
                Affected Locations
              </Typography>
              <Typography variant="h3" sx={{ color: '#2D3748', fontWeight: 'bold', mb: 0.5 }}>
                {uniqueLocations}
              </Typography>
              <Typography variant="caption" sx={{ color: '#48BB78', fontSize: '12px', fontWeight: 600 }}>
                +8.3% from last month
              </Typography>
            </Box>
            <Box sx={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #26C6DA 0%, #00ACC1 100%)',
              boxShadow: '0 8px 16px rgba(38, 198, 218, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <LocationOnOutlinedIcon sx={{ color: '#fff', fontSize: '28px' }} />
            </Box>
          </Box>
        </Box>

        <Box
          gridColumn={isMobile ? 'span 12' : 'span 3'}
          sx={{
            borderRadius: "20px",
            background: '#ffffff',
            boxShadow: '8px 8px 20px rgba(0, 0, 0, 0.1), -8px -8px 20px rgba(255, 255, 255, 0.9)',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.95)',
            }
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6" sx={{ color: '#8B8FA3', fontSize: '14px', mb: 1, fontWeight: 500 }}>
                Total Requests
              </Typography>
              <Typography variant="h3" sx={{ color: '#2D3748', fontWeight: 'bold', mb: 0.5 }}>
                {severeDisasters}
              </Typography>
              <Typography variant="caption" sx={{ color: '#48BB78', fontSize: '12px', fontWeight: 600 }}>
                +0.2 from last month
              </Typography>
            </Box>
            <Box sx={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
              boxShadow: '0 8px 16px rgba(102, 187, 106, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <LocalShippingIcon sx={{ color: '#fff', fontSize: '28px' }} />
            </Box>
          </Box>
        </Box>
        
        <Box
  gridColumn={isMobile ? 'span 12' : 'span 12'}
  gridRow="span 3"
  sx={{
    borderRadius: "20px",
    background: '#ffffff',
    boxShadow: '8px 8px 20px rgba(0, 0, 0, 0.1), -8px -8px 20px rgba(255, 255, 255, 0.9)',
    border: "none",
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  }}
>
  {/* Header Section */}
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: '16px',
      borderBottom: '2px solid #E2E8F0'
    }}
  >
    <Box>
      <Typography
        variant="h4"
        sx={{
          color: '#2D3748',
          fontWeight: 600,
          letterSpacing: '0.5px',
          marginBottom: '4px'
        }}
      >
        Latest Disaster Reports
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#718096',
          fontSize: '14px'
        }}
      >
        Real-time disaster monitoring and alerts • {ocrData.length} active reports
      </Typography>
    </Box>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold'
      }}
    >
      <Box
        sx={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}
      />
      LIVE
    </Box>
  </Box>

  {/* Cards Grid */}
  <Box 
    data-testid="disaster-cards-grid"
    sx={{ 
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(380px, 1fr))',
      gap: '20px',
      maxHeight: '500px',
      overflowY: 'auto',
      padding: '8px',
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-track': {
        background: '#F1F5F9',
        borderRadius: '10px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#CBD5E1',
        borderRadius: '10px',
        '&:hover': {
          background: '#94A3B8',
        }
      }
    }}
  >
    {ocrData && ocrData.length > 0 ? (
      ocrData.map((dataItem, index) => {
        console.log(`Rendering card ${index}:`, dataItem.location, dataItem.disaster_type);
        return (
        <Card
          key={dataItem._id || dataItem.id || index}
          sx={{
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#ffffff',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #F1F5F9',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            position: 'relative',
            '&:hover': {
              transform: 'translateY(-4px) scale(1.02)',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
            }
          }}
          onClick={() => handleMapPopup(dataItem.coordinates)}
        >
          {/* Severity Banner */}
          <Box
            sx={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 2,
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: '#fff',
              background: dataItem.severity?.toLowerCase() === 'high' ? 
                'linear-gradient(135deg, #FF4444 0%, #CC0000 100%)' :
                dataItem.severity?.toLowerCase() === 'medium' ? 
                'linear-gradient(135deg, #FF8800 0%, #CC6600 100%)' :
                'linear-gradient(135deg, #00AA44 0%, #006622 100%)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
            }}
          >
            {dataItem.severity?.toUpperCase() || 'UNKNOWN'}
          </Box>

          {/* Image Section */}
          <Box
            sx={{
              height: '140px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <img
              src={
                dataItem.disaster_type === 'Cyclone' 
                  ? "https://upload.wikimedia.org/wikipedia/commons/b/bc/Low_pressure_system_over_Iceland.jpg"
                  : dataItem.disaster_type === 'Earthquake' 
                  ? "https://images.unsplash.com/photo-1583663008618-0cc2fc6143b3?w=500&h=300&fit=crop"
                  : "https://www.extracobanks.com/sites/default/files/styles/open_graph/public/2022-09/aerial-view-of-flooded-houses-and-rescue-vehicles-2022-01-17-17-11-53-utc.jpg.webp?itok=59zSY5eh"
              }
              alt={`${dataItem.disaster_type || 'Disaster'} disaster`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
                padding: '20px 16px 12px',
                color: '#fff'
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '16px',
                  marginBottom: '4px'
                }}
              >
                {dataItem.disaster_type || 'Disaster'} in {dataItem.location || 'Unknown Location'}
              </Typography>
            </Box>
          </Box>

          {/* Content Section */}
          <CardContent sx={{ padding: '20px' }}>
            <Box sx={{ marginBottom: '16px' }}>
              <Typography
                variant="body1"
                sx={{
                  color: '#2D3748',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  fontWeight: 500,
                  marginBottom: '12px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {dataItem.data || 'No description available'}
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '12px'
                }}
              >
                <Chip
                  size="small"
                  label={dataItem.news_source || 'Unknown Source'}
                  sx={{
                    backgroundColor: '#EDF2F7',
                    color: '#4A5568',
                    fontSize: '11px',
                    fontWeight: 600,
                    '& .MuiChip-label': {
                      padding: '0 8px'
                    }
                  }}
                />
                <Chip
                  size="small"
                  label={dataItem.timestamp ? new Date(dataItem.timestamp).toLocaleDateString() : 'No date'}
                  sx={{
                    backgroundColor: '#E6FFFA',
                    color: '#234E52',
                    fontSize: '11px',
                    fontWeight: 600,
                    '& .MuiChip-label': {
                      padding: '0 8px'
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid #F1F5F9'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LocationOnOutlinedIcon sx={{ fontSize: '16px', color: '#718096' }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: '#718096',
                    fontSize: '12px',
                    fontWeight: 500
                  }}
                >
                  {dataItem.location || 'Unknown Location'}
                </Typography>
              </Box>
              
              <Typography
                variant="caption"
                sx={{
                  color: '#A0AEC0',
                  fontSize: '11px',
                  fontStyle: 'italic'
                }}
              >
                Click to view on map
              </Typography>
            </Box>
          </CardContent>
        </Card>
        );
      })
    ) : (
      <Box
        sx={{
          gridColumn: '1 / -1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          textAlign: 'center',
          color: '#718096'
        }}
      >
        <WarningAmberOutlinedIcon sx={{ fontSize: '64px', color: '#CBD5E1', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#4A5568', mb: 1, fontWeight: 600 }}>
          No Disaster Reports Available
        </Typography>
        <Typography variant="body2" sx={{ color: '#718096', maxWidth: '400px' }}>
          There are currently no disaster reports to display. New reports will appear here automatically when they become available.
        </Typography>
      </Box>
    )}
  </Box>

  {/* Add pulse animation */}
  <style>
    {`
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `}
  </style>
</Box>


        {/* ROW 2 */}
        <Box
  gridColumn={isMobile ? 'span 12' : 'span 8'}
  gridRow="span 2"
  sx={{
    borderRadius: "20px",
    background: '#ffffff',
    boxShadow: '8px 8px 20px rgba(0, 0, 0, 0.1), -8px -8px 20px rgba(255, 255, 255, 0.9)',
    border: "none",
    padding: '20px'
  }}
>
          <Box
            display="flex"
            flexDirection={isMobile ? 'column' : 'row'}
            justifyContent="space-between"
            alignItems="center"
            mb="20px"
          >
            <Box mb={isMobile ? '20px' : '0'}>
              <Typography
                variant="h5"
                fontWeight="700"
                sx={{ color: '#2D3748' }}
              >
                Disaster Severity
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#8B8FA3', mt: 0.5 }}
              >
                Statistics Overview
              </Typography>
            </Box>
          </Box>
          
          <Box height="250px">
            <BarChart ocrData={ocrData} isDashboard={true} />
          </Box>
        </Box>
        <Box
  gridColumn={isMobile ? 'span 12' : 'span 4'}
  gridRow="span 2"
  sx={{
    borderRadius: "20px",
    background: '#ffffff',
    boxShadow: '8px 8px 20px rgba(0, 0, 0, 0.1), -8px -8px 20px rgba(255, 255, 255, 0.9)',
    border: "1px solid #E2E8F0",
    overflow: "hidden",
    position: 'relative'
  }}
>
  {/* Background Pattern */}
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%)
      `,
      zIndex: 1
    }}
  />

  <Box
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 2
    }}
  >
    {/* Enhanced Header */}
    <Box
      sx={{
        background: '#F7FAFC',
        padding: '24px',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Box
          sx={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <LocationOnOutlinedIcon sx={{ color: '#fff', fontSize: '20px' }} />
        </Box>
        <Box>
          <Typography sx={{ color: '#2D3748', fontSize: '18px', fontWeight: 700, mb: 0.5 }}>
            Priority Zones
          </Typography>
          <Typography sx={{ color: '#718096', fontSize: '12px' }}>
            High-risk monitored areas
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          padding: '6px 12px',
          borderRadius: '15px',
          background: '#000000',
          color: '#fff',
          fontSize: '10px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}
      >
        {pinnedLocations.length} Active
      </Box>
    </Box>
    
    {/* Enhanced Location Cards */}
    <Box sx={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
      {pinnedLocations.length > 0 ? (
        pinnedLocations.map((location, i) => (
          <Box
            key={`${location.location}-${i}`}
            sx={{
              padding: '20px',
              marginBottom: '16px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px) scale(1.02)',
                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
                background: 'rgba(255, 255, 255, 1)',
              }
            }}
          >
            {/* Location Header with Icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mb: 2 }}>
              <Box
                sx={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: location.severity === 'high' ? 
                    'linear-gradient(135deg, #FF4444 0%, #CC0000 100%)' :
                    location.severity === 'medium' ? 
                    'linear-gradient(135deg, #FF8800 0%, #CC6600 100%)' :
                    'linear-gradient(135deg, #00AA44 0%, #006622 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <LocationOnOutlinedIcon sx={{ color: '#fff', fontSize: '16px' }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ 
                  color: '#2D3748', 
                  fontSize: '16px', 
                  fontWeight: 800, 
                  lineHeight: 1.2 
                }}>
                  {location.location}
                </Typography>
                <Typography sx={{ 
                  color: '#718096', 
                  fontSize: '12px', 
                  fontWeight: 500 
                }}>
                  {location.disaster_type} Event
                </Typography>
              </Box>
              <Chip 
                label={capitalizeFirstLetter(location.severity)} 
                size="small"
                sx={{ 
                  height: '24px', 
                  fontSize: '10px',
                  fontWeight: 700,
                  background: location.severity === 'high' ? 
                    'linear-gradient(135deg, #FF4444 0%, #CC0000 100%)' :
                    location.severity === 'medium' ? 
                    'linear-gradient(135deg, #FF8800 0%, #CC6600 100%)' :
                    'linear-gradient(135deg, #00AA44 0%, #006622 100%)',
                  color: '#fff',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  '& .MuiChip-label': { padding: '0 8px' }
                }}
              />
            </Box>

            {/* Description */}
            <Typography sx={{ 
              color: '#4A5568', 
              fontSize: '13px', 
              lineHeight: 1.5,
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {location.report}
            </Typography>

            {/* Footer Info */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingTop: '12px',
              borderTop: '1px solid rgba(0, 0, 0, 0.05)'
            }}>
              <Typography sx={{ 
                color: '#718096', 
                fontSize: '11px', 
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {new Date(location.timestamp).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </Typography>
              <Typography sx={{ 
                color: '#A0AEC0', 
                fontSize: '10px',
                fontStyle: 'italic'
              }}>
                Click to monitor
              </Typography>
            </Box>
          </Box>
        ))
      ) : (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center'
        }}>
          <LocationOnOutlinedIcon sx={{ color: '#CBD5E1', fontSize: '48px', mb: 1 }} />
          <Typography sx={{ color: '#2D3748', fontWeight: 600 }}>
            No Priority Zones
          </Typography>
          <Typography sx={{ color: '#718096', fontSize: '12px' }}>
            Locations will appear here when marked as priority
          </Typography>
        </Box>
      )}
    </Box>
  </Box>
</Box>

        {/* ROW 3 */}
        <Box
          gridColumn={isMobile ? 'span 12' : 'span 4'}
          gridRow="span 2"
          p="20px"
          sx={{
            borderRadius: "20px",
            background: '#ffffff',
            boxShadow: '8px 8px 20px rgba(0, 0, 0, 0.1), -8px -8px 20px rgba(255, 255, 255, 0.9)',
            border: "1px solid #E2E8F0",
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%)
              `,
              zIndex: 1
            }}
          />
          
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mb: 1 }}>
              <Box
                sx={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <WarningAmberOutlinedIcon sx={{ color: '#fff', fontSize: '20px' }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="700" sx={{ color: '#2D3748', mb: 0.5 }}>
                  Severity Insights
                </Typography>
                <Typography variant="body2" sx={{ color: '#718096', fontSize: '12px' }}>
                  Real-time risk assessment
                </Typography>
              </Box>
            </Box>
            
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt="20px"
            >
              <ProgressCircle size="135"/>
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography
                  variant="body1"
                  sx={{ color: '#2D3748', fontSize: '14px', fontWeight: 600, mb: 1 }}
                >
                  {chartData[0]?.count || 0} High Risk • {chartData[1]?.count || 0} Medium Risk
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: '#718096', fontSize: '12px' }}
                >
                  {chartData[2]?.count || 0} Low Risk situations monitored
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          gridColumn={isMobile ? 'span 12' : 'span 4'}
          gridRow="span 2"
          sx={{
            borderRadius: "20px",
            background: '#ffffff',
            boxShadow: '8px 8px 20px rgba(0, 0, 0, 0.1), -8px -8px 20px rgba(255, 255, 255, 0.9)',
            border: "none",
            padding: '20px'
          }}
        >
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ color: '#2D3748', mb: 1 }}
          >
            Disaster Stats
          </Typography>
          <Typography variant="body2" sx={{ color: '#8B8FA3', mb: 0 }}>
            Trend Analysis
          </Typography>
          <Box height="250px">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn={isMobile ? 'span 12' : 'span 4'}
          gridRow="span 2"
          padding="24px"
          sx={{
            borderRadius: "20px",
            background: '#ffffff',
            boxShadow: '8px 8px 20px rgba(0, 0, 0, 0.1), -8px -8px 20px rgba(255, 255, 255, 0.9)',
            border: "none",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ color: '#2D3748', mb: 1 }}
          >
            Geographic Distribution
          </Typography>
          <Typography variant="body2" sx={{ color: '#8B8FA3', mb: 2 }}>
            Regional Analysis
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
    <Modal
  open={showPopup}
  onClose={handleClosePopup}
  aria-labelledby="popup-title"
  aria-describedby="popup-description"
>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "400px",
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 4,
      borderRadius: "10px",
    }}
  >
    {/* Red Blinking Curved Box for Severity */}
    <Box
      sx={{
        position: "absolute",
        top: "15px",
        right: "15px",
        px: 2,
        py: 0.5,
        fontSize: "13px",
        borderRadius: "10px",
        backgroundColor: "rgba(255, 0, 0, 0.8)",
        color: "#fff",
        fontWeight: "bold",
        boxShadow: "0px 0px 10px rgba(255, 0, 0, 0.7)",
        animation: "blinker 1s linear infinite",
        "@keyframes blinker": {
          "50%": { opacity: 0.5 },
        },
      }}
    >
      Severity: {ocrData[0]?.severity || "Unknown"}
    </Box>

    <Typography id="popup-title" variant="h5" component="h2">
      <strong>Latest OCR Data</strong>
    </Typography>
    <Box id="popup-description" mt={2}>
      {ocrData.length ? (
        <>
          <Typography><strong>Location:</strong> {ocrData[0]?.location || "No location available"}</Typography>
          <Typography><strong>Disaster Type:</strong> {ocrData[0]?.disaster_type || "No disaster type available"}</Typography>
          <Typography><strong>News Source:</strong> {ocrData[0]?.news_source || "No news source available"}</Typography>
          <Typography><strong>Timestamp:</strong> {ocrData[0]?.timestamp || "No timestamp available"}</Typography>
          <Typography><strong>Coordinates:</strong> Lat: {ocrData[0]?.coordinates?.lat || "N/A"}, Lng: {ocrData[0]?.coordinates?.lng || "N/A"}</Typography>
         
        </>
      ) : (
        <Typography>No data available</Typography>
      )}
    </Box>
    <Button
      onClick={handleClosePopup}
      sx={{ mt: 3, backgroundColor: colors.blueAccent[500], color: "#fff" }}
    >
      Close
    </Button>
  </Box>
</Modal>



    </Box>
  );
  
};



export default Dashboard1;
