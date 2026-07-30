import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React from 'react'
type AppSubmitButtonProps = {
    isPending : boolean;
    disabled?: boolean;
    className?: string;
    children : React.ReactNode;
    pendingLebel?: string;
}

export default function AppSubmitButton({
    isPending,
    disabled = false, 
    className,  
    children, 
    pendingLebel = "Submitting..."
}:AppSubmitButtonProps) {

  const isDisabled = isPending || disabled;
  return (
    <Button 
      type="submit"
      disabled={isDisabled}
      className={cn(
        "w-full",
        className
      )}
    >
      {isPending ? (
        <>
          <Loader2 className="animate-spin" aria-hidden="true" />
          {pendingLebel? pendingLebel : children}
        </>
      ) : children}
    </Button>
  )
}
