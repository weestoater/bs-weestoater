import { YoutubeLogo } from "@phosphor-icons/react";

export const VideoLink = (props: any) => {
  const video = props.url ? props.url : null;

  if (video) {
    return (
      <p className="mb-3">
        <YoutubeLogo size={24} className="me-2" />
        Watch the{" "}
        <a href={`${video}`} target="_blank" rel="noreferrer">
          video highlights
        </a>
      </p>
    );
  }
};
