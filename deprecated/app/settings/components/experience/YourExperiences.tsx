"use client";

import { Experience } from "@prisma/client";
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
import EditExperienceForm from "./EditExperienceForm";
import { FullUser } from "@/types";

const YourExperiences = ({ currentUser }: { currentUser: FullUser }) => {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (experienceId: string) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/experience/delete`, {
        experienceId: experienceId,
      });
      toast.success("Experience deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="pt-8 w-1/2 mb-12">
      <h2 className="text-xl font-bold pb-2">Your Experience</h2>
      <div className="space-y-4">
        {currentUser.experience?.length === 0 ? (
          <div className="border-2 border-dashed rounded-xl p-6">
            <p className="text-center text-muted-foreground text-sm">
              Add your professional experience to showcase your career journey.
            </p>
          </div>
        ) : (
          currentUser.experience?.map((experience) => (
            <Card key={experience.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{experience.title}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedExperience(experience);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedExperience(experience);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  {experience.company} • {experience.location}
                </CardDescription>
                <CardDescription>
                  {experience.startMonth} {experience.startYear} -{" "}
                  {experience.isCurrent
                    ? "Present"
                    : `${experience.endMonth} ${experience.endYear}`}
                </CardDescription>
                <CardDescription>{experience.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {experience.description}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              experience entry.
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
                selectedExperience && handleDelete(selectedExperience.id)
              }
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Experience Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Experience</DialogTitle>
          </DialogHeader>
          {selectedExperience && (
            <EditExperienceForm
              experience={selectedExperience}
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

export default YourExperiences;
