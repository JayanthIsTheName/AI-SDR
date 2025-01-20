import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  useTheme,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import GetAppIcon from "@mui/icons-material/GetApp";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const App = () => {
  const theme = useTheme();
  const apiUrl = process.env.REACT_APP_DEV_API;
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleUpload = async () => {
    if (!file) {
      showSnackbar('Please select a CSV file.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${apiUrl}/upload-csv/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showSnackbar(response.data.message, 'success');
      setFile(null);
      fileInputRef.current.value = "";
    } catch (error) {
      showSnackbar('Error uploading file.', 'error');
      console.error(error);
    }
  };

  const handleGetData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/leads/`);
      setTableData(response.data);
      showSnackbar('Data fetched successfully!', 'success');
    } catch (error) {
      showSnackbar('Error fetching data.', 'error');
      console.error(error);
    }
  };

  const handleDeleteData = async () => {
    try {
      const response = await axios.delete(`${apiUrl}/leads/`);
      showSnackbar(response.data.message, 'success');
      setTableData([]);
    } catch (error) {
      showSnackbar('Error deleting data.', 'error');
      console.error(error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          p: 4,
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AI AGENT DASHBOARD
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Upload your CSV data to get started with the AI Agent
          </Typography>
        </Box>

        {/* File Upload Section */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'background.paper',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 600, mb: 3 }}>
            <input
              accept=".csv"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadFileIcon />}
                fullWidth
                sx={{
                  height: 56,
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  '&:hover': {
                    borderStyle: 'dashed',
                    borderWidth: 2,
                  },
                }}
              >
                {file ? file.name : 'Choose CSV File'}
              </Button>
            </label>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleUpload}
              startIcon={<CloudUploadIcon />}
              sx={{ px: 4 }}
            >
              Upload
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleGetData}
              startIcon={<GetAppIcon />}
              sx={{ px: 4 }}
            >
              Fetch Data
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteData}
              startIcon={<DeleteIcon />}
              sx={{ px: 4 }}
            >
              Clear Data
            </Button>
          </Box>
        </Paper>

        {/* Data Table */}
        <TableContainer
          component={Paper}
          elevation={2}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>First Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Last Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>DOB</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Firm Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Firm Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Designation</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>GSTIN</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Annual Turnover</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Property Ownership</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow
                  key={row.id || index}
                  sx={{
                    '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                    '&:hover': { backgroundColor: 'action.selected' },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <TableCell>{row.first_name}</TableCell>
                  <TableCell>{row.last_name}</TableCell>
                  <TableCell>{row.dob}</TableCell>
                  <TableCell>{row.firm_name}</TableCell>
                  <TableCell>{row.firm_type}</TableCell>
                  <TableCell>{row.designation}</TableCell>
                  <TableCell>{row.gstin}</TableCell>
                  <TableCell>{row.annual_turnover}</TableCell>
                  <TableCell>{row.property_ownership}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default App;