import { tinymceImageUploadHandler } from "./tinymceUpload";
import type { TinyMCEBlobInfo } from "./tinymceUpload";

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
  extended_valid_elements: "i[class|style|id|title],span[class|style|id]",
  valid_children:
    "+body[style],+body[i],+p[i],+h1[i],+h2[i],+h3[i],+h4[i],+h5[i],+h6[i],+div[i],+span[i]",
  verify_html: false,
  entity_encoding: "raw",
  content_style:
    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px } " +
    ".bi, .ph { font-size: 1.5em; vertical-align: middle; margin: 0 2px; } " +
    ".ph.fs-1 { font-size: 4.5rem !important; }",

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup: (editor: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let bootstrapDialogApi: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let phosphorDialogApi: any = null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).insertBootstrapIcon = (iconClass: string) => {
      const iconHtml = `<i class="bi ${iconClass}"></i>&nbsp;`;
      try {
        editor.execCommand("mceInsertContent", false, iconHtml);
        if (bootstrapDialogApi) {
          bootstrapDialogApi.close();
        }
      } catch (error) {
        console.error("❌ Error inserting icon:", error);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).insertPhosphorIcon = (iconClass: string) => {
      const iconHtml = `<i class="ph ${iconClass}"></i>&nbsp;`;
      try {
        editor.execCommand("mceInsertContent", false, iconHtml);
        if (phosphorDialogApi) {
          phosphorDialogApi.close();
        }
      } catch (error) {
        console.error("❌ Error inserting Phosphor icon:", error);
      }
    };

    if (onMediaPicker) {
      editor.ui.registry.addButton("media_library", {
        icon: "gallery",
        tooltip: "Insert from Media Library",
        onAction: () => {
          onMediaPicker();
        },
      });
    }

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
            { type: "cancel", text: "Cancel" },
            { type: "submit", text: "Insert Icon", primary: true },
          ],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSubmit: (api: any) => {
            const data = api.getData();
            let iconClass = data.iconClass;

            if (!iconClass || iconClass.trim() === "") {
              editor.notificationManager.open({
                text: "Please select an icon or enter an icon class",
                type: "warning",
              });
              return;
            }

            if (!iconClass.startsWith("bi-") && !iconClass.startsWith("bi ")) {
              iconClass = "bi-" + iconClass.replace(/^bi-?/, "");
            }

            const iconHtml = `<i class="bi ${iconClass}"></i>&nbsp;`;
            try {
              editor.execCommand("mceInsertContent", false, iconHtml);
              api.close();
            } catch (error) {
              console.error("❌ Error inserting icon:", error);
            }
          },
          initialData: { iconClass: "" },
        });
      },
    });

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
            { type: "cancel", text: "Cancel" },
            { type: "submit", text: "Insert Icon", primary: true },
          ],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSubmit: (api: any) => {
            const data = api.getData();
            let iconClass = data.iconClass;

            if (!iconClass || iconClass.trim() === "") {
              editor.notificationManager.open({
                text: "Please select an icon or enter an icon class",
                type: "warning",
              });
              return;
            }

            if (!iconClass.startsWith("ph-") && !iconClass.startsWith("ph ")) {
              iconClass = "ph-" + iconClass.replace(/^ph-?/, "");
            }

            const iconHtml = `<i class="ph ${iconClass}"></i>&nbsp;`;
            try {
              editor.execCommand("mceInsertContent", false, iconHtml);
              api.close();
            } catch (error) {
              console.error("❌ Error inserting Phosphor icon:", error);
            }
          },
          initialData: { iconClass: "" },
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
