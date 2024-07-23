import github from "../../public/github.svg";
import frontendmentor from "../../public/frontend mentor.svg";
import twitter from "../../public/twitter.svg";
import linkedln from "../../public/linkedln.svg";
import youtube from "../../public/youtube.svg";
import facebook from "../../public/facebook.svg";
import twitch from "../../public/twitch.svg";
import devto from "../../public/github.svg";
import codewars from "../../public/dev.to.svg";
import freecodecamp from "../../public/freecodecamp.svg";
import gitlab from "../../public/gitlab.svg";
import hashnode from "../../public/hashnode.svg";
import stackoverflow from "../../public/stackoverflow.svg";

export type userProps = {
  profileImage: string;
  firstName: string;
  lastName: string;
  userId: string;
  email: string;
  password: string;
};
export type linkProps = {
  name: string;
  link: string;
  userId: string;
};

export const websites = [
  {
    name: "GitHub",
    link: "https://www.github.com/",
    backgroundColor: "#000000",
    image: github,
  },
  {
    name: "Frontend Mentor",
    link: "https://www.frontendmentor.io/",
    backgroundColor: "#F2F4FF",
    image: frontendmentor,
  },
  {
    name: "Twitter",
    link: "https://www.twitter.com/",
    backgroundColor: "#1DA1F2",
    image: twitter,
  },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/",
    backgroundColor: "#0077B5",
    image: linkedln,
  },
  {
    name: "YouTube",
    link: "https://www.youtube.com/",
    backgroundColor: "#FF0000",
    image: youtube,
  },
  {
    name: "Facebook",
    link: "https://www.facebook.com/",
    backgroundColor: "#1877F2",
    image: facebook,
  },
  {
    name: "Twitch",
    link: "https://www.twitch.tv/",
    backgroundColor: "#FAD000",
    image: twitch,
  },
  {
    name: "Dev.to",
    link: "https://www.dev.to/",
    backgroundColor: "#000000",
    image: devto,
  },
  {
    name: "Codewars",
    link: "https://www.codewars.com/",
    backgroundColor: "#B1361E",
    image: codewars,
  },
  {
    name: "freeCodeCamp",
    link: "https://www.freecodecamp.org/",
    backgroundColor: "#0A0A23",
    image: freecodecamp,
  },
  {
    name: "GitLab",
    link: "https://www.gitlab.com/",
    backgroundColor: "#FC6D26",
    image: gitlab,
  },
  {
    name: "Hashnode",
    link: "https://www.hashnode.com/",
    backgroundColor: "#2962FF",
    image: hashnode,
  },
  {
    name: "Stack Overflow",
    link: "https://www.stackoverflow.com/",
    backgroundColor: "#F48024",
    image: stackoverflow,
  },
];
