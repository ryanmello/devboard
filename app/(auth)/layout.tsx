import Image from "next/image";
import Background from "@/public/background.png";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <Image
        src={Background}
        alt="background"
        layout="fill"
        objectFit="cover"
        className="absolute top-0 left-0 -z-10"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AuthLayout;
