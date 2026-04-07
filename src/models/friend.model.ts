import type { Row } from "../core/storage/db.js";

export interface iFriend extends Row {
  id?: string;
  name: string;
  email: string;
  phone: string;
  balance?: string;
  address?: string;
}
