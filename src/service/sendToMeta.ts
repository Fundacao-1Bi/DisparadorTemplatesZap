import axios from "axios";

const sendToMeta = async ({
  number,
  token,
  templateId,
  phoneNumberId,
}: {
  number: string;
  token: string;
  templateId: string;
  phoneNumberId: string;
}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const data = {
    messaging_product: "whatsapp",
    to: number,
    type: "template",
    preview_url: true,
    template: {
      name: templateId,
      language: { code: "pt_BR" },
      //   components: [
      //     {
      //       type: "header",
      //       parameters: [
      //         {
      //           type: "image",
      //           image: {
      //             link: url,
      //           },
      //         },
      //       ],
      //     },
      //   ],
    },
  };
  const response = await axios.post(
    `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
    data,
    config
  );
  return response;
};

export default sendToMeta;
