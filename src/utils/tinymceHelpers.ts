export { tinymceImageUploadHandler } from "./tinymceUpload";
export { createTinyMCEConfig } from "./tinymceConfig";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const insertMediaIntoEditor = (editor: any, mediaItem: any) => {
  if (!editor) return;

  if (mediaItem.file_type === "image") {
    const imgHtml = `<img src="${mediaItem.public_url}" alt="${mediaItem.alt_text || mediaItem.original_filename}" class="img-fluid" ${mediaItem.width ? `width="${mediaItem.width}"` : ""} ${mediaItem.height ? `height="${mediaItem.height}"` : ""} />`;
    editor.execCommand("mceInsertContent", false, imgHtml);
  } else if (mediaItem.file_type === "video") {
    const videoHtml = `<video controls><source src="${mediaItem.public_url}" type="${mediaItem.mime_type}">Your browser does not support the video tag.</video>`;
    editor.execCommand("mceInsertContent", false, videoHtml);
  } else if (mediaItem.file_type === "audio") {
    const audioHtml = `<audio controls><source src="${mediaItem.public_url}" type="${mediaItem.mime_type}">Your browser does not support the audio tag.</audio>`;
    editor.execCommand("mceInsertContent", false, audioHtml);
  } else {
    const linkHtml = `<a href="${mediaItem.public_url}" target="_blank" rel="noopener noreferrer">${mediaItem.original_filename}</a>`;
    editor.execCommand("mceInsertContent", false, linkHtml);
  }
};
