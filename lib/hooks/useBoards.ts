"use client";

import { useState } from "react";
import { Board, Column, JobApplication } from "../models/models.types";
import { updateJobApplication } from "../actions/job-applications";

export function useBoard(initialBoard?: Board | null) {
  const [board] = useState<Board | null>(initialBoard || null);
  const [columns, setColumns] = useState<Column[]>(initialBoard?.columns || []);
  const [prevBoard, setPrevBoard] = useState(initialBoard);
  const [error, setError] = useState<string | null>(null);

  // Synchronize state during render when initialBoard changes
  if (initialBoard !== prevBoard) {
    setPrevBoard(initialBoard);
    setColumns(initialBoard?.columns || []);
  }

  async function moveJob(
    jobApplicationId: string,
    newColumnId: string,
    newOrder: number
  ) {
    // Snapshot previous state for rollback on mutation failure
    const previousColumns = columns;
    setError(null);

    setColumns((prev) => {
      const newColumns = prev.map((col) => ({
        ...col,
        jobApplications: [...col.jobApplications],
      }));

      // Find and remove job from the old column
      let jobToMove: JobApplication | null = null;
      let oldColumnId: string | null = null;

      for (const col of newColumns) {
        const jobIndex = col.jobApplications.findIndex(
          (j) => j._id === jobApplicationId
        );
        if (jobIndex !== -1 && jobIndex !== undefined) {
          jobToMove = col.jobApplications[jobIndex];
          oldColumnId = col._id;
          col.jobApplications = col.jobApplications.filter(
            (job) => job._id !== jobApplicationId
          );
          break;
        }
      }

      if (jobToMove && oldColumnId) {
        const targetColumnIndex = newColumns.findIndex(
          (col) => col._id === newColumnId
        );
        if (targetColumnIndex !== -1) {
          const targetColumn = newColumns[targetColumnIndex];
          const currentJobs = targetColumn.jobApplications || [];

          const updatedJobs = [...currentJobs];
          updatedJobs.splice(newOrder, 0, {
            ...jobToMove,
            columnId: newColumnId,
            order: newOrder * 100,
          });

          const jobsWithUpdatedOrders = updatedJobs.map((job, idx) => ({
            ...job,
            order: idx * 100,
          }));

          newColumns[targetColumnIndex] = {
            ...targetColumn,
            jobApplications: jobsWithUpdatedOrders,
          };
        }
      }

      return newColumns;
    });

    try {
      const result = await updateJobApplication(jobApplicationId, {
        columnId: newColumnId,
        order: newOrder,
      });

      if (result?.error) {
        // Rollback state if server action returns an error
        console.error("Failed to update job application:", result.error);
        setColumns(previousColumns);
        setError(result.error);
        return { error: result.error };
      }

      return { success: true };
    } catch (err: unknown) {
      // Rollback state on network or unexpected error
      console.error("Network or unexpected error updating job:", err);
      setColumns(previousColumns);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update job position";
      setError(errorMessage);
      return { error: errorMessage };
    }
  }

  function clearError() {
    setError(null);
  }

  return { board, columns, error, clearError, moveJob };
}
