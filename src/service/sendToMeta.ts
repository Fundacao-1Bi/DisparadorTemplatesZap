import axios from "axios";

const sendToMeta = async ({
  number,
  token,
  templateId,
  phoneNumberId,
  imageUrl,
  hasFlowTemplate,
  flowToken,
}: {
  number: string;
  token: string;
  templateId: string;
  phoneNumberId: string;
  imageUrl?: string;
  hasFlowTemplate?: boolean;
  flowToken?: string;
}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const templateComponents: Array<
    | {
        type: "header";
        parameters: Array<{
          type: "image";
          image: { link: string };
        }>;
      }
    | {
        type: "button";
        sub_type: "flow";
        index: "0";
        parameters: Array<{
          type: "action";
          action: { flow_token: string };
        }>;
      }
  > = [];

  const data: {
    messaging_product: string;
    to: string;
    type: string;
    preview_url: boolean;
    template: {
      name: string;
      language: { code: string };
      components?: typeof templateComponents;
    };
  } = {
    messaging_product: "whatsapp",
    to: number,
    type: "template",
    preview_url: true,
    template: {
      name: templateId,
      language: { code: "pt_BR" },
    },
  };

  if (imageUrl) {
    templateComponents.push({
      type: "header",
      parameters: [
        {
          type: "image",
          image: {
            link: imageUrl,
          },
        },
      ],
    });
  }

  if (hasFlowTemplate && flowToken) {
    templateComponents.push({
      type: "button",
      sub_type: "flow",
      index: "0",
      parameters: [
        {
          type: "action",
          action: {
            flow_token: flowToken,
          },
        },
      ],
    });
  }

  if (templateComponents.length > 0) {
    data.template.components = templateComponents;
  }

  const response = await axios.post(
    `https://graph.facebook.com/v24.0/${phoneNumberId}/messages`,
    data,
    config,
  );
  return response;
};

export default sendToMeta;
