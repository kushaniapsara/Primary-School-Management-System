import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import {
  Box,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Collapse,
  IconButton,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const ProgressTeacher = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openRows, setOpenRows] = useState({});
    const [message, setMessage] = useState("");


  const years = Array.from({ length: 9 }, (_, i) => 2022 + i);

  const fetchStudents = async (selectedYear) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5001/api/progress/students/details",
        {
          params: { year: selectedYear },
          headers: { Authorization: token },
        }
      );
      setStudents(response.data);
    } catch (error) {
      setStudents([]);
      alert(
        "Error fetching students: " +
          (error.response?.data?.message || error.message)
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents(year);
    // eslint-disable-next-line
  }, [year]);

  // Toggle expand/collapse row for subject details
  const handleToggleRow = (studentId) => {
    setOpenRows((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };
  const navigate = useNavigate();

 //view student profiles
  const handleViewStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/students');
      if (response.status === 200) {
        localStorage.setItem('students', JSON.stringify(response.data));
        navigate('/StudentProfiles');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error fetching student profiles');
    }
  };


  return (
    <Box sx={{ p: 3, maxWidth: 900, margin: "0 auto" }}>
      <Typography variant="h4" mb={3}>
        Progress
      </Typography>
      <Button
  variant="contained"
  color="primary"
  sx={{ mb: 2 }}
  onClick={() => navigate("/addsubmarks")}
>
  Add Subject Marks
</Button>

      <FormControl sx={{ mb: 3, minWidth: 220 }}>
        <InputLabel id="year-select-label">Academic Year</InputLabel>
        <Select
          labelId="year-select-label"
          value={year}
          label="Academic Year"
          onChange={(e) => setYear(e.target.value)}
        >
          {years.map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Student ID</TableCell>
              <TableCell>Full Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3}>Loading...</TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>No students found.</TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <React.Fragment key={student.Student_ID}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleRow(student.Student_ID)}
                      >
                        {openRows[student.Student_ID] ? (
                          <KeyboardArrowUp />
                        ) : (
                          <KeyboardArrowDown />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>{student.Student_ID}</TableCell>
                    <TableCell>{student.Full_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={3}
                    >
                      <Collapse
                        in={openRows[student.Student_ID]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={1}>
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            component="div"
                          >
                            Subjects & Marks
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Subject Name</TableCell>
                                <TableCell>Marks</TableCell>
                                <TableCell>Term</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Academic Year</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {student.subjects && student.subjects.length > 0 ? (
                                student.subjects.map((subj, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>{subj.Subject_name}</TableCell>
                                    <TableCell>{subj.Marks}</TableCell>
                                    <TableCell>{subj.Term}</TableCell>
                                    
                                    <TableCell>
                                      {subj.Date
                                        ? new Date(subj.Date)
                                            .toLocaleDateString()
                                        : "-"}
                                    </TableCell>
                                    <TableCell>{subj.year}</TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={4}>
                                    No subjects found.
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
       <div>
              <button
                onClick={handleViewStudents}
                className="w-auto bg-blue-500 text-white p-3 rounded-md cursor-pointer hover:bg-blue-600 mt-4 mx-4">
                View Student Profiles
              </button>
            </div>
    </Box>

    
  );
};

export default ProgressTeacher;