import { YoutubeLogo } from "@phosphor-icons/react";
import { Video } from "@phosphor-icons/react";

export const VideoLink = (props: any) => {
  const video = props.url ? props.url : null;
  const iplayer = props.iplayer ? props.iplayer : null;

  if (iplayer) {
    return (
      <p>
        <Video size={24} />
        &nbsp; Watch the{" "}
        <a href={`${iplayer}`} target="_blank" rel="noreferrer">
          iplayer highlights
        </a>
      </p>
    );
  }
  if (video) {
    return (
      <p>
        <YoutubeLogo size={24} />
        &nbsp; Watch the{" "}
        <a href={`${video}`} target="_blank" rel="noreferrer">
          video highlights
        </a>
      </p>
    );
  }
};
