import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import axios from "axios";
import sendToMeta from "../.test-build/sendToMeta.js";

const options = {
  number: "5511999999999",
  token: "test-token",
  templateId: "aviso_escola",
  phoneNumberId: "123456789",
};

let originalAdapter;
let requests;

beforeEach(() => {
  originalAdapter = axios.defaults.adapter;
  requests = [];
  // Intercept after Axios serializes the body. No network requests are made.
  axios.defaults.adapter = async (config) => {
    requests.push(config);
    return {
      data: { messages: [{ id: "wamid.test", message_status: "accepted" }] },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };
});

afterEach(() => {
  axios.defaults.adapter = originalAdapter;
});

test("posts a Portuguese template to v26.0 using the phone number unchanged", async () => {
  const response = await sendToMeta(options);

  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, "https://graph.facebook.com/v26.0/123456789/messages");
  assert.equal(requests[0].method, "post");
  assert.equal(requests[0].headers.get("Authorization"), "Bearer test-token");
  const payload = JSON.parse(requests[0].data);
  assert.equal(payload.messaging_product, "whatsapp");
  assert.equal(payload.type, "template");
  assert.equal(payload.to, options.number);
  assert.equal(Object.hasOwn(payload, "recipient"), false);
  assert.deepEqual(payload.template, {
    name: options.templateId,
    language: { code: "pt_BR" },
  });
  // HTTP acceptance is returned to the caller; this does not prove delivery.
  assert.equal(response.data.messages[0].message_status, "accepted");
});

test("adds an image as a template header", async () => {
  await sendToMeta({ ...options, imageUrl: "https://example.org/header.png" });

  assert.deepEqual(JSON.parse(requests[0].data).template.components, [{
    type: "header",
    parameters: [{ type: "image", image: { link: "https://example.org/header.png" } }],
  }]);
});

test("maps Flow button orders to zero-based indexes and preserves tokens", async () => {
  await sendToMeta({ ...options, flowButtons: [
    { order: 1, flowToken: "student-session-1" },
    { order: 3, flowToken: "student-session-3" },
  ] });

  assert.deepEqual(JSON.parse(requests[0].data).template.components, [
    {
      type: "button",
      sub_type: "flow",
      index: "0",
      parameters: [{ type: "action", action: { flow_token: "student-session-1" } }],
    },
    {
      type: "button",
      sub_type: "flow",
      index: "2",
      parameters: [{ type: "action", action: { flow_token: "student-session-3" } }],
    },
  ]);
});

test("keeps the image header and Flow action in the same template", async () => {
  await sendToMeta({ ...options,
    imageUrl: "https://example.org/header.png",
    flowButtons: [{ order: 2, flowToken: "student-session" }],
  });

  const components = JSON.parse(requests[0].data).template.components;
  assert.equal(components.length, 2);
  assert.equal(components[0].type, "header");
  assert.equal(components[1].sub_type, "flow");
  assert.equal(components[1].index, "1");
});

test("omits components for empty optional image and Flow fields", async () => {
  await sendToMeta({ ...options, imageUrl: "", flowButtons: [] });

  assert.equal(Object.hasOwn(JSON.parse(requests[0].data).template, "components"), false);
});

test("propagates a Meta rejection once without silently retrying", async () => {
  let calls = 0;
  const failure = new axios.AxiosError("Request failed with status code 400", "ERR_BAD_REQUEST");
  failure.response = { status: 400, data: { error: { code: 132001, message: "Template not found" } } };
  axios.defaults.adapter = async () => {
    calls += 1;
    throw failure;
  };

  await assert.rejects(sendToMeta(options), (error) => {
    assert.equal(error, failure);
    assert.equal(error.response.data.error.code, 132001);
    return true;
  });
  assert.equal(calls, 1);
});

test("propagates transport failures to the existing UI error handler", async () => {
  const failure = new axios.AxiosError("Network Error", "ERR_NETWORK");
  axios.defaults.adapter = async () => { throw failure; };

  await assert.rejects(sendToMeta(options), (error) => error === failure);
});
