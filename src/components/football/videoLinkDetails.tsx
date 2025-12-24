import { YoutubeLogo } from "@phosphor-icons/react";

interface VideoLinkProps {
  url?: string;
}

export const VideoLink = (props: VideoLinkProps) => {
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
