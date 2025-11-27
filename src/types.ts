export type NavigationLink = {
  name: string;
  path: string;
};

export type NavigationLinks = Array<NavigationLink>;

export type SocialLink = {
  platform: string;
  url: string;
  svg: string;
};

export type SocialLinks = Array<SocialLink>;
