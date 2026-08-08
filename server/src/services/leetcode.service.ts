import axios from "axios";
import type { LeetCodeStats } from "../types";

const LEETCODE_API = "https://leetcode.com/graphql";

interface LeetCodeResponse {
  data: {
    matchedUser: {
      submitStats: {
        acSubmissionNum: {
          difficulty: string;
          count: number;
        }[];
      };
      profile: {
        ranking: number;
      };
    } | null;
    userContestRanking: {
      rating: number;
    } | null;
  };
}

export async function getLeetCodeStats(
  username: string
): Promise<LeetCodeStats | null> {
  const query = `
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        profile {
          ranking
        }

        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }

      userContestRanking(username: $username) {
        rating
      }
    }
  `;

  try {
    const response = await axios.post<LeetCodeResponse>(
      LEETCODE_API,
      {
        query,
        variables: {
          username,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Referer: "https://leetcode.com/",
        },
      }
    );

    const user = response.data.data.matchedUser;

    if (!user) {
      return null;
    }

    const submissions = user.submitStats.acSubmissionNum;

    const easy =
      submissions.find((item) => item.difficulty === "Easy")?.count ?? 0;

    const medium =
      submissions.find((item) => item.difficulty === "Medium")?.count ?? 0;

    const hard =
      submissions.find((item) => item.difficulty === "Hard")?.count ?? 0;

    const total = easy + medium + hard;

    return {
      totalSolved: total,
      easySolved: easy,
      mediumSolved: medium,
      hardSolved: hard,
      acceptanceRate: 0,
      ranking: user.profile?.ranking ?? null,
      contestRating:
        response.data.data.userContestRanking?.rating ?? null,
    };
  } catch {
    return null;
  }
}