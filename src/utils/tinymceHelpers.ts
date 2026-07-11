import { getSupabaseClient } from "../../backend/index.js";

/**
 * TinyMCE image upload handler for Supabase Storage
 * @param blobInfo - The blob containing the image data
 * @param progress - Progress callback function
 * @param folder - Optional folder name in the bucket (default: 'editor')
 * @param bucket - Optional bucket name (default: 'images')
 * @returns Promise resolving to the public URL of the uploaded image
 */
interface TinyMCEBlobInfo {
  blob: () => Blob;
  filename: () => string;
  base64?: () => string;
}

export const tinymceImageUploadHandler = async (
  blobInfo: TinyMCEBlobInfo,
  progress: (percent: number) => void,
  folder: string = "editor",
  bucket: string = "images",
): Promise<string> => {
  try {
    const supabase = getSupabaseClient();

    // Get the blob as a file
    const blob = blobInfo.blob();
    const filename = blobInfo.filename();

    // Generate unique filename
    const fileExt = filename.split(".").pop() || "png";
    const uniqueFilename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(uniqueFilename, blob, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      throw new Error(error.message);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    progress(100);
    return publicUrl;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};

/**
 * Popular Bootstrap Icons for quick selection
 */
const popularBootstrapIcons = [
  "bi-heart",
  "bi-heart-fill",
  "bi-star",
  "bi-star-fill",
  "bi-check",
  "bi-check-circle",
  "bi-check-circle-fill",
  "bi-x",
  "bi-x-circle",
  "bi-x-circle-fill",
  "bi-info-circle",
  "bi-info-circle-fill",
  "bi-exclamation-circle",
  "bi-exclamation-triangle",
  "bi-question-circle",
  "bi-lightning",
  "bi-lightning-fill",
  "bi-trophy",
  "bi-trophy-fill",
  "bi-award",
  "bi-award-fill",
  "bi-bookmark",
  "bi-bookmark-fill",
  "bi-calendar",
  "bi-calendar-check",
  "bi-chat",
  "bi-chat-dots",
  "bi-envelope",
  "bi-envelope-fill",
  "bi-house",
  "bi-house-fill",
  "bi-person",
  "bi-person-fill",
  "bi-gear",
  "bi-search",
  "bi-arrow-right",
  "bi-arrow-left",
];

/**
 * Popular Phosphor Icons for quick selection
 */
const popularPhosphorIcons = [
  "ph-heart",
  "ph-heart-fill",
  "ph-star",
  "ph-star-fill",
  "ph-check",
  "ph-check-circle",
  "ph-x",
  "ph-x-circle",
  "ph-info",
  "ph-warning",
  "ph-lightning",
  "ph-lightning-fill",
  "ph-trophy",
  "ph-medal",
  "ph-bookmark",
  "ph-calendar",
  "ph-chat",
  "ph-envelope",
  "ph-house",
  "ph-user",
  "ph-gear",
  "ph-magnifying-glass",
  "ph-arrow-right",
  "ph-arrow-left",
];

/**
 * Create TinyMCE init config with image upload support and icon insertion
 * @param folder - Folder name for uploads
 * @param onMediaPicker - Optional callback to open media picker
 * @returns TinyMCE init configuration object
 */
export const createTinyMCEConfig = (
  folder: string = "editor",
  onMediaPicker?: () => void,
) => ({
  height: 500,
  menubar: false,
  plugins: [
    "advlist",
    "autolink",
    "lists",
    "link",
    "image",
    "charmap",
    "preview",
    "anchor",
    "searchreplace",
    "visualblocks",
    "code",
    "fullscreen",
    "insertdatetime",
    "media",
    "table",
    "help",
    "wordcount",
  ],
  toolbar:
    "undo redo | blocks | " +
    "bold italic forecolor | alignleft aligncenter " +
    "alignright alignjustify | bullist numlist outdent indent | " +
    "removeformat | link image media_library bootstrapicon phosphoricon | code | help",
  // Allow icon elements and preserve their classes
  extended_valid_elements: "i[class|style|id|title],span[class|style|id]",
  valid_children:
    "+body[style],+body[i],+p[i],+h1[i],+h2[i],+h3[i],+h4[i],+h5[i],+h6[i],+div[i],+span[i]",
  verify_html: false, // Disable strict HTML verification to preserve icons
  entity_encoding: "raw", // Prevent encoding of HTML entities
  content_style:
    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px } " +
    ".bi, .ph { font-size: 1.5em; vertical-align: middle; margin: 0 2px; } " +
    ".ph.fs-1 { font-size: 4.5rem !important; }",

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup: (editor: any) => {
    // Store dialog API reference globally so onclick handlers can access it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let bootstrapDialogApi: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let phosphorDialogApi: any = null;

    // Create global function for inserting Bootstrap icons
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).insertBootstrapIcon = (iconClass: string) => {
      console.log("🎨 Inserting Bootstrap icon:", iconClass);
      const iconHtml = `<i class="bi ${iconClass}"></i>&nbsp;`;
      console.log("📝 HTML to insert:", iconHtml);

      try {
        editor.execCommand("mceInsertContent", false, iconHtml);
        console.log("✅ Icon inserted successfully");
        if (bootstrapDialogApi) {
          bootstrapDialogApi.close();
        }
      } catch (error) {
        console.error("❌ Error inserting icon:", error);
      }
    };

    // Create global function for inserting Phosphor icons
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).insertPhosphorIcon = (iconClass: string) => {
      console.log("🎨 Inserting Phosphor icon:", iconClass);
      const iconHtml = `<i class="ph ${iconClass}"></i>&nbsp;`;
      console.log("📝 HTML to insert:", iconHtml);

      try {
        editor.execCommand("mceInsertContent", false, iconHtml);
        console.log("✅ Icon inserted successfully");
        if (phosphorDialogApi) {
          phosphorDialogApi.close();
        }
      } catch (error) {
        console.error("❌ Error inserting icon:", error);
      }
    };

    // Media Library button (if callback provided)
    if (onMediaPicker) {
      editor.ui.registry.addButton("media_library", {
        icon: "gallery",
        tooltip: "Insert from Media Library",
        onAction: () => {
          onMediaPicker();
        },
      });
    }

    // Bootstrap Icons button
    editor.ui.registry.addButton("bootstrapicon", {
      icon: "bookmark",
      tooltip: "Insert Bootstrap Icon",
      onAction: () => {
        bootstrapDialogApi = editor.windowManager.open({
          title: "Insert Bootstrap Icon",
          body: {
            type: "panel",
            items: [
              {
                type: "htmlpanel",
                html:
                  '<p style="margin-bottom: 10px;">Click an icon to insert it, or type a class name below:</p>' +
                  '<div id="bootstrap-icon-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(40px, 1fr)); gap: 8px; max-height: 300px; overflow-y: auto; padding: 10px; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9;">' +
                  popularBootstrapIcons
                    .map(
                      (icon) =>
                        `<button type="button" onclick="window.insertBootstrapIcon('${icon}')" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer; font-size: 20px; transition: all 0.2s;" title="${icon}" onmouseover="this.style.background='#e3f2fd'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='white'; this.style.transform='scale(1)'">
                      <i class="bi ${icon}"></i>
                    </button>`,
                    )
                    .join("") +
                  "</div>" +
                  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.css">',
              },
              {
                type: "input",
                name: "iconClass",
                label: "Or enter icon class manually",
                placeholder: "bi-heart",
              },
            ],
          },
          buttons: [
            {
              type: "cancel",
              text: "Cancel",
            },
            {
              type: "submit",
              text: "Insert Icon",
              primary: true,
            },
          ],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSubmit: (api: any) => {
            const data = api.getData();
            let iconClass = data.iconClass;

            console.log("📥 Manual input submitted:", iconClass);

            if (!iconClass || iconClass.trim() === "") {
              console.warn("⚠️ No icon class entered");
              editor.notificationManager.open({
                text: "Please select an icon or enter an icon class",
                type: "warning",
              });
              return;
            }

            // Ensure it has 'bi' prefix if it doesn't start with it
            if (!iconClass.startsWith("bi-") && !iconClass.startsWith("bi ")) {
              iconClass = "bi-" + iconClass.replace(/^bi-?/, "");
            }

            console.log("🎨 Inserting icon with class:", iconClass);
            const iconHtml = `<i class="bi ${iconClass}"></i>&nbsp;`;

            try {
              editor.execCommand("mceInsertContent", false, iconHtml);
              console.log("✅ Icon inserted via manual input");
              api.close();
            } catch (error) {
              console.error("❌ Error inserting icon:", error);
            }
          },
          initialData: {
            iconClass: "",
          },
        });
      },
    });

    // Phosphor Icons button
    editor.ui.registry.addButton("phosphoricon", {
      icon: "gamma",
      tooltip: "Insert Phosphor Icon",
      onAction: () => {
        phosphorDialogApi = editor.windowManager.open({
          title: "Insert Phosphor Icon",
          body: {
            type: "panel",
            items: [
              {
                type: "htmlpanel",
                html:
                  '<p style="margin-bottom: 10px;">Click an icon to insert it, or type a class name below:</p>' +
                  '<div id="phosphor-icon-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(40px, 1fr)); gap: 8px; max-height: 300px; overflow-y: auto; padding: 10px; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9;">' +
                  popularPhosphorIcons
                    .map(
                      (icon) =>
                        `<button type="button" onclick="window.insertPhosphorIcon('${icon}')" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer; font-size: 20px; transition: all 0.2s;" title="${icon}" onmouseover="this.style.background='#e8f5e9'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='white'; this.style.transform='scale(1)'">
                      <i class="ph ${icon}"></i>
                    </button>`,
                    )
                    .join("") +
                  "</div>" +
                  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/regular/style.css">' +
                  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/fill/style.css">',
              },
              {
                type: "input",
                name: "iconClass",
                label: "Or enter icon class manually",
                placeholder: "ph-heart",
              },
            ],
          },
          buttons: [
            {
              type: "cancel",
              text: "Cancel",
            },
            {
              type: "submit",
              text: "Insert Icon",
              primary: true,
            },
          ],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSubmit: (api: any) => {
            const data = api.getData();
            let iconClass = data.iconClass;

            console.log("📥 Manual Phosphor input submitted:", iconClass);

            if (!iconClass || iconClass.trim() === "") {
              console.warn("⚠️ No icon class entered");
              editor.notificationManager.open({
                text: "Please select an icon or enter an icon class",
                type: "warning",
              });
              return;
            }

            // Ensure it has 'ph' prefix if it doesn't start with it
            if (!iconClass.startsWith("ph-") && !iconClass.startsWith("ph ")) {
              iconClass = "ph-" + iconClass.replace(/^ph-?/, "");
            }

            console.log("🎨 Inserting Phosphor icon with class:", iconClass);
            const iconHtml = `<i class="ph ${iconClass}"></i>&nbsp;`;

            try {
              editor.execCommand("mceInsertContent", false, iconHtml);
              console.log("✅ Phosphor icon inserted via manual input");
              api.close();
            } catch (error) {
              console.error("❌ Error inserting Phosphor icon:", error);
            }
          },
          initialData: {
            iconClass: "",
          },
        });
      },
    });
  },
  images_upload_handler: (
    blobInfo: TinyMCEBlobInfo,
    progress: (percent: number) => void,
  ) => tinymceImageUploadHandler(blobInfo, progress, folder),
  automatic_uploads: true,
  file_picker_types: "image",
  image_title: true,
  image_description: true,
  image_dimensions: true,
  image_class_list: [
    { title: "Responsive", value: "img-fluid" },
    { title: "Thumbnail", value: "img-thumbnail" },
    { title: "Rounded", value: "rounded" },
  ],
});

/**
 * Insert media item into TinyMCE editor
 * @param editor - TinyMCE editor instance
 * @param mediaItem - Media library item to insert
 */
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
    // For documents and other files, insert as a link
    const linkHtml = `<a href="${mediaItem.public_url}" target="_blank" rel="noopener noreferrer">${mediaItem.original_filename}</a>`;
    editor.execCommand("mceInsertContent", false, linkHtml);
  }
};
