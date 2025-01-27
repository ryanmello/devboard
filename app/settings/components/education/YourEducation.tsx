import { FullUser } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const YourEducation = ({ currentUser }: { currentUser: FullUser }) => {
  return (
    <div className="pt-8 w-1/2">
      <h2 className="text-xl font-bold pb-2">
        Your Education
      </h2>
      <div className="space-y-4">
        {currentUser.education?.map((edu, index) => (
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

export default YourEducation;
