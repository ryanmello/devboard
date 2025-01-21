import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center">
      <SignIn
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
