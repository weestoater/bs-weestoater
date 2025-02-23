import { YoutubeLogo } from "@phosphor-icons/react";

export const VideoLink = (props: any) => {
  const video = props.url ? props.url : null;
  return (
    <p>
      <YoutubeLogo size={24} />
      &nbsp; Watch the{" "}
      <a href={`${video}`} target="_blank" rel="noreferrer">
        video highlights
      </a>
    </p>
  );
};
