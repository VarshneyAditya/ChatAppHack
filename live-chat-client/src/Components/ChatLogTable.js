import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material';
  
const ChatLogTable = () => {
    const downloadCsv = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
          "Timestamp,Order No.,Sender,Message,Addressed By,Status,Resolution\n" +
          chatLogs.map(log => Object.values(log).join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "chat_logs.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    
const tableHeadingStyle = {
    backgroundColor: '#95007fc2',
    color: '#fff',
    fontWeight: 'bold',
    borderRight: '1px solid #fff', // Add vertical line
    };

    const tableCellStyle = {
        borderRight: '1px solid #f0f0f0', // Add vertical line
    };
    
const chatLogs = [
    { timestamp: '2024-02-25 12:30', orderNo: 'JKSIKE-29910' , sender: 'User', message: 'Hello!', addressedBy:'Saransh K', Status:'Resolved', Resolution:'Testing Done' },
    { timestamp: '2024-02-25 12:35', orderNo: 'JKSIKE-29910', sender: 'Support', message: 'Hi there! How can we assist you today?', addressedBy:'Abhishek Anand', Status:'Open', Resolution:''},
    { timestamp: '2024-02-25 12:35', orderNo: 'JKSIKE-29910', sender: 'Support', message: 'Hi there! How can we assist you today?', addressedBy:'Abhishek Anand', Status:'Open', Resolution:''},
    { timestamp: '2024-02-25 12:35', orderNo: 'JKSIKE-29910', sender: 'Support', message: 'Hi there! How can we assist you today?', addressedBy:'Aditya V', Status:'Open', Resolution:''},
    { timestamp: '2024-02-25 12:40', orderNo: 'JKSIKE-29911', sender: 'User', message: 'I have an issue with my order.', addressedBy: 'Abrar Z', Status: 'Open', Resolution: null },
    { timestamp: '2024-02-25 12:42', orderNo: 'JKSIKE-29911', sender: 'Support', message: 'Sure, Im here to help. Can you please provide more details about the issue?', addressedBy: 'Saransh K', Status: 'Open', Resolution: null },
    { timestamp: '2024-02-25 12:45', orderNo: 'JKSIKE-29911', sender: 'User', message: 'One of the items in my order is missing.', addressedBy: "Abrar Z", Status: 'Open', Resolution: null },
    { timestamp: '2024-02-25 12:50', orderNo: 'JKSIKE-29911', sender: 'Support', message: 'I apologize for the inconvenience. Let me check the status of your order and resolve the issue for you.', addressedBy: 'Aditya V', Status: 'Open', Resolution: null },
    { timestamp: '2024-02-25 12:55', orderNo: 'JKSIKE-29911', sender: 'Support', message: 'Thank you for your patience. We have identified the issue, and the missing item will be shipped to you within 24 hours.', addressedBy: 'Aditya V', Status: 'Resolved', Resolution: 'Item Reshipped' },
    // Add more chat logs as needed
    ];
  return (
    <Box display="flex" flexDirection="column" alignItems="center">

    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell style={tableHeadingStyle}>Timestamp</TableCell>
            <TableCell style={tableHeadingStyle}>Order No.</TableCell>
            <TableCell style={tableHeadingStyle}>Sender</TableCell>
            <TableCell style={tableHeadingStyle}>Addressed By</TableCell>
            <TableCell style={tableHeadingStyle}>Message</TableCell>
            <TableCell style={tableHeadingStyle}>Status</TableCell>
            <TableCell style={tableHeadingStyle}>Resolution</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chatLogs.map(({ timestamp, sender, message, addressedBy, Status, Resolution, orderNo }, index) => (
            <TableRow key={index}>
              <TableCell style={tableCellStyle}>{timestamp}</TableCell>
              <TableCell style={tableCellStyle}>{orderNo}</TableCell>
              <TableCell style={tableCellStyle}>{sender}</TableCell>
              <TableCell style={tableCellStyle}>{addressedBy}</TableCell>
              <TableCell style={tableCellStyle}>{message}</TableCell>
              <TableCell style={tableCellStyle}>{Status}</TableCell>
              <TableCell style={tableCellStyle}>{Resolution}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Button variant="contained" color="primary" onClick={downloadCsv} style={{ marginTop: '10px', background:'#95007fc2' }}>
        Download CSV
    </Button>
    </Box>

  );
};

export default ChatLogTable;
