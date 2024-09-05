import { authOptions } from "@/app/libs/authOptions";
import { getServerSession } from "next-auth";
import { forms as googleForms } from "@googleapis/forms";
import { OAuth2Client } from "google-auth-library";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Not logged in </div>;
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({ access_token: session.accessToken });
  const forms = googleForms({
    version: "v1",
    auth: oauth2Client,
  });
  const newForm = {
    info: {
      title: "Creating a new form from nextjs",
    },
  };
  const res = await forms.forms.create({
    requestBody: newForm,
  });
  console.log(res.data);
  return <h1>Form ID IS: {res.data.formId}</h1>;
}
