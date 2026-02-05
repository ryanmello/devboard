import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center">
      <SignUp
        // appearance={{
        //   elements: {
        //     footer: {
        //       display: "none",
        //     },
        //   },
        // }}
        fallbackRedirectUrl="/settings"
      />
    </div>
  );
}
