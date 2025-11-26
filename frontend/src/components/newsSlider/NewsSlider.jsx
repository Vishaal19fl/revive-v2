import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Box, Typography, Paper, Divider, Chip, Button, useTheme } from '@mui/material';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import newRequest from '../../utils/newRequest';
import './NewsSlider.scss';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NewspaperIcon from '@mui/icons-material/Newspaper';

const NewsSlider = () => {
  const [ocrData, setOcrData] = useState([]); 
  const theme = useTheme();

  useEffect(() => {
    const fetchOcrData = async () => {
      try {
        const response = await newRequest.get('/ocrdata');
        console.log('OCR Data Response:', response.data);
        setOcrData(Array.isArray(response.data.ocrData) ? response.data.ocrData : []);
      } catch (error) {
        console.error('Error fetching OCR data:', error);
      }
    };

    fetchOcrData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: true,
    cssEase: "cubic-bezier(0.87, 0, 0.13, 1)"
  };

  // Get top 5 items
  const topNews = ocrData.slice(0, 5);

  const getSeverityColor = (severity) => {
    const sev = severity?.toLowerCase();
    if (sev === 'high') return 'error';
    if (sev === 'medium') return 'warning';
    return 'success';
  };

  return (
    <Box mt={4} mx="auto" px={2} sx={{ maxWidth: '1000px', position: 'relative' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary, mb: 3 }}>
        Latest Disaster Updates
      </Typography>
      
      {topNews.length > 0 ? (
        <Slider {...settings} className='news-slider'>
          {topNews.map((item, index) => (
            <Box key={index} p={1}>
              <Paper 
                elevation={3} 
                sx={{
                  p: 4,
                  width: '90%',
                  margin: "auto",
                  borderRadius: '20px',
                  background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(145deg, #1e1e1e, #2d2d2d)' 
                    : 'linear-gradient(145deg, #ffffff, #f5f7fa)',
                  position: 'relative',
                  overflow: 'hidden',
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[10]
                  }
                }}
              >
                {/* Decorative accent */}
                <Box sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '6px', 
                  background: item.severity?.toLowerCase() === 'high' 
                    ? 'linear-gradient(90deg, #ff4444, #ff6b6b)' 
                    : 'linear-gradient(90deg, #4caf50, #81c784)'
                }} />

                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
                    {item.disaster_type || 'Disaster Alert'}
                  </Typography>
                  <Chip 
                    label={item.severity || 'Unknown'} 
                    color={getSeverityColor(item.severity)}
                    size="small"
                    sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
                  />
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={2} color="text.secondary">
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="subtitle1" fontWeight="500">
                    {item.location || 'Unknown Location'}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body1" sx={{ 
                  mb: 3, 
                  lineHeight: 1.6, 
                  color: theme.palette.text.secondary,
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3
                }}>
                  {item.data || 'No detailed information available for this alert.'}
                </Typography>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <NewspaperIcon fontSize="small" color="disabled" />
                    <Typography variant="caption" color="text.disabled">
                      Source: {item.news_source || 'Unknown'}
                    </Typography>
                  </Box>
                  
                  {item.news_source && (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      endIcon={<ArrowForwardIcon />}
                      href={item.news_source}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        borderRadius: '20px',
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      Read Full Report
                    </Button>
                  )}
                </Box>
              </Paper>
            </Box>
          ))}
        </Slider>
      ) : (
        <Typography align="center" color="textSecondary">No updates available at the moment.</Typography>
      )}
    </Box>
  );
};

export default NewsSlider;
