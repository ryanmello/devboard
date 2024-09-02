import { Button } from "@/components/ui/button";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            footer: {
              display: "none",
            },
          },
        }}
      />
      <div className="flex items-center mt-2">
        <div className="cursor-default font-light">
          <p>Already have an account?</p>
        </div>
        <Button variant="link" className="px-2">
          Sign in
        </Button>
      </div>
    </div>
  );
}
