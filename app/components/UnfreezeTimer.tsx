"use client";
import { useEffect, useState } from "react";
import { UnfreezeStatus, type CommitteeProgress } from "../types/unfreeze";
import unfreezeData from "../data/unfreeze-progress.json";
import ProgressBar from "./ProgressBar";
import CommitteeCard from "./CommitteeCard";

const START_DATE = new Date(unfreezeData.startDate);
const COMMITTEES = unfreezeData.committees;

const calculateTotalCases = (statusCounts: Record<string, number>) => {
  return Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
};

const DATA: CommitteeProgress[] = COMMITTEES.map((committee) => {
  const totalCases = calculateTotalCases(committee.statusCounts);
  return {
    committee: committee.name,
    totalCases,
    statusCounts: {
      [UnfreezeStatus.FROZEN]: committee.statusCounts.FROZEN,
      [UnfreezeStatus.PENDING]: committee.statusCounts.PENDING,
      [UnfreezeStatus.APPROVED]: committee.statusCounts.APPROVED,
      [UnfreezeStatus.UNFROZEN]: committee.statusCounts.UNFROZEN,
    },
    progress: Number(
      ((committee.statusCounts.UNFROZEN / totalCases) * 100).toFixed(1),
    ),
  };
});

// 計算總進度
const TOTAL_PROGRESS = {
  totalCases: DATA.reduce((sum, committee) => sum + committee.totalCases, 0),
  statusCounts: DATA.reduce(
    (acc, committee) => ({
      [UnfreezeStatus.FROZEN]:
        acc[UnfreezeStatus.FROZEN] +
        committee.statusCounts[UnfreezeStatus.FROZEN],
      [UnfreezeStatus.PENDING]:
        acc[UnfreezeStatus.PENDING] +
        committee.statusCounts[UnfreezeStatus.PENDING],
      [UnfreezeStatus.APPROVED]:
        acc[UnfreezeStatus.APPROVED] +
        committee.statusCounts[UnfreezeStatus.APPROVED],
      [UnfreezeStatus.UNFROZEN]:
        acc[UnfreezeStatus.UNFROZEN] +
        committee.statusCounts[UnfreezeStatus.UNFROZEN],
    }),
    {
      [UnfreezeStatus.FROZEN]: 0,
      [UnfreezeStatus.PENDING]: 0,
      [UnfreezeStatus.APPROVED]: 0,
      [UnfreezeStatus.UNFROZEN]: 0,
    },
  ),
};

export default function UnfreezeTimer() {
  const [elapsedTime, setElapsedTime] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = now.getTime() - START_DATE.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setElapsedTime(`${days}天 ${hours}小時 ${minutes}分`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-6 md:p-12">
      <h2 className="text-center text-4xl font-semibold text-gray-900 dark:text-white">
        總預算解凍進度
      </h2>
      <div className="space-y-2 rounded-xl bg-gray-100 p-4 text-center dark:bg-gray-800">
        <p className="text-lg text-gray-700 dark:text-gray-200">
          距離總統公告總預算已經過了
        </p>
        <div className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          {elapsedTime || `0天 0小時 0分`}
        </div>
      </div>

      {/* 總進度條 */}
      <div className="relative pt-1">
        <div className="mb-2 flex items-end justify-between">
          <div className="text-right">
            <span className="inline-block text-lg font-semibold text-gray-700 dark:text-gray-200">
              總體進度
            </span>
          </div>
          <div className="flex items-center gap-2 text-right">
            <span className="text-primary dark:text-primary inline-block text-sm font-semibold">
              已解凍{" "}
              {(
                (TOTAL_PROGRESS.statusCounts[UnfreezeStatus.UNFROZEN] /
                  TOTAL_PROGRESS.totalCases) *
                100
              ).toFixed(1)}
              %
            </span>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl">
          <ProgressBar
            pending={TOTAL_PROGRESS.statusCounts[UnfreezeStatus.PENDING]}
            approved={TOTAL_PROGRESS.statusCounts[UnfreezeStatus.APPROVED]}
            unfrozen={TOTAL_PROGRESS.statusCounts[UnfreezeStatus.UNFROZEN]}
            total={TOTAL_PROGRESS.totalCases}
            height="lg"
          />
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 text-sm">
          <span className="inline-block font-semibold text-gray-600 dark:text-gray-400">
            {TOTAL_PROGRESS.statusCounts[UnfreezeStatus.PENDING]} 案已送件
          </span>{" "}
          <span className="inline-block font-semibold text-gray-600 dark:text-gray-400">
            {TOTAL_PROGRESS.statusCounts[UnfreezeStatus.UNFROZEN]} /{" "}
            {TOTAL_PROGRESS.totalCases} 案
          </span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {COMMITTEES.map((committee, index) => (
          <CommitteeCard
            key={committee.name}
            committee={committee}
            data={DATA[index]}
          />
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500" />
          <span className="text-gray-700 dark:text-gray-200">等待審議</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-orange-500" />
          <span className="text-gray-700 dark:text-gray-200">審議通過</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="text-gray-700 dark:text-gray-200">已解凍</span>
        </div>
      </div>
    </div>
  );
}
