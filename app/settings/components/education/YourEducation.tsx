"use client";

import { Education } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import EditEducationForm from "./EditEducationForm";
import { useSacramentoColleges } from "@/hooks/education";
import Image from "next/image";

const YourEducation = ({
  currentUser,
}: {
  currentUser: { education: Education[] };
}) => {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const colleges = useSacramentoColleges();

  const getUniversityInfo = (universityId: number) => {
    return colleges.find((college) => college.id === universityId);
  };

  const handleDelete = async (educationId: string) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/education/delete`, {
        educationId: educationId,
      });
      toast.success("Education deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="pt-8 w-1/2">
      <h2 className="text-xl font-bold pb-2">Your Education</h2>
      <div className="space-y-4">
        {currentUser.education?.length === 0 ? (
          <div className="border-2 border-dashed rounded-xl p-6">
            <p className="text-center text-muted-foreground text-sm">
              Add your educational background to highlight your academic
              achievements.
            </p>
          </div>
        ) : (
          currentUser.education?.map((edu) => {
            const university = getUniversityInfo(edu.universityId);
            return (
              <Card key={edu.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {university?.image && (
                        <div className="w-8 h-8 relative">
                          <Image
                            src={university.image}
                            alt={university.name}
                            fill
                            className="object-contain rounded-sm"
                          />
                        </div>
                      )}
                      <span>{university?.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedEducation(edu);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedEducation(edu);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardTitle>
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
            );
          })
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              education record.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedEducation && handleDelete(selectedEducation.id)
              }
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Education Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Education</DialogTitle>
          </DialogHeader>
          {selectedEducation && (
            <EditEducationForm
              education={selectedEducation}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                router.refresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default YourEducation;
