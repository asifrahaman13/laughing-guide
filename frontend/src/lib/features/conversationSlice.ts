import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ConversationState = {
  query: string;
  history: Array<{ message: string; messageFrom: string }>;
};

type SetQueryActionPayload = {
  query: string;
};

type SetHistoryActionPayload = {
  message: string | "";
  sql_query: string | "";
  messageFrom: string;
  answer_type: string | null;
};

export const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    query: "",
    history: [],
  } as ConversationState,
  reducers: {
    setQuery: (state, action: PayloadAction<SetQueryActionPayload>) => {
      const { query } = action.payload;
      state.query = query;
    },
    setHistory: (state, action: PayloadAction<SetHistoryActionPayload>) => {
      const { message, messageFrom, answer_type, sql_query } = action.payload;
      const chatResponse = { message, messageFrom, answer_type, sql_query };
      state.history = [...state.history, chatResponse];
    },
    clearHistory: (state) => {
      state.history = [];
    },
  },
});

export const { setQuery, setHistory, clearHistory } = conversationSlice.actions;

export default conversationSlice.reducer;
