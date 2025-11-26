import React from "react";

type ParamFieldProps = {
  children: React.ReactNode;
  body?: string;
  header?: string;
  path?: string;
  query?: string;
  type: string;
  required?: boolean;
  optional?: boolean;
};

export default function ParamField({
  children,
  body,
  header,
  path,
  query,
  type,
  required,
  optional,
}: ParamFieldProps) {
  const fieldName = body || header || path || query || "unknown";
  const location = body
    ? "body"
    : header
    ? "header"
    : path
    ? "path"
    : query
    ? "query"
    : "unknown";
  const isRequired = required !== undefined ? required : !optional;

  return (
    <div className="mb-6 rounded-lg border border-white/10 bg-black/40 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-sm font-semibold text-white">
          {fieldName}
        </span>
        <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/80">
          {type}
        </span>
        <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/80">
          {location}
        </span>
        {isRequired ? (
          <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
            required
          </span>
        ) : (
          <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">
            optional
          </span>
        )}
      </div>
      <div className="text-white/80 leading-7">{children}</div>
    </div>
  );
}


