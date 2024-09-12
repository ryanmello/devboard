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
        fallbackRedirectUrl="/settings"
      />
      <div className="w-[400px] bg-white h-12 flex justify-center items-center mt-4 rounded-md">
        <div className="cursor-default text-black text-sm">
          <p>Already have an account?</p>
        </div>
        <a
          href={process.env.URL + "/sign-in"}
          className="pl-2 text-black text-sm font-medium hover:underline underline-offset-4"
        >
          Sign in
        </a>
      </div>
    </div>
  );
}
