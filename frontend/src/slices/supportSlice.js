// // // src/redux/supportSlice.js
// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import axios from "axios";

// // const API_URL = `${import.meta.env.VITE_API_URL}/api/support`;

// // // ✅ Fetch all tickets
// // export const fetchSupportTickets = createAsyncThunk(
// //   "support/fetchAll",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const res = await axios.get(API_URL);
// //       return res.data; // ✅ backend returns an array directly
// //     } catch (err) {
// //       return rejectWithValue(err.response?.data?.message || err.message);
// //     }
// //   }
// // );

// // // ✅ Update ticket status (used when email is sent)
// // export const updateTicketStatus = createAsyncThunk(
// //   "support/updateStatus",
// //   async ({ id, status }, { rejectWithValue }) => {
// //     try {
// //       const res = await axios.put(`${API_URL}/${id}`, { status });
// //       return res.data; // ✅ backend returns ticket directly
// //     } catch (err) {
// //       return rejectWithValue(err.response?.data?.message || err.message);
// //     }
// //   }
// // );

// // const supportSlice = createSlice({
// //   name: "support",
// //   initialState: {
// //     tickets: [],
// //     loading: false,
// //     error: null,
// //   },
// //   reducers: {},
// //   extraReducers: (builder) => {
// //     builder
// //       // ✅ Fetch tickets
// //       .addCase(fetchSupportTickets.pending, (state) => {
// //         state.loading = true;
// //       })
// //       .addCase(fetchSupportTickets.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.tickets = action.payload;
// //       })
// //       .addCase(fetchSupportTickets.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload;
// //       })

// //       // ✅ Update ticket status
// //       .addCase(updateTicketStatus.fulfilled, (state, action) => {
// //         const updatedTicket = action.payload;
// //         state.tickets = state.tickets.map((t) =>
// //           t._id === updatedTicket._id ? updatedTicket : t
// //         );
// //       });
// //   },
// // });

// // export default supportSlice.reducer;
// // src/redux/supportSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const API_URL = `${import.meta.env.VITE_API_URL}/api/support`;

// // ✅ Fetch all tickets
// export const fetchSupportTickets = createAsyncThunk(
//   "support/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(API_URL);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// // ✅ Update ticket status
// export const updateTicketStatus = createAsyncThunk(
//   "support/updateStatus",
//   async ({ id, status }, { rejectWithValue }) => {
//     try {
//       const res = await axios.put(`${API_URL}/${id}`, { status });
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// // ✅ Get ticket replies
// export const getTicketReplies = createAsyncThunk(
//   "support/getReplies",
//   async (id, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${API_URL}/${id}/replies`);
//       return { id, replies: res.data };
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// // ✅ Add a new ticket reply
// export const addTicketReply = createAsyncThunk(
//   "support/addReply",
//   async ({ id, message, senderId }, { rejectWithValue }) => {
//     try {
//       const res = await axios.post(`${API_URL}/${id}/replies`, {
//         message,
//         senderId,
//       });
//       return { id, replies: res.data.replies };
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// const supportSlice = createSlice({
//   name: "support",
//   initialState: {
//     tickets: [],
//     replies: {}, // store per ticket: { ticketId: [replies] }
//     loading: false,
//     replyLoading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // ===================
//       // FETCH TICKETS
//       // ===================
//       .addCase(fetchSupportTickets.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchSupportTickets.fulfilled, (state, action) => {
//         state.loading = false;
//         state.tickets = action.payload;
//       })
//       .addCase(fetchSupportTickets.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===================
//       // UPDATE STATUS
//       // ===================
//       .addCase(updateTicketStatus.fulfilled, (state, action) => {
//         const updatedTicket = action.payload;
//         state.tickets = state.tickets.map((t) =>
//           t._id === updatedTicket._id ? updatedTicket : t
//         );
//       })

//       // ===================
//       // GET REPLIES
//       // ===================
//       .addCase(getTicketReplies.pending, (state) => {
//         state.replyLoading = true;
//       })
//       .addCase(getTicketReplies.fulfilled, (state, action) => {
//         state.replyLoading = false;
//         state.replies[action.payload.id] = action.payload.replies;
//       })
//       .addCase(getTicketReplies.rejected, (state, action) => {
//         state.replyLoading = false;
//         state.error = action.payload;
//       })

//       // ===================
//       // ADD REPLY
//       // ===================
//       .addCase(addTicketReply.pending, (state) => {
//         state.replyLoading = true;
//       })
//       .addCase(addTicketReply.fulfilled, (state, action) => {
//         state.replyLoading = false;
//         state.replies[action.payload.id] = action.payload.replies;
//       })
//       .addCase(addTicketReply.rejected, (state, action) => {
//         state.replyLoading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default supportSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/support`;

// Fetch all tickets
export const fetchSupportTickets = createAsyncThunk(
  "support/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch single ticket with replies (populated)
export const fetchTicketDetails = createAsyncThunk(
  "support/fetchTicketDetails",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Add reply to ticket (backend returns populated senderId)
export const addTicketReply = createAsyncThunk(
  "support/addReply",
  async ({ id, message, senderId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/${id}/replies`, {
        message,
        senderId,
      });
      return { ticketId: id, replies: res.data.replies }; // replies include populated senderId
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update ticket status
export const updateTicketStatus = createAsyncThunk(
  "support/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, { status });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const supportSlice = createSlice({
  name: "support",
  initialState: {
    tickets: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch tickets
      .addCase(fetchSupportTickets.pending, (state) => { state.loading = true; })
      .addCase(fetchSupportTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchSupportTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch ticket details
      .addCase(fetchTicketDetails.fulfilled, (state, action) => {
        const updatedTicket = action.payload;
        const index = state.tickets.findIndex(t => t._id === updatedTicket._id);
        if (index !== -1) {
          state.tickets[index] = { 
            ...state.tickets[index], 
            ...updatedTicket, 
            replies: updatedTicket.replies || state.tickets[index].replies 
          };
        } else {
          state.tickets.push(updatedTicket);
        }
      })

      // Add reply (merge replies, preserving populated senderId)
      .addCase(addTicketReply.fulfilled, (state, action) => {
        const { ticketId, replies } = action.payload;
        const index = state.tickets.findIndex(t => t._id === ticketId);
        if (index !== -1) {
          state.tickets[index] = {
            ...state.tickets[index],
            replies: replies || state.tickets[index].replies
          };
        }
      })

      // Update ticket status
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        const updatedTicket = action.payload;
        const index = state.tickets.findIndex(t => t._id === updatedTicket._id);
        if (index !== -1) {
          state.tickets[index] = {
            ...state.tickets[index],
            status: updatedTicket.status
          };
        }
      });
  },
});

export default supportSlice.reducer;