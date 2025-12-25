// Loads base activities from JSON.

import raw from "./activities.json";
import type { Activity } from "../types/activity";

export const baseActivities = raw as Activity[];
