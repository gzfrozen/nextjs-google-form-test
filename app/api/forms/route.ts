import { authOptions } from "@/app/libs/authOptions";
import { getServerSession } from "next-auth";
import { forms as googleForms } from "@googleapis/forms";
import { OAuth2Client } from "google-auth-library";

const now = new Date().toLocaleString("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const updateRequest = {
  requests: [
    {
      updateSettings: {
        settings: {
          quizSettings: {
            isQuiz: true,
          },
        },
        updateMask: "quizSettings.isQuiz",
      },
    },
    {
      createItem: {
        item: {
          title: "1+1は？",
          questionItem: {
            question: {
              required: true,
              grading: {
                pointValue: 1,
                correctAnswers: {
                  answers: [{ value: "2" }],
                },
              },
              choiceQuestion: {
                type: "RADIO",
                options: [
                  {
                    value: "1",
                  },
                  {
                    value: "2",
                  },
                ],
              },
            },
          },
        },
        location: {
          index: 0,
        },
      },
    },
    {
      createItem: {
        item: {
          title: "2+2は？",
          questionItem: {
            question: {
              required: true,
              grading: {
                pointValue: 1,
                correctAnswers: {
                  answers: [{ value: "4" }],
                },
              },
              choiceQuestion: {
                type: "RADIO",
                options: [
                  {
                    value: "3",
                  },
                  {
                    value: "4",
                  },
                ],
              },
            },
          },
        },
        location: {
          index: 1,
        },
      },
    },
  ],
};

export const POST = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ result: "failed" });
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({ access_token: session.accessToken });
  const forms = googleForms({
    version: "v1",
    auth: oauth2Client,
  });
  const createRes = await forms.forms.create({
    requestBody: {
      info: {
        documentTitle: `${now}-nextjs`,
        title: "テスト質問",
      },
    },
  });
  console.log(createRes.data);
  const formId = createRes.data.formId;
  if (!formId) return Response.json({ result: "failed" });
  const settingUpdateRes = await forms.forms.batchUpdate({
    formId: formId,
    requestBody: updateRequest,
  });
  console.log(settingUpdateRes.data);
  return Response.json({
    result: "success",
    url: `https://docs.google.com/forms/d/${formId}/edit`,
  });
};
