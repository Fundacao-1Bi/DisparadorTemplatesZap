import axios from "axios";

const sendToMeta = async ({
  number,
  token,
  templateId,
  phoneNumberId,
  imageUrl,
}: {
  number: string;
  token: string;
  templateId: string;
  phoneNumberId: string;
  imageUrl?: string;
}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const data: {
    messaging_product: string;
    to: string;
    type: string;
    preview_url: boolean;
    template: {
      name: string;
      language: { code: string };
      components?: Array<{
        type: string;
        parameters: Array<{
          type: string;
          image: { link: string };
        }>;
      }>;
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
    data.template.components = [
      {
        type: "header",
        parameters: [
          {
            type: "image",
            image: {
              link: imageUrl,
            },
          },
        ],
      },
    ];
  }
  const response = await axios.post(
    `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
    data,
    config
  );
  return response;
};

export default sendToMeta;
