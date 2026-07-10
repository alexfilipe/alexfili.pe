import { musicMovements, musicPageContent } from "@/data/musicContent";
import { profile } from "@/data/profile";
import { projectPages, type ProjectPage } from "@/data/projectPages";

export type SocialImage = {
  src: string;
  width: number;
  height: number;
  type: string;
  alt: string;
};

export type SeoEntry = {
  path: string;
  title: string;
  description: string;
  socialTitle?: string;
  socialDescription?: string;
  keywords?: string[];
  image?: SocialImage;
  lastmod: string;
  schemaType?: string | string[];
};

export const DEFAULT_SITE_URL = "https://alexfili.pe";
export const CONTENT_LANGUAGE = "en-US";
export const OPEN_GRAPH_LOCALE = "en_US";
export const SEO_LASTMOD = "2026-07-09";

export const defaultShareImage: SocialImage = {
  src: "/og-image.png",
  width: 1120,
  height: 630,
  type: "image/png",
  alt: `${profile.name} - ${profile.tagline}`
};

const projectSocialImages: Record<string, SocialImage> = Object.fromEntries(
  projectPages.map((project) => [
    project.id,
    {
      src: project.preview.pngSrc,
      width: 960,
      height: 720,
      type: "image/png",
      alt: `${project.name}: ${project.tagline}`
    }
  ])
);

type ProjectSeoOverride = Required<Pick<SeoEntry, "title" | "description" | "socialDescription" | "keywords">>;

const projectSeoOverrides: Record<string, ProjectSeoOverride> = {
  aetherloom: {
    title: "Aetherloom | AI-First macOS Sync App",
    description:
      "Explore Aetherloom, Álex Filipe Santos's AI-first native macOS app for private, local-first sync across iCloud Drive, Google Drive, OneDrive, and NAS storage.",
    socialDescription:
      "A native macOS, local-first sync app for keeping files private, controlled, and portable across clouds.",
    keywords: [
      "Aetherloom",
      "AI-first macOS app",
      "local-first sync",
      "multi-cloud sync",
      "iCloud Drive",
      "Google Drive",
      "OneDrive",
      "NAS storage"
    ]
  },
  inspirasonho: {
    title: "InspiraSonho | Education Access Platform",
    description:
      "See how Álex Filipe Santos co-founded and built InspiraSonho, a Brazilian education platform connecting 20,000+ students with scholarships, exchanges, and opportunities.",
    socialDescription:
      "A Brazilian education platform that helped students discover scholarships, exchanges, olympiads, and learning opportunities.",
    keywords: [
      "InspiraSonho",
      "education access",
      "social impact software",
      "Brazilian students",
      "scholarships",
      "student opportunities"
    ]
  },
  "home-intelligence": {
    title: "Home Intelligence | Local-First Smart Home Automation",
    description:
      "Home Intelligence is Álex Filipe Santos's local-first Home Assistant work for adaptive ambience, energy insights, and agentic smart-speaker coordination.",
    socialDescription:
      "Local-first Home Assistant plugins for adaptive ambience, energy insights, and agentic smart-speaker coordination.",
    keywords: [
      "Home Intelligence",
      "Home Assistant",
      "smart home automation",
      "local-first AI",
      "adaptive ambience",
      "energy insights",
      "smart speakers"
    ]
  },
  labstocker: {
    title: "LabStocker | Chemistry Lab Inventory Software",
    description:
      "Explore LabStocker, Álex Filipe Santos's chemistry-lab inventory platform for reagents, safety, reporting, and predictive reorder planning.",
    socialDescription:
      "A chemistry-lab inventory platform for reagents, safer storage, reporting, and predictive reorder planning.",
    keywords: [
      "LabStocker",
      "chemistry lab inventory",
      "reagent management",
      "lab software",
      "predictive reorder planning",
      "student chemistry project"
    ]
  }
};

export const seoPages = {
  home: {
    path: "/",
    title: profile.homeSeo.title,
    description: profile.homeSeo.description,
    socialTitle: profile.homeSeo.socialTitle,
    socialDescription:
      "Software and AI engineering shaped by systems thinking, mathematical thought, and classical musicianship.",
    keywords: [
      profile.name,
      "Álex Filipe",
      "Software and AI Engineer",
      "AI Engineer San Francisco",
      "software engineer",
      "classical musician",
      "mathematical thought"
    ],
    image: defaultShareImage,
    lastmod: SEO_LASTMOD,
    schemaType: "ProfilePage"
  },
  projects: {
    path: "/projects/",
    title: "Featured Work | Álex Filipe Santos",
    description:
      "Explore Álex Filipe Santos's featured software projects, from AI-first macOS sync and Home Assistant automation to education access and chemistry-lab systems.",
    socialTitle: "Featured Work by Álex Filipe Santos",
    socialDescription:
      "AI systems, social-impact software, local-first automation, and research-lab tools by Álex Filipe Santos.",
    keywords: [
      "Álex Filipe Santos projects",
      "software engineering portfolio",
      "AI systems",
      "social impact software",
      "Home Assistant automation",
      "chemistry lab software"
    ],
    image: defaultShareImage,
    lastmod: SEO_LASTMOD,
    schemaType: "CollectionPage"
  },
  music: {
    path: "/music/",
    title: "Music | Violin, Piano & Conducting",
    description:
      "Violin, piano, and conducting in Álex Filipe Santos's life: 25 years of violin, piano recitals, and a conducting premiere with the Amherst Symphony Orchestra.",
    socialTitle: "Music by Álex Filipe Santos",
    socialDescription:
      "Violin, piano, and conducting as a lifelong practice in listening, structure, and interpretation.",
    keywords: [
      "Álex Filipe Santos music",
      "violin",
      "piano",
      "conducting",
      "Amherst Symphony Orchestra",
      "classical musician",
      "San Francisco musician"
    ],
    image: defaultShareImage,
    lastmod: SEO_LASTMOD,
    schemaType: "ProfilePage"
  }
} satisfies Record<string, SeoEntry>;

export function getProjectSeo(project: ProjectPage): SeoEntry {
  const override = projectSeoOverrides[project.id];

  return {
    path: `/projects/${project.id}/`,
    title: override.title,
    description: override.description,
    socialTitle: `${project.name} by ${profile.name}`,
    socialDescription: override.socialDescription,
    keywords: [...new Set([...override.keywords, ...project.tags, ...project.focus])],
    image: projectSocialImages[project.id] ?? defaultShareImage,
    lastmod: SEO_LASTMOD,
    schemaType: "WebPage"
  };
}

export const projectSeoEntries = projectPages.map(getProjectSeo);

export const indexableSeoEntries: SeoEntry[] = [
  seoPages.home,
  seoPages.projects,
  ...projectSeoEntries,
  seoPages.music
];

export function getSiteRoot(site: string | URL | undefined = DEFAULT_SITE_URL): string {
  const siteUrl = new URL(site.toString());
  siteUrl.pathname = "/";
  siteUrl.search = "";
  siteUrl.hash = "";
  return siteUrl.toString();
}

export function makeAbsoluteUrl(path: string, site: string | URL | undefined = DEFAULT_SITE_URL): string {
  return new URL(path, getSiteRoot(site)).toString();
}

export function getProjectsItemList(site: string | URL | undefined = DEFAULT_SITE_URL) {
  return {
    "@type": "ItemList",
    "@id": `${makeAbsoluteUrl(seoPages.projects.path, site)}#projects`,
    name: "Featured software projects by Álex Filipe Santos",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: projectPages.length,
    itemListElement: projectPages.map((project, index) => {
      const seo = getProjectSeo(project);
      return {
        "@type": "ListItem",
        position: index + 1,
        url: makeAbsoluteUrl(seo.path, site),
        name: project.name,
        description: seo.description
      };
    })
  };
}

export function getProjectCreativeWork(project: ProjectPage, site: string | URL | undefined = DEFAULT_SITE_URL) {
  const seo = getProjectSeo(project);

  return {
    "@type": "CreativeWork",
    "@id": `${makeAbsoluteUrl(seo.path, site)}#project`,
    name: project.name,
    headline: project.tagline,
    description: seo.description,
    url: makeAbsoluteUrl(seo.path, site),
    creator: {
      "@id": `${makeAbsoluteUrl("/", site)}#person`
    },
    image: makeAbsoluteUrl(seo.image?.src ?? defaultShareImage.src, site),
    keywords: [...new Set([...project.tags, ...project.focus])].join(", "),
    temporalCoverage: project.period,
    about: project.focus
  };
}

export function getMusicCreativeWork(site: string | URL | undefined = DEFAULT_SITE_URL) {
  return {
    "@type": "CreativeWork",
    "@id": `${makeAbsoluteUrl(seoPages.music.path, site)}#music`,
    name: musicPageContent.hero.title,
    description: seoPages.music.description,
    url: makeAbsoluteUrl(seoPages.music.path, site),
    creator: {
      "@id": `${makeAbsoluteUrl("/", site)}#person`
    },
    about: musicMovements.map((movement) => movement.title),
    hasPart: musicMovements.map((movement) => ({
      "@type": "CreativeWork",
      name: movement.title,
      description: typeof movement.lede === "string" ? movement.lede : movement.title
    }))
  };
}
