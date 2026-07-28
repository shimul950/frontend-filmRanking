import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type {AnyFieldApi} from "@tanstack/react-form"
import React from "react";

const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string") return error;
    if(error && typeof error === "object"){
        if("message" in error && typeof error.message === "string"){
            return error.message;
        }
    }
    return String(error);
}

type AppFieldProps = {
    field: AnyFieldApi;
    lebel?: string;
    type?: "text" | "password" | "email" | "number";
    placeholder?: string;
    append?: React.ReactNode;
    prepend?: React.ReactNode;
    className?: string;
    disabled?: boolean;

}


export default function AppField({
    field, lebel, type = "text", placeholder, append, prepend, className, disabled =false
}: AppFieldProps) {
    const firstError = field.state.meta.isTouched && field.state.meta.errors.length > 0 ? getErrorMessage(field.state.meta.errors[0]) : null;

    const hasError = firstError !== null;

  return (
    <div className = {cn("space-y-1.5", className)}>
        <Label
            htmlFor={field.name}
            className={cn(hasError && "text-destructive")}
        >
            {lebel}
        </Label>

        <div className="relative">
            {prepend && (
                <div className="absolute insert-y-0 left-0 items-center pl-3 pointer-events-none z-10">
                    {prepend}
                </div>
            )}

            <Input
                id={field.name}
                name={field.name}
                type={type}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange = {(e) => field.handleChange(e.target.value)}
                disabled={disabled}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${field.name}-error` : undefined}
                className={cn(
                    prepend && "pl-10",
                    append && "pr-10",
                    disabled && "cursor-not-allowed opacity-50"
                )}

            ></Input>

            {append && (
                <div className="absolute right-0 top-0 flex items-center justify-content h-full">
                    {append}
                </div>
            )}
            {
                hasError && (
                    <p
                        id={`${field.name}-error`}
                        role="alert"
                        className="text-sm text-destructive"
                    >
                        {firstError}
                    </p>
                )
            }

        </div>
    </div>
  )
}
