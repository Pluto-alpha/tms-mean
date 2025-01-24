import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  SelectChangeEvent,
} from "@mui/material";
import TaskCard from "../components/TaskCard";
import moment from "moment";

// import { useDispatch } from 'react-redux';
// import { fetchTasks } from './taskSlice';
// const TaskComponent: React.FC = () => {
//   const dispatch = useDispatch();
//   const loadTasks = () => {
//     dispatch(fetchTasks());
//   };
//   return (
//     <button onClick={loadTasks}>Load Tasks</button>
//   );
// };

const TaskDashboard: React.FC = () => {
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending",
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Array<typeof taskDetails>>([]); // State for storing tasks

  const handleCreateTask = () => {
    setTasks([...tasks, taskDetails]);
    setOpenDialog(false); // Close the dialog
    setTaskDetails({
      title: "",
      description: "",
      dueDate: "",
      status: "Pending",
    }); // Reset task details after creating task
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name === "dueDate") {
      if (value) {
        const isoDate = moment(value);
        if (isoDate.isValid()) {
          setTaskDetails({
            ...taskDetails,
            [name]: isoDate.toISOString(),
          });
        } else {
          console.error("Invalid date format:", value);
          setTaskDetails({
            ...taskDetails,
            [name]: "",
          });
        }
      } else {
        setTaskDetails({
          ...taskDetails,
          [name]: "",
        });
      }
    } else {
      setTaskDetails({
        ...taskDetails,
        [name as string]: value,
      });
    }
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setTaskDetails({ ...taskDetails, status: event.target.value });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setIsSearching(event.target.value.length > 0);
  };

  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6">Task Dashboard</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body1">Logged in as: UserName</Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px",
        }}
      >
        <TextField
          label="Search Tasks"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          sx={{
            maxWidth: isSearching ? "100%" : "500px",
            transition: "max-width 0.3s ease-in-out",
          }}
        />
        {!isSearching && (
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            sx={{
              transition: "opacity 0.3s ease-in-out",
              opacity: isSearching ? 0 : 1,
            }}
          >
            + Add Task
          </Button>
        )}
      </Box>

      {/* Create Task Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
      >
        <DialogTitle>Create Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={taskDetails.title}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 3, mt: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={taskDetails.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 3 }}
          />
          <TextField
            label="Due Date"
            name="dueDate"
            value={
              taskDetails.dueDate
                ? moment(taskDetails.dueDate).format("YYYY-MM-DDTHH:mm")
                : ""
            }
            onChange={handleChange}
            fullWidth
            type="datetime-local"
            sx={{ mb: 3 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              name="status"
              value={taskDetails.status}
              onChange={handleStatusChange}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateTask} color="primary">
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          padding: "20px",
        }}
      >
        {tasks.length === 0 ? (
          <Typography>No tasks available</Typography>
        ) : (
          tasks.map((task, index) => (
            <Box key={index}>
              <TaskCard
                title={task.title}
                description={task.description}
                dueDate={task.dueDate}
                status={task.status}
              />
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default TaskDashboard;
