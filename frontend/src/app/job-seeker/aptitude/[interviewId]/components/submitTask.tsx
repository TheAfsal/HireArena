import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from '@/components/ui/alert-dialog'
  import { AlertCircle } from 'lucide-react'
  import React from 'react'
  
  type SubmitTaskDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    answeredCount: number
    totalQuestions: number
    onSubmit: () => void
  }
  
  const SubmitTaskDialog: React.FC<SubmitTaskDialogProps> = ({
    open,
    onOpenChange,
    answeredCount,
    totalQuestions,
    onSubmit,
  }) => {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Test?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} out of {totalQuestions} questions.
              {answeredCount < totalQuestions && (
                <div className="mt-2 flex items-center text-amber-600">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  You still have {totalQuestions - answeredCount} unanswered questions.
                </div>
              )}
              Are you sure you want to submit your test?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Test</AlertDialogCancel>
            <AlertDialogAction onClick={onSubmit}>Submit Test</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  
  export default SubmitTaskDialog
  