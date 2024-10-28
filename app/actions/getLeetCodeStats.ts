import axios from "axios";
import { LeetCodeStatsResponse } from "@/types";

const ENDPOINT = "https://leetcode-stats-api.herokuapp.com/";

export const getLeetCodeStats = async (
  leetCodeUsername: string
): Promise<LeetCodeStatsResponse> => {
  try {
    const response = await axios.get(`${ENDPOINT}/${leetCodeUsername}/`);
    return response.data as LeetCodeStatsResponse;
  } catch {
    const errorMessage = "internal error";
    return { status: "error", message: errorMessage };
  }
};
