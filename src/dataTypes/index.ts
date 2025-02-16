import github from "../../public/github.svg";
import frontendmentor from "../../public/frontend mentor.svg";
import twitter from "../../public/twitter.svg";
import linkedln from "../../public/linkedln.svg";
import youtube from "../../public/youtube.svg";
import facebook from "../../public/facebook.svg";
import twitch from "../../public/twitch.svg";
import devto from "../../public/dev.to.svg";
import codewars from "../../public/codewars.svg";
import freecodecamp from "../../public/freecodecamp.svg";
import gitlab from "../../public/gitlab.svg";
import hashnode from "../../public/hashnode.svg";
import stackoverflow from "../../public/stackoverflow.svg";
import githubpreview from "../../public/githubpreview.svg";
import frontendmentorpreview from "../../public/frontendmentorpreview.svg";
import twitterpreview from "../../public/twitterpreview.svg";
import linkedlnpreview from "../../public/linkedlnpreview.svg";
import youtubepreview from "../../public/youtubepreview.svg";
import facebookpreview from "../../public/facebookpreview.svg";
import twitchpreview from "../../public/twitchpreview.svg";
import devtopreview from "../../public/dev.topreview.svg";
import codewarspreview from "../../public/codewarspreview.svg";
import freecodecamppreview from "../../public/freecodecamppreview.svg";
import gitlabpreview from "../../public/gitlabpreview.svg";
import hashnodepreview from "../../public/hashnodepreview.svg";
import stackoverflowpreview from "../../public/stackoverflowpreview.svg";
import { MoreHorizontal } from 'lucide-react'; 

export type userProps = {
  profileImage: string;
  firstName: string;
  lastName: string;
  userId: string;
  email: string;
  password: string;
  links: linkProps[];
};
export type linkProps = {
  name: string;
  link: string;
  userId: string;
  backgroundColor: string;
};

export type websiteProps = {
  name: string;
  link: string;
  image: string;
  backgroundColor?: string;
};
export const websites = [
  {
    name: "GitHub",
    link: "https://www.github.com/",
    backgroundColor: "#000000",
    image: github,
    textColor: "#FFF",
    previewImage: githubpreview,
  },
  {
    name: "Frontend Mentor",
    link: "https://www.frontendmentor.io/",
    backgroundColor: "#fff",
    image: frontendmentor,
    textColor: "#000",
    previewImage: frontendmentorpreview,
  },
  {
    name: "Twitter",
    link: "https://www.twitter.com/",
    backgroundColor: "#1DA1F2",
    image: twitter,
    textColor: "#FFF",
    previewImage: twitterpreview,
  },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/",
    backgroundColor: "#0077B5",
    image: linkedln,
    textColor: "#FFF",
    previewImage: linkedlnpreview,
  },
  {
    name: "YouTube",
    link: "https://www.youtube.com/",
    backgroundColor: "#FF0000",
    image: youtube,
    textColor: "#FFF",
    previewImage: youtubepreview,
  },
  {
    name: "Facebook",
    link: "https://www.facebook.com/",
    backgroundColor: "#1877F2",
    image: facebook,
    textColor: "#FFF",
    previewImage: facebookpreview,
  },
  {
    name: "Twitch",
    link: "https://www.twitch.tv/",
    backgroundColor: "#EE3FC8",
    image: twitch,
    textColor: "#FFF",
    previewImage: twitchpreview,
  },
  {
    name: "Dev.to",
    link: "https://www.dev.to/",
    backgroundColor: "#000000",
    image: devto,
    textColor: "#FFF",
    previewImage: devtopreview,
  },
  {
    name: "Codewars",
    link: "https://www.codewars.com/",
    backgroundColor: "#B1361E",
    image: codewars,
    textColor: "#FFF",
    previewImage: codewarspreview,
  },
  {
    name: "freeCodeCamp",
    link: "https://www.freecodecamp.org/",
    backgroundColor: "#0A0A23",
    image: freecodecamp,
    textColor: "#FFF",
    previewImage: freecodecamppreview,
  },
  {
    name: "GitLab",
    link: "https://www.gitlab.com/",
    backgroundColor: "#FC6D26",
    image: gitlab,
    textColor: "#FFF",
    previewImage: gitlabpreview,
  },
  {
    name: "Hashnode",
    link: "https://www.hashnode.com/",
    backgroundColor: "#2962FF",
    image: hashnode,
    textColor: "#FFF",
    previewImage: hashnodepreview,
  },
  {
    name: "Stack Overflow",
    link: "https://www.stackoverflow.com/",
    backgroundColor: "#F48024",
    image: stackoverflow,
    textColor: "#FFF",
    previewImage: stackoverflowpreview,
  },
  {
    name: "Other",
    link: "",
    backgroundColor: "#633CFF", 
    image: null,
    textColor: "#FFFFFF",
    previewImage: null,
    isCustom: true
  },
];

export const getCustomBackgroundColor = (index: number) => {
  // Predefined gradient colors for custom links
  const colors = [
    '#633CFF', // Purple
    '#FF3C8C', // Pink
    '#3CBAFF', // Blue
    '#40C463', // Green
    '#FD9426'  // Orange
  ];
  return colors[index % colors.length];
};