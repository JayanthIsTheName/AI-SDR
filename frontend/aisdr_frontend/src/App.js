import React, { useState } from "react";
import axios from "axios";
import "./App.css";
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
  Grid,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import GetAppIcon from "@mui/icons-material/GetApp";

const App = () => {
  const apiUrl = process.env.REACT_APP_DEV_API

  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);

  // Handle file input change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle CSV file upload
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${apiUrl}/upload-csv/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data.message);
      setFile(null); // Clear the file input
    } catch (error) {
      alert("Error uploading fie.");
      console.error(error);
    }
  };

  // Fetch data from the backend
  const handleGetData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/leads/`);
      setTableData(response.data);
    } catch (error) {
      alert("Error fetching data.");
      console.error(error);
    }
  };

  // Delete all data from the backend
  const handleDeleteData = async () => {
    try {
      const response = await axios.delete(`${apiUrl}/leads/`);
      alert(response.data.message);
      setTableData([]); // Clear the table data
    } catch (error) {
      alert("Error deleting data.");
      console.error(error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Align horizontally to center
          justifyContent: "flex-start", // Align vertically to top
          minHeight: "100vh", // Ensure the container takes full viewport height
          pt: 4, // Add padding at the top
        }}
      >
        {/* Title */}
        <Typography variant="h4" component="h1" gutterBottom>
          AI AGENT
        </Typography>

        {/* File Input Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <input
            accept=".csv"
            style={{ display: "none" }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
              sx={{ mr: 2 }}
            >
              Choose File
            </Button>
          </label>
          <Typography variant="body1" sx={{ ml: 2 }}>
            {file ? `File Chosen: ${file.name}` : "No file chosen"}
          </Typography>
        </Box>

        {/* Upload Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          sx={{ mb: 4 }}
        >
          Upload CSV
        </Button>

        {/* Buttons for Get Data and Delete Data */}
        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<GetAppIcon />}
            onClick={handleGetData}
            sx={{ mr: 2 }}
          >
            Get Data
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteData}
          >
            Delete Data
          </Button>
        </Box>

        {/* Table to Display Data */}
        <TableContainer component={Paper} elevation={3} sx={{ width: "100%" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>First Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Last Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Firm Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Designation</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Annual Turnover
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.first_name}</TableCell>
                  <TableCell>{row.last_name}</TableCell>
                  <TableCell>{row.firm_name}</TableCell>
                  <TableCell>{row.designation}</TableCell>
                  <TableCell>{row.annual_turnover}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default App;
