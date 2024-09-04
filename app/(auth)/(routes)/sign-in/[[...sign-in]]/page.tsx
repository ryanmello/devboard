import { Button } from "@/components/ui/button";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            footer: {
              display: "none",
            },
          },
        }}
      />
      <div className="w-[400px] bg-white h-12 flex justify-center items-center mt-4 rounded-md">
        <div className="cursor-default text-black text-sm">
          <p>Don&apos;t have an account?</p>
        </div>
        <a
          href={process.env.URL + "/sign-up"}
          className="pl-2 text-black text-sm font-medium hover:underline underline-offset-4"
        >
          Sign up
        </a>
      </div>
    </div>
  );
}
