import type { Activity } from "../types/activity";
import { BASE_ACTIVITIES } from "./activities.base";

// Built-in activities
export const baseActivities: Activity[] = BASE_ACTIVITIES;

// User-created activities
export const customActivities: Activity[] = [];

// All activities in one list
export const allActivities: Activity[] = [...baseActivities, ...customActivities];
