export const getSkillImage = (skillName: string) => {
  const allSkills = [
    ...useCoreLanguages(),
    ...useFrontendSkills(),
    ...useBackendSkills(),
    ...useOtherSkills(),
  ];

  const skill = allSkills.find((s) => s.name === skillName);
  return skill?.image || "";
};

export const useCoreLanguages = () => {
  const coreLanguages = [
    {
      name: "Java",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/java-colored.svg",
    },
    {
      name: "Python",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/python-colored.svg",
    },
    {
      name: "JavaScript",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/javascript-colored.svg",
    },
    {
      name: "TypeScript",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/typescript-colored.svg",
    },
    {
      name: "C",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/c-colored.svg",
    },
    {
      name: "C++",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/cplusplus-colored.svg",
    },
    {
      name: "CSharp",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/csharp-colored.svg",
    },
    {
      name: "Go",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/go-colored.svg",
    },
    {
      name: "PHP",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/php-colored.svg",
    },
    {
      name: "Swift",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/swift-colored.svg",
    },
    {
      name: "Rust",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/rust-colored-dark.svg",
    },
    {
      name: "Kotlin",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/kotlin-colored.svg",
    },
  ];

  return coreLanguages;
};

export const useFrontendSkills = () => {
  const frontendSkills = [
    {
      name: "HTML",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/html5-colored.svg",
    },
    {
      name: "CSS",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/css3-colored.svg",
    },
    {
      name: "React",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/react-colored.svg",
    },
    {
      name: "Next.js",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nextjs-colored-dark.svg",
    },
    {
      name: "Angular",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/angularjs-colored.svg",
    },
    {
      name: "Svelte",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/svelte-colored.svg",
    },
    {
      name: "Nuxt",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nuxtjs-colored.svg",
    },
    {
      name: "Vite",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/vite-colored.svg",
    },
    {
      name: "Vue",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/vuejs-colored.svg",
    },
    {
      name: "Jquery",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/jquery-colored.svg",
    },
    {
      name: "Tailwind",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/tailwindcss-colored.svg",
    },
    {
      name: "Bootstrap",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/bootstrap-colored.svg",
    },
    {
      name: "MaterialUI",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/materialui-colored.svg",
    },
  ];

  return frontendSkills;
};

export const useBackendSkills = () => {
  const backendSkills = [
    {
      name: "Node",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nodejs-colored.svg",
    },
    {
      name: "Express",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/express-colored-dark.svg",
    },
    {
      name: "GraphQL",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/graphql-colored.svg",
    },
    {
      name: "MongoDB",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/mongodb-colored.svg",
    },
    {
      name: "MySQL",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/mysql-colored.svg",
    },
    {
      name: "PostgreSQL",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/postgresql-colored.svg",
    },
    {
      name: "Firebase",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/firebase-colored.svg",
    },
    {
      name: "Supabase",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/supabase-colored.svg",
    },
  ];

  return backendSkills;
};

export const useOtherSkills = () => {
  const otherSkills = [
    {
      name: "AWS",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/aws-colored-dark.svg",
    },
    {
      name: "Google",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/googlecloud-colored.svg",
    },
    {
      name: "Docker",
      image:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/docker-colored.svg",
    },
  ];

  return otherSkills;
};
