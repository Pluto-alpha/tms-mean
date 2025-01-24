import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Edit, Delete, AccessTime } from "@mui/icons-material";
import moment from "moment";

interface TaskCardProps {
  title: string;
  description: string;
  dueDate: string;
  status: string;
}
const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  dueDate,
  status,
}) => {
  const statusColor: { [key: string]: string } = {
    Pending: "orange",
    "In Progress": "blue",
    Completed: "green",
  };
  const completedStyle = {
    textDecoration: status === "Completed" ? "line-through" : "none",
    filter: status === "Completed" ? "blur(0.5px)" : "none",
  };
  const formattedDueDate = moment(dueDate).format("DD-MM-YYYY h:mm A");

  return (
    <Card sx={{ width: "100%", mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={completedStyle}>
          {title}
        </Typography>
        <Typography variant="body2" sx={completedStyle}>
          {description}
        </Typography>
      </CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5px",
        }}
      >
        <Box sx={{ display: "flex", gap: 1, ml: 1 }}>
          <Tooltip title={`Status: ${status}`} arrow>
            <Typography
              variant="body2"
              sx={{
                color: statusColor[status],
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                marginRight: 1,
              }}
            >
              <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
              {formattedDueDate} {/* Use the formatted due date */}
            </Typography>
          </Tooltip>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Edit Task" arrow>
            <IconButton color="primary">
              <Edit sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Task" arrow>
            <IconButton color="error">
              <Delete sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
};

export default TaskCard;