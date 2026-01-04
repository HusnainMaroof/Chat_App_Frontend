import React from "react";

function MessagesLoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 h-full flex flex-col justify-center">
      {[...Array(5)].map((_, index) => {
        const isStart = index % 2 === 0;
        return (
          <div
            key={index}
            className={`flex ${
              isStart ? "justify-start" : "justify-end"
            } animate-pulse`}
          >
            <div
              className={`flex gap-3 max-w-[60%] ${
                isStart ? "flex-row" : "flex-row-reverse"
              }`}
            >
              {/* Avatar Skeleton */}
              <div className="h-8 w-8 rounded-lg bg-slate-800 shrink-0" />

              <div className="space-y-2">
                {/* Bubble Skeleton */}
                <div
                  className={`h-12 ${
                    index === 2 ? "w-64" : "w-48"
                  } bg-slate-800/50 rounded-2xl ${
                    isStart ? "rounded-tl-none" : "rounded-tr-none"
                  }`}
                />
                {/* Timestamp Skeleton */}
                <div
                  className={`h-2 w-12 bg-slate-800/30 rounded mx-auto ${
                    isStart ? "mr-auto ml-1" : "ml-auto mr-1"
                  }`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MessagesLoadingSkeleton;
