import { authOptions } from "@/app/libs/authOptions";
import { getServerSession } from "next-auth";
import { forms as googleForms } from "@googleapis/forms";
import { OAuth2Client } from "google-auth-library";

export const POST = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ result: "failed" });
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({ access_token: session.accessToken });
  const forms = googleForms({
    version: "v1",
    auth: oauth2Client,
  });
  const now = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const newForm = {
    info: {
      documentTitle: `${now}-nextjs`,
      title: "Creating a new form from nextjs",
    },
  };
  const res = await forms.forms.create({
    requestBody: newForm,
  });
  console.log(res.data);
  return Response.json({
    result: "success",
    url: `https://docs.google.com/forms/d/${res.data.formId}/edit`,
  });
};
