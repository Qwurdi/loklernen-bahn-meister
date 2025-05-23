
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
          description: "group-[.toast]:text-gray-600",
          actionButton:
            "group-[.toast]:bg-gradient-to-r group-[.toast]:from-[#3F00FF] group-[.toast]:to-[#0F52BA] group-[.toast]:text-white group-[.toast]:border-0",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-600 group-[.toast]:border-gray-200",
          success: "group-[.toast]:bg-green-50 group-[.toast]:border-green-200 group-[.toast]:text-green-800",
          error: "group-[.toast]:bg-red-50 group-[.toast]:border-red-200 group-[.toast]:text-red-800",
          warning: "group-[.toast]:bg-yellow-50 group-[.toast]:border-yellow-200 group-[.toast]:text-yellow-800",
          info: "group-[.toast]:bg-blue-50 group-[.toast]:border-blue-200 group-[.toast]:text-blue-800",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
