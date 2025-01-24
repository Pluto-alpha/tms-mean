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
  onEdit: () => void;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  dueDate,
  status,
  onEdit,
  onDelete,
}) => {
  const statusColor: Record<string, string> = {
    Pending: "orange",
    "In Progress": "blue",
    Completed: "green",
  };

  const isCompleted = status === "Completed";

  return (
    <Card
      sx={{
        width: '100%',
        opacity: isCompleted ? 0.6 : 1,
        transition: "opacity 0.3s",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            textDecoration: isCompleted ? "line-through" : "none",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            textDecoration: isCompleted ? "line-through" : "none",
          }}
        >
          {description}
        </Typography>
      </CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title={`Due on ${moment(dueDate).format("DD-MM-YYYY HH:mm A")}`}>
            <Box sx={{ display: "flex", alignItems: "center", cursor: "help" }}>
              <AccessTime
                sx={{ color: statusColor[status], fontSize: 18, mr: 0.5 }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: statusColor[status],
                  fontWeight: "bold",
                }}
              >
                {moment(dueDate).format("DD-MM-YYYY HH:mm A")}
              </Typography>
            </Box>
          </Tooltip>
        </Box>
        <Box>
          <Tooltip title="Edit Task">
            <IconButton color="primary" onClick={onEdit}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Task">
            <IconButton color="error" onClick={onDelete}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
};

export default TaskCard;