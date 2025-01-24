import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Task {
  id: string;
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

// Async Thunks for CRUD operations
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { getState }) => {
    const state: any = getState();
    const token = state.auth.accessToken;
    const response = await axios.get("http://localhost:8081/api/v1/task", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async ({ task, token }: { task: Task; token: string }) => {
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

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({
    taskId,
    task,
    token,
  }: {
    taskId: string;
    task: Task;
    token: string;
  }) => {
    const response = await axios.patch(
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
  async ({ taskId, token }: { taskId: string; token: string }) => {
    await axios.delete(`http://localhost:8081/api/v1/task/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return taskId;
  }
);

// Create the task slice
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
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export const { } = taskSlice.actions;
export default taskSlice.reducer;
