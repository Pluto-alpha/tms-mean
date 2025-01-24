import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

const getToken = () => localStorage.getItem("token");

// Fetch all tasks
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const token = getToken();
  if (!token) throw new Error("Authentication token not found");
  const response = await axios.get("http://localhost:8081/api/v1/task", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.tasks;
});

// Create a new task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (task: Task, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("Authentication token not found");
    const response = await axios.post(
      "http://localhost:8081/api/v1/task",
      task,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
);

// Update an existing task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({
    taskId,
    task,
  }: {
    taskId: string;
    task: Task;
  }) => {
    const token = getToken();
    if (!token) throw new Error("Authentication token not found");
    const response = await axios.put(
      `http://localhost:8081/api/v1/task/${taskId}`,
      task,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string) => {
    const token = getToken();
    if (!token) throw new Error("Authentication token not found");
    await axios.delete(`http://localhost:8081/api/v1/task/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return taskId;
  }
);

// Search tasks based on parameters like status and dueDate
export const searchTasks = createAsyncThunk(
  "tasks/searchTasks",
  async (searchParams: { status?: string; dueDate?: string }, { rejectWithValue }) => {
    const token = getToken();
    if (!token) return rejectWithValue("Authentication token not found");
    try {
      const { status, dueDate } = searchParams;
      const response = await axios.get("http://localhost:8081/api/v1/task/search", {
        params: { status, dueDate },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.tasks;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(searchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(searchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {} = taskSlice.actions;
export default taskSlice.reducer;
