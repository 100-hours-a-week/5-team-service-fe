import z from "zod";
import { EditUserProfileSchema } from "./schema";

export type EditUserProfileFormValues = z.infer<typeof EditUserProfileSchema>;
