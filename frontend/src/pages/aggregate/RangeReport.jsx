import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { jsPDF } from "jspdf";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Header from '../../components/Header';
import newRequest from '../../utils/newRequest';

// Sample Disaster Progression Data
const SAMPLE_DISASTER_PROGRESSION = [
  {
    date: '2025-11-15',
    disasterType: 'Air Pollution',
    location: 'Delhi NCR, India',
    progression: [
      {
        time: 'Morning',
        details: 'Delhi AQI recorded at 380 (Very Poor category). Smog blanketed the city, reducing visibility to less than 200 meters. Health advisories issued for vulnerable groups including children and elderly. Schools advised to limit outdoor activities.'
      }
    ],
    severity: 'High',
    affectedArea: '1500 sq km'
  },
  {
    date: '2025-11-18',
    disasterType: 'Air Pollution Emergency',
    location: 'Delhi NCR, India',
    progression: [
      {
        time: 'Afternoon',
        details: 'AQI spiked to severe levels at 428 in Delhi and 406 in Greater Noida - the worst day of November. CAQM activated emergency protocols under GRAP Stage 3. Ban on construction activities and restrictions on BS-III/IV diesel vehicles enforced.'
      }
    ],
    severity: 'Severe',
    affectedArea: '2000 sq km'
  },
  {
    date: '2025-11-22',
    disasterType: 'Air Pollution',
    location: 'Delhi NCR, India',
    progression: [
      {
        time: 'Morning',
        details: 'CAQM revised GRAP schedule with stricter measures. AQI remained in Very Poor to Severe category (350-400 range). PMO directly monitoring pollution sources. Staggered office timings implemented for government offices to reduce peak-hour emissions.'
      }
    ],
    severity: 'High',
    affectedArea: '1800 sq km'
  },
  {
    date: '2025-11-24',
    disasterType: 'Air Pollution',
    location: 'Delhi NCR, India',
    progression: [
      {
        time: 'Morning',
        details: 'Government mandated 50% work-from-home for offices under GRAP Stage 3. AQI recorded at 356. Residents staged protests near India Gate demanding immediate government action. Doctors advised people with lung or heart conditions to leave the city if possible.'
      }
    ],
    severity: 'High',
    affectedArea: '1700 sq km'
  },
  {
    date: '2025-11-25',
    disasterType: 'Pre-Cyclone Alert',
    location: 'Chennai & Tamil Nadu, India',
    progression: [
      {
        time: 'Evening',
        details: 'IMD detected low-pressure area near Sri Lanka in the Bay of Bengal, expected to intensify into Cyclone Senyar. Yellow alert issued for Chennai, Tiruvallur, and Delta districts. Schools in Kanyakumari, Tirunelveli, Tenkasi, Thoothukudi, and Ramanathapuram declared closed for Nov 26-27 as precautionary measure.'
      }
    ],
    severity: 'Medium',
    affectedArea: '500 sq km'
  },
  {
    date: '2025-11-26',
    disasterType: 'Air Quality Improvement & Cyclone Watch',
    location: 'Delhi NCR & Tamil Nadu, India',
    progression: [
      {
        time: 'Morning',
        details: 'Delhi AQI improved to 327 (Very Poor) as winds picked up. CAQM revoked GRAP Stage 3 measures but kept Stage 1 and 2 restrictions in force. Meanwhile, the depression near Sri Lanka intensified and began moving northwards toward Tamil Nadu coast.'
      },
      {
        time: 'Evening',
        details: 'IMD forecast continuous heavy rainfall for Chennai from Nov 28-Dec 1. Authorities prepared for potential flooding in low-lying areas. Fishermen advised not to venture into sea.'
      }
    ],
    severity: 'Medium',
    affectedArea: '2500 sq km'
  },
  {
    date: '2025-11-27',
    disasterType: 'Cyclone Formation',
    location: 'Tamil Nadu & Puducherry, India',
    progression: [
      {
        time: 'Morning',
        details: 'Depression intensified into Cyclonic Storm Senyar over southwest Bay of Bengal. Wind speeds reached 50-60 kmph. Schools across Chennai, Kancheepuram, and Tiruvallur districts closed. NDRF teams deployed to coastal areas for precautionary measures.'
      },
      {
        time: 'Afternoon',
        details: 'IMD issued Orange alert for heavy to very heavy rainfall. Chennai Corporation activated emergency control rooms and deployed dewatering pumps in flood-prone zones. Residents in low-lying areas advised to move to relief centers.'
      }
    ],
    severity: 'High',
    affectedArea: '800 sq km'
  }
];


const DisasterProgressionReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedProgression, setSelectedProgression] = useState([]);
  const [ocrData, setOcrData] = useState([]);
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top when component mounts
      }, []);

    useEffect(() => {
        const fetchNews = async () => {
          try {
            const response = await newRequest.get("/totalreport");
            console.log("API response:", response.data);
            const fetchedData = response.data.ocrData || [];
            setOcrData(fetchedData); // Reverse the array
          } catch (error) {
            console.error("Error fetching OCR data:", error);
          }
        };
      
        fetchNews();
      }, []);

  const handleDateRangeSelect = (selectInfo) => {
    const start = selectInfo.startStr;
    const end = selectInfo.endStr;

    setStartDate(start);
    setEndDate(end);

    // Filter progression data within the selected date range
    const filteredProgression = SAMPLE_DISASTER_PROGRESSION.filter(
      entry => entry.date >= start && entry.date <= end
    );

    setSelectedProgression(filteredProgression);
  };

  const generateProgressionPDF = () => {
    if (selectedProgression.length === 0) return;

    const report = "The National Capital Region of India faced a severe air quality crisis throughout November 2025, while simultaneously, Tamil Nadu and Puducherry braced for Cyclone Senyar. Beginning November 15, Delhi's Air Quality Index (AQI) reached hazardous levels at 380 (Very Poor category), with thick smog blanketing the city and reducing visibility to under 200 meters. Health advisories were immediately issued for vulnerable populations including children, elderly citizens, and those with respiratory conditions. Schools were instructed to limit outdoor activities as air pollution posed serious health risks. By November 18, the situation deteriorated dramatically as Delhi's AQI spiked to a catastrophic 428—the worst recorded day of the month—with neighboring areas like Greater Noida registering 406. The Commission for Air Quality Management (CAQM) activated emergency protocols under the Graded Response Action Plan (GRAP) Stage 3, enforcing strict bans on all construction and demolition activities, and imposing restrictions on BS-III and BS-IV diesel vehicles entering the capital. The severe pollution crisis prompted the Prime Minister's Office to directly monitor pollution sources and coordinate inter-departmental responses. On November 22, CAQM revised the GRAP schedule with even more stringent measures as AQI remained persistently between 350-400. Staggered office timings were implemented for government offices to reduce peak-hour vehicular emissions. By November 24, authorities mandated work-from-home for 50% of office staff across Delhi-NCR under GRAP Stage 3 protocols, with AQI recorded at 356. Frustrated residents staged protests near India Gate, demanding immediate and decisive government action to address the recurring pollution nightmare. Medical professionals advised patients with pre-existing lung or cardiovascular conditions to temporarily relocate if possible, highlighting the crisis's severity. Meanwhile, on November 25, a distinct meteorological threat emerged along India's southeastern coast. The India Meteorological Department (IMD) detected a low-pressure area forming near Sri Lanka in the Bay of Bengal, which was forecast to intensify into Cyclone Senyar. A yellow alert was promptly issued for Chennai, Tiruvallur, and Delta districts of Tamil Nadu. As a precautionary measure, district authorities declared school closures for November 26-27 across Kanyakumari, Tirunelveli, Tenkasi, Thoothukudi, and Ramanathapuram districts. On November 26, Delhi experienced marginal relief as wind patterns shifted, improving the AQI to 327 (Very Poor). CAQM revoked GRAP Stage 3 measures but maintained Stage 1 and 2 restrictions. Simultaneously, the depression near Sri Lanka intensified and began tracking northward toward the Tamil Nadu coast. IMD forecast continuous heavy rainfall for Chennai from November 28 through December 1, prompting authorities to prepare for potential urban flooding in historically vulnerable low-lying neighborhoods. Fishermen were strictly advised against venturing into the sea. By November 27, the depression officially intensified into Cyclonic Storm Senyar over the southwest Bay of Bengal, with wind speeds reaching 50-60 kmph."
    const doc = new jsPDF();
  
    // Government-style header
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text("OFFICIAL DISASTER PROGRESSION REPORT", 105, 15, { align: 'center' });
    doc.setLineWidth(0.5);
    doc.line(20, 20, 190, 20);
  
    // Disaster Overview
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    
    // Group disasters by type
    const disasterTypes = [...new Set(selectedProgression.map(entry => entry.disasterType))];
    doc.text(`DISASTER(S): ${disasterTypes.join(', ')}`, 20, 30);
    
    doc.text(`LOCATION(S): ${[...new Set(selectedProgression.map(entry => entry.location))].join(', ')}`, 20, 40);
    doc.text(`DATE RANGE: ${startDate} to ${endDate}`, 20, 50);
  
    let yPosition = 70;
    doc.setFont('helvetica', 'bold');
  const summaryTitle = "SUMMARY: ";
  const summaryTitleWidth = doc.getTextWidth(summaryTitle);
  doc.text(summaryTitle, 20, yPosition);
    const summaryLines = doc.splitTextToSize(report, 180); // Wrap long text to fit within the page width
  
    doc.setFont('helvetica', 'normal');
    
    doc.text(summaryLines, 20, yPosition+ 20);
  
    // Update yPosition based on the length of the summary
    yPosition += summaryLines.length * 10 + 20; // Adjust for each summary section
  
    // Add a new page if the content exceeds the available space
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
  
  
    // Footer with watermark
    doc.setTextColor(150);
    doc.setFont('helvetica', 'bold');
    doc.text("GENERATED BY REVIVE", 105, 280, { align: 'center', angle: 45 });
  
    doc.save(`DISASTER_PROGRESSION_${startDate}_TO_${endDate}.pdf`);
  };
  

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      p: 3,
      backgroundColor: '#F0F0F0'
    }}>
        <Header title="Generate Total Reports" subtitle="Select a Date" />
      <Card sx={{ 
        width: '100%', 
        maxWidth: 1000, 
        boxShadow: 3,
        border: '2px solid #4A4A4A'
      }}>
        <CardContent>
          <Typography 
            variant="h4" 
            sx={{ 
              textAlign: 'center', 
              mb: 3, 
            
              textTransform: 'uppercase',
              fontWeight: 'bold',
              color: '#2C3E50'
            }}
          >
            Disaster Progression Report
          </Typography>

          {/* Calendar */}
          <Box sx={{ height: '600px', mb: 3 }}>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              selectable={true}
              select={handleDateRangeSelect}
              selectMode="range"
            />
          </Box>

          {/* Progression Display */}
          
        </CardContent>
      </Card>
      {selectedProgression.length > 0 && (
            <>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  mt:2,
                  fontWeight: 'bold',
                  color: '#2C3E50'
                }}
              >
                Disaster Progression: {[...new Set(selectedProgression.map(entry => entry.disasterType))].join(', ')}
              </Typography>

              {selectedProgression.map((entry, index) => (
                <Card key={index} sx={{ mb: 2, border: '1px solid #E0E0E0' }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle1">
                          <strong>Date:</strong> {entry.date}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle1">
                          <strong>Disaster:</strong> {entry.disasterType}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle1">
                          <strong>Severity:</strong> {entry.severity}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle1">
                          <strong>Affected Area:</strong> {entry.affectedArea}
                        </Typography>
                      </Grid>
                    </Grid>

                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Progression Details</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {entry.progression.map((prog, progIndex) => (
                            <TableRow key={progIndex}>
                              <TableCell>{prog.time}</TableCell>
                              <TableCell>{prog.details}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              ))}

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 2 
              }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={generateProgressionPDF}
                  sx={{ 
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                  }}
                >
                  Generate Progression PDF
                </Button>
              </Box>
            </>
          )}
    </Box>
  );
};

export default DisasterProgressionReport;