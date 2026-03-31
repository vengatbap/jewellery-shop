import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core"
import { primaryId } from "../shared/common"

export const files = pgTable("files", {

  id: primaryId,

  entityType: text("entity_type"),

  entityId: uuid("entity_id"),

  fileUrl: text("file_url"),

  fileType: text("file_type"),

  uploadedBy: uuid("uploaded_by"),

  createdAt: timestamp("created_at").defaultNow()

})