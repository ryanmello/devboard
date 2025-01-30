"use client";

import { FullUser } from "@/types";
import GitHubHeatmap from "./github/GitHubHeatmap";
import LeetCode from "./leetcode/LeetCode";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const RightProfile = ({ user }: { user: FullUser }) => {
  console.log(user);
  return (
    <div className="w-3/4 2xl:w-4/5">
      {/* LEETCODE STATS */}
      <LeetCode leetCodeUsername={user.leetCodeUsername} />
      {/* GITHUB STATS */}
      <GitHubHeatmap gitHubUsername={user.gitHubUsername} />

      {/* EDUCATION */}
      <div className="space-y-4 mb-8">
        {user.education.map((edu, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{edu.universityName}</CardTitle>
              <CardDescription>
                {edu.major} {edu.minor && `• Minor in ${edu.minor}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="text-sm text-muted-foreground">
                  {edu.startYear} - {edu.graduationYear}
                </div>
                {edu.gpa && (
                  <div className="text-sm text-muted-foreground">
                    GPA: {edu.gpa}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RightProfile;
