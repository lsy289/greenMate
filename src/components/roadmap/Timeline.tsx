import { Check, Lock } from 'lucide-react';
import { LEVELS } from '@/lib/constants';
import type { UserLevel } from '@/types';

interface TimelineProps {
  level: UserLevel;
}

type StepStatus = 'done' | 'current' | 'locked';

export default function Timeline({ level }: TimelineProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h2 className="text-sm font-bold text-[var(--gray-900)] mb-5">성장 로드맵</h2>

      <div className="flex flex-col gap-0">
        {LEVELS.map((lvl, index) => {
          const status: StepStatus =
            lvl.level < level.currentLevel
              ? 'done'
              : lvl.level === level.currentLevel
              ? 'current'
              : 'locked';

          const isLast = index === LEVELS.length - 1;

          return (
            <div key={lvl.level} className="flex gap-4">
              {/* 타임라인 선 + 노드 */}
              <div className="flex flex-col items-center">
                <TimelineNode status={status} icon={lvl.icon} />
                {!isLast && (
                  <div
                    className={`w-0.5 flex-1 min-h-8 ${
                      status === 'done' ? 'bg-[var(--primary-500)]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>

              {/* 내용 */}
              <div className={`pb-6 flex-1 ${isLast ? 'pb-0' : ''}`}>
                <div className="flex items-center justify-between">
                  <span
                    className={`font-semibold text-sm ${
                      status === 'locked'
                        ? 'text-[var(--gray-500)]'
                        : 'text-[var(--gray-900)]'
                    }`}
                  >
                    {lvl.name}
                  </span>
                  {status === 'done' && (
                    <span className="text-[10px] font-medium text-[var(--primary-500)] bg-[var(--primary-50)] px-2 py-0.5 rounded-full">
                      달성
                    </span>
                  )}
                  {status === 'current' && (
                    <span className="text-[10px] font-medium text-[var(--amber-700)] bg-[var(--amber-50)] px-2 py-0.5 rounded-full">
                      진행 중
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs mt-0.5 ${
                    status === 'locked' ? 'text-gray-400' : 'text-[var(--gray-500)]'
                  }`}
                >
                  {lvl.condition}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimelineNode({ status, icon }: { status: StepStatus; icon: string }) {
  if (status === 'done') {
    return (
      <div className="w-9 h-9 rounded-full bg-[var(--primary-500)] flex items-center justify-center shrink-0 shadow-sm">
        <Check size={16} className="text-white" strokeWidth={3} />
      </div>
    );
  }
  if (status === 'current') {
    return (
      <div className="w-9 h-9 rounded-full border-2 border-[var(--primary-500)] bg-white flex items-center justify-center shrink-0 shadow-sm text-xl">
        {icon}
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
      <Lock size={14} className="text-gray-400" />
    </div>
  );
}
