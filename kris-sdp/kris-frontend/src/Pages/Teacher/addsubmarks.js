import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Alert,
} from "@mui/material";

const AddSubMarks = () => {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [term, setTerm] = useState("");
  const [marks, setMarks] = useState({});
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");

  // Years for academic year dropdown
  const years = Array.from({ length: 9 }, (_, i) => 2022 + i);
  const termOptions = [1, 2, 3];

  // Fetch subjects for class/year
  useEffect(() => {
    const fetchSubjects = async () => {
      setSubjects([]);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5001/api/progress/subjects",
          {
            params: { year },
            headers: { Authorization: token },
          }
        );
        setSubjects(res.data || []);
      } catch (e) {
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, [year]);

  // Fetch students for class/year
  useEffect(() => {
    const fetchStudents = async () => {
      setStudents([]);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5001/api/progress/students",
          {
            params: { year },
            headers: { Authorization: token },
          }
        );
        setStudents(res.data || []);
      } catch (e) {
        setStudents([]);
      }
    };
    fetchStudents();
  }, [year]);

  // Handle mark entry
  const handleMarkChange = (studentId, value) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: value === "" ? "" : Number(value),
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    const markEntries = Object.entries(marks)
      .filter(([sid, mark]) => mark !== "" && mark !== null && !isNaN(mark))
      .map(([student_id, marks]) => ({
        student_id: Number(student_id),
        marks: Number(marks),
      }));

    if (!subjectId || !term) {
      setSubmitError("Please select both subject and term.");
      return;
    }

    if (markEntries.length === 0) {
      setSubmitError("No marks entered!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5001/api/progress/addsubmarks",
        {
          subject_id: subjectId,
          term,
          year,
          entries: markEntries,
        },
        {
          headers: { Authorization: token },
        }
      );
      setSubmitSuccess("Marks submitted successfully!");
      setMarks({});
    } catch (e) {
      setSubmitError("Failed to submit marks.");
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 900, margin: "0 auto" }}>
      <Typography variant="h4" mb={3}>
        Add Subject Marks
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel id="subject-label">Subject</InputLabel>
            <Select
              labelId="subject-label"
              value={subjectId}
              label="Subject"
              onChange={(e) => setSubjectId(e.target.value)}
              required
            >
              {subjects.map((subj) => (
                <MenuItem key={subj.Subject_ID} value={subj.Subject_ID}>
                  {subj.Subject_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="term-label">Term</InputLabel>
            <Select
              labelId="term-label"
              value={term}
              label="Term"
              onChange={(e) => setTerm(e.target.value)}
              required
            >
              {termOptions.map((t) => (
                <MenuItem key={t} value={t}>{`Term ${t}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="year-label">Year</InputLabel>
            <Select
              labelId="year-label"
              value={year}
              label="Year"
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Paper sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student ID</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Marks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.length > 0 ? (
                students.map((stu) => (
                  <TableRow key={stu.Student_ID}>
                    <TableCell>{stu.Student_ID}</TableCell>
                    <TableCell>{stu.Full_name}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        variant="outlined"
                        size="small"
                        value={marks[stu.Student_ID] ?? ""}
                        onChange={(e) =>
                          handleMarkChange(stu.Student_ID, e.target.value)
                        }
                        inputProps={{ min: 0, max: 100 }}
                        placeholder="Enter marks"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3}>No students found for this class/year.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {submitSuccess}
          </Alert>
        )}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 1 }}
        >
          Submit Marks
        </Button>
      </form>
    </Box>
  );
};

export default AddSubMarks;